import { Wordmark } from '@/components/v2/identity/Wordmark';

const steps = ['Input', 'Process', 'Iterate', 'Progress', 'Ready'];

/**
 * PRD §34 loading sequence. Pure CSS: nodes activate in turn over ~1.1s.
 * It renders only while a route is actually loading and never delays a loaded page.
 * Reduced motion: every node shows at once, with a static caption.
 */
export function LoadingSequence() {
  return (
    <div role="status" aria-live="polite" className="page-container flex min-h-[70svh] flex-col items-start justify-center gap-10">
      <Wordmark withUmbrella className="text-4xl" />
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2" aria-hidden="true">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            {i > 0 && <span className="seq-line h-px w-6 bg-line md:w-10" style={{ ['--i' as string]: i }} />}
            <span className="label flex items-center gap-2">
              <span className="seq-node h-2 w-2 rounded-full border border-muted" style={{ ['--i' as string]: i }} />
              {s}
            </span>
          </li>
        ))}
      </ol>
      <span className="sr-only">Loading</span>
    </div>
  );
}
