/**
 * Single source of truth for every project on the site.
 *
 * Edit in the admin (/keystatic → Projects) or content/data/projects.json.
 * To add a project: add one entry. To promote/demote one: change `tier`.
 *   flagship  – full-width feature on the homepage (keep to 1)
 *   featured  – large tile on the homepage + top of /projects
 *   standard  – listed on /projects
 *   archive   – listed on /projects under "Earlier work"
 * `order` sorts within a tier (lower first). `draft: true` hides it everywhere
 * until the content is confirmed. A long-form case study lives in
 * content/data/case-studies/<slug>.json (admin → Case studies).
 */

import { resolveAsset, type ImageAsset } from '@/lib/assets';
import data from './data/projects.json';

export type ProjectTier = 'flagship' | 'featured' | 'standard' | 'archive';

export type ProjectCategory = 'ai' | 'data' | 'product' | 'analytics' | 'research';

export type ProjectStatus = 'live' | 'in-progress' | 'shipped' | 'prototype' | 'archived';

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
  links: { live: p.links.live || undefined, source: p.links.source || undefined },
  cover: resolveAsset(p.cover),
  metrics: p.metrics.length ? p.metrics.map((m) => ({ ...m, illustrative: m.illustrative || undefined })) : undefined,
}));

const tierRank: Record<ProjectTier, number> = { flagship: 0, featured: 1, standard: 2, archive: 3 };

/** All published projects, flagship first. */
export function getProjects(): Project[] {
  return projects
    .filter((p) => !p.draft)
    .sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || a.order - b.order);
}

export function getProjectsByTier(...tiers: ProjectTier[]): Project[] {
  return getProjects().filter((p) => tiers.includes(p.tier));
}

/** Home "Selected work": finished highlighted projects only; active builds (e.g. Sepang) stay on /projects and /lab. */
export function getHomeProjects(count = 3): Project[] {
  return getProjectsByTier('flagship', 'featured')
    .filter((p) => p.status !== 'in-progress' && p.status !== 'prototype')
    .slice(0, count);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
