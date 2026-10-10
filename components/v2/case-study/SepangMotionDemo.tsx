'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

export interface SepangMotion {
  source: string;
  session: string;
  driver: number;
  raw: [number, number, number][];
  smoothed: [number, number, number][];
  sigmaSeconds: number;
  intervals: { bins: { from: number; to: number; n: number }[]; over: number; count: number; medianMs: number };
}

type Mode = 'raw' | 'smoothed';

/**
 * Twelve real seconds of one car's OpenF1 positions, played back two ways. Raw: the marker jumps from
 * sample to sample at the uneven times they arrived, which is the stutter. Smoothed: the same samples
 * smoothed over time. The histogram is the spacing of every sample in that half hour.
 */
export function SepangMotionDemo({ data }: { data: SepangMotion }) {
  const [mode, setMode] = useState<Mode>('raw');
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion();
  const frame = useRef(0);
  const duration = data.raw[data.raw.length - 1][0];

  useEffect(() => {
    if (!playing) return;
    const start = performance.now() - t * 1000;
    const tick = (now: number) => {
      const next = (now - start) / 1000;
      if (next >= duration) {
        setT(duration);
        setPlaying(false);
        return;
      }
      setT(next);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // t is the resume point only; re-running on every frame would restart the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, duration]);

  // Bounds in OpenF1 units, with a margin; y is flipped so north is up.
  const xs = data.raw.map((p) => p[1]);
  const ys = data.raw.map((p) => p[2]);
  const pad = 60;
  const minX = Math.min(...xs) - pad;
  const maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad;
  const maxY = Math.max(...ys) + pad;
  const W = maxX - minX;
  const H = maxY - minY;
  const px = (x: number) => x - minX;
  const py = (y: number) => maxY - y;

  // Marker: raw holds the last sample that has arrived; smoothed reads the 20 Hz path.
  const at = (() => {
    if (mode === 'raw') {
      let last = data.raw[0];
      for (const p of data.raw) if (p[0] <= t) last = p;
      return last;
    }
    return data.smoothed[Math.min(data.smoothed.length - 1, Math.round(t / 0.05))];
  })();

  const path = (pts: [number, number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'}${px(p[1]).toFixed(1)},${py(p[2]).toFixed(1)}`).join(' ');
  const maxBin = Math.max(...data.intervals.bins.map((b) => b.n));

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="border border-line lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-3">
          <div role="tablist" aria-label="Playback" className="flex gap-1">
            {(['raw', 'smoothed'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cn('label border px-3 py-2 transition-colors', mode === m ? 'border-ink bg-ink text-surface' : 'border-line text-muted hover:border-ink hover:text-ink')}
              >
                {m === 'raw' ? 'Raw samples' : 'Smoothed'}
              </button>
            ))}
          </div>
          {!reduced && (
            <button
              type="button"
              onClick={() => {
                if (!playing && t >= duration) setT(0);
                setPlaying((p) => !p);
              }}
              className="label border border-ink px-3 py-2 hover:bg-ink hover:text-surface"
            >
              {playing ? 'Pause' : 'Play 12 s ▸'}
            </button>
          )}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Car ${data.driver} through a corner: ${data.raw.length} raw OpenF1 samples over ${Math.round(duration)} seconds, ${mode === 'raw' ? 'shown as received' : 'smoothed over time'}.`} className="block h-auto w-full">
          <path d={path(data.raw)} fill="none" className={cn('stroke-current transition-opacity', mode === 'raw' ? 'opacity-60' : 'opacity-15')} strokeWidth={W / 400} strokeDasharray={mode === 'raw' ? undefined : `${W / 120} ${W / 120}`} />
          {mode === 'smoothed' && <path d={path(data.smoothed)} fill="none" className="stroke-current" strokeWidth={W / 220} />}
          {data.raw.map((p) => (
            <circle key={p[0]} cx={px(p[1])} cy={py(p[2])} r={W / 220} className={cn('fill-current', mode === 'raw' ? 'opacity-90' : 'opacity-25')} />
          ))}
          <circle cx={px(at[1])} cy={py(at[2])} r={W / 70} className="fill-lime stroke-current" strokeWidth={W / 400} />
        </svg>
        <div className="flex items-center gap-3 border-t border-line p-3">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.05}
            value={t}
            onChange={(e) => {
              setPlaying(false);
              setT(Number(e.target.value));
            }}
            aria-label="Time in the clip"
            className="w-full accent-lime"
          />
          <span className="label w-14 shrink-0 text-right text-muted">{t.toFixed(1)} s</span>
        </div>
      </div>

      <div className="lg:col-span-4">
        <p className="label text-muted">Gap between samples · {data.intervals.count.toLocaleString('en')} samples</p>
        <div className="mt-3 flex h-32 items-end gap-1 border-b border-line">
          {data.intervals.bins.map((b) => (
            <span key={b.from} title={`${b.from} to ${b.to} ms: ${b.n}`} className="tl-rise block flex-1 bg-ink/30" style={{ height: `${(b.n / maxBin) * 100}%` }} />
          ))}
        </div>
        <div className="label mt-1 flex justify-between text-muted">
          <span>0 ms</span>
          <span>500 ms</span>
        </div>
        <p className="mt-4 text-sm text-muted">
          Median gap {Math.round(data.intervals.medianMs)} ms, about four samples a second, and {data.intervals.over} gaps longer than half a second. Played as received, the car stutters.
        </p>
        <p className="label mt-4 text-muted">
          Car {data.driver} · {data.session} · OpenF1 · smoothing here is a {data.sigmaSeconds} s time window for illustration; the app fits motion along the track
        </p>
      </div>
    </div>
  );
}
