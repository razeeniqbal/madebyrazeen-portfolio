'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { CareerTimelineData, TimelineCredential, TimelineSpan } from '@/content/career-timeline';
import { cn } from '@/lib/utils';

interface CareerTimelineProps {
  data: CareerTimelineData;
  /** full: work, study, credentials and credentials per year. compact: work and study only. */
  variant?: 'full' | 'compact';
  className?: string;
}

type Item = { kind: 'span'; span: TimelineSpan } | { kind: 'credential'; credential: TimelineCredential };

/**
 * The career as a real timeline: every bar and dot is a dated record (roles, degrees, credentials).
 * Hover, focus or tap an item to read it below; the arrows step through everything in date order, which
 * is also how keyboard and phone users move through it. Bars grow in as the chart scrolls into view.
 */
export function CareerTimeline({ data, variant = 'full', className }: CareerTimelineProps) {
  const full = variant === 'full';
  const items: Item[] = useMemo(() => {
    const spans: Item[] = data.spans.map((span) => ({ kind: 'span', span }));
    const creds: Item[] = full ? data.credentials.map((credential) => ({ kind: 'credential', credential })) : [];
    const at = (i: Item) => (i.kind === 'span' ? i.span.start : i.credential.at);
    return [...spans, ...creds].sort((a, b) => at(a) - at(b));
  }, [data, full]);

  const currentIndex = Math.max(0, items.findIndex((i) => i.kind === 'span' && i.span.current));
  const [active, setActive] = useState(currentIndex);
  const [year, setYear] = useState<number | null>(null);
  const selected = items[active];

  const range = data.to - data.from;
  const x = (t: number) => `${((t - data.from) / range) * 100}%`;
  const w = (a: number, b: number) => `${((b - a) / range) * 100}%`;
  const years = Array.from({ length: range + 1 }, (_, i) => data.from + i);
  const maxPerYear = Math.max(1, ...data.perYear.map((y) => y.count));
  // Dots closer than ~6 weeks alternate between two rows instead of sitting on top of each other.
  const dotRow = useMemo(() => {
    const rows = new Map<string, number>();
    let last = -Infinity;
    let row = 0;
    for (const c of data.credentials) {
      row = c.at - last < 0.12 ? 1 - row : 0;
      rows.set(c.id, row);
      last = c.at;
    }
    return rows;
  }, [data.credentials]);
  const indexOf = (match: (i: Item) => boolean) => items.findIndex(match);

  const lane = (name: TimelineSpan['lane'], label: string) => (
    <div className="relative">
      <p className="label mb-1.5 text-muted">{label}</p>
      <div className="relative h-8">
        {data.spans
          .filter((s) => s.lane === name)
          .map((s) => {
            const i = indexOf((it) => it.kind === 'span' && it.span.id === s.id);
            const on = i === active;
            return (
              <button
                key={s.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                aria-label={`${s.title}, ${s.org}, ${s.period}`}
                style={{ left: x(s.start), width: w(s.start, s.end), ['--i' as string]: i }}
                className={cn(
                  'tl-grow absolute inset-y-0 min-w-[1.5rem] overflow-hidden border px-2 text-left text-xs font-semibold leading-8 transition-colors',
                  s.current ? 'border-ink bg-lime text-carbon' : on ? 'border-ink bg-ink text-surface' : 'border-ink/40 bg-ink/10 text-ink hover:bg-ink/20',
                  on && 'ring-2 ring-ink ring-offset-2 ring-offset-surface',
                )}
              >
                <span className="block truncate max-sm:sr-only">{s.short}</span>
              </button>
            );
          })}
      </div>
    </div>
  );

  return (
    <figure className={cn('min-w-0', className)}>
      <div className="relative">
        {/* Year grid and the "now" line sit behind the lanes. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {years.map((y) => (
            <span key={y} className="absolute inset-y-0 w-px bg-line" style={{ left: x(y) }} />
          ))}
          <span className="absolute inset-y-0 w-px bg-lime" style={{ left: x(data.now) }} />
        </div>

        <div className="relative space-y-4">
          {lane('work', 'Work')}
          {lane('study', 'Study')}

          {full && (
            <div>
              <p className="label mb-1.5 text-muted">Credentials</p>
              <div className="relative h-11">
                {data.credentials.map((c) => {
                  const i = indexOf((it) => it.kind === 'credential' && it.credential.id === c.id);
                  const on = i === active;
                  const dim = year !== null && Math.floor(c.at) !== year;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      aria-label={`${c.title}, ${c.org}, ${c.when}`}
                      style={{ left: x(c.at), top: dotRow.get(c.id) ? '1.25rem' : 0, ['--i' as string]: i }}
                      className={cn('tl-fade group absolute flex h-6 w-6 -translate-x-1/2 items-center justify-center transition-opacity', dim && 'opacity-25')}
                    >
                      <span
                        className={cn(
                          'h-2.5 w-2.5 rounded-full border border-ink transition-transform group-hover:scale-125',
                          on ? 'scale-150 bg-lime' : 'bg-surface',
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {full && (
            <div>
              <p className="label mb-1.5 text-muted">Credentials per year</p>
              {/* One grid column per calendar year, so the bars line up with the year grid above. */}
              <div className="grid h-16" style={{ gridTemplateColumns: `repeat(${range}, minmax(0, 1fr))` }}>
                {data.perYear.map((y) => (
                  <button
                    key={y.year}
                    type="button"
                    disabled={y.count === 0}
                    onMouseEnter={() => setYear(y.year)}
                    onMouseLeave={() => setYear(null)}
                    onFocus={() => setYear(y.year)}
                    onBlur={() => setYear(null)}
                    aria-label={`${y.year}: ${y.count} credential${y.count === 1 ? '' : 's'}`}
                    className="group flex h-full min-w-0 flex-col items-stretch justify-end px-[18%] disabled:cursor-default"
                  >
                    {y.count > 0 && <span className="label mb-1 text-center text-ink">{y.count}</span>}
                    <span
                      style={{ height: `${Math.round((y.count / maxPerYear) * 44)}px` }}
                      className={cn('tl-rise block', year === y.year ? 'bg-lime' : 'bg-ink/25 group-hover:bg-ink/40')}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Year axis: every year from tablet up, every other year on phones. */}
        <div aria-hidden="true" className="relative mt-2 h-5">
          {years.slice(0, -1).map((y, i) => (
            <span key={y} className={cn('label absolute text-muted', i % 2 === 1 && 'max-sm:hidden')} style={{ left: x(y) }}>
              <span className="-ml-px pl-1">’{String(y).slice(2)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* The reading panel: what the highlighted item is, with a link into the full record. */}
      <figcaption className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-[1fr_auto] sm:items-start">
        <div aria-live="polite" className="min-w-0">
          {selected?.kind === 'span' ? (
            <>
              <p className="label text-muted">
                {selected.span.lane === 'work' ? 'Work' : 'Study'} · {selected.span.period}
                {selected.span.current && <span className="ml-2 text-ink">Now</span>}
              </p>
              <p className="mt-2 text-lg font-semibold leading-tight">
                {selected.span.title} <span className="font-normal text-muted">· {selected.span.org}</span>
              </p>
              {selected.span.detail && <p className="mt-1.5 line-clamp-2 max-w-prose text-sm text-muted">{selected.span.detail}</p>}
              {selected.span.href && (
                <Link href={selected.span.href} className="label mt-3 inline-block border-b border-current pb-0.5 hover:text-signal">
                  Read the role →
                </Link>
              )}
            </>
          ) : selected?.kind === 'credential' ? (
            <>
              <p className="label text-muted">Credential · {selected.credential.when}</p>
              <p className="mt-2 text-lg font-semibold leading-tight">{selected.credential.title}</p>
              <p className="mt-1.5 text-sm text-muted">{selected.credential.org}</p>
              <Link href="/credentials" className="label mt-3 inline-block border-b border-current pb-0.5 hover:text-signal">
                All credentials →
              </Link>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            disabled={active === 0}
            aria-label="Previous item"
            className="hit label border border-line px-3 py-2 transition-colors hover:border-ink disabled:opacity-30"
          >
            ←
          </button>
          <span className="label w-14 text-center text-muted">
            {active + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => setActive((a) => Math.min(items.length - 1, a + 1))}
            disabled={active === items.length - 1}
            aria-label="Next item"
            className="hit label border border-line px-3 py-2 transition-colors hover:border-ink disabled:opacity-30"
          >
            →
          </button>
        </div>
        {full && data.undatedCredentials > 0 && (
          <p className="label text-muted sm:col-span-2">
            {data.undatedCredentials} undated credential{data.undatedCredentials === 1 ? '' : 's'} not plotted
          </p>
        )}
      </figcaption>
    </figure>
  );
}
