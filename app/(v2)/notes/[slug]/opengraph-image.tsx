import { renderOg, ogSize, ogContentType } from '@/lib/og/template';
import { getNote, getReadableNotes } from '@/content/notes';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Field note by Razeen Iqbal';

export function generateStaticParams() {
  return getReadableNotes().map((n) => ({ slug: n.slug }));
}

// TECHNICAL NOTE template: light surface, quieter than projects.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const n = getNote((await params).slug);
  return renderOg({
    kind: 'Technical note',
    index: n ? `Note_${n.number}` : undefined,
    title: n?.title ?? 'Field notes',
    subtitle: 'Patterns. Lessons. Practical insights.',
    meta: n?.topic,
    surface: 'light',
  });
}
