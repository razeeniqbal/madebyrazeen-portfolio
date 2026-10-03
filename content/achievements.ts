/**
 * Credentials: the one source for /credentials, About, Experience, Resume and the assistant.
 * Edit in the admin (/keystatic → Credentials) or content/data/achievements.json.
 *
 * - `area` is the subject (AI, Data, Cloud, Development, Other), used for filters and the learning path.
 * - `selected` is a small narrative set (one per step of Engineering → Data → AI), shown on
 *   /credentials and About. It is not a ranking. `featured` stays the Home hero strip and Resume lead.
 * - Dates are recorded as issued ("May 2026"); an empty date is shown as undated, never guessed.
 */
import data from './data/achievements.json';

export type CredentialArea = 'ai' | 'data' | 'cloud' | 'development' | 'other';

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  issuedDate: string;
  description: string;
  category: 'certification' | 'award' | 'course' | 'achievement';
  area: CredentialArea;
  image: string;
  credentialUrl?: string;
  credentialId?: string;
  /** Shown in the Home hero strip and first on the Resume. */
  featured: boolean;
  /** Part of the small narrative set on /credentials and About. */
  selected: boolean;
}

export const credentialAreas: { value: CredentialArea; label: string }[] = [
  { value: 'ai', label: 'AI' },
  { value: 'data', label: 'Data' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'development', label: 'Development' },
  { value: 'other', label: 'Engineering & other' },
];

export const areaLabel = (a: CredentialArea) => credentialAreas.find((x) => x.value === a)?.label ?? a;

// Data: content/data/achievements.json (edited in the admin → Credentials).
export const achievements: Achievement[] = data.items.map((a) => ({
  ...a,
  category: a.category as Achievement['category'],
  area: a.area as CredentialArea,
  credentialUrl: a.credentialUrl || undefined,
  credentialId: a.credentialId || undefined,
  featured: Boolean(a.featured),
  selected: Boolean(a.selected),
}));

export const featuredCredentials = achievements.filter((a) => a.featured);

/** "May 2026" → sortable time; undated → 0. */
export const issuedTime = (d: string) => {
  // An empty date must stay undated: V8 reads a bare "1 " as the year 2001.
  const t = d.trim() ? Date.parse(`1 ${d}`) : NaN;
  return Number.isNaN(t) ? 0 : t;
};

/** The narrative set, oldest first, so it reads as the path it represents. Undated items close the set. */
const undatedLast = (a: Achievement) => issuedTime(a.issuedDate) || Number.MAX_SAFE_INTEGER;
export const selectedCredentials = achievements.filter((a) => a.selected).sort((a, b) => undatedLast(a) - undatedLast(b));

export interface LearningYear {
  /** "2025", or "Undated" for records without an issue date. */
  year: string;
  items: Achievement[];
  /** Count per area, largest first. */
  areas: { area: CredentialArea; count: number }[];
}

/** Credentials grouped by the year they were issued, oldest first; undated records last. */
export function learningPath(): LearningYear[] {
  const groups = new Map<string, Achievement[]>();
  for (const a of achievements) {
    const year = a.issuedDate.match(/\d{4}/)?.[0] ?? 'Undated';
    groups.set(year, [...(groups.get(year) ?? []), a]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a === 'Undated' ? 1 : b === 'Undated' ? -1 : a.localeCompare(b)))
    .map(([year, items]) => {
      const counts = new Map<CredentialArea, number>();
      items.forEach((a) => counts.set(a.area, (counts.get(a.area) ?? 0) + 1));
      return { year, items, areas: [...counts.entries()].map(([area, count]) => ({ area, count })).sort((x, y) => y.count - x.count) };
    });
}
