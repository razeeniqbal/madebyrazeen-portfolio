import { Fragment } from 'react';

/**
 * Career path as a trajectory: ○ Civil engineering ─── ○ Data ─── ○ AI ─── ● Systems.
 * The last node is the "progress point" (filled lime). Vertical on mobile.
 */
export function PathDiagram({ steps }: { steps: { label: string; year: string }[] }) {
  return (
    <ol aria-label="Career path" className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <Fragment key={s.label}>
            {i > 0 && (
              <li aria-hidden="true" className="ml-[5px] h-5 w-px bg-line md:ml-0 md:h-px md:w-auto md:flex-1 md:min-w-8" />
            )}
            <li className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={last ? 'h-3 w-3 rounded-full bg-lime' : 'h-3 w-3 rounded-full border border-muted'}
              />
              <span>
                <span className="label block text-muted">{s.year}</span>
                <span className="block font-semibold">{s.label}</span>
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
