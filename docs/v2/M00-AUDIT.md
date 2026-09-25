# M00 — Repository Audit

**Project:** Razeen Iqbal Portfolio V2
**Date:** 2026-09-25
**Scope:** Analysis only. No source code, dependencies or assets modified. Source of truth: [PRD.md](PRD.md).

---

## A. Repository overview

| Item | Current state |
|---|---|
| Framework | Next.js 16.1 (App Router), React 19.2, TypeScript 5.9 |
| Styling | Tailwind **3.4** (README wrongly says 4.1), `darkMode: 'class'`, hard-coded `dark` on `<html>` |
| Motion | framer-motion 12 |
| Other deps | lucide-react, clsx, tailwind-merge. Nothing else. README claims Zustand, SWR, Supabase, Firebase, Nodemailer: **none are installed** |
| Git | `master`, clean except `package-lock.json`. Remote `razeeniqbal/portfolio-v1.0` |
| Size | ~30 source files, ~150 KB of TSX/TS. Small, easy to evolve rather than rewrite |
| Layout model | Desktop: a centred rounded "floating window" (`max-h-[90vh]`) with a 288px sidebar and an inner scroll container. Mobile: fixed header + slide-in drawer |
| Visual system | Neutral grey dark theme with blue/purple/orange gradient accents, `GlowCard` spotlight cards everywhere. The 90s "retro" system described in the README was **already removed** (commit `fdce56a`). What V1 actually looks like today is "dark SaaS card grid" |
| Stray dirs | `.kilo/worktrees/oxidized-soda` (untracked copy of the repo from another tool), `.next` build output |

**Verdict:** Continue in this repository. The stack matches the PRD's technical direction exactly (Next.js + TS + Tailwind + Framer Motion). There is no justification to start over, but almost all **presentation** code will be replaced. The value to preserve lives in data, links, the GitHub integration, and the resume.

## B. Route map

| Route | File | Rendering | Notes |
|---|---|---|---|
| `/` | `app/page.tsx` | `'use client'` | Short bio, tech-logo wall (`pythonStack`), 6 gradient "explore" cards |
| `/about` | `app/about/page.tsx` | client | Bio (hard-coded prose in the page), Career, Education, resume download |
| `/projects` | `app/projects/page.tsx` | client | Search + category filter + "featured" toggle, uniform 3-col card grid |
| `/achievements` | `app/achievements/page.tsx` | client | Search + filter over 43 certs/courses, uniform card grid |
| `/dashboard` | `app/dashboard/page.tsx` | client | GitHub stats, contribution heatmap, language % bars |
| `/smart-talk` | `app/smart-talk/page.tsx` | client | **"Coming soon" placeholder only.** No AI assistant exists |
| `/contact` | `app/contact/page.tsx` | client | Contact form that **does not send** (a `setTimeout` fakes success), contact methods list |
| `/api/github` | `app/api/github/route.ts` | route handler, `revalidate = 3600` | Proxies `lib/github.ts` |

No `not-found`, `loading`, `error`, `sitemap`, `robots`, `opengraph-image`, or dynamic `[slug]` routes exist. There is no chat room either, despite the README.

## C. Component map

| Component | Used by | V2 fate |
|---|---|---|
| `layout/ModernSidebar` | root layout (desktop) | REMOVE → replaced by V2 top nav |
| `layout/MobileMenu` | root layout (mobile) | REMOVE → V2 mobile nav (drawer logic is reference only) |
| `ui/spotlight-card` (`GlowCard`) | nearly every page | ARCHIVE (V1 only). It is exactly the "glow card" the PRD bans |
| `ui/MagicCard` | exported, unused | ARCHIVE |
| `ui/SimpleCard` | home | ARCHIVE |
| `ui/ProjectCard` | projects | ARCHIVE. Replaced by `ProjectFeature` / `ProjectPreview` |
| `ui/AchievementCard` | achievements | ARCHIVE. Achievements become a list/table |
| `ui/CareerSection` | about | REFACTOR → V2 Experience timeline (data shape reused) |
| `ui/EducationSection` | about | REFACTOR (resume-download logic kept; the "Download Portfolio" button just opens the site in a new tab, so drop it) |
| `ui/SkillIcon` + `lib/techStackIcons.tsx` | home | ARCHIVE. Logo wall is a PRD non-goal |
| `ui/ThemeToggle` | exported, unused | REMOVE (V2 has fixed light/dark *sections*, not a theme toggle) |

## D. Data / content map

| File | Contents | Quality | V2 fate |
|---|---|---|---|
| `lib/data.ts` | `personalInfo`, `careers` (3), `educationCards` (2) | Real, good | MIGRATE → `content/profile.ts`, `content/experience.ts` |
| `lib/projectsData.ts` | 12 projects (title, desc, stack, tags, GitHub URL, category, featured) | Real links; image paths point to `/projects/*.jpg` files **that don't exist**, so every card falls back to a purple gradient | MIGRATE → `content/projects.ts` with the PRD §19 schema (number, year, status, role, problem, architecture, outcome, learning…) |
| `lib/achievementsData.ts` | 43 entries (34 certifications, 9 courses) | Real, but 6 credential URLs are generic vendor homepages and all `/achievements/*.jpg` images are missing | MIGRATE → `content/achievements.ts`. Surface on About as a filterable list (search/filter logic is worth keeping) |
| `lib/skillsData.ts` | 2 icon lists with remote CDN logos + gradients | Logo-wall data | ARCHIVE. Replace with the PRD §24 purpose-grouped `content/capabilities.ts` |
| `lib/github.ts` | GitHub REST + GraphQL fetch | Works, but see risk H2 | KEEP / REFACTOR |
| `types/index.ts` | Old retro types (`ChatMessage`, `Experience.color` …), **mostly unused** | Stale | REMOVE after migration |
| About page prose | Long bio hard-coded in `app/about/page.tsx` | Real, but PRD §42 says content must not live in components | MIGRATE → `content/profile.ts` |

**Missing from data entirely:** Sepang Vision Lab, QualityPlus, AI/NLP research (the three flagship projects of V2), plus running, notes and lab content.

## E. Integration map

| Integration | State | V2 fate |
|---|---|---|
| GitHub API (`GITHUB_TOKEN` in `.env`, correctly git-ignored) | Live, cached 1h | KEEP → powers `/lab` coding stats |
| Contact form | **Fake.** Simulates a send, then shows "Message Sent!" | REMOVE the form. PRD §33 favours direct channels (email, LinkedIn, GitHub). A real form can come back later if it adds value |
| AI assistant / Smart Talk | Not built | Show in `/lab` with a clear "not built yet" status (PRD §56) |
| Remote images | `images.unsplash.com`, `cdn.simpleicons.org` whitelisted; icons pulled from `raw.githubusercontent.com` / jsDelivr at runtime | REMOVE with the logo wall |
| Analytics | None | Optional later (Vercel Analytics) |
| Hosting | Presumably Vercel (no `vercel.json`); target domain `portfolio.madebyrazeen.com` | Confirm (see L) |

## F. Asset inventory

### Existing (`/public`)
| Asset | Fate |
|---|---|
| `profile.jpg` (124 KB) | ARCHIVE to V1; V2 uses new photography |
| `Razeen_Iqbal_Resume.pdf` | KEEP (PRD §25 CV action). Check it's current |
| `file/globe/next/vercel/window.svg` | REMOVE (create-next-app leftovers, unused) |
| `app/favicon.ico` (270 KB, oversized) | REPLACE with the lime-dot favicon from the identity board |

### New V2 assets (`Downloads/portfolio v2 asset`, 29 PNGs, ~1.5–2.3 MB each, 1536–1774 px wide)

**Key finding:** these are **presentation boards**, not production assets. Almost every file is a composite with typography, labels and UI baked into the pixels. Shipping them as-is would put text inside images (bad for SEO, accessibility, responsiveness and file size), and it would duplicate text the site renders itself.

| Board | What it's good for | Production-ready? |
|---|---|---|
| Master Brand Sheet, Primary Identity System, `portfolio concept` (actually the identity exploration board), Character + Wordmark Lockup | **Design reference**: palette, type, lockups, avatar set | Reference. Wordmark → rebuild as live text/SVG |
| Technical Grid, Annotation Kit, Signature Trajectory, Textures, Architecture System, Loading System | Design language → implement in CSS/SVG (PRD §14, §36: "implement rather than render") | Reference |
| Mini Razeen × 9 boards (Master, Builder, Data Eng, AI Experiment, Learning, Runner, Thinking, Icon System), 404 Empty States | Character poses | **Need cut-outs**: one transparent WebP/PNG per pose. The empty-states board has baked-in, partly garbled text ("BOOLTE", "FRLECR") and glow halos |
| **Real Razeen Hero** | Hero photo. B&W, strong, on-brand | **Nearly.** Annotations are baked into the left and corner areas. Needs the **original clean photo** (or a crop of the right ~45%) |
| **About Photography** | Collaboration/people photo | Same: small corner labels baked in. Need the clean original |
| Career Collaboration | Career photo | Same |
| Sepang Vision Lab | Flagship project hero | Composite (title, telemetry, lap times baked in). Good as a *case-study cover image*; the charts should be rebuilt as SVG |
| QualityPlus, AI NLP, Data Engineering | Project art | Composite. Usable as cover art once text is cropped or the art is re-exported clean |
| Running Data, Running Route System | Running page **design reference** | Reference only: rebuild as components from structured data |
| Social OpenGraph | 5 OG templates | Reference → generate with `next/og` from metadata (PRD §41) |

**Also missing:** any real **running photography** (PRD §27/§55 require it), and a clean transparent **wordmark SVG**.

## G. KEEP / REFACTOR / MIGRATE / ARCHIVE / REMOVE / CREATE

| Area | Decision | Notes |
|---|---|---|
| Next.js / TS / Tailwind / Framer stack | **KEEP** | |
| `next.config.js` image config (AVIF/WebP) | **KEEP**, trim | Drop Unsplash/simpleicons patterns. The custom webpack `splitChunks` override is a V1 memory workaround; re-evaluate |
| Personal info, careers, education | **MIGRATE** → `/content` | |
| Project data + GitHub links | **MIGRATE / REFACTOR** | Extend schema; add Sepang, QualityPlus, NLP |
| Achievements (43) | **REFACTOR** | About page "Credentials" list with filter; fix the 6 generic URLs |
| Resume PDF + download | **KEEP** | |
| Root metadata | **KEEP / REFACTOR** | Becomes per-page `generateMetadata` |
| GitHub API route + lib | **KEEP / REFACTOR** | Remove fake fallback numbers |
| Dashboard | **MIGRATE → `/lab`** | Restyle heatmap in lime; drop the random mock grid |
| Smart Talk | **MIGRATE → `/lab`** as a clearly-labelled "not built yet" experiment | |
| Contact form | **REMOVE** (fake) | Replace with direct channels |
| Sidebar + mobile drawer | **REMOVE** → new nav | |
| GlowCard / MagicCard / SimpleCard / ProjectCard / AchievementCard | **ARCHIVE** | Only live on in `/archive/v1` |
| Tech logo wall (`skillsData`, `SkillIcon`, `techStackIcons`) | **ARCHIVE** | |
| ThemeToggle, `types/index.ts`, starter SVGs | **REMOVE** | |
| `globals.css` | **REFACTOR** (rewrite) | See H4 |
| V1 visual as a whole | **ARCHIVE → `/archive/v1`** | See I |
| Home, Work index, case studies, Running, Notes, Lab, About, Contact, 404/loading/error, OG images, sitemap/robots | **CREATE** | |

## H. Technical risks

1. **Everything is `'use client'`.** All 7 pages are client components, so they cannot export per-page `metadata`. The whole site ships as client JS. V2 should default to **Server Components**, with client islands only for nav, filters and motion.
2. **Fake data already in V1, against PRD §58.** `lib/github.ts` returns invented fallback stats on failure (42 repos, 156 followers, 1,247 contributions). The dashboard renders a `Math.random()` contribution grid when there's no data. The contact form reports "Message Sent!" without sending. All three must go.
3. **Illustrative numbers in the new assets.** The Running Data board shows a latest run, splits, PBs and race history (e.g. "21 Sep 2026 Putrajaya 10.21 km", "KL Half Marathon 1:58:14"). The Sepang board shows lap/sector times, but the Sepang repo README says *"No real speed or race data is implied."* Under PRD §58, any of these numbers that aren't real must be labelled illustrative or replaced. **Needs your confirmation (L3).**
4. **`globals.css` harms accessibility.** It hides every scrollbar site-wide, forces `transition-duration: .15s !important` on all elements on mobile, strips transforms from any element with inline `translate3d`, and loads Google Fonts twice (CSS `@import` **and** `next/font`).
5. **Scroll-container layout.** The desktop "floating window" scrolls an inner `<main>`, not the document. That breaks anchor links, scroll-driven motion, sticky elements and scroll restoration. V2 must use normal document scroll.
6. **Missing images** in projects and achievements silently fall back to a purple gradient via `innerHTML` injection in `onError`.
7. **Asset weight.** 29 PNGs at ~1.8 MB each. Every production image needs export to WebP/AVIF at the right sizes through `next/image`.
8. **Font spec conflict.** The PRD says IBM Plex Mono; the brand sheets say **JetBrains Mono**. Display face is "bold grotesk" (brand sheets use Inter Bold). Minor, but it needs a decision (L4).
9. **Mini Razeen consistency.** The 404-state renders are visibly softer and more "anime" than the master character sheet. Pick the master as canonical and check that every cut-out matches.
10. **Lint config is out of date.** `eslint` has no args and `eslint.config.mjs` is the old flat stub. Verify `npm run build` passes before M01 so there's a known-good baseline.

## I. Recommended V2 architecture

- **One app, route groups** to separate the two eras without two codebases:
  - `app/(v2)/…`: the new site, with its own `layout.tsx` (nav, footer, fonts, tokens)
  - `app/archive/v1/…`: V1 pages moved here unchanged, with their own layout (sidebar, GlowCard). This preserves the "evolution" story (PRD §47) at near-zero cost. Old URLs (`/projects`, `/achievements`, `/dashboard`, `/smart-talk`) get **permanent redirects** to their V2 homes in `next.config.js`.
- **Server Components by default.** Client components only for: mobile menu, work/credential filters, loading sequence, motion reveals, GitHub heatmap tooltip.
- **Content layer** in `/content/*.ts`: typed arrays with a `status` field and an explicit `isIllustrative` flag on any demo metric. Case studies and notes as **MDX** (`@next/mdx`, the one new dependency worth adding, at M05/M07) so long-form writing isn't JSX.
- **Design tokens** in `tailwind.config.ts` (carbon / warm / grey / lime, 12-col grid, type scale) + CSS variables for section theme (`data-section="dark|light"`).
- **Fonts via `next/font` only:** Inter (body + display weights) and JetBrains Mono (or Plex Mono). No CSS `@import`.
- **Diagrams as SVG components** (`ArchitectureDiagram`, `ArchitectureNode`, `ArchitectureFlow`), built when the Sepang case study needs them, not before.
- **Running** reads from `content/running.ts` through a `getRuns()` function, so a Strava/Garmin API can be swapped in later without touching UI (PRD §28).
- **OG images** via `app/**/opengraph-image.tsx` (`next/og`), fed from the same metadata.

## J. Proposed file / folder structure

```text
app/
  (v2)/
    layout.tsx              nav + footer + fonts
    page.tsx                homepage
    work/page.tsx
    work/[slug]/page.tsx
    lab/page.tsx
    running/page.tsx
    notes/page.tsx
    notes/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
  archive/v1/…              current pages, moved as-is
  api/github/route.ts
  not-found.tsx  error.tsx  loading.tsx
  sitemap.ts  robots.ts  opengraph-image.tsx
components/
  v2/
    layout/     Nav, MobileNav, Footer, Section
    system/     TechnicalLabel, Annotation, Trajectory, Node, SectionHeader
    work/       ProjectFeature, ProjectPreview, ProjectMetadata
    diagram/    ArchitectureDiagram, ArchitectureNode, ArchitectureFlow
    running/    RunningMetric, RouteMap, SplitsTable
    identity/   Wordmark, MiniRazeen, PhotoFrame
    states/     EmptyState, LoadingSequence
  v1/           current components (archived)
content/
  profile.ts  projects.ts  experience.ts  achievements.ts
  capabilities.ts  running.ts  lab.ts
  case-studies/*.mdx   notes/*.mdx
lib/
  assets.ts   metadata.ts   github.ts   utils.ts
public/assets/v2/
  identity/  projects/{sepang-vision-lab,qualityplus,nlp-research}/
  running/  textures/  social/  system/{loading,empty-states}/
docs/v2/
  PRD.md  M00-AUDIT.md  (+ one report per milestone)
```

## K. Recommended migration sequence

1. **Branch** `v2` off `master` so V1 stays deployable throughout.
2. **Baseline:** confirm `npm run build` passes on current code (H10).
3. **Asset prep** (you, in parallel with M01): clean photos, Mini Razeen cut-outs, wordmark SVG, running photos (see L1).
4. **M01 Foundation:** tokens, fonts, grid, `/content` scaffolding with V1 data migrated, `lib/assets.ts`.
5. **M02 Shell:** move V1 into `archive/v1` + redirects, build V2 nav/footer/section system. The site is navigable from this point.
6. **M03 Homepage** → **M04 Work** → **M05 Case studies** (Sepang → QualityPlus → NLP → others) → **M06 Running** → **M07 Notes** → **M08 Lab** (GitHub stats migrate here) → **M09 About/Contact** (achievements, resume) → **M10 System states** → **M11 Motion** → **M12 Responsive** → **M13 SEO/OG** → **M14 Perf/A11y** → **M15 QA**, as the PRD specifies.
7. Deploy V2 to `portfolio.madebyrazeen.com` only after M15; keep the current deployment as a fallback until then.

## L. Decisions that genuinely block implementation

| # | Question | Blocks |
|---|---|---|
| **L1** | **Clean source files.** Can you supply the *original* photos behind Real Razeen Hero, About Photography and Career Collaboration (no baked-in labels), plus transparent Mini Razeen cut-outs and a wordmark SVG? If not, I can crop the photos and rebuild the wordmark as live text. The Mini Razeen poses can't be cleanly extracted from the boards. | M01/M03 |
| **L2** | **Running photography.** None exists in the asset folder. PRD §27 and §55 require it. Do you have real race/training photos? | M03 teaser, M06 |
| **L3** | **Are the running numbers real?** (10.21 km / 58:24 / 5:43, the 5K PB of 24:36, the race history table). If not, they ship labelled "illustrative" until real data is supplied. The Sepang lap times will be labelled illustrative either way, per that repo's own README. | M03, M05, M06 |
| **L4** | **Mono font:** JetBrains Mono (brand sheets) or IBM Plex Mono (PRD)? My recommendation: **JetBrains Mono**, because the approved boards already use it. | M01 |
| **L5** | **Repo & domain:** keep building in `portfolio-v1.0` on a `v2` branch (recommended), or a new `portfolio-v2` repo? And is Vercel the host for `portfolio.madebyrazeen.com`? | M01 start, M15 |
| **L6** | **Contact form:** OK to drop the fake form in favour of direct links (email / LinkedIn / GitHub)? Should the phone number stay public? | M09 |
| **L7** | **Case-study content:** I can draft Sepang Vision Lab and QualityPlus case studies from their repos' docs and your vault notes, for you to correct. Is the AI/NLP research your UMPSA Master's work? Is there a thesis or paper to draw from? | M05 |
