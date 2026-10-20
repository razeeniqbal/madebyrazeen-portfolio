import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { OAUTH_COOKIE, SSO_COOKIE, issueToken, safeNext, ssoConfig } from '@/lib/admin/sso';

const fail = (req: NextRequest, error: string) => {
  const res = NextResponse.redirect(new URL(`/admin?error=${error}`, req.url));
  res.cookies.delete({ name: OAUTH_COOKIE, path: '/api/admin' });
  return res;
};

function readFlow(raw: string | undefined): { state: string; next: string } | null {
  try {
    const v = JSON.parse(raw ?? '');
    return typeof v?.state === 'string' && typeof v?.next === 'string' ? v : null;
  } catch {
    return null;
  }
}

/** GitHub sends the browser back here. Only the logins in ADMIN_GITHUB_LOGINS get the admin cookie. */
export async function GET(req: NextRequest) {
  const cfg = ssoConfig();
  if (!cfg.ready) return fail(req, 'setup');

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state') ?? '';
  const flow = readFlow(req.cookies.get(OAUTH_COOKIE)?.value);
  const sameState =
    flow && flow.state.length === state.length && timingSafeEqual(Buffer.from(flow.state), Buffer.from(state));
  if (!code || !flow || !sameState) return fail(req, 'state');

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      code,
      redirect_uri: new URL('/api/admin/callback', req.url).toString(),
    }),
    cache: 'no-store',
  });
  const { access_token: accessToken } = (await tokenRes.json().catch(() => ({}))) as { access_token?: string };
  if (!accessToken) return fail(req, 'github');

  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json', 'User-Agent': 'madebyrazeen-admin' },
    cache: 'no-store',
  });
  const { login } = (await userRes.json().catch(() => ({}))) as { login?: string };
  if (!login) return fail(req, 'github');
  if (!cfg.logins.includes(login.toLowerCase())) return fail(req, 'denied');

  const res = NextResponse.redirect(new URL(safeNext(flow.next), req.url));
  res.cookies.delete({ name: OAUTH_COOKIE, path: '/api/admin' });
  res.cookies.set(SSO_COOKIE, issueToken(login), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    domain: cfg.cookieDomain,
    maxAge: cfg.maxAge,
  });
  return res;
}
