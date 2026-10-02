/**
 * Training and speaking engagements: the canonical source for Trainer, Home and Resume.
 * Edit in the admin (/keystatic → Trainer) or content/data/trainer.json.
 * Dates are ISO days and stay empty when not known; `year` is used only when no exact date exists.
 * `evidence` lists asset keys or URLs of real photos or screenshots (never placeholders).
 */
import data from './data/trainer.json';

export interface TrainerEngagement {
  slug: string;
  title: string;
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

type Raw = Omit<TrainerEngagement, 'dateStart' | 'dateEnd' | 'year' | 'format' | 'audience' | 'visibility'> & {
  dateStart: string | null;
  dateEnd: string | null;
  year: number | null;
  format: string;
  audience: string;
  visibility: string;
};

const engagements: TrainerEngagement[] = (data.engagements as Raw[]).map((e) => ({
  ...e,
  dateStart: e.dateStart ?? undefined,
  dateEnd: e.dateEnd ?? undefined,
  year: e.year ?? (e.dateStart ? Number(e.dateStart.slice(0, 4)) : undefined),
  format: e.format || undefined,
  audience: e.audience || undefined,
  visibility: e.visibility as TrainerEngagement['visibility'],
}));

/** Public engagements, newest dated first; undated ongoing work (internal training) leads. */
export function getTrainerEngagements(): TrainerEngagement[] {
  return engagements
    .filter((e) => e.visibility === 'public')
    .sort((a, b) => (a.year === undefined ? -1 : b.year === undefined ? 1 : (b.dateStart ?? String(b.year)).localeCompare(a.dateStart ?? String(a.year))));
}

export const getFeaturedTrainerEngagements = (): TrainerEngagement[] => getTrainerEngagements().filter((e) => e.featured);
