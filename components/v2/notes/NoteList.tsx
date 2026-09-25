import Link from 'next/link';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import type { Note } from '@/content/notes';

const statusLabel = { draft: 'Draft', 'in-writing': 'In writing', published: '' } as const;

/** NOTE_001 · Topic — title — summary. Only notes with a body are links. */
export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <ol>
      {notes.map((n) => {
        const inner = (
          <>
            <div className="flex items-center justify-between gap-4">
              <TechnicalLabel>
                Note_{n.number} · {n.topic}
                {n.readingMinutes && ` · ${n.readingMinutes} min`}
              </TechnicalLabel>
              {n.status !== 'published' && (
                <TechnicalLabel className="border border-current px-1.5">{statusLabel[n.status]}</TechnicalLabel>
              )}
            </div>
            <h3 className="mt-2 text-xl font-semibold group-hover:underline">{n.title}</h3>
            <p className="mt-1 max-w-prose text-sm text-muted">{n.summary}</p>
          </>
        );
        return (
          <li key={n.slug} className="border-t border-line">
            {n.body ? (
              <Link href={`/notes/${n.slug}`} className="group block py-5">
                {inner}
              </Link>
            ) : (
              <div className="py-5">{inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
