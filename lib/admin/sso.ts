import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Admin single sign-on for the madebyrazeen apps.
 *
 * /admin signs in with GitHub (only the logins in ADMIN_GITHUB_LOGINS), then sets `mbr_admin` on
 * MBR_SSO_COOKIE_DOMAIN (.madebyrazeen.com in production) so Langkah and the course tracker receive it
 * too. Token: `v1.<base64url JSON {sub, iat, exp}>.<base64url HMAC-SHA256 of "v1.<payload>">`, keyed
 * with MBR_SSO_SECRET, which every app shares. Keep in step with `sso.py` in Langkah and the tracker.
 */

export const SSO_COOKIE = 'mbr_admin';
export const OAUTH_COOKIE = 'mbr_oauth';

const secret = () => process.env.MBR_SSO_SECRET ?? '';
const hours = () => Number(process.env.MBR_SSO_HOURS ?? 12) || 12;

export const ssoConfig = () => {
  const clientId = process.env.ADMIN_GITHUB_CLIENT_ID ?? process.env.KEYSTATIC_GITHUB_CLIENT_ID ?? '';
  const clientSecret = process.env.ADMIN_GITHUB_CLIENT_SECRET ?? process.env.KEYSTATIC_GITHUB_CLIENT_SECRET ?? '';
  return {
    ready: Boolean(secret() && clientId && clientSecret),
    clientId,
    clientSecret,
    logins: (process.env.ADMIN_GITHUB_LOGINS ?? 'razeeniqbal').split(',').map((l) => l.trim().toLowerCase()).filter(Boolean),
    cookieDomain: process.env.MBR_SSO_COOKIE_DOMAIN || undefined,
    maxAge: hours() * 3600,
  };
};

const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url');
const sign = (body: string) => b64(createHmac('sha256', secret()).update(body).digest());

export function issueToken(sub: string, now = Math.floor(Date.now() / 1000)): string {
  const payload = b64(JSON.stringify({ sub, iat: now, exp: now + ssoConfig().maxAge }));
  return `v1.${payload}.${sign(`v1.${payload}`)}`;
}

/** The GitHub login the token belongs to, or null when it is missing, forged or expired. */
export function verifyToken(token: string | undefined): string | null {
  if (!secret() || !token) return null;
  const [version, payload, sig, ...rest] = token.split('.');
  if (version !== 'v1' || !payload || !sig || rest.length) return null;
  const want = Buffer.from(sign(`v1.${payload}`));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const { sub, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof sub === 'string' && typeof exp === 'number' && exp > Date.now() / 1000 ? sub : null;
  } catch {
    return null;
  }
}

/**
 * Where to send the browser after sign-in or sign-out: a path on this site, or an https page on
 * madebyrazeen.com or one of its subdomains (http://localhost in development). Anything else → /admin.
 */
export function safeNext(next: string | null | undefined): string {
  if (!next) return '/admin';
  if (next.startsWith('/')) {
    // Resolve instead of string checks: parsers drop tabs/newlines and read "\" as "/", so "/\t/evil.com" is "//evil.com".
    const base = 'https://portfolio.invalid';
    const url = new URL(next, base);
    return url.origin === base ? `${url.pathname}${url.search}${url.hash}` : '/admin';
  }
  try {
    const url = new URL(next);
    const host = url.hostname;
    const ours = url.protocol === 'https:' && (host === 'madebyrazeen.com' || host.endsWith('.madebyrazeen.com'));
    const local = process.env.NODE_ENV !== 'production' && url.protocol === 'http:' && host === 'localhost';
    return ours || local ? url.toString() : '/admin';
  } catch {
    return '/admin';
  }
}
