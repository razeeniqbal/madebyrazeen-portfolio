'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProjectRow } from './ProjectRow';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { projectCategories, type Project, type ProjectCategory } from '@/content/projects';
import { cn } from '@/lib/utils';

type Filter = ProjectCategory | 'all';

/** Filterable editorial index of every project. Category is mirrored to ?category= for shareable links. */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  // Read the initial filter from the URL after mount (keeps the page statically rendered).
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('category') as Filter | null;
    if (c && projectCategories.some((p) => p.value === c)) setCategory(c);
  }, []);

  const choose = (c: Filter) => {
    setCategory(c);
    const url = new URL(window.location.href);
    if (c === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', c);
    window.history.replaceState(null, '', url);
  };

  const counts = useMemo(() => {
    const m = new Map<Filter, number>([['all', projects.length]]);
    projects.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return m;
  }, [projects]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!q || [p.title, p.summary, ...p.stack, ...p.tags].some((s) => s.toLowerCase().includes(q))),
    );
  }, [projects, category, query]);

  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...projectCategories.filter((c) => counts.has(c.value)),
  ];

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = category === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => choose(f.value)}
                className={cn(
                  'label flex items-center gap-2 border px-3 py-2 transition-colors',
                  active ? 'border-ink bg-ink text-surface' : 'border-line hover:border-ink',
                )}
              >
                {f.label}
                <span className={active ? 'opacity-70' : 'text-muted'}>{counts.get(f.value) ?? 0}</span>
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
            placeholder="Python, NLP, dashboard…"
            className="w-full bg-transparent py-1 outline-none placeholder:text-muted/70"
          />
        </label>
      </div>

      <p className="label mt-4 text-muted" role="status" aria-live="polite">
        {results.length} of {projects.length} projects
      </p>

      {results.length > 0 ? (
        <ol className="mt-2">
          {results.map((p) => (
            <ProjectRow key={p.slug} project={p} />
          ))}
        </ol>
      ) : (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <MiniRazeen pose="thinking" height={120} />
          <p className="label text-muted">// No results</p>
          <p className="text-xl font-semibold">Nothing matches that. Yet.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              choose('all');
            }}
            className="label border-b border-current pb-1"
          >
            Clear filters →
          </button>
        </div>
      )}
    </div>
  );
}
