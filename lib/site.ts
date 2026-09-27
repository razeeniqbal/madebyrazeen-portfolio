// R03: About leads (the site is a person, not only a portfolio), then Work · Stories · Running; Resume ↗ sits apart.
// Lab stays a secondary destination (footer, /work).
export const primaryNav = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Stories', href: '/stories' },
  { label: 'Running', href: '/running' },
] as const;

export const contactHref = '/contact';
export const resumeHref = '/resume';
export const labHref = '/lab';

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Canonical origin. Change here if the domain changes. */
export const SITE_URL = 'https://portfolio.madebyrazeen.com';
