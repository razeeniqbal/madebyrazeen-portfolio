'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ShowcaseBuild {
  slug: string;
  title: string;
  origin?: string;
  summary: string;
  status: string;
  live: boolean;
  liveUrl?: string;
  stack: string[];
  image?: { src: string; width: number; height: number; alt: string };
  evidence?: string;
}

/**
 * Home 01, interactive. Desktop: the builds as a list on the left; pointing at one (or focusing it)
 * swaps the large product view on the right, so the four products are seen at full size one at a time.
 * Phones and tablets: a swipeable row of cards with snap points. Images are real captures.
 */
export function BuildShowcase({ builds }: { builds: ShowcaseBuild[] }) {
  const [active, setActive] = useState(0);
  const current = builds[active];

  return (
    <>
      {/* Desktop: list + stage */}
      <div className="col-span-full hidden lg:grid lg:grid-cols-12 lg:gap-x-10">
        <ol className="lg:col-span-5">
          {builds.map((b, i) => {
            const on = i === active;
            return (
              <li key={b.slug} data-reveal className="border-t border-line last:border-b">
                <Link
                  href={`/projects/${b.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-current={on ? 'true' : undefined}
                  className="group block py-6"
                >
                  <span className="label flex items-center gap-3 text-muted">
                    <span className={cn(on ? 'text-ink' : undefined)}>{String(i + 1).padStart(2, '0')}</span>
                    {b.origin && <span>{b.origin}</span>}
                    <span aria-hidden="true" className={cn('ml-auto transition-transform', on ? 'translate-x-0 text-ink' : '-translate-x-2 opacity-0')}>
                      →
                    </span>
                  </span>
                  <span
                    className={cn(
                      'mt-2 block text-[clamp(2rem,3.6vw,3.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] transition-colors',
                      on ? 'text-ink' : 'text-ink/35 group-hover:text-ink/70',
                    )}
                  >
                    {b.title}
                  </span>
                  {/* The summary opens under the active build only. */}
                  <span className={cn('grid transition-[grid-template-rows] duration-500 ease-out', on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                    <span className="overflow-hidden">
                      <span className="mt-3 block max-w-prose text-muted">{b.summary}</span>
                      <span className="label mt-3 flex flex-wrap items-center gap-x-2 text-muted">
                        <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', b.live ? 'bg-lime' : 'border border-current')} />
                        {b.status}
                        {b.stack.slice(0, 3).map((s) => (
                          <span key={s}>· {s}</span>
                        ))}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="lg:col-span-7">
          <div className="sticky top-[calc(var(--header-h)+2rem)]">
            <Link href={`/projects/${current.slug}`} aria-label={`${current.title} case study`} className="group relative block aspect-[16/10] overflow-hidden border border-line bg-raised">
              {builds.map((b, i) =>
                b.image ? (
                  <Image
                    key={b.slug}
                    src={b.image.src}
                    width={b.image.width}
                    height={b.image.height}
                    alt={i === active ? b.image.alt : ''}
                    aria-hidden={i !== active}
                    sizes="(min-width: 1024px) 56vw, 1px"
                    className={cn(
                      'absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
                      i === active ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                ) : null,
              )}
              {current.evidence && (
                <span className="label absolute bottom-0 right-0 bg-carbon/85 px-2 py-1 text-[0.625rem] text-warm/80">{current.evidence}</span>
              )}
            </Link>
            <p className="label mt-3 flex items-center justify-between text-muted">
              <span>
                {current.title} · {current.status}
              </span>
              <Link href={`/projects/${current.slug}`} className="text-ink hover:text-signal">
                Case study →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Phones and tablets: a swipeable row */}
      <ul className="col-span-full -mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-4 overflow-x-auto px-gutter pb-4 [scrollbar-width:none] lg:hidden">
        {builds.map((b) => (
          <li key={b.slug} className="w-[82%] shrink-0 snap-start sm:w-[46%]">
            <Link href={`/projects/${b.slug}`} className="group block">
              {b.image && (
                <div className="relative aspect-[16/10] overflow-hidden border border-line bg-raised">
                  <Image src={b.image.src} width={b.image.width} height={b.image.height} alt={b.image.alt} sizes="(min-width: 640px) 46vw, 82vw" className="h-full w-full object-cover object-top" />
                </div>
              )}
              {b.origin && <p className="label mt-4 text-muted">{b.origin}</p>}
              <p className="mt-1 text-2xl font-extrabold uppercase tracking-[-0.03em]">{b.title}</p>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{b.summary}</p>
              <p className="label mt-3 flex items-center gap-2 text-muted">
                <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', b.live ? 'bg-lime' : 'border border-current')} />
                {b.status}
                <span className="ml-auto text-ink">Case study →</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="label col-span-full -mt-6 text-muted lg:hidden" aria-hidden="true">
        Swipe for more →
      </p>
    </>
  );
}
