"""
Import runs from a Strava account export ("Download your data") into content/running/strava.json.

    python scripts/strava/import_export.py "C:/path/to/export_12345"

Reads only activities.csv and the per-activity files (FIT / GPX / TCX, gzipped or not).
Nothing else in the export (contacts, messages, logins, media) is touched or copied.

Per run it writes the same shape the site already uses (content/running.ts › Run), plus:
  indoor       true for treadmill / indoor runs (no GPS): the site hides these
  elapsedSec   elapsed time (durationSec is moving time)
  bestEfforts  fastest continuous 1K / 5K / 10K / half / marathon inside the run, in seconds
  race         { name } when the activity name looks like an event (RACE_PATTERNS)

Privacy: routes go through the same trimming as the Garmin export (300 m cut from each end,
normalised to a 0..1 shape, no coordinates survive). Requires: pip install fitdecode
"""
from __future__ import annotations

import csv
import gzip
import importlib.util
import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path

import fitdecode

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "content" / "running" / "strava.json"
LOCAL_TZ = timezone(timedelta(hours=8))  # Malaysia; Strava's CSV and FIT times are UTC
EFFORTS_KM = {"1k": 1.0, "5k": 5.0, "10k": 10.0, "half": 21.0975, "marathon": 42.195}
# Event names: a year ("Perkeso Run 2026"), "HM", "Ekiden", "Debut", "Race", "Marathon".
RACE_PATTERNS = re.compile(r"\b20\d\d\b|\bhm\b|ekiden|debut|\brace\b|marathon", re.I)
GENERIC_NAME = re.compile(r"^(Morning|Afternoon|Evening|Night|Lunch) Run$|^(Outdoor|Indoor) Running$")
SEMI = 180 / 2**31

# Reuse the Garmin exporter's privacy trimming so both sources produce identical route shapes.
_spec = importlib.util.spec_from_file_location("garmin_export", ROOT / "scripts" / "garmin" / "export_runs.py")
_garmin = importlib.util.module_from_spec(_spec)
sys.modules["garmin_export"] = _garmin
try:
    _spec.loader.exec_module(_garmin)  # type: ignore[union-attr]
except ModuleNotFoundError:
    # export_runs.py imports garminconnect at module level; only its pure helpers are needed here.
    sys.modules["garminconnect"] = type(sys)("garminconnect")
    sys.modules["garminconnect"].Garmin = object  # type: ignore[attr-defined]
    _spec.loader.exec_module(_garmin)  # type: ignore[union-attr]
privacy_route = _garmin.privacy_route
haversine = _garmin.haversine


def num(v: str) -> float | None:
    try:
        return float(v) if v not in ("", None) else None
    except ValueError:
        return None


def open_any(path: Path):
    return gzip.open(path, "rb") if path.suffix == ".gz" else open(path, "rb")


# ── Stream readers: each returns (points, meta) with points = [(t_sec, dist_m, lat, lon, hr)] ──
def read_fit(path: Path):
    pts, meta, t0 = [], {}, None
    with open_any(path) as fh, fitdecode.FitReader(fh) as fit:
        for frame in fit:
            if frame.frame_type != fitdecode.FIT_FRAME_DATA:
                continue
            if frame.name == "session":
                meta["sub_sport"] = str(frame.get_value("sub_sport", fallback="") or "")
            elif frame.name == "record":
                ts = frame.get_value("timestamp", fallback=None)
                d = frame.get_value("distance", fallback=None)
                if ts is None or d is None:
                    continue
                t0 = t0 or ts
                lat = frame.get_value("position_lat", fallback=None)
                lon = frame.get_value("position_long", fallback=None)
                pts.append(
                    (
                        (ts - t0).total_seconds(),
                        float(d),
                        lat * SEMI if lat is not None else None,
                        lon * SEMI if lon is not None else None,
                        frame.get_value("heart_rate", fallback=None),
                    )
                )
    return pts, meta


def _strip_ns(root):
    for el in root.iter():
        if "}" in el.tag:
            el.tag = el.tag.split("}", 1)[1]
    return root


def read_gpx(path: Path):
    root = _strip_ns(ET.parse(open_any(path)).getroot())
    pts, t0, dist, prev = [], None, 0.0, None
    for p in root.iter("trkpt"):
        t = p.findtext("time")
        if not t:
            continue
        ts = datetime.fromisoformat(t.replace("Z", "+00:00"))
        lat, lon = float(p.get("lat")), float(p.get("lon"))
        t0 = t0 or ts
        if prev:
            dist += haversine(prev, (lat, lon))
        prev = (lat, lon)
        pts.append(((ts - t0).total_seconds(), dist, lat, lon, None))
    return pts, {}


def read_tcx(path: Path):
    root = _strip_ns(ET.parse(open_any(path)).getroot())
    pts, t0 = [], None
    for tp in root.iter("Trackpoint"):
        t, d = tp.findtext("Time"), tp.findtext("DistanceMeters")
        if not t or d is None:
            continue
        ts = datetime.fromisoformat(t.replace("Z", "+00:00"))
        t0 = t0 or ts
        lat, lon = tp.findtext("Position/LatitudeDegrees"), tp.findtext("Position/LongitudeDegrees")
        hr = tp.findtext("HeartRateBpm/Value")
        pts.append(((ts - t0).total_seconds(), float(d), float(lat) if lat else None, float(lon) if lon else None, int(hr) if hr else None))
    return pts, {}


def read_stream(path: Path):
    name = path.name.lower()
    if ".fit" in name:
        return read_fit(path)
    if ".gpx" in name:
        return read_gpx(path)
    if ".tcx" in name:
        return read_tcx(path)
    return [], {}


# ── Derived metrics ────────────────────────────────────────────────────────────
def best_effort(pts, meters: float) -> int | None:
    """Fastest time to cover `meters` continuously (interpolated start), like Strava/Garmin best efforts."""
    if not pts or pts[-1][1] - pts[0][1] < meters:
        return None
    best, i = None, 0
    for j in range(1, len(pts)):
        tj, dj = pts[j][0], pts[j][1]
        if dj - pts[0][1] < meters:
            continue
        while i + 1 < j and dj - pts[i + 1][1] >= meters:
            i += 1
        (ta, da), (tb, db) = pts[i][:2], pts[i + 1][:2]
        target = dj - meters
        ts = ta + (tb - ta) * ((target - da) / (db - da)) if db > da else ta
        dt = tj - ts
        if dt > 0 and (best is None or dt < best):
            best = dt
    return round(best) if best else None


def km_splits(pts) -> list[dict] | None:
    if not pts:
        return None
    splits, next_km, last_t = [], 1000.0, 0.0
    for (ta, da, *_), (tb, db, *_) in zip(pts, pts[1:]):
        while db >= next_km > da:
            t = ta + (tb - ta) * ((next_km - da) / (db - da))
            splits.append({"km": 1.0, "durationSec": round(t - last_t)})
            last_t, next_km = t, next_km + 1000
    rest_km = (pts[-1][1] - (next_km - 1000)) / 1000
    if rest_km >= 0.05:
        splits.append({"km": round(rest_km, 2), "durationSec": round(pts[-1][0] - last_t)})
    return splits or None


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    export = Path(sys.argv[1])
    rows = list(csv.reader(open(export / "activities.csv", encoding="utf-8")))
    header, data = rows[0], rows[1:]
    # activities.csv repeats some column names; the second occurrence holds raw numbers.
    col = {}
    for i, name in enumerate(header):
        col[name] = i if name not in col or name in ("Activity ID", "Activity Date", "Activity Name", "Activity Type", "Filename") else col[name]
    last = {name: i for i, name in enumerate(header)}

    runs = []
    for r in data:
        if r[col["Activity Type"]] != "Run":
            continue
        name = r[col["Activity Name"]].strip()
        start = datetime.strptime(r[col["Activity Date"]], "%b %d, %Y, %I:%M:%S %p").replace(tzinfo=timezone.utc).astimezone(LOCAL_TZ)
        distance_m = num(r[last["Distance"]]) or 0.0
        moving = num(r[last["Moving Time"]]) or 0.0
        elapsed = num(r[last["Elapsed Time"]]) or moving
        if distance_m <= 0 or moving <= 0:
            continue

        pts, meta = [], {}
        fname = r[col["Filename"]]
        if fname and (export / fname).exists():
            try:
                pts, meta = read_stream(export / fname)
            except Exception as exc:  # a broken file shouldn't stop the import
                print(f"  ! {fname}: {exc}")
        gps = [(p[2], p[3]) for p in pts if p[2] is not None and p[3] is not None]
        # Treadmill: Strava leaves grade-adjusted distance empty without GPS; FIT says sub_sport=treadmill.
        indoor = (
            not r[last["Grade Adjusted Distance"]]
            or "treadmill" in meta.get("sub_sport", "")
            or "indoor" in meta.get("sub_sport", "")
            or name.lower().startswith("indoor")
            or len(gps) < 10
        )

        cadence = num(r[last["Average Cadence"]])
        run = {
            "id": f"strava-{r[col['Activity ID']]}",
            "date": start.date().isoformat(),
            "title": name if not GENERIC_NAME.match(name) else ("Treadmill run" if indoor else "Run"),
            "distanceKm": round(distance_m / 1000, 2),
            "durationSec": round(moving),
            "elapsedSec": round(elapsed),
            "avgHr": round(num(r[last["Average Heart Rate"]])) if num(r[last["Average Heart Rate"]]) else None,
            "maxHr": round(num(r[last["Max Heart Rate"]])) if num(r[last["Max Heart Rate"]]) else None,
            "elevationGainM": round(num(r[last["Elevation Gain"]])) if num(r[last["Elevation Gain"]]) is not None else None,
            # Strava reports running cadence per leg; the site shows steps per minute.
            "cadenceSpm": round(cadence * 2) if cadence and cadence < 120 else (round(cadence) if cadence else None),
            "indoor": indoor,
            "source": "strava",
        }
        if not indoor:
            run["route"] = privacy_route(gps)
            run["splits"] = km_splits(pts)
            efforts = {k: best_effort(pts, km * 1000) for k, km in EFFORTS_KM.items()}
            run["bestEfforts"] = {k: v for k, v in efforts.items() if v}
            if RACE_PATTERNS.search(name):
                run["race"] = {"name": name}
        runs.append({k: v for k, v in run.items() if v not in (None, {}, [])})

    runs.sort(key=lambda x: x["date"], reverse=True)
    OUT.write_text("[\n" + ",\n".join(json.dumps(x, separators=(",", ":")) for x in runs) + "\n]\n", encoding="utf-8")
    outdoor = [x for x in runs if not x["indoor"]]
    print(f"Wrote {len(runs)} runs ({len(outdoor)} outdoor, {len(runs) - len(outdoor)} indoor) to {OUT}")
    print(f"Races: {', '.join(x['race']['name'] for x in runs if 'race' in x) or 'none'}")


if __name__ == "__main__":
    main()
