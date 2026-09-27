# R03 · UI / content hierarchy refinement

## Navigation
- Before: Work · Stories · Running · About · Resume ↗ · Contact →, plus "Build · Learn · Experiment · Improve" in the header.
- After: About · Work · Stories · Running · Resume ↗ · Contact →. Philosophy line removed from the header; it lives in About (How I think), the footer and the mobile menu. Lab stays secondary (footer, /work).

## Hero
- Portrait starts level with the second headline line (BUILDER.): `lg:mt-[calc(2.5rem+min(6.5vw,7.65rem))]`; crop 5:4 on desktop, square on tablet, 4:5 on mobile. Grid rows `auto 1fr` so the tall right column never pushes the CTAs down.
- Mobile order: text → portrait → credentials → CTAs (DOM order; desktop placement via grid).
- Verified at 1920×1080, 1440×900, 1366×768, 1024×768, 390, 360.

## Credentials
- Selection: `featured: true` in `achievements.json` (admin checkbox). Currently PL-300, AI-102, DP-700, Google Generative AI Leader.
- Desktop: badges only, name · issuer · year in a small hover/focus tooltip; each badge links to its verify URL or `/work#credentials`. Mobile: details written under the badges.
- View all → `/work#credentials` (full list + achievements moved there from About). `/achievements` redirect now points there.
- Badge artwork: none exists in the repo (V1 image paths were never shipped). `CredentialBadge` shows official artwork automatically once a file exists at the `image` path in `/public`; until then a neutral tile with the exam code or issuer mark.

## About
- Removed: "at a glance" stats, 9-chapter timeline, path diagram, credential list (→ /work), recognition (→ /work), contact block, Mini Razeen poses in chapters.
- New: Intro (real portrait, 2 paragraphs) · The path (5 stages, editorial narrative, real photos) · How I think (Input → Process → Iterate → Progress) · Beyond the screen (real photos, links to Running and Stories) · Currently (Building from in-progress projects, Exploring from lab.json) + CTAs. Mini Razeen appears once.
- Path stages are chronological: Civil engineering (2017) → Data analytics (2022) → Artificial intelligence (2024) → Data engineering (2025) → Building systems (now). Chapter copy is draft voice built from existing facts; rewrite in the admin (About · story).

## Resume
- Desktop: named-area grid, left 24 / main 49 / right 27 with hairline rules. Left: contact, certifications (featured first, 8 max, verify links), education, achievements. Main: work experience (≤5 bullets each), selected work (text only, Sepang = "In development"). Right: skills by purpose, languages.
- Tablet: main + rail. Mobile: one column in the order contact · experience · selected work · skills · certifications · education · achievements · download.
- Print: white, no nav/assistant/controls, root 11px, main + rail then a 3-column band (certifications · education · achievements). 2 A4 pages.
- Data: profile, bio.short (replaces the hardcoded paragraph), experience, projects, capabilities, achievements, recognition. No second dataset.

## Performance
- Chat launcher collapsed to the avatar (label on hover/focus) so it no longer covers hero content. Credential badges are CSS tiles (no image requests) until artwork exists.

## Remaining issues
- Official badge artwork missing (add files at the `image` paths in achievements.json).
- About "Currently › Learning" left out: no existing content to source it from.
- 4 of the new certifications have no issue date, so no year is shown.
- Lab still describes "Ask Razeen" as "Not built yet" although the assistant is live (out of R03 scope).
- Pre-existing lint errors in SiteHeader, ProjectIndex and lib/github.ts (untouched by this pass). No test suite exists.
- Reference screenshots mentioned in the brief were not attached; structure followed the written spec.
