/**
 * Career record: the canonical source for Experience, Resume, Home, About and the assistant.
 * Edit in the admin (/keystatic → Experience) or content/data/experience.json.
 *
 * - Dates are ISO days. `datesConfirmed: false` means the dates are unresolved: they are never shown
 *   or guessed (IntelliLabs AI today); presentations show the employment type instead.
 * - `relationship: 'parallel'` marks work alongside the main career (IntelliLabs), so it never replaces
 *   the current primary role.
 * - `selectedWork` holds named pieces of work; `projectSlug` links one to a project instead of repeating it.
 */
import data from './data/experience.json';

export type Relationship = 'primary' | 'parallel';
export type Visibility = 'public' | 'private';
export type WorkStatus = 'active' | 'under-construction' | 'proof-of-concept' | 'completed' | 'archived';

export interface SelectedWork {
  id: string;
  name: string;
  context: string;
  type: string;
  status?: WorkStatus;
  scale?: string;
  description: string;
  /** Why it matters in the story (optional). */
  significance?: string;
  technologies: string[];
  aiUsed: boolean;
  /** Conceptual flow, step by step (e.g. MSSQL → Python → Existing API → NoSQL). */
  flow: string[];
  recognition?: string;
  projectSlug?: string;
  visibility: Visibility;
}

export interface Role {
  id: string;
  company: string;
  role: string;
  employmentType?: string;
  workMode?: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  datesConfirmed: boolean;
  relationship: Relationship;
  location?: string;
  summary?: string;
  responsibilities: string[];
  technologies: string[];
  careerSignificance?: string;
  progression: string[];
  selectedWork: SelectedWork[];
  /** Client and project details stay private; show the role at a high level only. */
  confidential: boolean;
  visibility: Visibility;
  // ── Derived for presentation ──
  /** "Aug 2020 - Jan 2022", "Jun 2025 - Present", or the employment type when dates are unresolved. */
  period: string;
  /** Start year for sorting and timelines (0 when unresolved). */
  start: number;
  /** Bullets for timelines: responsibilities, or the public selected work when a role lists work instead. */
  highlights: string[];
}

type RawWork = Omit<SelectedWork, 'status' | 'scale' | 'significance' | 'recognition' | 'projectSlug' | 'visibility'> & {
  status: string | null;
  scale: string;
  significance: string;
  recognition: string;
  projectSlug: string;
  visibility: string;
};
type RawRole = Omit<Role, 'period' | 'start' | 'highlights' | 'selectedWork' | 'relationship' | 'visibility' | 'startDate' | 'endDate' | 'employmentType' | 'workMode' | 'location' | 'summary' | 'careerSignificance'> & {
  relationship: string;
  visibility: string;
  startDate: string | null;
  endDate: string | null;
  employmentType: string;
  workMode: string;
  location: string;
  summary: string;
  careerSignificance: string;
  selectedWork: RawWork[];
};

const month = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function period(r: RawRole): string {
  if (!r.datesConfirmed || !r.startDate) return r.employmentType ? titleCase(r.employmentType) : '';
  return `${month(r.startDate)} - ${r.isCurrent || !r.endDate ? 'Present' : month(r.endDate)}`;
}

const workLine = (w: SelectedWork) => `${w.name}: ${w.type.toLowerCase()}${w.scale ? `, ${w.scale.toLowerCase()}` : ''}`;

const roles: Role[] = (data.roles as RawRole[]).map((r) => {
  const selectedWork: SelectedWork[] = r.selectedWork.map((w) => ({
    ...w,
    status: (w.status || undefined) as WorkStatus | undefined,
    scale: w.scale || undefined,
    significance: w.significance || undefined,
    recognition: w.recognition || undefined,
    projectSlug: w.projectSlug || undefined,
    visibility: w.visibility as Visibility,
  }));
  const publicWork = selectedWork.filter((w) => w.visibility === 'public');
  return {
    ...r,
    relationship: r.relationship as Relationship,
    visibility: r.visibility as Visibility,
    employmentType: r.employmentType || undefined,
    workMode: r.workMode || undefined,
    startDate: r.startDate ?? undefined,
    endDate: r.endDate ?? undefined,
    location: r.location || undefined,
    summary: r.summary || undefined,
    careerSignificance: r.careerSignificance || undefined,
    selectedWork,
    period: period(r),
    start: r.datesConfirmed && r.startDate ? Number(r.startDate.slice(0, 4)) : 0,
    highlights: r.responsibilities.length ? r.responsibilities : publicWork.map(workLine),
  };
});

/**
 * Public roles, newest first. Parallel roles sit directly after the current primary role,
 * so they are visible without taking its place.
 */
export function getExperience(): Role[] {
  const visible = roles.filter((r) => r.visibility === 'public');
  const primary = visible.filter((r) => r.relationship === 'primary').sort((a, b) => (b.startDate ?? '').localeCompare(a.startDate ?? ''));
  const parallel = visible.filter((r) => r.relationship === 'parallel');
  const current = primary.findIndex((r) => r.isCurrent);
  return current === -1 ? [...primary, ...parallel] : [...primary.slice(0, current + 1), ...parallel, ...primary.slice(current + 1)];
}

/** The current primary role (never a parallel contract). */
export const getCurrentRole = (): Role | undefined => getExperience().find((r) => r.relationship === 'primary' && r.isCurrent);

/** Roles for the resume: the same records, same order. */
export const getResumeRoles = (): Role[] => getExperience();

/** Public selected work across roles, with the role it belongs to. */
export const getSelectedWork = (): (SelectedWork & { roleId: string; company: string })[] =>
  getExperience().flatMap((r) => r.selectedWork.filter((w) => w.visibility === 'public').map((w) => ({ ...w, roleId: r.id, company: r.company })));

/** Kept for existing call sites: the public career in display order. */
export const experience: Role[] = getExperience();
