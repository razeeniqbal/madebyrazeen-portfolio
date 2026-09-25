import Image from 'next/image';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import type { StoryChapter } from '@/content/story';
import { cn } from '@/lib/utils';

/**
 * The About story as a vertical trajectory: one node per chapter, the latest
 * (the "progress point") filled lime. Photos and credentials sit inside their chapter.
 */
export function StoryTimeline({ chapters }: { chapters: StoryChapter[] }) {
  const current = chapters.findIndex((c) => /now/i.test(c.period));
  return (
    <ol className="relative border-l border-line">
      {chapters.map((c, i) => {
        const active = i === current;
        return (
          <li key={c.title} data-reveal className="relative pb-14 pl-8 last:pb-0 md:pl-12">
            <span
              aria-hidden="true"
              className={cn(
                'absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full',
                active ? 'bg-lime ring-2 ring-ink' : 'border border-muted bg-surface',
              )}
            />
            <TechnicalLabel as="p" className={active ? 'text-ink' : undefined}>
              {c.period}
            </TechnicalLabel>
            <h3 className="mt-2 text-display-sm">{c.title}</h3>
            <div className="mt-4 max-w-prose space-y-3 text-muted">
              {c.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {c.credential && (
              <div className="mt-6 max-w-prose border border-line p-4">
                <p className="label flex items-center gap-2 text-muted">
                  <span aria-hidden="true">✓</span> Verified · credential
                </p>
                <p className="mt-2 font-semibold">{c.credential.title}</p>
                <p className="flex flex-wrap items-baseline justify-between gap-3 text-sm text-muted">
                  {c.credential.issuer} · {c.credential.date}
                  {c.credential.url && (
                    <a href={c.credential.url} target="_blank" rel="noopener noreferrer" className="label border-b border-current text-ink">
                      Verify ↗
                    </a>
                  )}
                </p>
              </div>
            )}

            {c.photo && (
              <figure className="mt-6 max-w-md">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={c.photo.image.src}
                    alt={c.photo.image.alt}
                    fill
                    sizes="(min-width: 768px) 28rem, 90vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2">
                  <TechnicalLabel>{c.photo.caption}</TechnicalLabel>
                </figcaption>
              </figure>
            )}
          </li>
        );
      })}
    </ol>
  );
}
