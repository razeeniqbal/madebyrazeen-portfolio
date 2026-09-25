# M06 → M15 · Remaining milestones

**Branch:** `v2` (uncommitted) · **Date:** 2026-09-25

## CREATED

**M06 Running** (`/running`)
- `content/running.ts` rebuilt as a source-agnostic data layer (`getRuns`, `getLatestRun`, `getPersonalBests`, `getRaces`, `getTotals`). It reads `content/running/runs.json`. While that file is empty, the labelled sample run is used, and every place it appears says "Sample data · Garmin sync coming".
- Page sections:
  - Header with real race photo.
  - Six-metric latest-run panel.
  - `RouteMap`: dark grid, lime route that draws once (INITIAL → COMPLETE), km milestones, start ring vs lime finish dot.
  - Splits table with deltas vs average; bars are shape-coded (filled = faster, outlined = slower), and a text legend is included.
  - "Why it connects" principles, personal bests, race-history empty state, running-stories teaser.
- **Garmin pipeline** (`scripts/garmin/export_runs.py` + `.github/workflows/garmin-sync.yml` + README):
  - Exports summary metrics, splits and route. The route has 300 m trimmed from both ends and is normalised to a 0..1 shape, so no GPS coordinates are published. The privacy function was tested offline.
  - The daily Action commits new runs and so triggers a redeploy.
  - **Not yet run against a real account.**

**M07 Notes** (`/notes`, `/notes/[slug]`)
- Notes reuse the case-study block types; statuses are `published` / `draft` / `in-writing`.
- Reading template: 44rem measure, 17px / 1.75 body, Article JSON-LD. Drafts are noindex with a DRAFT banner.
- One draft note written from QualityPlus material: "What a data quality score should actually tell you".

**M09 About** (`/about`)
- Portrait (real photo), 4-step journey, a six-photo "people & places" gallery, and recognition (Google Speaker AI Build 2025, AWS National Top 20).
- Experience timeline and all credentials: a filterable list by issuer with search. "Verify ↗" is shown only where the URL is a real credential link; the 6 generic vendor URLs are hidden rather than implying verification.
- Beyond work, and contact.

**M10 System states**
- `app/(v2)/loading.tsx`: INPUT → PROCESS → ITERATE → PROGRESS → READY sequence (~1.1s, pure CSS). It only renders while a route is actually loading, and reduced motion shows the completed state at once.
- `app/(v2)/error.tsx`: Mini Razeen error state with retry.
- Existing: 404, no-results, no-notes, under-construction, race-history empty.

**M11 Motion** (CSS + one ~40-line observer; no animation library)
- Scroll reveals on section headers, project features, photos and diagrams.
  - The hidden starting state only applies after JS runs.
  - Anything already on screen is never hidden.
  - Fully off under `prefers-reduced-motion`.
- Diagram construction: flow nodes light up left → right.
- Hero trajectory nodes activate in sequence; the route map draws once; the loading sequence animates.
- Existing: hover lifts on project blocks and arrow links.

**M12 Responsive**
- All 12 V2 page types measured for horizontal overflow at **375, 768, 1024 and 1920 px**: zero overflow everywhere. (Tables and the heatmap scroll inside their own containers by design.)
- Mobile uses a recomposed nav and trimmed annotations.

**M13 SEO & social**
- `sitemap.xml` (static pages, 15 projects, published notes only) and `robots.txt` (disallows `/system` and `/api/`).
- Canonical URLs on every page; OpenGraph and Twitter defaults.
- JSON-LD: `Person` (home), `SoftwareSourceCode` / `CreativeWork` (projects), `Article` (notes).
- **Generated share images** with the brand fonts (Inter 800 and JetBrains Mono, vendored as OFL woff) for identity, project (×15, from each project's own metadata), note and running.
- `dynamicParams = false` on `[slug]` routes, so unknown slugs return a real 404 status.

**M14 Performance & accessibility**
- Performance:
  - Server Components by default.
  - Client JS limited to the header menu, reveal observer and two filter lists.
  - framer-motion and lucide are only reachable from the V1 archive.
  - Fonts via `next/font`.
  - All images through `next/image` with `sizes`; hero marked `priority`.
  - Photos cut from ~50 MB to 2.9 MB.
- Favicon replaced: 270 KB V1 `.ico` → 3 KB lime-dot mark (+ `icon.svg`, `apple-icon.png`).
- Accessibility:
  - One `h1` per page and a skip link.
  - Visible lime or ink focus rings.
  - Muted text contrast 6.0:1 on light and 7.4:1 on dark.
  - State never carried by colour alone (dot shape, `aria-pressed`, `aria-current`, text labels).
  - Charts have text alternatives; reduced motion respected.
- Removed unused starter SVGs and `types/index.ts`.

**M15 QA** (see VERIFIED below). README rewritten for V2.

## VERIFIED

- Dev: every V2 route returns 200; an unknown route returns 404; the 4 legacy redirects return 308.
- No horizontal overflow at 4 widths.
- Console and server clean.
- Typecheck clean.
- **Production build passes** (clean `npm ci` + `next build` outside OneDrive): compiled, typechecked, **58 static pages** pre-rendered, including all 15 project pages, 1 note and every OG image. `/lab` and `/api/github` revalidate hourly.
- Production smoke test: `/` 200, `/projects` 308 → `/work`, unknown project/note slugs are real 404s, `/archive/v1` 200, `robots.txt` correct, `sitemap.xml` has 23 URLs.
- **Lighthouse** on the production build (default = throttled mobile):

  | Page | Perf | A11y | Best practices | SEO |
  |---|---|---|---|---|
  | `/` | 76 | 100 | 100 | 100 |
  | `/about` | 89 | 100 | 100 | 100 |
  | `/running` | 90 | 100 | 100 | 100 |
  | `/work/sepang-vision-lab` | 93 | 100 | 100 | 100 |
  | `/` (desktop preset) | **100** | | | |

  CLS is 0 everywhere; desktop LCP is 0.8 s.
  - Fixed during QA: `aria-label` on a plain span (the wordmark) and footer touch targets. Both are now 100.
  - Remaining mobile cost is the framework runtime (React DOM + Next, ~220 KB) plus the hero photo as LCP on throttled 4G. That's acceptable; the PRD says not to chase the number at usability's expense.

## PENDING FROM YOU

1. Review / approve case-study wording (Sepang, QualityPlus). Then set `review: 'approved'` in each file under `content/case-studies/`.
2. Rewrite the drafted voice copy: `content/profile.ts` (journey), the About and Intro blurbs, `exploring` in `content/lab.ts`, and draft note 001 in `content/notes.ts`.
3. NLP project details (context, confidentiality, method, results) → write its case study, remove `placeholder`.
4. Garmin: run `scripts/garmin/export_runs.py` once locally, then add `GARMIN_EMAIL` / `GARMIN_PASSWORD` repo secrets for the daily Action.
5. Assets: higher-res hero photo; proper transparent Mini Razeen exports.
6. Confirm: phone stays hidden; resume PDF is current.
7. Deploy (not done, since it's outward-facing):
   - Commit + push `v2`.
   - Create/point the Vercel project.
   - Set `GITHUB_TOKEN` in Vercel env.
   - Add the `portfolio.madebyrazeen.com` DNS record.
   - Merge to `master` when happy.
8. Optional: move the repo out of OneDrive (OneDrive turns `node_modules` into cloud placeholders, which breaks copies and slows builds).
