# razeeniqbal. · Portfolio

Personal site of Razeen Iqbal: projects and case studies, experience and training work, a journal, and a running log.
Live at **[portfolio.madebyrazeen.com](https://portfolio.madebyrazeen.com)**.

The code is V2. V1 has been retired and its old URLs redirect to their V2 pages (`next.config.js`). The repository was called `portfolio-v1.0` until October 2026; GitHub redirects the old URL.

## Stack

- **Next.js 16** (App Router, Server Components by default) · **React 19** · **TypeScript**
- **Tailwind CSS 3** for styling
- **Keystatic** admin panel over JSON content in `content/data/`
- **Claude** (`@anthropic-ai/sdk`) for the "Ask about me" assistant
- `next/og` for share images · fonts self-hosted with `next/font/local` · deployed on **Vercel**

## Getting started

Requires Node 22 (the version CI uses).

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev:turbo            # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev:turbo` | Dev server with Turbopack (fastest) |
| `npm run dev` | Dev server with webpack and a 4 GB heap (`dev:light` uses 2 GB) |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run check:content` | Content in `content/data` matches the Keystatic schema |
| `npm run check:writing` | Writing rules (see below) across content and UI strings |
| `npm run check:links` | Crawls a running server for broken internal links |
| `npm run resume:pdf` | Prints `/resume` to `public/Razeen_Iqbal_Resume.pdf` (needs a running server and Chrome, Edge or Chromium) |
| `npm run clean` | Deletes `.next` |

### Environment variables

All are optional for local work. See `.env.example`.

| Variable | Used for |
|---|---|
| `ANTHROPIC_API_KEY` | The "Ask about me" assistant. Without it the widget shows "Offline". |
| `CHAT_MODEL` | Overrides the assistant model (default `claude-haiku-4-5`) |
| `GITHUB_TOKEN` | The coding-activity calendar on `/experience` |
| `KEYSTATIC_*`, `NEXT_PUBLIC_KEYSTATIC_*` | Production admin through GitHub. See [`docs/v2/ADMIN-AND-CHAT.md`](docs/v2/ADMIN-AND-CHAT.md) |

## Site map

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | Story, education and background |
| `/experience` | Roles, credentials and live coding activity |
| `/trainer` | Training and speaking engagements |
| `/projects`, `/projects/[slug]` | Project index and case studies |
| `/journal`, `/journal/[slug]`, `/journal/rss.xml` | Journal entries and RSS feed |
| `/life`, `/running` | Life outside work and the running log |
| `/credentials` | Certificates and badges |
| `/resume` | Printable online resume with PDF download |
| `/contact` | Contact and availability |
| `/system` | Internal design-system review page (not linked, not indexed) |
| `/keystatic` | Admin panel |
| `/api/chat` | Assistant endpoint |

## Project structure

```
app/
  (v2)/              site pages (routes above)
  api/chat/          "Ask about me" endpoint
  keystatic/         admin panel
  sitemap.ts, robots.ts
components/v2/       UI grouped by area: system/ primitives, layout/, home/, work/,
                     case-study/, journal/, running/, experience/, chat/, ...
content/
  data/              all editable content as JSON (edited through /keystatic)
  *.ts               typed loaders over content/data
  case-studies/      case-study types and loader (entries in data/case-studies/<slug>.json)
  running/           runs.json (Garmin), strava.json (history), meta.json (last sync)
lib/
  assistant/         knowledge for the assistant, built from content/data
  assets.ts          image manifest: paths, sizes, alt text, evidence labels
  site.ts            navigation and site URL
  og/                share-image template and fonts
scripts/
  garmin/            Garmin Connect to runs.json exporter (see its README)
  strava/            one-off import of the Strava export
  check-*            content, writing and link checks used by CI
docs/v2/             PRD, milestone reports, admin and assistant guide
```

## Editing content

Run the dev server and open `http://localhost:3000/keystatic`. Saving writes straight to `content/data/*.json`; commit and push as usual. In production, each save becomes a GitHub commit and Vercel redeploys. Setup is in [`docs/v2/ADMIN-AND-CHAT.md`](docs/v2/ADMIN-AND-CHAT.md).

- **Projects:** `tier` (flagship / featured / standard / archive) and `order` decide where a project appears; `draft` hides it.
- **Journal:** entries are `published`, `draft` or `archived`. Only published entries are public (journal, home, sitemap, RSS and the assistant).
- **Images:** add the file under `public/assets/v2/`, register it in `lib/assets.ts`, and it appears in every image picker.

## "Ask about me" assistant

`app/api/chat/route.ts` streams short answers from Claude, grounded only in the site's own content (built by `lib/assistant/knowledge.ts`). Off-topic questions are declined. The system prompt is prompt-cached, history and message length are capped, and each IP is limited to 20 requests per 10 minutes.

## Running data

`.github/workflows/garmin-sync.yml` runs daily at 06:00 Malaysia time. It pulls recent runs from Garmin Connect into `content/running/runs.json` and commits them, which triggers a redeploy. The site itself never calls Garmin. Setup and troubleshooting: [`scripts/garmin/README.md`](scripts/garmin/README.md).

## CI

`.github/workflows/ci.yml` runs on every push to `master` and `v2` and on every pull request: typecheck, lint, Keystatic content schema, writing rules, production build and internal links. Any failing step fails the run.

## Content rules

- **No invented metrics.** Anything not real is flagged in data (`sample`, `illustrative`, `placeholder`, `draft`) and labelled in the UI.
- **Signal Lime (`#D8FF3E`)** is a signal: never a background field, and never the only indicator of state.
- **Light sections for thinking and writing, dark sections for systems and building.**
- **Writing:** no em dashes and no contractions in site copy, enforced by `npm run check:writing`.

## Licence

The code is MIT licensed (`package.json`). The self-hosted fonts in `app/fonts` and `lib/og/fonts` (Inter, JetBrains Mono) are under the SIL Open Font License; see the licence files alongside them.
