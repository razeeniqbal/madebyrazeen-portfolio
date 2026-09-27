# Garmin → portfolio running data

`export_runs.py` reads your recent Garmin Connect runs and merges them into `content/running/runs.json`.
The site combines this with the full history from the Strava export (`content/running/strava.json`,
see `scripts/strava/import_export.py`), de-duplicates, and hides treadmill runs.

`runs.json` **accumulates**: each sync adds or updates the latest `RUN_LIMIT` activities and keeps
everything older, so runs never disappear when they leave the window.

## Run it locally

```bash
pip install -r scripts/garmin/requirements.txt
set GARMIN_EMAIL=you@example.com
set GARMIN_PASSWORD=...
set GARMINTOKENS=%USERPROFILE%\.garminconnect
python scripts/garmin/export_runs.py
```

`GARMINTOKENS` saves the login so later runs don't need the password (or an MFA code).
Set `RUN_LIMIT=1000` once to backfill your whole Garmin history.

## Automate it (GitHub Actions)

1. GitHub → the repo → **Settings → Secrets and variables → Actions → New repository secret**.
2. Add `GARMIN_EMAIL` and `GARMIN_PASSWORD`.
3. **Actions → Garmin sync → Run workflow** to test it (optionally set *run_limit* to `1000` for a one-time backfill).
   After that it runs every day at 06:00 MYT and commits new runs, which redeploys the site.

### If the login fails

Garmin sometimes blocks password logins from cloud servers, or asks for an MFA code. Use the saved login instead:

1. Run the script locally once with `GARMINTOKENS` set (above). This creates `%USERPROFILE%\.garminconnect`.
2. In PowerShell, pack it and copy it to the clipboard:
   ```powershell
   tar -czf "$env:TEMP\garmin-tokens.tgz" -C "$env:USERPROFILE\.garminconnect" .
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("$env:TEMP\garmin-tokens.tgz")) | Set-Clipboard
   Remove-Item "$env:TEMP\garmin-tokens.tgz"
   ```
3. Add a repository secret `GARMIN_TOKENS` and paste. The workflow restores it before logging in.
   The saved login lasts about a year; repeat these steps if the sync starts failing again.

## Privacy

- Route: 300 m removed from both ends, downsampled, and normalised to a 0..1 shape. No latitude/longitude is written.
- Only summary metrics, splits and the route shape are exported, nothing else from your Garmin profile.
- Treadmill runs are flagged `indoor` and hidden on the site.
- Race detection: activity names containing a year ("Perkeso Run 2026"), "HM", "Ekiden", "Debut", or `RACE_KEYWORDS`.

## Caveats

`garminconnect` is an unofficial library. The official route is the Garmin Connect Developer Program, which needs an approved application.
