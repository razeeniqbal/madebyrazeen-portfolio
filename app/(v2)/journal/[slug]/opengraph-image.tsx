import { renderOg, ogSize, ogContentType } from '@/lib/og/template';
import { categoryLabel, formatJournalDate, getNote, getPublishedJournalEntries } from '@/content/notes';
import { journalCovers } from '@/lib/journal';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Journal entry by Razeen Iqbal';

export function generateStaticParams() {
  return getPublishedJournalEntries().map((n) => ({ slug: n.slug }));
}

// Journal template: light surface, quieter than projects.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const n = getNote((await params).slug);
  return renderOg({
    kind: 'Journal',
    index: n ? categoryLabel(n.category) : undefined,
    title: n?.title ?? 'Journal',
    subtitle: n?.description,
    meta: n?.date ? `${formatJournalDate(n.date)} · ${n.readingMinutes} min read` : undefined,
    surface: 'light',
    // The article's own cover sequence, so each card is distinct but the Journal reads as one publication.
    motif: n?.cover ? journalCovers[n.cover].motif : undefined,
    motifMark: n?.cover ? journalCovers[n.cover].mark : undefined,
  });
}
