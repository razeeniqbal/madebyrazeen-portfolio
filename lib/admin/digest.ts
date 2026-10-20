import { getProjects } from '@/content/projects';
import { getPublishedJournalEntries, notes } from '@/content/notes';
import { getLatestRun, isSampleData } from '@/content/running';
import { SSO_COOKIE } from './sso';

/**
 * At-a-glance numbers for the admin hub. Langkah and the tracker each serve `/api/digest`; the portfolio
 * calls them server-side with the admin's own `mbr_admin` token, so they answer exactly as they would
 * in the browser. A slow or failing app gives `null` and its panel says so; the page never waits long.
 */

export interface LangkahDigest {
  overall: number;
  projects: { code: string; name: string; progress: number; open: number; late: number }[];
  cards: Record<'backlog' | 'todo' | 'doing' | 'review' | 'done', number>;
  lateCount: number;
  dueThisWeek: number;
  attention: { title: string; project: string; due: string; status: string }[];
}

export interface TrackerDigest {
  total: number;
  published: number;
  byStatus: { status: string; label: string; count: number }[];
  rings: { key: string; label: string; percent: number; detail: string }[];
  studyMinutesWeek: number;
  streak: number;
  pace: { thisWeek: number; target: number; perWeek: number; remaining: number; finishAtPace: string | null };
  upNext: { key: string; code: string; title: string; status: string; statusLabel: string }[];
}

export interface PortfolioDigest {
  projects: number;
  published: number;
  drafts: number;
  latest?: { title: string; date: string; slug: string };
  run?: { title: string; date: string; distanceKm: number; durationSec: number };
}

/** Today in Malaysia, so "late" and "due this week" match what Langkah shows on the board. */
export const todayMYT = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur' }).format(new Date());

async function getJson<T>(url: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Cookie: `${SSO_COOKIE}=${token}`, Accept: 'application/json' },
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export const langkahDigest = (base: string, token: string) =>
  getJson<LangkahDigest>(`${base}/api/digest?today=${todayMYT()}`, token);

export const trackerDigest = (base: string, token: string) => getJson<TrackerDigest>(`${base}/api/digest`, token);

export function portfolioDigest(): PortfolioDigest {
  const published = getPublishedJournalEntries();
  const latest = [...published].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))[0];
  const run = isSampleData() ? undefined : getLatestRun();
  return {
    projects: getProjects().length,
    published: published.length,
    drafts: notes.filter((n) => n.status === 'draft').length,
    latest: latest?.date ? { title: latest.title, date: latest.date, slug: latest.slug } : undefined,
    run: run ? { title: run.title, date: run.date, distanceKm: run.distanceKm, durationSec: run.durationSec } : undefined,
  };
}
