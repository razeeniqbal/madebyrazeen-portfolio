/**
 * Training and speaking engagements: the canonical source for Trainer, Home and Resume.
 * Edit in the admin (/keystatic → Trainer) or content/data/trainer.json.
 * Dates are ISO days and stay empty when not known; `year` is used only when no exact date exists.
 * `evidence` lists asset keys or URLs of real photos or screenshots (never placeholders).
 */
import data from './data/trainer.json';

/** How the engagement shares knowledge; decides its weight on /trainer. */
export type EngagementMode = 'structured-training' | 'technical-sharing' | 'internal-knowledge-sharing';

export const modeLabel: Record<EngagementMode, string> = {
  'structured-training': 'Structured training',
  'technical-sharing': 'Technical sharing',
  'internal-knowledge-sharing': 'Internal knowledge sharing',
};

export interface TrainerEngagement {
  slug: string;
  title: string;
  mode: EngagementMode;
  /** The shape of a structured programme, step by step (Audience → Concept → Hands-on → Application). */
  journey: { label: string; detail: string }[];
  /** The verified topics grouped into themes, so a long curriculum reads as a few ideas. */
  topicGroups: { label: string; topics: string[] }[];
  role: string;
  organization: string;
  partners: string[];
  dateStart?: string;
  dateEnd?: string;
  year?: number;
  format?: string;
  audience?: string;
  summary: string;
  topics: string[];
  evidence: string[];
  featured: boolean;
  visibility: 'public' | 'private';
}

type Raw = Omit<TrainerEngagement, 'mode' | 'dateStart' | 'dateEnd' | 'year' | 'format' | 'audience' | 'visibility'> & {
  mode: string;
  dateStart: string | null;
  dateEnd: string | null;
  year: number | null;
  format: string;
  audience: string;
  visibility: string;
};

const engagements: TrainerEngagement[] = (data.engagements as Raw[]).map((e) => ({
  ...e,
  mode: e.mode as EngagementMode,
  dateStart: e.dateStart ?? undefined,
  dateEnd: e.dateEnd ?? undefined,
  year: e.year ?? (e.dateStart ? Number(e.dateStart.slice(0, 4)) : undefined),
  format: e.format || undefined,
  audience: e.audience || undefined,
  visibility: e.visibility as TrainerEngagement['visibility'],
}));

/** Public engagements, newest first. Undated ongoing work (AEM internal training) comes last. */
export function getTrainerEngagements(): TrainerEngagement[] {
  const key = (e: TrainerEngagement) => e.dateStart ?? (e.year ? String(e.year) : '');
  return engagements.filter((e) => e.visibility === 'public').sort((a, b) => key(b).localeCompare(key(a)));
}

const day = (iso: string, parts: Intl.DateTimeFormatOptions) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { ...parts, timeZone: 'UTC' });

/**
 * "5 to 6 Aug 2026", "12 Mar 2025", "2025", or undefined when nothing is known.
 * Undefined means the date is omitted, never replaced with a placeholder.
 */
export function engagementWhen(e: TrainerEngagement): string | undefined {
  if (e.dateStart) {
    const full = day(e.dateStart, { day: 'numeric', month: 'short', year: 'numeric' });
    if (!e.dateEnd || e.dateEnd === e.dateStart) return full;
    const sameMonth = e.dateStart.slice(0, 7) === e.dateEnd.slice(0, 7);
    const start = sameMonth ? day(e.dateStart, { day: 'numeric' }) : day(e.dateStart, { day: 'numeric', month: 'short' });
    return `${start} to ${day(e.dateEnd, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }
  return e.year ? String(e.year) : undefined;
}

export const getFeaturedTrainerEngagements = (): TrainerEngagement[] => getTrainerEngagements().filter((e) => e.featured);

/** How a session is shaped: Understand → Demonstrate → Practise → Apply (used on /trainer and Home). */
export const trainerApproach = [
  { step: 'Understand', detail: 'What it is, and why it exists.' },
  { step: 'Demonstrate', detail: 'How it works, shown on something real.' },
  { step: 'Practise', detail: 'People work through it themselves.' },
  { step: 'Apply', detail: 'Connect it to a real use case.' },
];
