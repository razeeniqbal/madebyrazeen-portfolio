import Image from 'next/image';
import Link from 'next/link';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import type { Note } from '@/content/notes';

/** NOTE_001 · Topic, then title and summary. Only notes with a body are links. */
export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <ol>
      {notes.map((n) => {
        const text = (
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-4">
              <TechnicalLabel>
                Entry_{n.number} · {n.topic}
                {n.readingMinutes && ` · ${n.readingMinutes} min`}
              </TechnicalLabel>
            </div>
            <h3 className="mt-2 text-xl font-semibold group-hover:underline">{n.title}</h3>
            <p className="mt-1 max-w-prose text-sm text-muted">{n.summary}</p>
          </div>
        );
        const inner = n.photo ? (
          <div className="grid grid-cols-[1fr_5.5rem] items-start gap-5 md:grid-cols-[1fr_8rem]">
            {text}
            <div className="relative aspect-[4/3] overflow-hidden bg-raised">
              <Image
                src={n.photo.image.src}
                alt=""
                fill
                sizes="(min-width: 768px) 8rem, 5.5rem"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </div>
          </div>
        ) : (
          text
        );
        return (
          <li key={n.slug} className="border-t border-line">
            {n.body ? (
              <Link href={`/journal/${n.slug}`} className="group block py-5">
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
