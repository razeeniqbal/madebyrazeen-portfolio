import { profile, contact, bio } from '@/content/profile';
import { availability } from '@/content/contact';
import { getProjects, getPrimaryBuilds } from '@/content/projects';
import { getPublishedJournalEntries } from '@/content/notes';
import { achievements } from '@/content/achievements';
import { credentialVerifyUrl } from '@/lib/credentials';
import { SITE_URL, primaryNav } from '@/lib/site';

/**
 * /llms.txt (llmstxt.org): a short, link-first map of the site for language models, built from the
 * same content as the pages at build time. /llms-full.txt carries the full text.
 */
export const dynamic = 'force-static';

const link = (title: string, path: string, note?: string) => `- [${title}](${SITE_URL}${path})${note ? `: ${note}` : ''}`;

export function GET() {
  const primary = getPrimaryBuilds();
  const others = getProjects().filter((p) => !primary.includes(p) && p.tier !== 'archive');
  const verified = achievements.filter((a) => credentialVerifyUrl(a));

  const text = [
    `# ${profile.name}`,
    `> ${bio.short} Based in ${profile.location}.`,
    `${availability.headline}. ${availability.detail} Contact: ${contact.email} or ${SITE_URL}/contact. The full text of this site is at ${SITE_URL}/llms-full.txt.`,
    `## Pages\n${[...primaryNav.map((s) => link(s.label, s.href)), link('Running', '/running', 'running log built from recorded runs'), link('Credentials', '/credentials'), link('Resume', '/resume'), link('Contact', '/contact')].join('\n')}`,
    `## Primary builds\n${primary.map((p) => link(p.title, `/projects/${p.slug}`, p.summary)).join('\n')}`,
    `## Journal\n${getPublishedJournalEntries()
      .map((n) => link(n.title, `/journal/${n.slug}`, n.description))
      .join('\n')}`,
    `## Verified credentials\n${verified.map((a) => `- [${a.title}](${credentialVerifyUrl(a)}): ${a.organization}${a.issuedDate ? `, ${a.issuedDate}` : ''}`).join('\n')}`,
    `## Optional\n${[...others.map((p) => link(p.title, `/projects/${p.slug}`, p.summary)), link('Journal RSS', '/journal/rss.xml'), link('Sitemap', '/sitemap.xml')].join('\n')}`,
  ].join('\n\n');

  return new Response(`${text}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
