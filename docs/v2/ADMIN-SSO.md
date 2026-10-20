# Admin sign-in across the madebyrazeen apps

`/admin` on the portfolio is the one place to sign in. It also lets you into Langkah and the AI Engineering course tracker. The footer's quiet **Admin** link opens it.

## How it works

1. `/admin` → **Sign in with GitHub** (`/api/admin/login`). GitHub sends you back to `/api/admin/callback`.
2. If your GitHub login is in `ADMIN_GITHUB_LOGINS`, the portfolio sets the `mbr_admin` cookie on `.madebyrazeen.com`: HttpOnly, Secure, SameSite=Lax, 12 hours by default.
3. Langkah and the tracker live on subdomains, so the browser sends them that cookie. Each one verifies it with the shared `MBR_SSO_SECRET` (`sso.py` in each repo). A valid cookie means you are signed in. The sign-in screens there also get a **Sign in with madebyrazeen** button, which comes back to the app afterwards.
4. **Sign out** in any app clears the cookie at `/api/admin/logout`, which signs you out of all of them.

Token: `v1.<base64url JSON {sub, iat, exp}>.<base64url HMAC-SHA256>`. The code is `lib/admin/sso.ts` here and `sso.py` in the two Python apps; keep the three in step. Changing the secret signs out every browser. The apps' own passwords keep working as a fallback.

## One-time setup

1. **Domains.** In the tracker's Vercel project, add `tracker.madebyrazeen.com` (Settings → Domains) and the DNS record Vercel asks for. The cookie only reaches `*.madebyrazeen.com`, never `*.vercel.app`. Langkah is already on `langkah.madebyrazeen.com`.
2. **Secret.** Generate one value and set it as `MBR_SSO_SECRET` in all three Vercel projects:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```
3. **Portfolio env** (Vercel → Production): `MBR_SSO_COOKIE_DOMAIN=.madebyrazeen.com`. Optional: `ADMIN_GITHUB_LOGINS` (default `razeeniqbal`), `MBR_SSO_HOURS` (default 12), `TRACKER_URL` / `LANGKAH_URL` if the addresses differ.
4. **GitHub callback.** Sign-in reuses the Keystatic GitHub App's client ID and secret. In GitHub → Settings → Developer settings → GitHub Apps → the Keystatic app, add the callback URL `https://portfolio.madebyrazeen.com/api/admin/callback`. Keep the existing Keystatic URL. To use a separate OAuth app instead, set `ADMIN_GITHUB_CLIENT_ID` / `ADMIN_GITHUB_CLIENT_SECRET`.
5. Redeploy all three. Then open `/admin`, sign in, and open Langkah from the hub.

## Locally

Leave `MBR_SSO_COOKIE_DOMAIN` unset, so the cookie stays on `localhost`. A GitHub app can only send you back to a callback URL it lists, so add `http://localhost:3000/api/admin/callback` to the app (or use a separate dev OAuth app). Without `MBR_SSO_SECRET`, the Python apps behave exactly as before.
