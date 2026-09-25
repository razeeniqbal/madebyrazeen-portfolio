interface RouteMapProps {
  /** Normalised 0..1 points (see content/running.ts). */
  route: [number, number][];
  distanceKm: number;
  label: string;
}

const W = 600;
const H = 480;
const PAD = 36;

/**
 * PRD §29 route visualisation: dark, restrained, lime route, clear start/finish,
 * selected kilometre milestones. The path draws itself once (see .route-draw in globals.css).
 */
export function RouteMap({ route, distanceKm, label }: RouteMapProps) {
  const pts = route.map(([x, y]) => [PAD + x * (W - PAD * 2), PAD + y * (H - PAD * 2)] as const);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  // Cumulative length along the path so milestones can be placed per km.
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = cum[cum.length - 1] || 1;
  const every = distanceKm > 15 ? 5 : 2;
  const milestones: { km: number; x: number; y: number }[] = [];
  // Skip a milestone that would sit on top of the finish marker.
  for (let km = every; km < distanceKm * 0.95; km += every) {
    const target = (km / distanceKm) * total;
    const i = cum.findIndex((c) => c >= target);
    if (i > 0) milestones.push({ km, x: pts[i][0], y: pts[i][1] });
  }
  const [start, finish] = [pts[0], pts[pts.length - 1]];
  const isLoop = Math.hypot(start[0] - finish[0], start[1] - finish[1]) < 24;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full bg-raised">
      {/* Restrained grid instead of map tiles */}
      <defs>
        <pattern id="route-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgb(var(--fg) / 0.06)" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#route-grid)" />

      <path d={d} fill="none" stroke="rgb(var(--fg) / 0.12)" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
      <path
        d={d}
        pathLength={1}
        className="route-draw"
        fill="none"
        stroke="rgb(var(--lime))"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {milestones.map((m) => (
        <g key={m.km}>
          <circle cx={m.x} cy={m.y} r="4" fill="rgb(var(--bg))" stroke="rgb(var(--fg))" strokeWidth="1.5" />
          <text x={m.x + 9} y={m.y - 7} className="font-mono text-[11px]" fill="rgb(var(--fg) / 0.7)">
            {m.km} km
          </text>
        </g>
      ))}

      {/* Start: hollow ring. Finish: filled lime. Shapes differ, not just colour. */}
      <circle cx={start[0]} cy={start[1]} r="8" fill="rgb(var(--bg))" stroke="rgb(var(--fg))" strokeWidth="2" />
      <circle cx={finish[0]} cy={finish[1]} r="6" fill="rgb(var(--lime))" stroke="rgb(var(--bg))" strokeWidth="2" />
      <text x={start[0] + 14} y={start[1] + 4} fill="rgb(var(--fg))" className="font-mono text-[11px] uppercase tracking-widest">
        {isLoop ? 'Start / Finish' : 'Start'}
      </text>
      {!isLoop && (
        <text x={finish[0] + 12} y={finish[1] + 4} fill="rgb(var(--fg))" className="font-mono text-[11px] uppercase tracking-widest">
          Finish
        </text>
      )}
    </svg>
  );
}
