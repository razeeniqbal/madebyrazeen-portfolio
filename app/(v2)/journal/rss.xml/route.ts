import { getPublishedJournalEntries } from '@/content/notes';
import { SITE_URL } from '@/lib/site';

// Published entries only, generated at build time.
export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

export function GET() {
  const entries = getPublishedJournalEntries();
  const items = entries
    .map(
      (n) => `    <item>
      <title>${esc(n.title)}</title>
      <link>${SITE_URL}/journal/${n.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/journal/${n.slug}</guid>
      <pubDate>${rfc822(n.date!)}</pubDate>
      <category>${esc(n.category)}</category>
      <description>${esc(n.description)}</description>
    </item>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Razeen Iqbal · Journal</title>
    <link>${SITE_URL}/journal</link>
    <atom:link href="${SITE_URL}/journal/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes from building, learning and figuring things out.</description>
    <language>en</language>
${entries[0]?.date ? `    <lastBuildDate>${rfc822(entries[0].updated ?? entries[0].date)}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
