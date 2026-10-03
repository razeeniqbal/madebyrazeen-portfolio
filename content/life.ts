/**
 * Life: personal interests and where each one leads. Canonical source for Life, Home and About.
 * Edit in the admin (/keystatic → Life) or content/data/life.json.
 * Running keeps its own detailed page (/running) and data pipeline; volleyball and Formula 1 point to
 * the projects they inspired. No statistics or history are stored here.
 */
import data from './data/life.json';

export type InterestType = 'sport' | 'interest';

export interface LifeInterest {
  slug: string;
  name: string;
  type: InterestType;
  /** A few short paragraphs for the Life page. */
  body: string[];
  /** The interest told as steps (Play → People → Coordination → VSB); used instead of `body` when present. */
  story: { label: string; text: string }[];
  /** Where the interest leads on the site (/running, /projects/vsb …). */
  href: string;
  relatedProject?: string;
  /** 'running' = the real Garmin / Strava pipeline in content/running. */
  dataSource?: 'running';
  visibility: 'public' | 'private';
}

type Raw = Omit<LifeInterest, 'type' | 'relatedProject' | 'dataSource' | 'visibility'> & {
  type: string;
  relatedProject: string;
  dataSource: string;
  visibility: string;
};

export function getLifeInterests(): LifeInterest[] {
  return (data.interests as Raw[])
    .filter((i) => i.visibility === 'public')
    .map((i) => ({
      ...i,
      type: i.type as InterestType,
      relatedProject: i.relatedProject || undefined,
      dataSource: i.dataSource === 'running' ? 'running' : undefined,
      visibility: 'public',
    }));
}
