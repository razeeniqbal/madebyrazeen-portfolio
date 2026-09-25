# M01 — V2 Foundation

**Branch:** `v2` (from `master`, uncommitted)
**Date:** 2026-09-25
**Review page:** `/system` (noindex, not linked). Shows tokens, type, grid, Mini Razeen, photography and content on real data.

## Decisions applied from the M00 review

| # | Decision |
|---|---|
| L1/L2 | Photos supplied in `OneDrive/Photo/portfolio photo` (12 originals incl. 2 running). Mini Razeen: interim cut-outs from the master character sheet. Wordmark: built as live text, not an image. |
| L3 | Running numbers on the boards are **not real**. Nothing from the running board is used. Real data will come from Garmin (see NEXT). |
| L4 | Mono font: **JetBrains Mono** (matches the approved brand sheets). |
| L5 | Work on a new `v2` branch in the existing repo. |
| L7 | Project list must stay easy to edit, list everything like V1, and still feature some. Solved with `tier` + `order` in `content/projects.ts`. |

## CREATED

- `content/projects.ts` — single source of truth for all projects. PRD §19 schema plus `tier` (flagship / featured / standard / archive), `order`, `draft`, `confidential`, and per-metric `illustrative` flag. Helpers: `getProjects()`, `getProjectsByTier()`, `getProject(slug)`.
  - 15 published + 1 draft. Added **Sepang Vision Lab** (flagship), **QualityPlus** (featured, confidential repo), **AI / NLP Research** (featured, `draft` until confirmed).
  - Years and **3 live URLs V1 was missing** (EduGen, LeadSightz, HR Analytics) taken from the public GitHub API, not guessed.
- `content/profile.ts` — identity, statement, loops, contact, education, and the long bio that used to be hard-coded in the About page.
- `content/experience.ts` — roles, with optional `worked / changed / learned` fields for the PRD §25 framing.
- `content/capabilities.ts` — PRD §24 purpose groups; no levels, no logos.
- `lib/assets.ts` — typed asset manifest; every image carries its `alt`.
- `public/assets/v2/**` — 12 photos converted to WebP (≤2400px, **EXIF/GPS stripped**, ~50 MB → 2.9 MB) + 9 Mini Razeen transparent PNG cut-outs.
- `app/(v1)/layout.tsx` — V1 shell (sidebar, drawer, Allura font) moved out of the root layout.
- `app/(v2)/layout.tsx`, `app/(v2)/system/page.tsx` — V2 base layout + review page.
- `components/v2/identity/Wordmark.tsx`, `MiniRazeen.tsx`; `components/v2/system/Section.tsx`, `TechnicalLabel.tsx`.
- Design tokens:
  - CSS variables for the 4 brand colours plus `data-surface="dark|light"` semantic tokens (`surface`, `ink`, `muted`, `line`, `signal`), so a component works on either section type.
  - Fluid display scale (`text-display-xl…sm`, `text-lead`), `py-section` rhythm, `.page-grid` (4 / 8 / 12 columns), `.label` mono style, `.bg-tech-grid` texture.
  - Global lime focus ring, and reduced-motion handling.

## MODIFIED

- `app/layout.tsx` — now a minimal root: fonts via `next/font` only (Inter + JetBrains Mono), no shell.
- `app/globals.css` — V2 tokens added. **All V1 rules scoped under `.v1`**, including the scrollbar hiding and mobile `!important` overrides, so none of them reach V2. Removed the duplicate Google Fonts `@import`s.
- `tailwind.config.ts` — V2 colours, fonts, type scale, spacing; font families now use the `next/font` variables.
- `lib/data.ts`, `lib/projectsData.ts`, `lib/achievementsData.ts` — now thin compatibility layers over `/content`, so V1 pages read the same data as V2.

## PRESERVED

- Every V1 page, unchanged, at the same URL (moved into the `(v1)` route group). Smoke-tested: `/`, `/about`, `/projects`, `/achievements`, `/dashboard`, `/contact`, `/smart-talk` all return 200 inside the V1 shell. V1 `/projects` now lists the new projects too.
- All achievements (moved to `content/achievements.ts`), resume PDF, GitHub route, SEO metadata.

## REMOVED

- Nothing deleted. (`types/index.ts`, starter SVGs, logo-wall data are scheduled for removal once V1 moves to `/archive/v1` in M02.)

## ISSUES

1. **Hero photo is only 800×800.** It's fine as a half-width image, but too small for a full-bleed hero on large screens. A higher-resolution original of that shot would help.
2. **Mini Razeen cut-outs are small** (97–293 px tall). They're fine for nav details and empty states, but not for large illustrations. Proper transparent exports from the source tool are still wanted.
3. **Bio text is stale.** It says "Currently pursuing Master's", but the education data says 2024–2025. It will be rewritten in M09.
4. **NLP project** is `draft` until you confirm its context and method. The board mentions both "FastText 300d" and "768 dimensions", which contradict each other.
5. **Local builds are very slow** in the OneDrive folder: dev server start takes about 3.5 minutes, and one transient `UNKNOWN: read` file lock hit `node_modules`. Consider moving the repo out of OneDrive, or excluding `node_modules` and `.next` from sync.
6. A full `next build` hasn't completed locally yet because of issue 5. The type check (`tsc`) passes, apart from stale generated types that clearing `.next` removes.

## NEXT — M02 Global Shell

- Move V1 to `/archive/v1` with permanent redirects (`/projects` → `/work`, `/dashboard` → `/lab`, `/achievements` → `/about#credentials`, `/smart-talk` → `/lab`).
- V2 navigation (desktop + intentionally designed mobile menu), footer, page shell, section system, annotation primitives.
- Running data source: Garmin via a scheduled export into `content/running/*.json`. The site never calls Garmin live. Pick the export method before M06: manual FIT/GPX, the unofficial `garminconnect` library in a GitHub Action, or the official Garmin Connect Developer Program.
