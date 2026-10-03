import { Fragment } from 'react';
import { cn } from '@/lib/utils';

export type NodeType = 'SOURCE' | 'PROCESS' | 'DATABASE' | 'API' | 'MODEL' | 'AGENT' | 'USER' | 'OUTPUT' | 'MONITOR';

export interface FlowNode {
  type: NodeType;
  title: string;
  /** Optional second line. */
  detail?: string;
  /** Highlighted node (PRD §14 "ACTIVE"). Marked by a filled dot and a heavier border, not colour alone. */
  active?: boolean;
}

// Literal class sets per breakpoint, so Tailwind can see them.
const layout = {
  lg: {
    list: 'lg:flex-row lg:items-stretch',
    link: 'lg:px-1 lg:py-0',
    line: 'lg:h-px lg:w-6',
    glyph: 'lg:-ml-1.5',
    down: 'lg:hidden',
    right: 'hidden lg:inline',
  },
  xl: {
    list: 'xl:flex-row xl:items-stretch',
    link: 'xl:px-1 xl:py-0',
    line: 'xl:h-px xl:w-6',
    glyph: 'xl:-ml-1.5',
    down: 'xl:hidden',
    right: 'hidden xl:inline',
  },
};

interface FlowDiagramProps {
  nodes: FlowNode[];
  label: string;
  /** Width at which the flow turns horizontal. Long flows use xl so nodes keep a readable width. */
  horizontalFrom?: 'lg' | 'xl';
}

/**
 * Linear architecture flow in the shared diagram language (PRD §14).
 * Vertical on small screens, horizontal from `horizontalFrom`. Semantic <ol> with numbered steps, so it
 * reads as an ordered sequence without the arrows.
 */
export function FlowDiagram({ nodes, label, horizontalFrom = 'lg' }: FlowDiagramProps) {
  const l = layout[horizontalFrom];
  return (
    <ol data-reveal aria-label={label} className={cn('flex flex-col', l.list)}>
      {nodes.map((n, i) => (
        <Fragment key={n.title}>
          {i > 0 && (
            <li aria-hidden="true" className={cn('flex items-center justify-center py-1', l.link)}>
              <span className={cn('h-6 w-px bg-ink/40', l.line)} />
              <span className={cn('label -ml-1 text-ink/60', l.glyph)}>
                <span className={l.down}>↓</span>
                <span className={l.right}>→</span>
              </span>
            </li>
          )}
          <li
            style={{ ['--i' as string]: i }}
            className={cn('flow-node flex-1 border bg-surface p-4', n.active ? 'border-2 border-ink' : 'border-line')}
          >
            <p className="label flex items-center gap-2 text-muted">
              <span
                aria-hidden="true"
                className={cn('h-2 w-2 rounded-full', n.active ? 'bg-lime ring-1 ring-ink' : 'border border-muted')}
              />
              <span className="sr-only">Step {i + 1}: </span>
              {n.type}
            </p>
            <p className="mt-3 font-semibold leading-tight">{n.title}</p>
            {n.detail && <p className="mt-2 text-sm text-muted">{n.detail}</p>}
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
