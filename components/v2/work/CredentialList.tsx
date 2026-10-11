'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { credentialAreas, credentialTypeLabel, issuedTime, type Achievement, type CredentialArea } from '@/content/achievements';
import { cn } from '@/lib/utils';
import { credentialMark, credentialVerifyUrl } from '@/lib/credentials';

/** A credential with its badge path resolved on the server (only when the file really ships). */
export type ListedCredential = Achievement & { badge?: string };

type Filter = CredentialArea | 'all';

// One treatment per area, from the palette only: AI is the signal, the rest are shades of ink.
const areaFill: Record<CredentialArea, string> = {
  ai: 'bg-lime',
  data: 'bg-ink',
  cloud: 'bg-ink/50',
  development: 'bg-ink/25',
  other: 'bg-transparent border border-ink/40',
};
const yearOf = (a: Achievement) => a.issuedDate.match(/\d{4}/)?.[0] ?? 'Undated';

/**
 * The full credential archive: one row of subject filters and a search box. Newest first; undated
 * records last (they are shown as undated, never given a guessed date).
 */
export function CredentialList({ items, initial }: { items: ListedCredential[]; initial?: number }) {
  const counts = useMemo(() => {
    const m = new Map<Filter, number>([['all', items.length]]);
    items.forEach((a) => m.set(a.area, (m.get(a.area) ?? 0) + 1));
    return m;
  }, [items]);

  const [area, setArea] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [year, setYear] = useState<string | null>(null);

  // Credentials per year, stacked by area: the chart above the list, and a filter of its own.
  const years = useMemo(() => {
    const keys = [...new Set(items.map(yearOf))].sort((a, b) => (a === 'Undated' ? 1 : b === 'Undated' ? -1 : a.localeCompare(b)));
    return keys.map((y) => {
      const inYear = items.filter((a) => yearOf(a) === y);
      return { year: y, total: inYear.length, byArea: credentialAreas.map((c) => ({ area: c.value, n: inYear.filter((a) => a.area === c.value).length })).filter((x) => x.n > 0) };
    });
  }, [items]);
  const maxYear = Math.max(1, ...years.map((y) => y.total));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((a) => (area === 'all' || a.area === area) && (!year || yearOf(a) === year) && (!q || `${a.title} ${a.organization}`.toLowerCase().includes(q)))
      .sort((a, b) => (issuedTime(b.issuedDate) || -1) - (issuedTime(a.issuedDate) || -1) || a.title.localeCompare(b.title));
  }, [items, area, query, year]);

  const filtered = area !== 'all' || Boolean(query) || Boolean(year);
  const shown = initial && !expanded && !filtered ? results.slice(0, initial) : results;
  const filters: { value: Filter; label: string }[] = [{ value: 'all', label: 'All' }, ...credentialAreas.filter((c) => counts.has(c.value))];

  return (
    <div>
      {/* Per-year chart: click a year to filter; the area filter dims the other areas. */}
      <div className="mb-8">
        <div className="flex h-40 items-end gap-2 border-b border-line sm:gap-4" role="group" aria-label="Credentials per year">
          {years.map((y) => {
            const on = year === y.year;
            return (
              <button
                key={y.year}
                type="button"
                aria-pressed={on}
                aria-label={`${y.year}: ${y.total} credential${y.total === 1 ? '' : 's'}`}
                onClick={() => setYear(on ? null : y.year)}
                className={cn('group flex h-full flex-1 flex-col justify-end', year && !on && 'opacity-35')}
              >
                <span className="label mb-1 text-center text-ink">{y.total}</span>
                <span className="tl-rise flex flex-col-reverse gap-px" style={{ height: `${(y.total / maxYear) * 75}%` }}>
                  {y.byArea.map((b) => (
                    <span
                      key={b.area}
                      style={{ flexGrow: b.n }}
                      className={cn('block min-h-[3px] transition-opacity', areaFill[b.area], area !== 'all' && area !== b.area && 'opacity-15', 'group-hover:brightness-110')}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2 sm:gap-4">
          {years.map((y) => (
            <span key={y.year} className={cn('label flex-1 text-center', year === y.year ? 'text-ink' : 'text-muted')}>
              {y.year === 'Undated' ? 'No date' : `’${y.year.slice(2)}`}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Filter by area" className="flex flex-wrap gap-x-6 gap-y-2">
          {filters.map((f) => {
            const active = area === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setArea(f.value)}
                className={cn(
                  'hit label flex items-center gap-2 border-b-2 pb-1.5 transition-colors',
                  active ? 'border-lime text-ink' : 'border-transparent text-muted hover:text-ink',
                )}
              >
                {f.value !== 'all' && <span aria-hidden="true" className={cn('h-2 w-2', areaFill[f.value])} />}
                {f.label}
                <span className="opacity-60">{counts.get(f.value) ?? 0}</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-3 border-b border-ink pb-1 sm:w-64">
          <span className="label text-muted">Search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Azure, Fabric, Databricks…"
            className="w-full min-w-0 bg-transparent py-1 outline-none placeholder:text-muted/70"
          />
        </label>
      </div>

      <p className="label mt-4 text-muted" role="status" aria-live="polite">
        {results.length} of {items.length}
        {year && (
          <>
            {' · '}
            {year}{' '}
            <button type="button" onClick={() => setYear(null)} className="ml-1 border-b border-current text-ink">
              Clear year
            </button>
          </>
        )}
      </p>

      <ol className="mt-2">
        {shown.map((a) => {
          const verify = credentialVerifyUrl(a);
          return (
            <li data-reveal
              key={a.id}
              className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-1 border-t border-line py-3.5 md:grid-cols-[2.5rem_1fr_13rem_7rem_4.5rem]"
            >
              {a.badge ? (
                // Next to the visible title, so the badge is decorative for screen readers.
                <Image src={a.badge} alt="" width={80} height={80} className="h-10 w-10 object-contain" />
              ) : (
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center border border-line font-mono text-[0.625rem] font-semibold leading-none tracking-tight text-muted">
                  {credentialMark(a)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block font-semibold leading-snug [overflow-wrap:anywhere]">{a.title}</span>
                <span className="mt-0.5 block text-sm text-muted md:hidden">
                  {a.organization} · {a.issuedDate || 'Undated'}
                  {a.type !== 'certification' && <> · {credentialTypeLabel[a.type]}</>}
                </span>
              </span>
              <span className="hidden text-sm text-muted md:block">
                {a.organization}
                {/* The type, when it is not a certification, so a course never reads as one. */}
                {a.type !== 'certification' && <span className="label ml-2">· {credentialTypeLabel[a.type]}</span>}
              </span>
              <span className="label hidden text-muted md:block">{a.issuedDate || 'Undated'}</span>
              <span className="label text-right">
                {verify ? (
                  <a href={verify} target="_blank" rel="noopener noreferrer" className="border-b border-current" aria-label={`Verify ${a.title} (opens the issuer page)`}>
                    Verify ↗
                  </a>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>

      {initial && !filtered && results.length > initial && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="hit label mt-6 border-b border-current pb-1" aria-expanded={expanded}>
          {expanded ? 'Show fewer' : `Show all ${results.length}`}
        </button>
      )}
    </div>
  );
}
