// V2.0 information architecture. Six primary sections, in this order on purpose: About leads (the site is
// a person first), Trainer sits directly after Experience. Resume and Contact are utilities, set apart.
// `index` is the page number used by page headings (PAGE / 03). `also` lists routes that belong to a
// section without being in the navigation: /running lives under Life.
export const primaryNav = [
  { label: 'About', href: '/about', index: '01', also: [] },
  { label: 'Experience', href: '/experience', index: '02', also: [] },
  { label: 'Trainer', href: '/trainer', index: '03', also: [] },
  { label: 'Projects', href: '/projects', index: '04', also: [] },
  { label: 'Journal', href: '/journal', index: '05', also: [] },
  { label: 'Life', href: '/life', index: '06', also: ['/running'] },
] as const satisfies readonly { label: string; href: string; index: string; also: readonly string[] }[];

export type PrimarySection = (typeof primaryNav)[number];

export const contactHref = '/contact';
export const resumeHref = '/resume';

/** Utilities: Resume opens a document-style page (↗), Contact continues the flow (→). */
export const utilityNav = [
  { label: 'Resume', href: resumeHref, arrow: '↗' },
  { label: 'Contact', href: contactHref, arrow: '→' },
] as const;

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** True when the pathname is the section's page, one of its sub-pages, or a route it owns (Life owns /running). */
export function isSectionActive(pathname: string, section: PrimarySection) {
  return [section.href, ...section.also].some((h) => isActive(pathname, h));
}

/** The navigation entry for a route, used for page headings. */
export const sectionFor = (href: string): PrimarySection | undefined => primaryNav.find((s) => s.href === href);

/** Canonical origin. Change here if the domain changes. */
export const SITE_URL = 'https://portfolio.madebyrazeen.com';
