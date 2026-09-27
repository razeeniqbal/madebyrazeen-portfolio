'use client';

import { useMemo, useState } from 'react';
import type { Achievement } from '@/content/achievements';
import { cn } from '@/lib/utils';
import { credentialVerifyUrl } from '@/lib/credentials';

const monthIndex = (d: string) => {
  const t = Date.parse(`1 ${d}`);
  return Number.isNaN(t) ? 0 : t;
};

/** Every certification and course from the V1 achievements page, as a filterable list. */
export function CredentialList({ items, initial }: { items: Achievement[]; initial?: number }) {
  const orgs = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((a) => m.set(a.organization, (m.get(a.organization) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const [org, setOrg] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((a) => (org === 'all' || a.organization === org) && (!q || `${a.title} ${a.organization} ${a.description}`.toLowerCase().includes(q)))
      .sort((a, b) => monthIndex(b.issuedDate) - monthIndex(a.issuedDate));
  }, [items, org, query]);

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Filter by issuer" className="flex flex-wrap gap-2">
          {[['all', items.length] as const, ...orgs].map(([name, count]) => {
            const active = org === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setOrg(name)}
                className={cn(
                  'label flex items-center gap-2 border px-3 py-2 transition-colors',
                  active ? 'border-ink bg-ink text-surface' : 'border-line hover:border-ink',
                )}
              >
                {name === 'all' ? 'All' : name}
                <span className={active ? 'opacity-70' : 'text-muted'}>{count}</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-3 border-b border-ink pb-1 lg:w-72">
          <span className="label text-muted">Search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Azure, Spark, Python…"
            className="w-full bg-transparent py-1 outline-none placeholder:text-muted/70"
          />
        </label>
      </div>

      <p className="label mt-4 text-muted" role="status" aria-live="polite">
        {results.length} of {items.length}
      </p>

      <ol className="mt-2">
        {(initial && !expanded && org === 'all' && !query ? results.slice(0, initial) : results).map((a) => {
          const verify = credentialVerifyUrl(a);
          return (
            <li
              key={a.id}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 border-t border-line py-4 md:grid-cols-[8rem_1fr_14rem_5rem]"
            >
              <span className="label order-3 text-muted md:order-none">{a.issuedDate}</span>
              <span className="order-1 font-semibold md:order-none">{a.title}</span>
              <span className="order-4 text-sm text-muted md:order-none">
                {a.organization}
                {a.category === 'course' && <span className="label ml-2">· Course</span>}
              </span>
              <span className="label order-2 text-right md:order-none">
                {verify ? (
                  <a href={verify} target="_blank" rel="noopener noreferrer" className="border-b border-current">
                    Verify ↗
                  </a>
                ) : a.credentialId ? (
                  <span className="text-muted" title={`Credential ID ${a.credentialId}`}>
                    ID ✓
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
      {initial && !expanded && org === 'all' && !query && results.length > initial && (
        <div className="border-t border-line pt-6">
          <button type="button" onClick={() => setExpanded(true)} className="label border-b border-current pb-1 hover:text-signal">
            Show all {results.length} ↓
          </button>
        </div>
      )}
    </div>
  );
}
