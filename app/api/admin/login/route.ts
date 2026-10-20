import { randomBytes } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { OAUTH_COOKIE, SSO_COOKIE, safeNext, ssoConfig, verifyToken } from '@/lib/admin/sso';

/** Starts GitHub sign-in for the admin. `?next=` is where to land afterwards (this site or a madebyrazeen app). */
export function GET(req: NextRequest) {
  const next = safeNext(req.nextUrl.searchParams.get('next'));
  if (verifyToken(req.cookies.get(SSO_COOKIE)?.value)) return NextResponse.redirect(new URL(next, req.url));

  const cfg = ssoConfig();
  if (!cfg.ready) return NextResponse.redirect(new URL('/admin?error=setup', req.url));

  const state = randomBytes(24).toString('base64url');
  const github = new URL('https://github.com/login/oauth/authorize');
  github.searchParams.set('client_id', cfg.clientId);
  github.searchParams.set('redirect_uri', new URL('/api/admin/callback', req.url).toString());
  github.searchParams.set('state', state);
  github.searchParams.set('allow_signup', 'false');

  const res = NextResponse.redirect(github);
  res.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, next }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/admin',
    maxAge: 600,
  });
  return res;
}
