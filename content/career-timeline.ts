/**
 * Data for the career timeline chart: real dates only, from the Experience record (primary roles), the
 * profile (education) and the credential master (issue dates). Built on the server and passed to the
 * client chart as plain data. Nothing is estimated: an undated role or credential is left out and counted.
 */
import { getCareerStages, shortCompany } from './experience';
import { education } from './profile';
import { achievements, issuedTime } from './achievements';

export type TimelineLane = 'work' | 'study';

export interface TimelineSpan {
  id: string;
  lane: TimelineLane;
  /** Short label drawn on the bar when it fits ("Geotechnical"). */
  short: string;
  title: string;
  org: string;
  /** Decimal years, e.g. 2022.58. */
  start: number;
  end: number;
  /** "Aug 2022 → Apr 2024". */
  period: string;
  detail: string;
  href?: string;
  current?: boolean;
}

export interface TimelineCredential {
  id: string;
  title: string;
  org: string;
  at: number;
  /** "Sep 2023". */
  when: string;
}

export interface CareerTimelineData {
  from: number;
  to: number;
  now: number;
  spans: TimelineSpan[];
  credentials: TimelineCredential[];
  /** Credentials per calendar year, for the bar row. */
  perYear: { year: number; count: number }[];
  undatedCredentials: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const decimal = (d: Date) => d.getUTCFullYear() + d.getUTCMonth() / 12;
const isoDecimal = (iso: string) => decimal(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
const monthLabel = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;

/** "Sep 2017 - Oct 2021" → [2017.67, 2021.75]. */
function parsePeriod(period: string): [number, number] | undefined {
  const m = period.match(/([A-Za-z]{3})\w*\s+(\d{4})\s*[-–]\s*([A-Za-z]{3})\w*\s+(\d{4})/);
  if (!m) return undefined;
  const at = (mon: string, y: string) => Number(y) + MONTHS.indexOf(mon.slice(0, 3)) / 12;
  return [at(m[1], m[2]), at(m[3], m[4])];
}

// Short bar labels per career stage (the stage names stay on /experience).
const shortFor: Record<string, string> = {
  Site: 'Site',
  Model: 'BIM',
  Data: 'Geotechnical',
  Pipelines: 'Data analyst',
  'AI systems': 'AI data engineer',
};

export function getCareerTimeline(now = new Date()): CareerTimelineData {
  const nowAt = decimal(now);

  const work: TimelineSpan[] = getCareerStages()
    .filter((r) => r.datesConfirmed && r.startDate)
    .map((r) => {
      const current = r.isCurrent || !r.endDate;
      return {
        id: r.id,
        lane: 'work',
        short: shortFor[r.stage ?? ''] ?? r.role,
        title: r.role,
        org: shortCompany(r.company),
        start: isoDecimal(r.startDate!),
        end: current ? nowAt : isoDecimal(r.endDate!),
        period: `${monthLabel(r.startDate!)} → ${current ? 'Present' : monthLabel(r.endDate!)}`,
        detail: r.discipline ? `${r.discipline}. ${r.summary || r.narrative[0] || ''}`.trim() : r.summary || r.narrative[0] || '',
        href: `/experience#${r.id}`,
        current,
      } satisfies TimelineSpan;
    });

  const study: TimelineSpan[] = education.flatMap((e) => {
    const span = parsePeriod(e.period);
    if (!span) return [];
    return [
      {
        id: `edu-${e.short.toLowerCase()}`,
        lane: 'study' as const,
        short: e.field === 'Artificial Intelligence' ? 'MSc AI' : 'Civil Eng.',
        title: `${e.degree}, ${e.field}`,
        org: e.institution,
        start: span[0],
        end: span[1],
        period: e.period.replace(' - ', ' → '),
        detail: `${e.short}, ${e.location}.`,
      },
    ];
  });

  const dated = achievements.filter((a) => issuedTime(a.issuedDate) > 0);
  const credentials: TimelineCredential[] = dated
    .map((a) => {
      const t = new Date(issuedTime(a.issuedDate));
      const at = a.issuedOn ? isoDecimal(a.issuedOn) : t.getFullYear() + t.getMonth() / 12;
      return { id: a.id, title: a.title, org: a.organization, at, when: `${MONTHS[t.getMonth()]} ${t.getFullYear()}` };
    })
    .sort((a, b) => a.at - b.at);

  const spans = [...study, ...work].sort((a, b) => a.start - b.start);
  const from = Math.floor(Math.min(...spans.map((s) => s.start), ...credentials.map((c) => c.at)));
  const to = Math.ceil(nowAt + 0.01);
  const perYear = Array.from({ length: to - from }, (_, i) => from + i).map((year) => ({
    year,
    count: credentials.filter((c) => Math.floor(c.at) === year).length,
  }));

  return { from, to, now: nowAt, spans, credentials, perYear, undatedCredentials: achievements.length - dated.length };
}
