export const primaryNav = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Notes', href: '/notes' },
  { label: 'Lab', href: '/lab' },
  { label: 'Running', href: '/running' },
] as const;

export const contactHref = '/contact';
export const resumeHref = '/resume';

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Canonical origin. Change here if the domain changes. */
export const SITE_URL = 'https://portfolio.madebyrazeen.com';
