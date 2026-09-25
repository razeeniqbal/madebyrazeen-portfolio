// V1 compatibility layer: maps content/projects.ts onto the V1 card shape.
import { getProjects, type ProjectCategory } from '@/content/projects';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  featured: boolean;
  category: 'web' | 'mobile' | 'ml' | 'data' | 'other';
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
  stars?: number;
}

const v1Category: Record<ProjectCategory, Project['category']> = {
  ai: 'ml',
  research: 'ml',
  data: 'data',
  analytics: 'data',
  product: 'web',
};

export const projects: Project[] = getProjects().map((p) => ({
  id: p.number,
  title: p.title,
  description: p.summary,
  // V1 had no project images either; the card's onError fallback handles it.
  image: `/projects/${p.slug}.jpg`,
  techStack: p.stack,
  featured: p.tier === 'flagship' || p.tier === 'featured',
  category: v1Category[p.category],
  liveUrl: p.links.live,
  githubUrl: p.links.source,
  tags: p.tags,
}));

export const projectCategories = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'ml', label: 'Machine Learning' },
  { value: 'data', label: 'Data Engineering' },
  { value: 'other', label: 'Other' },
];
