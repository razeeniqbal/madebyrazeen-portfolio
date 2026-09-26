# razeeniqbal. · Portfolio V2

Personal site of Razeen Iqbal: engineering notebook, project archive, lab and running journal.
Target domain: `portfolio.madebyrazeen.com`. Product spec: [`docs/v2/PRD.md`](docs/v2/PRD.md). Milestone reports: `docs/v2/`.

## Stack

Next.js 16 (App Router, Server Components by default) · React 19 · TypeScript · Tailwind CSS 3 · `next/og` for share images.
Content lives as JSON in `content/data/` and is edited in the admin panel at `/keystatic` (Keystatic). See [`docs/v2/ADMIN-AND-CHAT.md`](docs/v2/ADMIN-AND-CHAT.md).

## Run

```bash
npm install
npm run dev:turbo      # http://localhost:3000
npm run build && npm start
```

Environment variables: see `.env.example`. `ANTHROPIC_API_KEY` powers the "Ask about me" assistant (it shows "offline" without it). `GITHUB_TOKEN` adds the `/lab` contribution calendar.

## Where things live

| Path | What |
|---|---|
| `app/(v2)/` | The site: `/`, `/work`, `/work/[slug]`, `/lab`, `/running`, `/notes`, `/notes/[slug]`, `/about`, `/resume`, `/contact`, `/archive` |
| `app/keystatic`, `keystatic.config.tsx` | Admin panel |
| `app/api/chat`, `lib/assistant` | "Ask about me" assistant (Claude) |
| `app/archive/v1/` | V1 (2025), preserved as it was; old URLs redirect to V2 (`next.config.js`) |
| `content/data/` | **All editable content (JSON)**: edit via `/keystatic` |
| `content/*.ts` | Typed loaders over `content/data` (same exports the components use) |
| `content/projects.ts` | Every project. `tier` (flagship / featured / standard / archive), `order` and `draft` control what shows where |
| `content/case-studies/` | Case-study types + loader; entries live in `content/data/case-studies/<slug>.json` |
| `content/notes.ts` | Field notes (`published` / `draft` / `in-writing`) |
| `content/running.ts` | Running data layer; reads `content/running/runs.json`, falls back to labelled sample data |
| `content/profile.ts`, `experience.ts`, `achievements.ts`, `capabilities.ts`, `lab.ts` | Everything else |
| `lib/assets.ts` | Image manifest (paths, sizes, alt text) |
| `components/v2/` | V2 components: `system/` primitives, `layout/`, `home/`, `work/`, `case-study/`, `diagram/`, `running/`, `lab/`, `notes/` |
| `scripts/garmin/` | Garmin → `runs.json` exporter; `.github/workflows/garmin-sync.yml` runs it daily |

## Content rules

- No invented metrics. Anything not real is flagged in data (`sample`, `illustrative`, `placeholder`, `draft`) and labelled in the UI.
- Signal Lime (`#D8FF3E`) is a signal, never a background field, and never the only indicator of state.
- Light sections for thinking and writing, dark sections for systems and building.

## Licences

Fonts in `lib/og/fonts` (Inter, JetBrains Mono) are under the SIL Open Font License; see the licence files alongside them.
