/**
 * Running data layer. UI components depend only on the `Run` shape and the
 * getters below, so the source can change without touching the page.
 *
 * Source order:
 *   1. content/running/runs.json: written by scripts/garmin/export_runs.py (real data)
 *   2. SAMPLE_RUNS below: used only while runs.json is empty, and every
 *      surface labels it "Sample data" (PRD §58).
 */
import exported from './running/runs.json';
import meta from './running/meta.json';

export interface Split {
  km: number; // split distance in km (last split may be partial)
  durationSec: number;
}

export interface Run {
  id: string;
  date: string; // ISO date
  title: string;
  distanceKm: number;
  durationSec: number;
  avgHr?: number;
  maxHr?: number;
  elevationGainM?: number;
  cadenceSpm?: number;
  splits?: Split[];
  /**
   * Route shape, normalised to 0..1 in both axes, with the ends trimmed for privacy.
   * Never raw GPS coordinates.
   */
  route?: [number, number][];
  race?: { name: string };
  sample?: boolean;
}

// ── Sample data (labelled everywhere it appears) ───────────────────────────
const sampleSplits = ['5:52', '5:48', '5:41', '5:36', '5:38', '5:44', '5:49', '5:46', '5:42', '5:37'].map((p, i) => {
  const [m, s] = p.split(':').map(Number);
  return { km: 1, durationSec: m * 60 + s, i };
});

/** A smooth, made-up loop for layout purposes only. */
function sampleRoute(): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const x = 0.5 + 0.38 * Math.sin(t) + 0.08 * Math.sin(3 * t);
    const y = 0.5 - 0.3 * Math.cos(t) + 0.1 * Math.cos(2 * t) + 0.05 * Math.sin(5 * t);
    pts.push([x, y]);
  }
  return pts;
}

const SAMPLE_RUNS: Run[] = [
  {
    id: 'sample-001',
    date: '2026-09-21',
    title: 'Morning run',
    distanceKm: 10.21,
    durationSec: 58 * 60 + 24,
    avgHr: 152,
    maxHr: 168,
    elevationGainM: 128,
    cadenceSpm: 176,
    splits: [...sampleSplits.map(({ km, durationSec }) => ({ km, durationSec })), { km: 0.21, durationSec: 71 }],
    route: sampleRoute(),
    sample: true,
  },
];

// ── Getters ─────────────────────────────────────────────────────────────────
export function getRuns(): Run[] {
  const real = exported as Run[];
  const runs = real.length > 0 ? real : SAMPLE_RUNS;
  return [...runs].sort((a, b) => b.date.localeCompare(a.date));
}

export const getLatestRun = (): Run | undefined => getRuns()[0];

/** Most recent run with a GPS route (treadmill runs have none). */
export const getLatestRouteRun = (): Run | undefined => getRuns().find((r) => r.route && r.route.length > 1);

export const isSampleData = () => (exported as Run[]).length === 0;

/** Race results among the runs (those with `race` set). */
export const getRaces = () => getRuns().filter((r) => r.race);

/** Fastest effort at or above each standard distance, from whole-run times. */
export function getPersonalBests() {
  const targets = [
    { label: '5K', km: 5 },
    { label: '10K', km: 10 },
    { label: 'Half marathon', km: 21.0975 },
    { label: 'Marathon', km: 42.195 },
  ];
  const runs = getRuns();
  return targets.map((t) => {
    const eligible = runs.filter((r) => r.distanceKm >= t.km && r.distanceKm < t.km * 1.08);
    const best = eligible.sort((a, b) => a.durationSec / a.distanceKm - b.durationSec / b.distanceKm)[0];
    return { ...t, run: best };
  });
}

export function getTotals() {
  const runs = getRuns();
  return {
    runs: runs.length,
    km: runs.reduce((s, r) => s + r.distanceKm, 0),
    durationSec: runs.reduce((s, r) => s + r.durationSec, 0),
  };
}

// ── Formatting ──────────────────────────────────────────────────────────────
export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  const mm = h ? String(m).padStart(2, '0') : String(m);
  return `${h ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
}

/** Pace as m:ss per km. */
export function formatPace(run: Pick<Run, 'distanceKm' | 'durationSec'>): string {
  return formatPaceSec(run.durationSec / run.distanceKm);
}

export function formatPaceSec(secPerKm: number): string {
  let m = Math.floor(secPerKm / 60);
  let s = Math.round(secPerKm % 60);
  if (s === 60) {
    m += 1;
    s = 0;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ── Sync metadata ───────────────────────────────────────────────────────────

/** When the exported data last changed (written by the export script), or undefined for sample data. */
export const getSyncInfo = (): { syncedAt: string; source: string } | undefined =>
  isSampleData() || !meta?.syncedAt ? undefined : { syncedAt: meta.syncedAt, source: meta.source };
