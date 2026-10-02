import { getCareerStages, shortCompany, yearSpan } from '@/content/experience';
import { cn } from '@/lib/utils';

interface CareerMapProps {
  /** full: stage, discipline, company, years, linked to each chapter. compact: the stages only (closing). */
  variant?: 'full' | 'compact';
  className?: string;
}

/**
 * SITE → MODEL → DATA → PIPELINES → AI SYSTEMS, from the primary roles' `stage` fields.
 * A row of five columns on wide screens, a vertical line on small ones. An ordered list, so the
 * sequence reads correctly without the arrows. The current stage carries a filled marker and a label.
 */
export function CareerMap({ variant = 'full', className }: CareerMapProps) {
  const stages = getCareerStages();
  const full = variant === 'full';

  return (
    <ol
      aria-label="Career map, oldest to current"
      className={cn('grid grid-cols-1 lg:grid-cols-5', full ? 'border-t border-line' : 'gap-y-3 lg:gap-y-0', className)}
    >
      {stages.map((r, i) => {
        const current = r.isCurrent;
        const years = yearSpan(r);
        const inner = (
          <>
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn('h-2.5 w-2.5 shrink-0 rounded-full', current ? 'bg-lime ring-1 ring-ink' : 'border border-muted')}
              />
              <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
              {i < stages.length - 1 && (
                <span aria-hidden="true" className="label ml-auto hidden text-muted lg:inline">
                  →
                </span>
              )}
            </span>
            <span className={cn('mt-3 block uppercase', full ? 'text-display-sm' : 'text-xl font-bold tracking-tight')}>{r.stage}</span>
            {full && (
              <>
                <span className="label mt-2 block text-ink">{r.discipline}</span>
                <span className="mt-3 block text-sm text-muted">{shortCompany(r.company)}</span>
                {years && <span className="label mt-1 block text-muted">{years}</span>}
              </>
            )}
            {current && <span className="label mt-2 block text-ink">{full ? 'Current' : 'Now'}</span>}
          </>
        );
        return (
          <li
            key={r.id}
            aria-current={current ? 'step' : undefined}
            className={cn(
              'relative lg:[&:first-child>a]:pl-0',
              full && 'border-b border-line lg:border-b-0 lg:border-r lg:last:border-r-0',
              !full && 'lg:pr-6',
            )}
          >
            {full ? (
              <a href={`#${r.id}`} className="group block h-full py-6 transition-colors hover:bg-ink/[0.03] lg:px-5">
                {inner}
              </a>
            ) : (
              <div className="py-1">{inner}</div>
            )}
            {/* Vertical connector between stages on small screens */}
            {i < stages.length - 1 && !full && (
              <span aria-hidden="true" className="label block pl-[3px] text-muted lg:hidden">
                ↓
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
