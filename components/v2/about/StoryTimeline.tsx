import Image from 'next/image';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import type { StoryChapter } from '@/content/story';
import { cn } from '@/lib/utils';

/** "Jun 2025 – now" → "2025"; "Always" → "Always". */
const markerOf = (period: string) => period.match(/\d{4}/)?.[0] ?? period;

/**
 * The About story as a vertical trajectory. A big year marker on the left, one node per
 * chapter on the line, the current chapter (period contains "now") filled lime.
 * Photos, credentials and the occasional Mini Razeen sit inside their chapter.
 */
export function StoryTimeline({ chapters }: { chapters: StoryChapter[] }) {
  const current = chapters.findIndex((c) => /now/i.test(c.period));
  return (
    <ol>
      {chapters.map((c, i) => {
        const active = i === current;
        const marker = markerOf(c.period);
        const repeatYear = i > 0 && markerOf(chapters[i - 1].period) === marker;
        return (
          <li key={c.title} className="group grid md:grid-cols-[9rem_1fr] lg:grid-cols-[11rem_1fr]">
            {/* Year marker (desktop) */}
            <div className="hidden pr-8 pt-0.5 text-right md:block">
              {!repeatYear && (
                <span
                  className={cn(
                    'font-display text-display-sm font-extrabold tabular-nums',
                    active ? 'text-ink' : 'text-muted/60',
                  )}
                >
                  {marker}
                </span>
              )}
            </div>

            {/* Line + content */}
            <div data-reveal className="relative border-l border-line pb-16 pl-8 group-last:pb-0 md:pl-12">
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -left-[6px] top-2 h-[11px] w-[11px] rounded-full',
                  active ? 'bg-lime ring-2 ring-ink' : 'border border-ink/50 bg-surface',
                )}
              />
              <div className="flex items-start gap-6">
                <div className="min-w-0 flex-1">
                  <TechnicalLabel as="p" className={active ? 'text-ink' : undefined}>
                    {active && (
                      <span className="mr-2 inline-flex items-center gap-1.5 bg-ink px-1.5 py-0.5 text-surface">Now</span>
                    )}
                    {c.period}
                  </TechnicalLabel>
                  <h3 className="mt-2 text-display-sm">{c.title}</h3>
                  <div className="justify-copy mt-4 max-w-prose space-y-3 text-muted">
                    {c.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
                {c.pose && (
                  <div className="hidden shrink-0 pt-2 lg:block">
                    <MiniRazeen pose={c.pose} height={110} />
                  </div>
                )}
              </div>

              {c.credential && (
                <div className="mt-6 max-w-prose border border-ink/20 bg-raised p-4">
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
                <figure className="mt-6 max-w-lg">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={c.photo.image.src} alt={c.photo.image.alt} fill sizes="(min-width: 768px) 32rem, 90vw" className="object-cover" />
                    <span aria-hidden="true" className="absolute left-2 top-2 h-3 w-3 border-l border-t border-warm/80" />
                    <span aria-hidden="true" className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-warm/80" />
                  </div>
                  <figcaption className="mt-2">
                    <TechnicalLabel>{c.photo.caption}</TechnicalLabel>
                  </figcaption>
                </figure>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
