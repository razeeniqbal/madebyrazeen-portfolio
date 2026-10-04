'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { credentialAreas, credentialTypeLabel, issuedTime, type Achievement, type CredentialArea } from '@/content/achievements';
import { cn } from '@/lib/utils';
import { credentialMark, credentialVerifyUrl } from '@/lib/credentials';

/** A credential with its badge path resolved on the server (only when the file really ships). */
export type ListedCredential = Achievement & { badge?: string };

type Filter = CredentialArea | 'all';

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

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((a) => (area === 'all' || a.area === area) && (!q || `${a.title} ${a.organization}`.toLowerCase().includes(q)))
      .sort((a, b) => (issuedTime(b.issuedDate) || -1) - (issuedTime(a.issuedDate) || -1) || a.title.localeCompare(b.title));
  }, [items, area, query]);

  const filtered = area !== 'all' || Boolean(query);
  const shown = initial && !expanded && !filtered ? results.slice(0, initial) : results;
  const filters: { value: Filter; label: string }[] = [{ value: 'all', label: 'All' }, ...credentialAreas.filter((c) => counts.has(c.value))];

  return (
    <div>
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
      </p>

      <ol className="mt-2">
        {shown.map((a) => {
          const verify = credentialVerifyUrl(a);
          return (
            <li
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
