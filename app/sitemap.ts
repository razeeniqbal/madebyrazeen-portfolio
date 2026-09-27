import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getProjects } from '@/content/projects';
import { getPublishedNotes } from '@/content/notes';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/experience', '/projects', '/running', '/journal', '/about', '/resume', '/contact', '/archive'];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...getProjects().map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      changeFrequency: 'yearly' as const,
      priority: p.tier === 'flagship' || p.tier === 'featured' ? 0.8 : 0.5,
    })),
    // Drafts are noindex, so only published notes are listed.
    ...getPublishedNotes().map((n) => ({ url: `${SITE_URL}/journal/${n.slug}`, lastModified: n.date, priority: 0.6 })),
  ];
}
