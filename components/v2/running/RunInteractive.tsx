'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// Local copies of the two formatters, so the client bundle does not pull in the run data.
const duration = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return `${h ? `${h}:` : ''}${h ? String(m).padStart(2, '0') : m}:${String(s).padStart(2, '0')}`;
};
const pace = (secPerKm: number) => {
  let m = Math.floor(secPerKm / 60);
  let s = Math.round(secPerKm % 60);
  if (s === 60) {
    m += 1;
    s = 0;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
};
const monthName = (ym: string, long = false) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: long ? 'long' : 'short', year: long ? 'numeric' : undefined, timeZone: 'UTC' });

/** Distance per month; point at, focus or tap a month to read it. The peak month carries the lime. */
export function MonthlyChartInteractive({ months }: { months: { month: string; km: number; runs: number }[] }) {
  const peak = months.reduce((p, m) => (m.km > p.km ? m : p), months[0]);
  const [active, setActive] = useState(months.indexOf(peak));
  const max = Math.max(...months.map((m) => m.km), 1);
  const m = months[active];

  return (
    <figure>
      <div className="flex h-56 items-end gap-1.5 border-b border-line sm:gap-3" role="group" aria-label="Distance per month">
        {months.map((x, i) => {
          const on = i === active;
          return (
            <button
              key={x.month}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={on}
              aria-label={`${monthName(x.month, true)}: ${x.km.toFixed(1)} km, ${x.runs} runs`}
              className="group flex h-full flex-1 flex-col justify-end"
            >
              <span className={cn('label mb-1 text-center transition-opacity', on ? 'text-ink' : 'text-muted opacity-0 group-hover:opacity-100 sm:opacity-100')}>
                {x.km > 0 ? x.km.toFixed(0) : ''}
              </span>
              <span
                style={{ height: `${(x.km / max) * 85}%` }}
                className={cn('tl-rise block min-h-px transition-colors', x === peak ? 'bg-lime' : on ? 'bg-ink' : 'bg-ink/40 group-hover:bg-ink/70')}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-3" aria-hidden="true">
        {months.map((x, i) => (
          <span key={x.month} className={cn('label flex-1 text-center', i === active ? 'text-ink' : 'text-muted', i % 2 === 1 && 'max-sm:invisible')}>
            {monthName(x.month)}
          </span>
        ))}
      </div>
      <figcaption aria-live="polite" className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-line pt-4">
        <span className="font-semibold">{monthName(m.month, true)}</span>
        <span>
          <span className="tabular-nums">{m.km.toFixed(1)}</span> <span className="text-muted">km</span>
        </span>
        <span>
          <span className="tabular-nums">{m.runs}</span> <span className="text-muted">runs</span>
        </span>
        {m.runs > 0 && (
          <span>
            <span className="tabular-nums">{(m.km / m.runs).toFixed(1)}</span> <span className="text-muted">km per run</span>
          </span>
        )}
        {m === peak && <span className="label text-ink">Best month</span>}
      </figcaption>
    </figure>
  );
}

/**
 * Pick a distance and a goal time: the pace it needs, beside the pace of the personal best at that
 * distance (when there is one), and how far apart they are per kilometre.
 */
export function PaceCalculator({ bests }: { bests: { key: string; label: string; km: number; sec?: number }[] }) {
  const [key, setKey] = useState(bests.find((b) => b.sec)?.key ?? bests[0].key);
  const b = bests.find((x) => x.key === key)!;
  const start = b.sec ? Math.max(60, Math.round((b.sec * 0.97) / 30) * 30) : Math.round(b.km * 360);
  const [goal, setGoal] = useState<Record<string, number>>({});
  const target = goal[key] ?? start;
  const targetPace = target / b.km;
  const pbPace = b.sec ? b.sec / b.km : undefined;
  const delta = pbPace ? pbPace - targetPace : undefined;
  const min = Math.round(b.km * 180);
  const maxT = Math.round(b.km * 540);

  return (
    <div className="border border-line p-4 md:p-6">
      <p className="label text-muted">Pace calculator</p>
      <div role="tablist" aria-label="Distance" className="mt-3 flex flex-wrap gap-1">
        {bests.map((x) => (
          <button
            key={x.key}
            type="button"
            role="tab"
            aria-selected={x.key === key}
            onClick={() => setKey(x.key)}
            className={cn('label border px-3 py-2 transition-colors', x.key === key ? 'border-ink bg-ink text-surface' : 'border-line text-muted hover:border-ink hover:text-ink')}
          >
            {x.label}
          </button>
        ))}
      </div>
      <label className="mt-6 block">
        <span className="label flex justify-between text-muted">
          <span>Goal time</span>
          <span className="text-ink">{duration(target)}</span>
        </span>
        <input
          type="range"
          min={min}
          max={maxT}
          step={b.km > 20 ? 60 : 10}
          value={target}
          onChange={(e) => setGoal((g) => ({ ...g, [key]: Number(e.target.value) }))}
          className="mt-2 w-full accent-lime"
        />
      </label>
      <dl className="mt-6 grid grid-cols-2 gap-6">
        <div className="border-t-2 border-lime pt-3">
          <dt className="label text-muted">Pace needed</dt>
          <dd className="mt-2 text-3xl font-extrabold tabular-nums">
            {pace(targetPace)} <span className="text-base font-normal text-muted">/km</span>
          </dd>
        </div>
        <div className="border-t-2 border-ink pt-3">
          <dt className="label text-muted">Personal best pace</dt>
          <dd className="mt-2 text-3xl font-extrabold tabular-nums">
            {pbPace ? (
              <>
                {pace(pbPace)} <span className="text-base font-normal text-muted">/km</span>
              </>
            ) : (
              <span className="text-base font-normal text-muted">Not run yet</span>
            )}
          </dd>
        </div>
      </dl>
      {delta !== undefined && (
        <p aria-live="polite" className="mt-4 text-sm text-muted">
          {Math.abs(delta) < 1
            ? 'That is personal best pace.'
            : delta > 0
              ? `${Math.round(delta)} s per km faster than the personal best (${duration(b.sec!)}).`
              : `${Math.round(-delta)} s per km slower than the personal best (${duration(b.sec!)}).`}
        </p>
      )}
    </div>
  );
}
