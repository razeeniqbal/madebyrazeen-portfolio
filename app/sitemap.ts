import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getProjects } from '@/content/projects';
import { getPublishedNotes } from '@/content/notes';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/about', '/experience', '/trainer', '/projects', '/journal', '/life', '/running', '/resume', '/contact'];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...getProjects().map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      changeFrequency: 'yearly' as const,
      priority: p.tier === 'flagship' || p.tier === 'featured' ? 0.8 : 0.5,
    })),
    // Published entries only: drafts and archived entries have no page.
    ...getPublishedNotes().map((n) => ({ url: `${SITE_URL}/journal/${n.slug}`, lastModified: n.date, priority: 0.6 })),
  ];
}
