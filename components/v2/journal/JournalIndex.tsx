'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { JournalCategory } from '@/lib/journal';
import { EntryMeta, type EntrySummary } from './EntryMeta';

type Filter = JournalCategory | 'all';

/**
 * Every published entry, newest first, with a category filter. Receives summaries only, so no
 * article body is sent to the browser. Empty categories still show, with a plain empty state.
 */
export function JournalIndex({ entries, categories }: { entries: EntrySummary[]; categories: { value: JournalCategory; label: string }[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const shown = filter === 'all' ? entries : entries.filter((e) => e.category === filter);
  const options: { value: Filter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: entries.length },
    ...categories.map((c) => ({ ...c, count: entries.filter((e) => e.category === c.value).length })),
  ];

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-4">
        {options.map((o) => {
          const active = filter === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(o.value)}
              className={cn(
                'hit label flex items-center gap-2 border-b-2 pb-1.5 transition-colors',
                active ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink',
              )}
            >
              {o.label}
              <span className="opacity-60">{o.count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'entry' : 'entries'}
      </p>

      {shown.length === 0 ? (
        <p className="py-8 text-muted">Nothing published here yet.</p>
      ) : (
        <ol>
          {shown.map((e) => (
            <li key={e.slug} className="border-b border-line">
              <Link href={`/journal/${e.slug}`} className="group grid gap-x-8 gap-y-2 py-7 md:grid-cols-[1fr_14rem]">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold leading-snug group-hover:underline md:text-2xl">{e.title}</h3>
                  <p className="mt-2 max-w-prose text-muted">{e.description}</p>
                </div>
                <div className="space-y-1 md:text-right">
                  <EntryMeta entry={e} className="md:justify-end" />
                  {e.project && <p className="label text-muted">Related build · {e.project}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
