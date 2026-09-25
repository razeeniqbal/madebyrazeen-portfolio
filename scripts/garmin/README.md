# Garmin → portfolio running data

`export_runs.py` reads your recent Garmin Connect runs and writes `content/running/runs.json`.
When that file is non-empty the `/running` page and the homepage teaser use it instead of the labelled sample data.

**Status: written but not yet run against a real account.** Expect a first-run fix or two.

## Run it locally (first time)

```bash
pip install -r scripts/garmin/requirements.txt
set GARMIN_EMAIL=you@example.com
set GARMIN_PASSWORD=...
set GARMINTOKENS=%USERPROFILE%\.garminconnect
python scripts/garmin/export_runs.py
```

Check `content/running/runs.json`, then commit it.

## Automate it

`.github/workflows/garmin-sync.yml` runs daily at 06:00 MYT once you add `GARMIN_EMAIL` and `GARMIN_PASSWORD` as repository secrets. If your account has MFA, the unattended login will fail; use the token-cache approach (log in locally once, then provide the cached tokens to the workflow).

## Privacy

- Route: 300 m removed from both ends, downsampled, and normalised to a 0..1 shape. No latitude/longitude is written.
- Only summary metrics, splits and the route shape are exported, nothing else from your Garmin profile.
- Activities whose name contains a race keyword (`RACE_KEYWORDS`) are listed in race history. Rename the activity in Garmin to control this.

## Caveats

`garminconnect` is an unofficial library. The official route is the Garmin Connect Developer Program, which needs an approved application.
