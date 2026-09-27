// Refinement spec §9: Work · Stories · Running · About, then Resume ↗. Lab stays reachable from the footer and /work.
export const primaryNav = [
  { label: 'Work', href: '/work' },
  { label: 'Stories', href: '/stories' },
  { label: 'Running', href: '/running' },
  { label: 'About', href: '/about' },
] as const;

export const contactHref = '/contact';
export const resumeHref = '/resume';
export const labHref = '/lab';

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Canonical origin. Change here if the domain changes. */
export const SITE_URL = 'https://portfolio.madebyrazeen.com';
