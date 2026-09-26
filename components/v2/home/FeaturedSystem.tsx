import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { FlowDiagram, type FlowNode } from '@/components/v2/diagram/FlowDiagram';
import { home } from '@/content/home';

// How QualityPlus actually works (from the project's own documentation), in the PRD §22 narrative.
const nodes: FlowNode[] = [
  { type: 'SOURCE', title: 'Raw data', detail: 'O&G datasets uploaded into a project.' },
  { type: 'PROCESS', title: 'Quality rules', detail: 'Completeness, uniqueness, validity, consistency. Shareable templates.' },
  { type: 'PROCESS', title: 'Validation', detail: 'Checks run per column; failed rows are kept, not dropped.' },
  {
    type: 'MODEL',
    title: 'AI assistance',
    detail: 'Suggests rules from column names, explains scores, proposes fixes. n8n + self-hosted Mistral 7B.',
    active: true,
  },
  { type: 'OUTPUT', title: 'Quality score', detail: 'A saved, scored result per dimension.' },
  { type: 'OUTPUT', title: 'Trusted data', detail: 'Remediate → approve → publish a corrected version.' },
];

export function FeaturedSystem() {
  return (
    <Section surface="light">
      <div className="page-grid gap-y-12">
        <SectionHeader index="03" eyebrow={home.featured.eyebrow} title={home.featured.title} className="lg:col-span-8" />

        <div className="col-span-full md:col-span-5 lg:col-span-4 lg:self-end">
          <p className="text-lead">{home.featured.lead}</p>
          <p className="justify-copy mt-3 text-muted">{home.featured.body}</p>
        </div>

        <div className="col-span-full">
          <FlowDiagram nodes={nodes} label="QualityPlus system flow" />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <TechnicalLabel>React · TypeScript · Supabase · n8n · Ollama</TechnicalLabel>
            <ArrowLink href={`/work/${home.featured.project}`}>Read the case study</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
