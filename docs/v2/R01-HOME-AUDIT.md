# R01 · Homepage audit + migration plan

Refinement spec, Phase 01. Audited on `master` @ `410d9c2` (same as `v2`). **No code changed yet.**

Current home (`app/(v2)/page.tsx`) = JSON-LD + **11 sections**, alternating dark/light, indexed 01–11.
Target = **6 moments**: Hero · Selected Work · About teaser · Stories · Running · Contact.

---

## 1. Section map

| # | Current section | Component / file | Data source | Current purpose | Action | Destination | Notes |
|---|---|---|---|---|---|---|---|
| — | Person JSON-LD | `app/(v2)/page.tsx` | profile, experience, education | SEO | **KEEP** | Home | Add `image` (circular avatar or real photo) + `jobTitle` from the agreed title. |
| 01 | Hero | `components/v2/home/Hero.tsx` | `profile.json` (statement, supporting, disciplines, coordinates, loops) · `assets.identity.hero` | Identity statement + photo | **SIMPLIFY** | Home 01 | Remove disciplines list, coordinates block and the Trajectory row (7 visual layers today → photo + type). Add name + role line. CTAs → `View my work →` / `Resume ↗`. Photo renders **mono** today; spec wants a strong real portrait → decide colour vs mono. Keep the lime period after the last line (it is the future morph origin). |
| 02 | Intro "About the work" | `home/Intro.tsx` | `home.json › intro` | Pillars + career lead + Mini Razeen `working` | **MERGE** | → Home 03 About teaser | Lead text (civil → data → AI) becomes the journey line of the About teaser. Pillars drop. Mini Razeen removed from Home. |
| 03 | Selected Work | `home/SelectedWork.tsx` | `projects.json` tiers | Flagship + 2 featured + 4 "other experiments" rows | **SIMPLIFY** | Home 02 | **Sepang (status `in-progress`) is the full-width flagship today — live on master, contradicts spec §13.** New: 1 primary (QualityPlus) + 2 supporting (NLP + one text-weighted standard). Drop the 4 rows. `All N projects →`. |
| 04 | Featured System (QualityPlus flow) | `home/FeaturedSystem.tsx` | **Hardcoded nodes** + `home.json › featured` | Architecture diagram on Home | **REMOVE FROM HOME** | `/work/qualityplus` (already has its own flow block) | Duplicated data: diagram nodes are hardcoded here AND in `case-studies/qualityplus.json`. The one-line lead can live on the primary project card. Component can be deleted once unused (data is not lost). |
| 05 | Capabilities | `home/Capabilities.tsx` | `capabilities.json` | All skills, 4 groups | **MOVE** | `/work` › Capabilities | Reusable as-is. Already no percentage bars. Also feeds `/resume` Skills. |
| 06 | Experience + Education | `home/Experience.tsx` | `experience.json`, `profile.education` | Full career timeline | **MOVE** | `/work` › Experience (roles) · `/resume` (roles + education) | Component takes `index`/`flush` props, reusable on `/work`. Education rows → Resume only (About tells the story). |
| 07 | Running teaser | `home/RunningTeaser.tsx` | `runs.json` via `getLatestRun()` · `assets.running.action` | Photo + latest-run stats | **KEEP / SIMPLIFY** | Home 05 | Already real data only. New headline ("Running has become my other kind of problem solving."). Add `GARMIN · LAST SYNC` → needs a sync timestamp (see §3). Latest run is a 5 km treadmill: fine, no route on Home anyway. |
| 08a | Currently exploring | `home/ExploringNotes.tsx` (left) | `lab.json › exploring` | Learning list + Mini Razeen `learning` | **MOVE** | `/lab` › Currently exploring | Includes the Sepang digital-twin line: fits Lab. |
| 08b | Field notes | `home/ExploringNotes.tsx` (right) | `notes` collection | 3 notes | **SIMPLIFY → Stories teaser** | Home 04 | Rename Notes → Stories. **Risk: 0 of 3 notes are published** (2 `in-writing`, 1 `draft`). See §6. |
| 09 | Lab teaser | `home/LabTeaser.tsx` | `lab.json › experiments` | 3 experiment cards + Mini Razeen `laptop` | **REMOVE FROM HOME** | `/lab` (already lists them) | Lab stays reachable via footer + a link on `/work`. |
| 10 | About teaser | `home/AboutContact.tsx › AboutTeaser` | `home.json › aboutTeaser` · achievements count · `assets.career.collaboration` | Photo + short bio + cert/Master's stats | **SIMPLIFY + MERGE (02)** | Home 03 | Journey: CIVIL ENGINEERING → DATA → AI → BUILDING SYSTEMS. Drop the cert-count stats (credential data on Home). Keep real photo. `More about me →`. |
| 11 | Contact | `home/AboutContact.tsx › ContactBlock` | `profile.contact` | CTA + Email/LinkedIn/GitHub | **KEEP** | Home 06 | Shared with `/about`. Copy → "Have an idea? Let's build something." Footer already carries wordmark + MADE BY RAZEEN + Trajectory. |

---

## 2. Recommended homepage structure

```
app/(v2)/page.tsx
  <JsonLd person />
  <Hero />               01  real photo + type, low density            (Hero.tsx, simplified)
  <SelectedWork />       02  1 primary + 2 supporting                    (SelectedWork.tsx, simplified)
  <AboutTeaser />        03  real photo + 4-step journey + CTA          (AboutContact.tsx, merged w/ Intro)
  <StoriesTeaser />      04  3 latest stories, text only                 (NEW thin wrapper around NoteList)
  <RunningTeaser />      05  real photo + latest run + last sync         (RunningTeaser.tsx, simplified)
  <ContactBlock />       06  CTA + 3 channels                            (unchanged)
```

Rhythm: dark · dark→light · light · light · dark · dark (hero and contact stay dark; one dominant visual per viewport).
Mini Razeen on Home: **none in-page** — only the nav mark and the floating companion.

Components left unused on Home after this: `Intro`, `FeaturedSystem`, `LabTeaser`, `ExploringNotes`, `Capabilities`, `Experience`. The last three get **reused** on `/work` and `/lab`; `Intro` and `FeaturedSystem` can be retired (their text moves to `home.json`/the case study, nothing is deleted from content).

---

## 3. Content / data migration

| Change | Where | Size |
|---|---|---|
| Sepang off the home flagship slot | `projects.json`: QualityPlus → `flagship`, Sepang → `featured` with status `in-progress` **and** home selector filters out non-finished statuses | small |
| Status vocabulary | Keep stored values (`live`/`shipped`/`in-progress`/`prototype`/`archived`), map display → **SHIPPED** (live+shipped, with `LIVE ↗` when a link exists) · **ACTIVE** (in-progress) · **EXPERIMENT** (prototype) · **ARCHIVED**. No JSON rewrite needed. | small |
| `featured` flag | Not needed: `tier` already does it. Keep tiers. | none |
| Notes → Stories | Routes `/notes` → `/stories` with permanent redirects `/notes` and `/notes/:slug`; nav, sitemap, OG, Keystatic labels. Storage path `content/data/notes/` can stay. Add a `category` field (Engineering, AI, Data, Building, Career, Learning, Running, Life). | medium |
| Credentials + Achievements | Move `CredentialList` from `/about` to `/work`; `profile.recognition` becomes the Achievements block on `/work`. Update redirect `/achievements` → `/work#credentials`. | medium |
| Duplicate career copy | 5 versions exist: `home.intro.lead`, `home.aboutTeaser.body`, `profile.bio.*`, `story.json`, and a **hardcoded Profile paragraph in `resume/page.tsx`**. Resume should read `profile.bio.short`; Home uses `home.aboutTeaser` only. | small |
| Role title | Three live variants: `profile.role` "Data Engineer & AI Solutions Engineer", spec "Data Engineer / AI Builder", spec resume "Data Engineer / AI Systems Builder". Needs one decision. | decision |
| Running last-sync | `runs.json` is a bare list with no timestamp. Export script writes `content/running/meta.json` `{ syncedAt, source: "garmin" }`; UI reads it. Provider split (Garmin/FIT/Manual) already exists conceptually in the script; UI already only reads normalised JSON. | small |
| FeaturedSystem nodes | Delete hardcoded copy; case study JSON is the single source. | small |

---

## 4. Mini Razeen icon mapping

**What exists as files**

- `public/assets/v2/identity/mini-razeen/*.png` — 8 full-body poses (idle, happy, thinking, working, learning, laptop, exploring, running).
- `…/mini-razeen/bot/*.png` + `*-bust.png` — the 7 assistant states (idle, wave, thinking, talking, happy, sleeping, confused). **Spec §36 already satisfied.**
- `app/icon.svg` — lime node on carbon (= the sheet's "16px node" favicon). `app/favicon.ico`, `app/apple-icon.png` (180×180).
- **Digital Icon System V1.0 exists only as one composite sheet** (`Downloads/portfolio v2 asset/MINI RAZEEN ICON SYSTEM.png`, 1536×1024). No individual exports.

**Extraction from the sheet (crop only, no redraw)**

| Variant | Size in sheet | Use at | Enough pixels? | UI use |
|---|---|---|---|---|
| 01 Detailed | ~245 px | 96 px+ | yes (2.5×) | About identity moment, JSON-LD/profile image |
| 02 Standard | ~170 px | 48 px | yes (3.5×) | Companion launcher (collapsed), desktop nav if 32 looks weak |
| 03 Simplified | ~125 px | 32 px | yes (4×) | **Desktop nav** next to `razeeniqbal.` (default), assistant header |
| 04 Micro | ~80 px | 24 px | yes (3×) | Mobile nav, chat message avatar |
| 05 Minimal | ~50 px | 16 px | 3×, must be tested | Favicon candidate |
| 06 Monochrome | ~150 px | print | yes | Resume print footer mark |
| 07 Circular | ~125 px | social | ok ≤ 64 px | Share/profile contexts |
| 08 App icon | ~145 px | 180 / 192 / 512 px | **no** | apple-icon, PWA manifest (none exists yet) |
| 10 Favicons | ~50 px each | 16 px | yes | node already live; `r.` available as fallback |

---

## 5. Existing systems worth reusing

- **Motion:** CSS scroll-driven reveals (`animation-timeline: view()` in `globals.css`), `Trajectory` (CSS, used in Hero + Footer), bot mood keyframes, `ask-pop`, `LoadingSequence`. No JS animation library. `components/v2/motion/` is empty. The morph prototype can be CSS scroll-driven with a static fallback.
- **Client JS on Home:** none of the home sections are client components. Client code comes from the layout: `SiteHeader` and `AskWidget`. Home is already cheap; simplification mostly cuts DOM and images (6 large images today → 3).
- **Assistant:** `components/v2/chat/AskWidget.tsx` + `BotAvatar.tsx` (7 states, cross-faded), `/api/chat`, `lib/assistant/knowledge.ts`.
- **Reusable:** `ProjectFeature`, `ProjectRow`, `NoteList`, `PhotoFrame`, `SectionHeader`, `ArrowLink`, `CredentialList`, `Experience`, `Capabilities`, `ContactBlock`.

---

## 6. Risks before implementation

1. **Sepang is the flagship on the live site right now.** Recommend fixing this first, before the rest of the plan.
2. **Stories teaser with nothing published.** Options: (a) show the 3 as "In writing" honestly, (b) hide the section until ≥ 1 story is published, (c) publish one first. Recommend (b) + (c).
3. **App-icon resolution.** The sheet can't give a sharp 180/512 px app icon. Need the original high-res exports (ideally every variant as a separate PNG ≥ 4× or SVG). Until then keep the current node icons.
4. **Hero photo.** The same `identity.hero` photo is rendered grayscale; the About/Running pages already use real photos. If a better colour portrait exists it should be supplied; otherwise keep this one.
5. **URL change `/notes` → `/stories`.** Low traffic but indexed; handled by permanent redirects.
6. **About currently uses Mini Razeen poses inside real-life story chapters** (4 chapters). Conflicts with §06 "real moments stay real"; fix in the About phase, not now.
7. **Companion loads all 14 bot images on every page** (stacked cross-fade). With the icon system, the collapsed launcher can be one 48 px avatar and the mood images load on first open.
8. **Running pose vs bot style.** `running.png` is from the earlier pose set; using it as an "energetic" companion state could break the "same character, same rendering" rule. Recommend no running state for the companion.
9. **Lab loses its home entry point.** Mitigate with footer + `/work` link.
10. **Dev loop is slow** (repo in OneDrive: first compile 2+ min). Moving the repo out of OneDrive before Phase 02 will save a lot of time.

---

## 7. Decisions needed before Phase 02

1. Role line: **Data Engineer / AI Builder** (spec) or keep "Data Engineer & AI Solutions Engineer"?
2. Selected Work third slot: EduGen (live), LeadSightz, or HR Analytics (live)? None has artwork, so it shows as a text-weighted item.
3. Stories teaser when nothing is published: hide or show "in writing"?
4. Hero photo: colour or keep mono?
5. Can you export the icon-system variants as separate high-res files? If not, crop from the sheet (fine for everything except the app icon).

---

## 8. Decisions (2026-09-27) and Phase 02 result

Decisions: keep "Data Engineer & AI Solutions Engineer" · third slot = **Balang** (artwork to be supplied; typographic tile until then) · Stories teaser shows the unpublished pieces with their badges · hero photo unchanged · icons cropped from the sheet.

Done:
- Home = Hero · Selected Work (QualityPlus, NLP, Balang) · About teaser (journey from `story.json › path`) · Stories · Running (+ Garmin "updated" date from `content/running/meta.json`) · Contact.
- Sepang: tier `featured`, status shown as **Active**; excluded from Home, listed on /work and under "Currently building" on /lab.
- Status display: Shipped · Live / Active / Experiment / Archived (stored values unchanged).
- Nav: Work · Stories · Running · About · Resume ↗ (+ Contact). Lab in footer and on /work.
- `/notes` → `/stories` (308 redirects for `/notes` and `/notes/:slug`). Admin label "Stories"; storage path unchanged.
- /work gained Experience + Capabilities; /lab gained Currently building + Currently exploring.
- Icon system cropped to `public/assets/v2/identity/mini-razeen/icon/` (`avatarIcons` in `lib/assets.ts`, `<Avatar size>` picks the variant). Nav uses 32px Simplified. Favicon stays the lime node (16px avatar is noisy). `app/apple-icon.png` = App icon, upscaled 144→180.
- Removed components: `Intro`, `FeaturedSystem`, `LabTeaser`, `ExploringNotes` (content still in JSON). Unused fields left in `home.json`: `intro`, `featured`.
