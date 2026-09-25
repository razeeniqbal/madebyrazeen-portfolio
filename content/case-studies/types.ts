import type { FlowNode } from '@/components/v2/diagram/FlowDiagram';
import type { ImageAsset } from '@/lib/assets';

/**
 * Case study = ordered sections from the PRD §20 structure. Each section is a
 * list of typed blocks, so a new project needs content only, no new layout.
 * Not every project uses every section.
 */

export type SectionId =
  | 'overview'
  | 'problem'
  | 'idea'
  | 'architecture'
  | 'data'
  | 'build'
  | 'interface'
  | 'outcome'
  | 'learned';

export const sectionTitles: Record<SectionId, string> = {
  overview: 'Overview',
  problem: 'The problem',
  idea: 'The idea',
  architecture: 'System architecture',
  data: 'Data / intelligence',
  build: 'Build',
  interface: 'Interface',
  outcome: 'Outcome',
  learned: 'What I learned',
};

export type Block =
  | { kind: 'text'; body: string[]; lead?: boolean }
  | { kind: 'list'; items: { title: string; detail: string }[]; numbered?: boolean }
  | { kind: 'flow'; label: string; nodes: FlowNode[]; caption?: string }
  | { kind: 'metrics'; items: { label: string; value: string; note?: string; illustrative?: boolean }[] }
  | { kind: 'table'; caption: string; columns: string[]; rows: string[][]; note?: string; highlightRow?: number }
  | { kind: 'image'; image: ImageAsset; caption: string }
  | { kind: 'steps'; label: string; steps: string[] };

export interface CaseSection {
  id: SectionId;
  /** Short display statement, e.g. "Build in layers." */
  headline: string;
  /** Dark = systems/building, light = thinking/writing (PRD §8). Defaults per section id. */
  surface?: 'dark' | 'light';
  blocks: Block[];
}

export interface CaseStudy {
  slug: string;
  lede: string;
  facts: { label: string; value: string }[];
  sections: CaseSection[];
  disclaimer?: string;
  /** Narrative drafted from project documentation; shown as such until approved. */
  review?: 'draft' | 'approved';
}
