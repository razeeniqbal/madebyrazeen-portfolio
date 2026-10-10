'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface JumpItem {
  group: 'Pages' | 'Projects' | 'Journal';
  label: string;
  hint?: string;
  href: string;
}

/** Open the quick-jump menu from anywhere (e.g. the header button). */
export const openCommandMenu = () => window.dispatchEvent(new Event('open-command-menu'));

/**
 * Quick jump: Ctrl/⌘ + K (or the header button) opens a filterable list of every page, project and
 * journal entry. Arrow keys move, Enter opens, Escape closes. A native <dialog>, so focus is trapped
 * and returned without extra code.
 */
export function CommandMenu({ items }: { items: JumpItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => `${i.label} ${i.hint ?? ''} ${i.group}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  useEffect(() => {
    const open = () => {
      setQuery('');
      setActive(0);
      dialog.current?.showModal();
      requestAnimationFrame(() => input.current?.focus());
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-menu', open);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-menu', open);
    };
  }, []);

  const go = (href: string) => {
    dialog.current?.close();
    router.push(href);
  };

  const groups = (['Pages', 'Projects', 'Journal'] as const).map((g) => ({ g, list: results.filter((r) => r.group === g) })).filter((x) => x.list.length > 0);

  return (
    <dialog
      ref={dialog}
      aria-label="Quick jump"
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="m-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] border border-line bg-surface p-0 text-ink backdrop:bg-carbon/60 backdrop:backdrop-blur-[2px]"
      data-surface="dark"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span aria-hidden="true" className="label shrink-0 whitespace-nowrap text-muted">
          Go to
        </span>
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(results.length - 1, a + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === 'Enter' && results[active]) {
              e.preventDefault();
              go(results[active].href);
            }
          }}
          placeholder="Page, project or article"
          aria-label="Search pages, projects and articles"
          aria-controls="quick-jump-list"
          aria-activedescendant={results[active] ? `jump-${active}` : undefined}
          className="w-full bg-transparent py-4 outline-none placeholder:text-muted/70"
        />
        <kbd className="label shrink-0 border border-line px-1.5 py-0.5 text-muted">Esc</kbd>
      </div>
      <div id="quick-jump-list" role="listbox" className="max-h-[55vh] overflow-y-auto py-2">
        {groups.map(({ g, list }) => (
          <div key={g} role="group" aria-label={g}>
            <p className="label px-4 pb-1 pt-3 text-muted">{g}</p>
            {list.map((item) => {
              const i = results.indexOf(item);
              return (
                <button
                  key={item.href}
                  id={`jump-${i}`}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(item.href)}
                  className={cn('flex w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left', i === active && 'bg-ink/10')}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    {i === active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />}
                    {item.label}
                  </span>
                  {item.hint && <span className="label truncate text-muted">{item.hint}</span>}
                </button>
              );
            })}
          </div>
        ))}
        {results.length === 0 && <p className="px-4 py-6 text-muted">Nothing matches “{query}”.</p>}
      </div>
      <p className="label flex gap-4 border-t border-line px-4 py-2 text-muted" aria-hidden="true">
        <span>↑ ↓ move</span>
        <span>Enter open</span>
        <span className="ml-auto">Ctrl / ⌘ K</span>
      </p>
    </dialog>
  );
}
