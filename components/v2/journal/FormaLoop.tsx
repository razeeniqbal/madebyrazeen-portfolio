'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * FORMA's core loop, explorable: pick a step to see what happens there. The facts are the ones in the
 * FORMA article and case study (built-in example project).
 */
const loop = [
  { id: 'see', label: 'See', text: 'Open the source. Every sheet of a workbook is its own source, stored once in the project and shared by pipelines.' },
  { id: 'select', label: 'Select', text: 'Pick the part that matters: a column, a value, or a pattern buried in a messy field.' },
  { id: 'transform', label: 'Transform', text: 'Apply a step and compare before and after, side by side, before accepting it.' },
  { id: 'verify', label: 'Verify', text: 'Check the result against explicit rules. Rows that fail are held in a review queue, not loaded quietly.' },
  { id: 'run', label: 'Run', text: 'Run the whole pipeline. On the example project: 1,001 rows in, 985 ready, 16 held back for review.' },
  { id: 'export', label: 'Export', text: 'Leave with readable code: one pipeline.py, a full project, or an Airflow DAG or Prefect flow.' },
];

export function FormaLoop() {
  const [active, setActive] = useState(0);
  const step = loop[active];
  return (
    <div>
      <div role="tablist" aria-label="FORMA core loop" className="grid grid-cols-3 gap-px border border-line bg-line sm:grid-cols-6">
        {loop.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            className={cn('flex flex-col items-start gap-2 bg-surface p-3 text-left transition-colors', i === active ? 'bg-ink text-surface' : 'hover:bg-raised')}
          >
            <span className={cn('label', i === active ? 'text-surface/70' : 'text-muted')}>{String(i + 1).padStart(2, '0')}</span>
            <span className="font-semibold">{s.label}</span>
            <span aria-hidden="true" className={cn('h-1 w-full', i <= active ? 'bg-lime' : 'bg-line')} />
          </button>
        ))}
      </div>
      <div className="grid gap-4 border-x border-b border-line p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <p aria-live="polite">
          <span className="label mr-2 text-muted">{step.label}</span>
          {step.text}
        </p>
        <p className="label flex items-center gap-2 text-muted sm:justify-end">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-lime ring-1 ring-ink" />
          Engine and exported code checked cell for cell
        </p>
      </div>
    </div>
  );
}
