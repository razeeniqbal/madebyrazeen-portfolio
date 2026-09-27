# R04 · Running data, personal bests, cheaper assistant

## Running
- **New source:** `scripts/strava/import_export.py <export folder>` reads a Strava "Download your data" export
  (activities.csv + FIT/GPX/TCX tracks only; contacts, messages, logins and media are never read or copied)
  and writes `content/running/strava.json`. Re-run it whenever you download a new export.
- **Merge:** `content/running.ts` merges Strava (full history) with the daily Garmin sync (`runs.json`),
  de-duplicating by date + distance (within 3%). Garmin-only runs are the ones newer than the export.
- **Treadmill runs are excluded everywhere** (flagged by Strava's missing grade-adjusted distance,
  FIT sub_sport, or no GPS). The Garmin sync now writes `indoor` itself, and records moving time
  (`durationSec`) with elapsed time kept as `elapsedSec`.
- **Personal bests** are best efforts: the fastest continuous 1K / 5K / 10K / half inside any outdoor run,
  computed from the GPS stream. They are the highlight of /running and of the Home teaser.
- **Races** are detected from event names (a year, "HM", "Ekiden", "Debut", "Race", "Marathon") and shown with
  elapsed (gun-style) time.
- /running order: Personal bests · In numbers (totals, monthly distance, weekly consistency) · Races ·
  Latest outdoor run (route + splits) · Every run (first 12, then "Show all") · Why it connects · Stories.
- Privacy unchanged: route shapes only, 300 m trimmed from each end, normalised, no coordinates.

## Assistant
- Model: `claude-haiku-4-5` (was `claude-opus-5`), standard Messages API, no effort/fallback options
  (not needed for short grounded answers). `CHAT_MODEL` still overrides.
- The knowledge now includes real PBs, totals and races.
- One Mini Razeen at a time: the launcher hides while the panel is open (the panel header has Close
  and the mood avatar); the full-body greeting figure was removed. Focus returns to the launcher on close.
