# M02 Global Shell + M03 Homepage

**Branch:** `v2` (uncommitted)
**Date:** 2026-09-25
**Instruction:** proceed, and use clearly-marked stand-ins for anything not yet supplied.

## Placeholders in use

Every placeholder is flagged in the data and visibly labelled in the UI, so it can't be mistaken for real content (PRD §58).

| Where | Placeholder | Flag / label | Replace by |
|---|---|---|---|
| Running teaser | 10.21 km / 58:24 / 5:43 | `sample: true` → "Sample data · Garmin sync coming" | Garmin export (M06) |
| Field notes | 3 planned note titles | `status: 'in-writing'` → "In writing" | Writing the notes (M07) |
| AI / NLP project | Summary from the cover board | `placeholder: true` → "Details coming" | Your confirmation of context + method |
| Currently exploring | 4 items inferred from recent repos | comment in `content/lab.ts` | Edit the list |
| About teaser copy | "Civil engineering taught me to respect systems…" | — (voice draft) | Your wording (M09) |
| Project covers | Numbers painted into the boards | "Cover art · figures illustrative" | — |
| Lab / Running / About | Route stubs | "Under construction · M0x" | M06 / M08 / M09 |

Defaults assumed: contact = direct links only (**phone hidden**), host = Vercel at `portfolio.madebyrazeen.com` (set as `metadataBase`).

## CREATED

**Shell (M02)**
- `components/v2/layout/SiteHeader.tsx`: sticky dark header with wordmark, 5-item nav, and Contact →.
  - Active state is a lime dot **plus** ink colour and `aria-current`, so it doesn't rely on colour alone.
  - Skip-to-content link.
  - Mobile: a full-screen numbered index with Mini Razeen. It locks scroll while open, and Escape closes it and restores focus (verified).
- `components/v2/layout/SiteFooter.tsx`: follows PRD §40, plus CV download and Archive links.
- System primitives: `SectionHeader`, `Trajectory` (○ ─ ○ ─ ●), `ArrowLink`, `PhotoFrame` (registration marks + mono caption), `EmptyState`, `UnderConstruction`.
- `components/v2/diagram/FlowDiagram.tsx`: first architecture-language primitive. Node types, ACTIVE node, semantic `<ol>`; horizontal on desktop, vertical on mobile.
- `lib/site.ts`: nav config.
- `app/(v2)/archive/page.tsx`: portfolio archive (V2 current / V1 2025), per PRD §47.
- `app/not-found.tsx`: Mini Razeen 404 inside the V2 shell.
- Redirects: `/projects`→`/work`, `/dashboard`→`/lab`, `/smart-talk`→`/lab`, `/achievements`→`/about` (all 308).

**Homepage (M03)**: `app/(v2)/page.tsx` + `components/v2/home/*`, following the PRD §8 dark/light rhythm:
1. **Hero** (dark): statement, supporting line, 2 CTAs, monochrome real photo, INPUT→PROGRESS trajectory.
2. **Intro** (light): 01 / About the work.
3. **Selected work** (dark): flagship full-width (Sepang), then 7/5-column featured pair (QualityPlus, NLP), then an editorial row list, then "All 15 projects".
4. **Featured system** (light): QualityPlus as a real system-flow diagram built from its documentation.
5. **Capabilities** (light): 4 purpose groups, no logos or bars.
6. **Experience** (light): timeline + education + CV.
7. **Running teaser** (dark): real race photo + sample metrics.
8. **Currently exploring + Field notes** (light).
9. **Lab teaser** (dark): 3 experiments, each with a status (live / prototype / planned).
10. **About teaser** (light, photo): real workshop photo, 33 certifications (counted from data).
11. **Contact** (dark).

**Pages:**
- `/work`: working index with flagship + featured blocks and tiered lists (M04 will add filters).
- `/work/[slug]`: static pages for all 15 projects from structured data, with per-project metadata. The full case study comes in M05.
- `/contact`: complete (direct channels).
- `/notes`: "no notes yet" state listing the planned notes.
- `/lab`, `/running`, `/about`: stubs.

**Content:** `content/running.ts` (Run model + `getLatestRun`, pace/duration formatters, source-agnostic), `content/notes.ts`, `content/lab.ts`. Project covers converted to WebP (≈115 KB each).

## MODIFIED

- V1 moved from the `(v1)` route group to **`/archive/v1`**. Components moved to `components/v1/`. All internal links re-prefixed. Metadata set to `noindex`. A "back to current" pill added.
- `next.config.js`: redirects added; unused Unsplash/simpleicons image hosts removed.
- `content/projects.ts`: covers wired in, `placeholder` flag added, NLP un-drafted as placeholder.
- Tokens: the grid texture is now a much fainter separate token (`--grid-line`). `display-xl` capped at 8.5rem so hero CTAs sit above the fold at 1440×900.
- Fixed a V1 regression: its page background went light after the move (`dark:` variants need a `.dark` ancestor).

## PRESERVED

- All V1 pages render at `/archive/v1/*`, visually unchanged (verified by screenshot). GitHub API route returns live data.

## REMOVED

- Nothing deleted.

## VERIFIED

- 16 routes return 200 (404 for an unknown route), and the 4 redirects return 308.
- 1440px: full-page screenshot reviewed section by section.
- 375px: no horizontal overflow (measured). Mobile hero and menu reviewed.
- No console errors. Source typechecks clean.

## ISSUES

1. Full `next build` still not run to completion locally (OneDrive slowness). Run it once on a machine or CI outside OneDrive before deploying.
2. The hero photo (800 px source) is at its limit on large screens.
3. Motion is intentionally absent (M11).

## NEXT

- M04 Work index (filters by category, editorial layout).
- M05 Case-study template → Sepang Vision Lab first.
