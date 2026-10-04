import Image from 'next/image';
import Link from 'next/link';
import { EntryMeta } from '@/components/v2/journal/EntryMeta';
import { toSummary, type Note } from '@/content/notes';

/** Compact list of published journal entries: date · reading time · category, then title and description. */
export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <ol>
      {notes.map((n) => {
        const text = (
          <div className="min-w-0">
            <EntryMeta entry={toSummary(n)} />
            <h3 className="mt-2 text-xl font-semibold group-hover:underline">{n.title}</h3>
            <p className="mt-1 max-w-prose text-sm text-muted">{n.description}</p>
          </div>
        );
        return (
          <li key={n.slug} className="border-t border-line">
            <Link href={`/journal/${n.slug}`} className="group block py-5">
              {n.photo ? (
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
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
