import { cn } from '@/lib/utils';

const monthLabel = (ym: string) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });

/** Monthly distance as quiet bars; the strongest month gets the lime accent. Server-rendered SVG. */
export function MonthlyChart({ months }: { months: { month: string; km: number; runs: number }[] }) {
  const W = 720;
  const H = 220;
  const PAD_B = 28;
  const PAD_T = 22;
  const max = Math.max(...months.map((m) => m.km), 1);
  const slot = W / months.length;
  const bar = Math.min(44, slot * 0.62);
  const peak = months.reduce((p, m) => (m.km > p.km ? m : p), months[0]);

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Distance per month. Highest: ${peak.km.toFixed(0)} km in ${monthLabel(peak.month)}.`} className="h-auto w-full">
        <line x1="0" x2={W} y1={H - PAD_B} y2={H - PAD_B} stroke="currentColor" strokeOpacity="0.25" />
        {months.map((m, i) => {
          const h = (m.km / max) * (H - PAD_B - PAD_T);
          const x = i * slot + (slot - bar) / 2;
          const y = H - PAD_B - h;
          const isPeak = m === peak;
          return (
            <g key={m.month}>
              <rect x={x} y={y} width={bar} height={Math.max(h, m.km ? 1 : 0)} className={isPeak ? 'fill-lime' : 'fill-current opacity-80'} />
              {m.km > 0 && (
                <text x={x + bar / 2} y={y - 6} textAnchor="middle" className="fill-current font-mono text-[11px] opacity-70">
                  {m.km.toFixed(0)}
                </text>
              )}
              <text x={x + bar / 2} y={H - 8} textAnchor="middle" className="fill-current font-mono text-[11px] uppercase opacity-60">
                {monthLabel(m.month)}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>Distance per month</caption>
        <tbody>
          {months.map((m) => (
            <tr key={m.month}>
              <th scope="row">{m.month}</th>
              <td>
                {m.km.toFixed(1)} km, {m.runs} runs
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

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
