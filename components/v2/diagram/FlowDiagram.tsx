import { Fragment } from 'react';
import { cn } from '@/lib/utils';

export type NodeType = 'SOURCE' | 'PROCESS' | 'DATABASE' | 'API' | 'MODEL' | 'AGENT' | 'USER' | 'OUTPUT' | 'MONITOR';

export interface FlowNode {
  type: NodeType;
  title: string;
  detail: string;
  /** Highlighted node (PRD §14 "ACTIVE"). Marked by a filled dot and a heavier border, not colour alone. */
  active?: boolean;
}

/**
 * Linear architecture flow in the shared diagram language (PRD §14).
 * Horizontal on desktop, vertical on mobile. Semantic <ol>, so it reads as steps without the visuals.
 */
export function FlowDiagram({ nodes, label }: { nodes: FlowNode[]; label: string }) {
  return (
    <ol data-reveal aria-label={label} className="flex flex-col lg:flex-row lg:items-stretch">
      {nodes.map((n, i) => (
        <Fragment key={n.title}>
          {i > 0 && (
            <li aria-hidden="true" className="flex items-center justify-center py-1 lg:px-1 lg:py-0">
              <span className="h-6 w-px bg-ink/40 lg:h-px lg:w-6" />
              <span className="label -ml-1 text-ink/60 lg:-ml-1.5">
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </span>
            </li>
          )}
          <li
            style={{ ['--i' as string]: i }}
            className={cn(
              'flow-node flex-1 border bg-surface p-4',
              n.active ? 'border-ink border-2' : 'border-line',
            )}
          >
            <p className="label flex items-center gap-2 text-muted">
              <span
                aria-hidden="true"
                className={cn('h-2 w-2 rounded-full', n.active ? 'bg-lime ring-1 ring-ink' : 'border border-muted')}
              />
              {n.type}
            </p>
            <p className="mt-3 font-semibold leading-tight">{n.title}</p>
            <p className="mt-2 text-sm text-muted">{n.detail}</p>
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
