import type { CaseStudy, SectionId } from './types';
import { fromCmsBlocks, readCollection, type CmsBlock } from './cms';

export * from './types';

/**
 * Case studies live in content/data/case-studies/<project-slug>.json (admin → Case studies).
 * The file name must match the project's slug; /work/[slug] picks it up automatically.
 */
type CmsCaseStudy = {
  project: string;
  review: 'draft' | 'approved';
  lede: string;
  facts: { label: string; value: string }[];
  disclaimer: string;
  sections: { id: SectionId; headline: string; surface: 'default' | 'dark' | 'light'; blocks: CmsBlock[] }[];
};

const caseStudies = new Map<string, CaseStudy>(
  readCollection<CmsCaseStudy>('case-studies').map(({ slug, data }) => [
    slug,
    {
      slug,
      review: data.review,
      lede: data.lede,
      facts: data.facts,
      disclaimer: data.disclaimer || undefined,
      sections: data.sections.map((s) => ({
        id: s.id,
        headline: s.headline,
        surface: s.surface === 'default' ? undefined : s.surface,
        blocks: fromCmsBlocks(s.blocks),
      })),
    },
  ]),
);

export const getCaseStudy = (slug: string): CaseStudy | undefined => caseStudies.get(slug);
