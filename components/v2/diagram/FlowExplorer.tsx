'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { FlowNode } from './FlowDiagram';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

/**
 * An architecture flow you can walk through: pick a node to read what it does, or press Play to watch
 * the path light up from source to output. Play stops on interaction and is not offered to visitors who
 * prefer reduced motion. Same nodes and wording as the static diagram, so nothing is invented.
 */
export function FlowExplorer({ nodes, label }: { nodes: FlowNode[]; label: string }) {
  const start = Math.max(0, nodes.findIndex((n) => n.active));
  const [active, setActive] = useState(start);
  const [playing, setPlaying] = useState(false);
  const canPlay = !usePrefersReducedMotion();

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setActive((a) => {
        if (a >= nodes.length - 1) {
          setPlaying(false);
          return a;
        }
        return a + 1;
      });
    }, 1100);
    return () => clearInterval(t);
  }, [playing, nodes.length]);

  const pick = (i: number) => {
    setPlaying(false);
    setActive(i);
  };
  const node = nodes[active];

  return (
    <div>
      <ol aria-label={label} className="flex flex-col gap-1 lg:flex-row lg:items-stretch lg:gap-0">
        {nodes.map((n, i) => {
          const on = i === active;
          const passed = i < active;
          return (
            <li key={n.title} className="flex flex-col lg:flex-1 lg:flex-row lg:items-center">
              {i > 0 && (
                <span aria-hidden="true" className="ml-5 h-3 w-px lg:ml-0 lg:h-px lg:w-4">
                  <span className={cn('block h-full w-full transition-colors duration-500', passed || on ? 'bg-lime' : 'bg-line')} />
                </span>
              )}
              <button
                type="button"
                onClick={() => pick(i)}
                aria-pressed={on}
                className={cn(
                  'flex w-full flex-1 items-center gap-3 border p-3 text-left transition-colors lg:flex-col lg:items-start lg:gap-2',
                  on ? 'border-ink bg-ink text-surface' : passed ? 'border-ink/50' : 'border-line hover:border-ink',
                )}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', on || passed ? 'bg-lime' : 'border border-muted')} />
                  <span className={cn('label', on ? 'text-surface/70' : 'text-muted')}>{n.type}</span>
                </span>
                <span className="font-semibold leading-tight">{n.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4 border border-line p-4">
        <p aria-live="polite" className="max-w-prose">
          <span className="label mr-2 text-muted">
            {String(active + 1).padStart(2, '0')} / {node.type}
          </span>
          {node.detail || node.title}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => pick(Math.max(0, active - 1))} disabled={active === 0} aria-label="Previous step" className="hit label border border-line px-3 py-2 hover:border-ink disabled:opacity-30">
            ←
          </button>
          <button type="button" onClick={() => pick(Math.min(nodes.length - 1, active + 1))} disabled={active === nodes.length - 1} aria-label="Next step" className="hit label border border-line px-3 py-2 hover:border-ink disabled:opacity-30">
            →
          </button>
          {canPlay && (
            <button
              type="button"
              onClick={() => {
                if (!playing && active >= nodes.length - 1) setActive(0);
                setPlaying((p) => !p);
              }}
              className="hit label border border-ink px-3 py-2 hover:bg-ink hover:text-surface"
            >
              {playing ? 'Pause' : 'Play ▸'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
