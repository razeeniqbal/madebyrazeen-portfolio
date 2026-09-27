# Admin panel & "Ask about me" assistant

## Admin panel: `/keystatic`

All site content lives in `content/data/` as JSON and is edited through Keystatic.

| Section | What it edits |
|---|---|
| Profile & identity | Name, hero statement, role, location, contact links, education, recognition, bio |
| Homepage copy | Intro, featured-system and about-teaser text |
| About · story | The journal chapters (period, title, paragraphs, optional photo and credential) |
| Contact page | Availability status, "where I can help", quick answers |
| Chat assistant | Greeting, suggested questions, offline message |
| Projects | Every project. **Tier** controls where it appears; **Draft** hides it; **Placeholder** shows "details coming" |
| Case studies | One entry per project (file name = project slug), built from content blocks |
| Experience, Capabilities, Credentials | As named |
| Field notes | Notes with status Published / Draft / In writing |
| Lab | Experiments and "currently exploring" |

Photos are picked from the image library in `lib/assets.ts`. To add a new photo: put the file in `public/assets/v2/…`, add it to `lib/assets.ts`, and it appears in every image picker.

### Locally (works now)

```bash
npm run dev:turbo
```

Open `http://localhost:3000/keystatic`. Saving writes straight to `content/data/*.json`. Commit and push as usual.

### In production (one-time setup)

Production edits go through GitHub: you sign in with GitHub, and each save becomes a commit; Vercel then redeploys in about a minute. Nobody without write access to the repo can edit.

1. Locally, create `.env.local` with `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`, start the dev server, and open `/keystatic`.
2. Follow Keystatic's prompt to **create a GitHub App**. It writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` into `.env.local`.
3. In the GitHub App settings, add the production callback URL: `https://portfolio.madebyrazeen.com/api/keystatic/github/oauth/callback`.
4. Copy those four variables into Vercel → Project → Settings → Environment Variables. If the repo isn't `portfolio-v1.0`, also set `NEXT_PUBLIC_KEYSTATIC_REPO`.
5. Remove `NEXT_PUBLIC_KEYSTATIC_STORAGE` from `.env.local` to go back to local editing.

## "Ask about me" assistant

A floating button on every V2 page, plus "Ask the assistant" buttons on Contact and About.

- **Scope:** it answers only questions about Razeen, using only what the site says. The knowledge is built automatically from `content/data` (`lib/assistant/knowledge.ts`), so editing content in the admin updates what it knows on the next deploy. Anything off-topic is declined in one sentence; unknowns point to `/contact`; sample and illustrative numbers are flagged as such.
- **Model:** `claude-haiku-4-5` (lowest cost; answers are short and grounded in site content). Override with `CHAT_MODEL`, e.g. `claude-sonnet-5` for stronger answers.
- **Cost controls:**
  - The long system prompt is prompt-cached.
  - `max_tokens` is 2048.
  - Answers are one to four sentences.
  - History is capped at 12 messages; questions at 600 characters.
  - 20 requests per 10 minutes per IP (in-memory, per server instance).
- **Setup:** add `ANTHROPIC_API_KEY` to `.env.local` (local) and to Vercel env vars (production). Without it the widget shows **Offline** and links to the contact page.
- **Files:** `app/api/chat/route.ts` (endpoint), `components/v2/chat/AskWidget.tsx` (UI), `content/data/assistant.json` (copy).

## Online resume: `/resume`

Generated from the same content, with **Download PDF** (`public/Razeen_Iqbal_Resume.pdf`) and **Print / Save as PDF**; a print stylesheet produces a clean A4 page. Keep the uploaded PDF in sync with the site, or rely on Save as PDF.
