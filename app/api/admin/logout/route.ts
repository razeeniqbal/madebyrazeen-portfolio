import { NextResponse, type NextRequest } from 'next/server';
import { SSO_COOKIE, safeNext, ssoConfig } from '@/lib/admin/sso';

/** Clears the shared admin cookie, which signs out of every madebyrazeen app, then goes to `?next=`. */
function logout(req: NextRequest) {
  const res = NextResponse.redirect(new URL(safeNext(req.nextUrl.searchParams.get('next')), req.url), 303);
  res.cookies.set(SSO_COOKIE, '', { path: '/', domain: ssoConfig().cookieDomain, maxAge: 0 });
  return res;
}

export const GET = logout;
export const POST = logout;
