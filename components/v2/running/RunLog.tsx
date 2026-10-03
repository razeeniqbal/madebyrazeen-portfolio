import { RouteThumb } from './RunCharts';
import { formatDate, formatDuration, formatPace, type Run } from '@/content/running';

const VISIBLE = 12;

// Phone: date across the top, then the route shape beside title/distance and time/pace.
function Row({ r }: { r: Run }) {
  return (
    <li className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-4 gap-y-1 border-t border-line py-3 md:grid-cols-[2.25rem_7rem_1fr_5.5rem_6rem_6rem_3rem]">
      <RouteThumb route={r.route} className="row-span-2 row-start-2 text-muted md:row-span-1 md:row-start-auto" />
      <p className="label order-first col-span-3 text-muted md:order-none md:col-span-1">{formatDate(r.date)}</p>
      <p className="min-w-0 font-semibold leading-snug [overflow-wrap:anywhere]">
        {r.title}
        {r.race && <span className="label ml-2 bg-lime px-1.5 py-0.5 align-middle text-carbon">Race</span>}
      </p>
      <p className="text-right tabular-nums md:text-left">
        {r.distanceKm.toFixed(2)} <span className="text-muted">km</span>
      </p>
      <p className="col-start-2 text-sm tabular-nums text-muted md:col-start-auto md:text-base md:text-ink">{formatDuration(r.durationSec)}</p>
      <p className="whitespace-nowrap text-right text-sm tabular-nums text-muted md:text-left md:text-base md:text-ink">
        {formatPace(r)} <span className="text-muted">/km</span>
      </p>
      <p className="hidden text-right tabular-nums text-muted md:block">{r.avgHr ? `${r.avgHr}` : '·'}</p>
    </li>
  );
}

/** Every outdoor run, newest first. The first dozen are visible; the rest sit behind a native disclosure. */
export function RunLog({ runs }: { runs: Run[] }) {
  const [first, rest] = [runs.slice(0, VISIBLE), runs.slice(VISIBLE)];
  return (
    <div>
      <div
        aria-hidden="true"
        className="label hidden grid-cols-[2.25rem_7rem_1fr_5.5rem_6rem_6rem_3rem] gap-x-4 pb-2 text-muted md:grid"
      >
        <span />
        <span>Date</span>
        <span>Run</span>
        <span>Distance</span>
        <span>Moving time</span>
        <span>Pace</span>
        <span className="text-right">HR</span>
      </div>
      <ol>
        {first.map((r) => (
          <Row key={r.id} r={r} />
        ))}
      </ol>
      {rest.length > 0 && (
        <details className="group border-t border-line">
          <summary className="label flex cursor-pointer list-none items-center gap-2 py-4 hover:text-ink [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Show all {runs.length} runs ↓</span>
            <span className="hidden group-open:inline">Show fewer ↑</span>
          </summary>
          <ol>
            {rest.map((r) => (
              <Row key={r.id} r={r} />
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
