"""
Export recent Garmin Connect runs to content/running/runs.json for the portfolio.

Uses the unofficial `garminconnect` library (https://github.com/cyberjunky/python-garminconnect).
It is not an official Garmin API and can break when Garmin changes its login flow.

Privacy: no raw GPS leaves this script. Each route has PRIVACY_TRIM_M metres cut from
both ends (so start/finish near home are not published), is downsampled, and is
normalised to 0..1 so only its shape remains.

Usage:
    pip install -r scripts/garmin/requirements.txt
    GARMIN_EMAIL=... GARMIN_PASSWORD=... python scripts/garmin/export_runs.py
Optional:
    GARMINTOKENS   directory for cached OAuth tokens (avoids re-login / MFA prompts)
    RUN_LIMIT      how many recent activities to scan (default 60)
    RACE_KEYWORDS  comma-separated words in an activity name that mark it as a race
"""

from __future__ import annotations

import json
import re
import math
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from garminconnect import Garmin

OUT = Path(__file__).resolve().parents[2] / "content" / "running" / "runs.json"
META = OUT.with_name("meta.json")  # { syncedAt, source, runs }: powers "Garmin · updated" in the UI
PRIVACY_TRIM_M = 300
MAX_ROUTE_POINTS = 160
RUN_TYPES = {"running", "street_running", "track_running", "trail_running", "treadmill_running"}
RACE_KEYWORDS = [k.strip().lower() for k in os.getenv("RACE_KEYWORDS", "race,marathon").split(",") if k.strip()]
# Same event-name rule as scripts/strava/import_export.py: a year ("Perkeso Run 2026"), HM, Ekiden, Debut.
RACE_PATTERNS = re.compile(r"\b20\d\d\b|\bhm\b|ekiden|debut", re.I)


def haversine(a: tuple[float, float], b: tuple[float, float]) -> float:
    lat1, lon1, lat2, lon2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
    return 2 * 6_371_000 * math.asin(math.sqrt(h))


def privacy_route(latlon: list[tuple[float, float]]) -> list[list[float]] | None:
    """Trim both ends, downsample, and normalise to a 0..1 shape (no coordinates survive)."""
    if len(latlon) < 10:
        return None
    cum = [0.0]
    for i in range(1, len(latlon)):
        cum.append(cum[-1] + haversine(latlon[i - 1], latlon[i]))
    total = cum[-1]
    if total < PRIVACY_TRIM_M * 3:
        return None
    kept = [p for p, c in zip(latlon, cum) if PRIVACY_TRIM_M <= c <= total - PRIVACY_TRIM_M]
    step = max(1, math.ceil(len(kept) / MAX_ROUTE_POINTS))
    kept = kept[::step]

    # Equirectangular projection, then scale into the unit square keeping aspect ratio.
    lat0 = sum(p[0] for p in kept) / len(kept)
    xs = [p[1] * math.cos(math.radians(lat0)) for p in kept]
    ys = [-p[0] for p in kept]
    minx, miny = min(xs), min(ys)
    span = max(max(xs) - minx, max(ys) - miny) or 1
    offx = (1 - (max(xs) - minx) / span) / 2
    offy = (1 - (max(ys) - miny) / span) / 2
    return [[round(offx + (x - minx) / span, 4), round(offy + (y - miny) / span, 4)] for x, y in zip(xs, ys)]


def splits_for(client: Garmin, activity_id: int) -> list[dict] | None:
    try:
        laps = client.get_activity_splits(activity_id).get("lapDTOs", [])
    except Exception as exc:  # splits are optional
        print(f"  splits unavailable for {activity_id}: {exc}", file=sys.stderr)
        return None
    out = [
        {"km": round(l["distance"] / 1000, 2), "durationSec": round(l["duration"])}
        for l in laps
        if l.get("distance") and l.get("duration")
    ]
    return out or None


def route_for(client: Garmin, activity_id: int) -> list[list[float]] | None:
    try:
        details = client.get_activity_details(activity_id)
        poly = (details.get("geoPolylineDTO") or {}).get("polyline") or []
        return privacy_route([(p["lat"], p["lon"]) for p in poly if "lat" in p and "lon" in p])
    except Exception as exc:  # route is optional (treadmill, privacy, API change)
        print(f"  route unavailable for {activity_id}: {exc}", file=sys.stderr)
        return None


def main() -> None:
    email, password = os.getenv("GARMIN_EMAIL"), os.getenv("GARMIN_PASSWORD")
    tokens = os.getenv("GARMINTOKENS")
    client = Garmin(email, password)
    client.login(tokens) if tokens and Path(tokens).exists() else client.login()
    if tokens:
        client.garth.dump(tokens)

    runs = []
    for a in client.get_activities(0, int(os.getenv("RUN_LIMIT", "60"))):
        if (a.get("activityType") or {}).get("typeKey") not in RUN_TYPES:
            continue
        aid = a["activityId"]
        name = a.get("activityName") or "Run"
        indoor = a["activityType"]["typeKey"] == "treadmill_running"
        print(f"- {a.get('startTimeLocal')} {name}")
        run = {
            "id": str(aid),
            "date": (a.get("startTimeLocal") or "")[:10],
            "title": name,
            "distanceKm": round((a.get("distance") or 0) / 1000, 2),
            # Moving time for pace; elapsed kept separately (races are timed on elapsed).
            "durationSec": round(a.get("movingDuration") or a.get("duration") or 0),
            "elapsedSec": round(a.get("elapsedDuration") or a.get("duration") or 0),
            "avgHr": round(a["averageHR"]) if a.get("averageHR") else None,
            "maxHr": round(a["maxHR"]) if a.get("maxHR") else None,
            "elevationGainM": round(a["elevationGain"]) if a.get("elevationGain") else None,
            "cadenceSpm": round(a["averageRunningCadenceInStepsPerMinute"])
            if a.get("averageRunningCadenceInStepsPerMinute")
            else None,
            "splits": None if indoor else splits_for(client, aid),
            "route": None if indoor else route_for(client, aid),
            "indoor": indoor,
        }
        if not indoor and (any(k in name.lower() for k in RACE_KEYWORDS) or RACE_PATTERNS.search(name)):
            run["race"] = {"name": name}
        if run["distanceKm"] > 0 and run["durationSec"] > 0:
            runs.append({k: v for k, v in run.items() if v is not None})

    runs.sort(key=lambda r: r["date"], reverse=True)
    previous = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
    text = json.dumps(runs, indent=1) + "\n"
    OUT.write_text(text, encoding="utf-8")
    # Stamp only when the data changed, so the UI date means "data last updated", not "script last ran".
    if text != previous or not META.exists():
        META.write_text(
            json.dumps(
                {"syncedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"), "source": "garmin", "runs": len(runs)},
                indent=1,
            )
            + "\n",
            encoding="utf-8",
        )
    print(f"Wrote {len(runs)} runs to {OUT}")


if __name__ == "__main__":
    main()
