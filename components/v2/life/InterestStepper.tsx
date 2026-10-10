'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * An interest's story one step at a time: the rail shows how far along it is, the panel shows the
 * step. The last step (where the interest turned into a project) carries the lime.
 */
export function InterestStepper({ name, steps }: { name: string; steps: { label: string; text: string }[] }) {
  const [at, setAt] = useState(0);
  const s = steps[at];
  const last = at === steps.length - 1;
  return (
    <div className="mt-10">
      <div role="tablist" aria-label={`${name}, step by step`} className="flex gap-1.5">
        {steps.map((x, i) => (
          <button key={x.label} type="button" role="tab" aria-selected={i === at} onClick={() => setAt(i)} className="group flex-1 text-left">
            <span
              className={cn(
                'block h-1 transition-colors duration-500',
                i < at ? 'bg-ink/50' : i === at ? (i === steps.length - 1 ? 'bg-lime' : 'bg-ink') : 'bg-line group-hover:bg-ink/30',
              )}
            />
            <span className={cn('label mt-2 block transition-colors', i === at ? 'text-ink' : 'text-muted')}>
              {String(i + 1).padStart(2, '0')} {x.label}
            </span>
          </button>
        ))}
      </div>
      <p aria-live="polite" className={cn('mt-6 min-h-[5.5rem] max-w-prose text-lead', last ? 'text-ink' : 'text-muted')}>
        {s.text}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setAt(Math.max(0, at - 1))}
          disabled={at === 0}
          aria-label="Previous step"
          className="hit label border border-line px-3 py-2 hover:border-ink disabled:opacity-30"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setAt(Math.min(steps.length - 1, at + 1))}
          disabled={last}
          className="hit label border border-line px-3 py-2 hover:border-ink disabled:opacity-30"
        >
          {last ? 'End of the story' : `Next: ${steps[at + 1].label} →`}
        </button>
      </div>
    </div>
  );
}
