import { Fragment } from 'react';
import { cn } from '@/lib/utils';

interface TrajectoryProps {
  steps: readonly string[];
  /** Index of the active node; defaults to the last (the "progress point"). */
  active?: number;
  className?: string;
  /** Activate nodes in sequence once on load. */
  animate?: boolean;
}

/**
 * The brand's primary motion metaphor as static markup: ○ ─── ○ ─── ●
 * Nodes are shapes (hollow vs filled), not colour alone.
 */
export function Trajectory({ steps, active = steps.length - 1, className, animate }: TrajectoryProps) {
  return (
    <ol className={cn('flex flex-wrap items-center gap-x-3 gap-y-2', animate && 'trajectory-animate', className)}>
      {steps.map((step, i) => (
        <Fragment key={step}>
          {i > 0 && <li aria-hidden="true" data-node style={{ ['--i' as string]: i }} className="h-px w-6 bg-line md:w-10" />}
          <li
            data-node
            style={{ ['--i' as string]: i }}
            className="label flex items-center gap-2"
            aria-current={i === active ? 'step' : undefined}
          >
            <span
              aria-hidden="true"
              className={cn('h-2 w-2 rounded-full', i === active ? 'bg-lime' : 'border border-muted')}
            />
            {step}
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
