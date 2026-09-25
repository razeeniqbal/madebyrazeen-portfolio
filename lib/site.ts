export const primaryNav = [
  { label: 'Work', href: '/work' },
  { label: 'Lab', href: '/lab' },
  { label: 'Running', href: '/running' },
  { label: 'Notes', href: '/notes' },
  { label: 'About', href: '/about' },
] as const;

export const contactHref = '/contact';

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Canonical origin. Change here if the domain changes. */
export const SITE_URL = 'https://portfolio.madebyrazeen.com';
