/**
 * Career timeline. Edit in the admin (/keystatic → Experience) or content/data/experience.json.
 * `highlights` is the bullet list; `worked` / `changed` / `learned` are the optional
 * "problems solved" framing (PRD §25). When `worked` is filled, the timeline prefers it.
 */
import data from './data/experience.json';

export type WorkMode = 'Internship' | 'Onsite' | 'Remote' | 'Part-time' | 'Full-time' | 'Hybrid';

export interface Role {
  company: string;
  role: string;
  period: string;
  start: number;
  location: string;
  type: WorkMode;
  highlights: string[];
  worked?: string;
  changed?: string;
  learned?: string;
}

export const experience: Role[] = data.roles.map((r) => ({
  ...r,
  start: r.start ?? 0,
  type: r.type as WorkMode,
  worked: r.worked || undefined,
  changed: r.changed || undefined,
  learned: r.learned || undefined,
}));
