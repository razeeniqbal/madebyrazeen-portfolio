'use client';

import { useMemo, useState } from 'react';
import type { Achievement } from '@/content/achievements';
import { cn } from '@/lib/utils';
import { credentialVerifyUrl } from '@/lib/credentials';

const monthIndex = (d: string) => {
  const t = Date.parse(`1 ${d}`);
  return Number.isNaN(t) ? 0 : t;
};

/** Issuer shown in the filter: sub-brands fold into their parent so the list stays short. */
const issuerGroup = (org: string) => (/^IBM/i.test(org) ? 'IBM' : org);

type Kind = 'all' | Achievement['category'];
const KIND_LABEL: Record<string, string> = { all: 'All', certification: 'Certifications', course: 'Courses', award: 'Awards', achievement: 'Achievements' };

/**
 * Every certification and course, filterable. Clean by design: one row of type tabs, one issuer
 * dropdown (issuers grouped, largest first), and search, instead of a chip per issuer.
 */
export function CredentialList({ items, initial }: { items: Achievement[]; initial?: number }) {
  const kinds = useMemo(() => {
    const m = new Map<Kind, number>([['all', items.length]]);
    items.forEach((a) => m.set(a.category, (m.get(a.category) ?? 0) + 1));
    return [...m.entries()];
  }, [items]);

  const issuers = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((a) => m.set(issuerGroup(a.organization), (m.get(issuerGroup(a.organization)) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [items]);

  const [kind, setKind] = useState<Kind>('all');
  const [org, setOrg] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter(
        (a) =>
          (kind === 'all' || a.category === kind) &&
          (org === 'all' || issuerGroup(a.organization) === org) &&
          (!q || `${a.title} ${a.organization} ${a.description}`.toLowerCase().includes(q)),
      )
      // Featured credentials lead (several have no issue date), then newest first.
      .sort((a, b) => Number(b.featured) - Number(a.featured) || monthIndex(b.issuedDate) - monthIndex(a.issuedDate));
  }, [items, kind, org, query]);

  const filtered = kind !== 'all' || org !== 'all' || Boolean(query);

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-x-6 gap-y-2">
          {kinds.map(([k, count]) => {
            const active = kind === k;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={active}
                onClick={() => setKind(k)}
                className={cn(
                  'label flex items-center gap-2 border-b-2 pb-1.5 transition-colors',
                  active ? 'border-lime text-ink' : 'border-transparent text-muted hover:text-ink',
                )}
              >
                {KIND_LABEL[k] ?? k}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex items-center gap-3 border-b border-ink pb-1">
            <span className="label text-muted">Issuer</span>
            <select
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="min-w-0 cursor-pointer bg-transparent py-1 pr-1 outline-none [&>option]:bg-surface [&>option]:text-ink"
            >
              <option value="all">All issuers</option>
              {issuers.map(([name, count]) => (
                <option key={name} value={name}>
                  {name} ({count})
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-3 border-b border-ink pb-1 sm:w-64">
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
      </div>

      <p className="label mt-4 text-muted" role="status" aria-live="polite">
        {results.length} of {items.length}
      </p>

      <ol className="mt-2">
        {(initial && !expanded && !filtered ? results.slice(0, initial) : results).map((a) => {
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
      {initial && !expanded && !filtered && results.length > initial && (
        <div className="border-t border-line pt-6">
          <button type="button" onClick={() => setExpanded(true)} className="label border-b border-current pb-1 hover:text-signal">
            Show all {results.length} ↓
          </button>
        </div>
      )}
    </div>
  );
}
