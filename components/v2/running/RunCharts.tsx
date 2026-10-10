import { cn } from '@/lib/utils';

/** One cell per week: outline = no run, grey = 1, ink = 2, lime = 3+. Consistency at a glance. */
export function WeekStrip({ weeks }: { weeks: { weekStart: string; runs: number; km: number }[] }) {
  const tone = (n: number) =>
    n === 0 ? 'border border-current opacity-25' : n === 1 ? 'bg-current opacity-40' : n === 2 ? 'bg-current' : 'bg-lime';
  return (
    <div>
      <ol className="flex flex-wrap gap-1" aria-label="Runs per week">
        {weeks.map((w) => (
          <li
            key={w.weekStart}
            title={`Week of ${w.weekStart}: ${w.runs} run${w.runs === 1 ? '' : 's'}, ${w.km.toFixed(1)} km`}
            className={cn('h-4 w-4', tone(w.runs))}
          >
            <span className="sr-only">
              Week of {w.weekStart}: {w.runs} runs
            </span>
          </li>
        ))}
      </ol>
      <p className="label mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted" aria-hidden="true">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 border border-current opacity-40" /> none
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-current opacity-40" /> 1
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-current" /> 2
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-lime" /> 3+ runs
        </span>
      </p>
    </div>
  );
}

/** Tiny route silhouette for the run log (already privacy-trimmed and normalised). */
export function RouteThumb({ route, className }: { route?: [number, number][]; className?: string }) {
  if (!route || route.length < 2) return <span aria-hidden="true" className={cn('inline-block h-9 w-9', className)} />;
  const step = Math.max(1, Math.floor(route.length / 40));
  const pts = route.filter((_, i) => i % step === 0);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(2 + x * 32).toFixed(1)},${(2 + y * 32).toFixed(1)}`).join(' ');
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className={cn('h-9 w-9', className)}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
