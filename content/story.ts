/**
 * About: why the path happened. Edit in the admin (About · story) or content/data/story.json.
 *
 * About explains motives and decisions; it links to /experience for what happened (dates, roles, work)
 * instead of restating it. Project origins point at canonical projects by `projectSlug`: the title and
 * status come from content/data/projects.json, never from here.
 */
import { getProject, type Project } from '@/content/projects';
import data from './data/story.json';

export interface Moment {
  id: string;
  eyebrow: string;
  title: string[];
  /** Paragraphs before the questions. */
  body: string[];
  /** Short questions given visual emphasis. */
  questions: string[];
  /** Paragraphs after the questions. */
  after: string[];
  link?: { label: string; href: string };
}

export interface ProjectOrigin {
  lead: string;
  text: string;
  /** Short relation shown on About, e.g. "Work problem → Engineering tool". */
  label: string;
  project: Project;
}

export const aboutHero = data.hero;

/** Engineering → Data → AI → Build: the conceptual path (Experience owns the detailed career map). */
export const aboutStages = data.stages;

export const moments: Moment[] = data.moments.map((m) => ({
  ...m,
  link: m.linkHref ? { label: m.linkLabel, href: m.linkHref } : undefined,
}));

export const whyBuild = {
  ...data.whyBuild,
  origins: data.whyBuild.origins.flatMap((o): ProjectOrigin[] => {
    const project = getProject(o.projectSlug);
    return project ? [{ lead: o.lead, text: o.text, label: o.label, project }] : [];
  }),
};

export const howIWork = data.howIWork;

/** Input → Process → Iterate → Progress. Step names match profile.loops.philosophy. */
export const principles = data.principles;

export const learning = data.learning;

/** Currently: plain lists, plus the projects being built (resolved from canonical project data). */
export const currently = {
  working: data.currently.working,
  building: data.currently.building.map((slug) => getProject(slug)).filter((p): p is Project => Boolean(p)),
  exploring: data.currently.exploring,
  sharing: data.currently.sharing,
};

/** About › Away from the screen. */
export const beyond = data.beyond;

export const aboutClosing = data.closing;

/** Path steps (Home About teaser). */
export const storyPath = data.path;
