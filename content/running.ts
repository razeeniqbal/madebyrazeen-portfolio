/**
 * Running data layer. UI components depend only on the `Run` shape and the
 * getters below, so the source can change without touching the page.
 *
 * Sources (merged, de-duplicated, newest first):
 *   1. content/running/runs.json: daily Garmin sync (scripts/garmin/export_runs.py)
 *   2. content/running/strava.json: full history from a Strava export (scripts/strava/import_export.py),
 *      which adds best efforts, race names and the treadmill flag
 *   3. SAMPLE_RUNS below: only while both are empty, labelled "Sample data" everywhere (PRD §58).
 * Treadmill / indoor runs are dropped: no route, and their pace is not comparable.
 */
import exported from './running/runs.json';
import stravaExport from './running/strava.json';
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
  /** Treadmill / indoor: excluded from everything on the site. */
  indoor?: boolean;
  /** Elapsed time incl. pauses (durationSec is moving time). */
  elapsedSec?: number;
  /** Fastest continuous efforts inside the run, in seconds (from the GPS stream). */
  bestEfforts?: Partial<Record<EffortKey, number>>;
  source?: 'garmin' | 'strava';
}

export type EffortKey = '1k' | '5k' | '10k' | 'half' | 'marathon';

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
const GENERIC_TITLE = /^(run|treadmill run|morning run|afternoon run|evening run|night run|outdoor running)$/i;

/** Same run from both sources: same local date and distance within 3%. */
const sameRun = (a: Run, b: Run) =>
  a.date === b.date && Math.abs(a.distanceKm - b.distanceKm) <= Math.max(a.distanceKm, b.distanceKm) * 0.03;

function merged(): Run[] {
  const out: Run[] = [...(stravaExport as Run[])];
  for (const g of exported as Run[]) {
    const twin = out.findIndex((x) => sameRun(x, g));
    if (twin === -1) {
      // Garmin-only (newer than the Strava export). Older syncs carry no indoor flag: no route means treadmill.
      out.push({ ...g, source: 'garmin', indoor: g.indoor ?? !g.route });
    } else if (GENERIC_TITLE.test(out[twin].title) && !GENERIC_TITLE.test(g.title)) {
      out[twin] = { ...out[twin], title: g.title };
    }
  }
  return out;
}

const REAL: Run[] = merged()
  .filter((r) => !r.indoor)
  .sort((a, b) => b.date.localeCompare(a.date));

/** Outdoor runs, newest first (sample data only when no real data exists). */
export function getRuns(): Run[] {
  return REAL.length > 0 ? REAL : SAMPLE_RUNS;
}

export const getLatestRun = (): Run | undefined => getRuns()[0];

/** Most recent run with a GPS route. */
export const getLatestRouteRun = (): Run | undefined => getRuns().find((r) => r.route && r.route.length > 1);

export const isSampleData = () => REAL.length === 0;

/** Race results among the runs (those with `race` set). */
export const getRaces = () => getRuns().filter((r) => r.race);

export const PB_TARGETS: { key: EffortKey; label: string; short: string; km: number }[] = [
  { key: '1k', label: '1 kilometre', short: '1K', km: 1 },
  { key: '5k', label: '5 kilometres', short: '5K', km: 5 },
  { key: '10k', label: '10 kilometres', short: '10K', km: 10 },
  { key: 'half', label: 'Half marathon', short: 'Half', km: 21.0975 },
  { key: 'marathon', label: 'Marathon', short: 'Full', km: 42.195 },
];

export interface PersonalBest {
  key: EffortKey;
  label: string;
  short: string;
  km: number;
  sec?: number;
  run?: Run;
}

/**
 * Fastest continuous effort per distance (best efforts from the GPS stream, as Strava and Garmin do).
 * Runs without streams fall back to their whole moving time when the run is that distance (within 8%).
 */
export function getPersonalBests(): PersonalBest[] {
  const runs = getRuns();
  return PB_TARGETS.map((t) => {
    let best: { sec: number; run: Run } | undefined;
    for (const r of runs) {
      const fallback = !r.bestEfforts && r.distanceKm >= t.km && r.distanceKm < t.km * 1.08 ? (r.durationSec * t.km) / r.distanceKm : undefined;
      const effort = r.bestEfforts?.[t.key] ?? fallback;
      if (effort && (!best || effort < best.sec)) best = { sec: Math.round(effort), run: r };
    }
    return { ...t, ...best };
  });
}

export function getTotals() {
  const runs = getRuns();
  const longest = runs.reduce<Run | undefined>((m, r) => (!m || r.distanceKm > m.distanceKm ? r : m), undefined);
  return {
    runs: runs.length,
    km: runs.reduce((acc, r) => acc + r.distanceKm, 0),
    durationSec: runs.reduce((acc, r) => acc + r.durationSec, 0),
    longest,
    since: runs.length ? runs[runs.length - 1].date : undefined,
  };
}

/** Distance per calendar month, oldest first, including empty months in between. */
export function getMonthly(): { month: string; km: number; runs: number }[] {
  const runs = getRuns();
  if (!runs.length) return [];
  const byMonth = new Map<string, { km: number; runs: number }>();
  for (const r of runs) {
    const m = r.date.slice(0, 7);
    const cur = byMonth.get(m) ?? { km: 0, runs: 0 };
    byMonth.set(m, { km: cur.km + r.distanceKm, runs: cur.runs + 1 });
  }
  const out: { month: string; km: number; runs: number }[] = [];
  const [fy, fm] = runs[runs.length - 1].date.slice(0, 7).split('-').map(Number);
  const last = runs[0].date.slice(0, 7);
  for (let y = fy, m = fm; ; ) {
    const key = `${y}-${String(m).padStart(2, '0')}`;
    if (key > last) break;
    out.push({ month: key, ...(byMonth.get(key) ?? { km: 0, runs: 0 }) });
    if (m === 12) {
      m = 1;
      y += 1;
    } else m += 1;
  }
  return out;
}

/** Weeks (Monday start) from the first run to the latest, with the outdoor runs in each. */
export function getWeekly(): { weekStart: string; runs: number; km: number }[] {
  const runs = getRuns();
  if (!runs.length) return [];
  const monday = (iso: string) => {
    const d = new Date(`${iso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    return d;
  };
  const weeks = new Map<string, { runs: number; km: number }>();
  for (const r of runs) {
    const k = monday(r.date).toISOString().slice(0, 10);
    const cur = weeks.get(k) ?? { runs: 0, km: 0 };
    weeks.set(k, { runs: cur.runs + 1, km: cur.km + r.distanceKm });
  }
  const out: { weekStart: string; runs: number; km: number }[] = [];
  const end = monday(runs[0].date);
  for (const d = monday(runs[runs.length - 1].date); d <= end; d.setUTCDate(d.getUTCDate() + 7)) {
    const k = d.toISOString().slice(0, 10);
    out.push({ weekStart: k, ...(weeks.get(k) ?? { runs: 0, km: 0 }) });
  }
  return out;
}

// ── Formatting ──────────────────────────────────────────────────────────────
export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });

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
