/**
 * Single source of truth for every project on the site.
 *
 * Edit in the admin (/keystatic → Projects) or content/data/projects.json.
 * To add a project: add one entry. To promote/demote one: change `tier`.
 *   flagship  – full-width feature on the homepage (keep to 1)
 *   featured  – large tile on the homepage + top of /projects
 *   standard  – listed on /projects
 *   archive   – listed on /projects under "Earlier work"
 * `kind` is the portfolio hierarchy (primary-build, professional-system, experiment, research, small-build);
 * `tier` + `order` decide presentation. `origin` is the "why it exists" line (e.g. "Personal interest → Real product").
 * `visibility: 'private'` keeps a record out of every public page.
 * `order` sorts within a tier (lower first). `draft: true` hides it everywhere
 * until the content is confirmed. A long-form case study lives in
 * content/data/case-studies/<slug>.json (admin → Case studies).
 */

import { resolveAsset, type ImageAsset } from '@/lib/assets';
import data from './data/projects.json';

export type ProjectTier = 'flagship' | 'featured' | 'standard' | 'archive';

export type ProjectCategory = 'ai' | 'data' | 'product' | 'analytics' | 'research';

export type ProjectStatus = 'active' | 'under-construction' | 'proof-of-concept' | 'completed' | 'archived';

export type ProjectKind = 'primary-build' | 'professional-system' | 'experiment' | 'research' | 'small-build';

export interface ProjectMetric {
  label: string;
  value: string;
  /** Required whenever the number is not a real measured result (PRD §58). */
  illustrative?: boolean;
}

export interface Project {
  slug: string;
  /** Display number, e.g. "001". Stable once published. */
  number: string;
  title: string;
  year: number;
  category: ProjectCategory;
  status: ProjectStatus;
  tier: ProjectTier;
  order: number;
  /** One line, used on cards and in metadata. */
  summary: string;
  role?: string;
  problem?: string;
  outcome?: string;
  learning?: string;
  /** "What I built": short factual bullets shown on the project page. */
  highlights: string[];
  stack: string[];
  tags: string[];
  links: { live?: string; source?: string };
  /** Private repo or client work: no source link is shown. */
  confidential?: boolean;
  cover?: ImageAsset;
  metrics?: ProjectMetric[];
  caseStudy?: boolean;
  draft?: boolean;
  /** Published with stand-in copy; the UI marks it "details coming". */
  placeholder?: boolean;
  kind: ProjectKind;
  tagline?: string;
  /** Long form of a short name, e.g. VSB → Volleyball SDN BHD. */
  fullName?: string;
  origin?: string;
  /** The product's core loop, step by step (e.g. See → Select → Transform → Verify → Run → Export). */
  loop: string[];
  visibility: 'public' | 'private';
}

export const projectCategories: { value: ProjectCategory; label: string }[] = [
  { value: 'ai', label: 'AI Systems' },
  { value: 'data', label: 'Data Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'research', label: 'Research' },
];

// Data: content/data/projects.json (edited in the admin → Projects).
export const projects: Project[] = data.items.map((p) => ({
  ...p,
  year: p.year ?? 0,
  order: p.order ?? 0,
  category: p.category as ProjectCategory,
  status: p.status as ProjectStatus,
  tier: p.tier as ProjectTier,
  role: p.role || undefined,
  problem: p.problem || undefined,
  outcome: p.outcome || undefined,
  learning: p.learning || undefined,
  highlights: p.highlights ?? [],
  kind: p.kind as ProjectKind,
  tagline: p.tagline || undefined,
  fullName: p.fullName || undefined,
  origin: p.origin || undefined,
  loop: p.loop ?? [],
  visibility: (p.visibility || 'public') as 'public' | 'private',
  links: { live: p.links.live || undefined, source: p.links.source || undefined },
  cover: resolveAsset(p.cover),
  metrics: p.metrics.length ? p.metrics.map((m) => ({ ...m, illustrative: m.illustrative || undefined })) : undefined,
}));

const tierRank: Record<ProjectTier, number> = { flagship: 0, featured: 1, standard: 2, archive: 3 };

/** All published projects, flagship first. */
export function getProjects(): Project[] {
  return projects
    .filter((p) => !p.draft && p.visibility === 'public')
    .sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || a.order - b.order);
}

export function getProjectsByTier(...tiers: ProjectTier[]): Project[] {
  return getProjects().filter((p) => tiers.includes(p.tier));
}

/** Home "Selected work": highlighted projects that can be shown as working; under-construction builds stay on /projects. */
export function getHomeProjects(count = 3): Project[] {
  return getProjectsByTier('flagship', 'featured')
    .filter((p) => p.status !== 'under-construction')
    .slice(0, count);
}

/** Projects of one kind (e.g. the primary builds: VSB, FORMA, Sepang Vision Lab, BALANG), in presentation order. */
export const getProjectsByKind = (...kinds: ProjectKind[]): Project[] => getProjects().filter((p) => kinds.includes(p.kind));

/** The four primary builds in their fixed order (VSB, FORMA, Sepang Vision Lab, BALANG), set by `order`. */
export const getPrimaryBuilds = (): Project[] => getProjectsByKind('primary-build').sort((a, b) => a.order - b.order);

export interface ProjectGroup {
  id: string;
  label: string;
  projects: Project[];
}

/**
 * Everything below the primary builds, grouped by kind. Older experiments (tier `archive`) are their own
 * group so the main list stays current. Empty groups are dropped.
 */
export function getSecondaryProjectGroups(): ProjectGroup[] {
  const rest = getProjects().filter((p) => p.kind !== 'primary-build');
  const groups: ProjectGroup[] = [
    { id: 'professional', label: 'Professional systems', projects: rest.filter((p) => p.kind === 'professional-system') },
    { id: 'research', label: 'Research', projects: rest.filter((p) => p.kind === 'research') },
    {
      id: 'experiments',
      label: 'Experiments and small builds',
      projects: rest.filter((p) => (p.kind === 'experiment' || p.kind === 'small-build') && p.tier !== 'archive'),
    },
    {
      id: 'earlier',
      label: 'Earlier work',
      projects: rest.filter((p) => (p.kind === 'experiment' || p.kind === 'small-build') && p.tier === 'archive'),
    },
  ];
  return groups.filter((g) => g.projects.length > 0);
}

/** Builds still being worked on (active or under construction). */
export const getActiveBuilds = (): Project[] =>
  getProjectsByKind('primary-build').filter((p) => p.status === 'active' || p.status === 'under-construction');

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
