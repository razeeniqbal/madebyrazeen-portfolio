# M04 Work Index · M05 Case Studies · M08 Lab

**Branch:** `v2` (uncommitted) · **Date:** 2026-09-25

## CREATED

**M04 — Work index**
- `components/v2/work/ProjectIndex.tsx` (client island). The flagship and featured blocks at the top of `/work` stay as they are; this index sits below them.
  - Category filter buttons with counts and `aria-pressed`.
  - Search across title, summary, stack and tags (kept from V1).
  - Result count read out to screen readers.
  - Mini Razeen "no results" state with a clear-filters action.
  - Category is mirrored to `?category=` so filtered links can be shared; the page is still statically rendered.

**M05 — Case-study framework**
- `content/case-studies/types.ts`: sections follow the PRD §20 order (overview → problem → idea → architecture → data → build → interface → outcome → learned), then next project. Each section holds typed blocks: `text`, `list`, `steps`, `flow`, `metrics`, `table`, `image`.
  - No MDX dependency needed.
  - To add a case study, write one file and register it in `content/case-studies/index.ts`.
- `components/v2/case-study/CaseStudyView.tsx` + `CaseStudyBlocks.tsx`: one template for all case studies.
  - Dark/light surface per section type.
  - Prose in a reading column; diagrams full width.
  - Accessible data table.
  - Metrics carry an `illustrative` flag.
  - Disclaimer and "next project" link.
- **Sepang Vision Lab**: written from the repo's README, PRD and milestone docs M2–M17. All numbers are sourced:
  - 1,024 laps; 448 / 207 / 275 split; 0.11% geometry delta; 10,000 Monte Carlo scenarios.
  - The real ML results table, including the finding that the naive baseline beat every trained model on test.
  - Includes the independent-project disclaimer the Sepang PRD requires.
- **QualityPlus**: written from the vault notes (4 dimensions, 3 n8n/Ollama workflows, correction provenance, roles, governed templates, the Render → Supabase pivot). No usage metrics claimed.
- Both are labelled **"Drafted from project docs · under review"** until you approve the wording. To approve, set `review: 'approved'`.

**M08 — Lab**
- `/lab` built out:
  - Experiments list, each with a status (live / prototype / planned).
  - **Coding activity** migrated from the V1 dashboard. It's server-rendered from the GitHub API with hourly revalidation, and shows 4 stats, an SVG contribution heatmap (lime intensity scale, per-day `<title>`, text summary for screen readers) and the language split.
- `components/v2/lab/ContributionGraph.tsx`.

## MODIFIED

- `lib/github.ts`: **removed the invented fallback stats** (42 repos / 156 followers / 1,247 contributions). A failure now returns `null`; `/api/github` returns 503; `/lab` shows "GitHub data is unavailable right now". The archived V1 dashboard already handles a failed response.
- `/work/[slug]`: shows the case study when one is registered, otherwise the overview; metadata uses the case-study lede.
- `/work`: tier lists replaced by the filterable index.

## PRESERVED

- V1 at `/archive/v1/*`, including its dashboard (verified 200).

## VERIFIED

- `/work`, `/work?category=analytics` (5 of 15, filter restored from the URL), `/work/sepang-vision-lab`, `/work/qualityplus`, `/work/edugen` (overview fallback), `/lab` (live data: 1,162 contributions, 22 repos), `/api/github` all return 200.
- Full-page screenshots reviewed.
- Typecheck clean, no console or server errors.

## ISSUES

1. Case-study wording is a draft in your voice; please read both and correct anything you'd say differently.
2. The NLP case study isn't written (the project is still a placeholder).
3. Full `next build` still to be run outside OneDrive.

## NEXT

- M06 Running (needs the Garmin export decision; can be built against sample data now).
- M07 Notes (needs at least one real note, or a template post).
- M09 About (real photography + all 43 credentials).
- M10 System states (loading sequence, error page).
