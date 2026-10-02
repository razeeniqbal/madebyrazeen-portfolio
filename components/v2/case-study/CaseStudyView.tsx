import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { ProjectMeta } from '@/components/v2/work/ProjectMeta';
import { CaseStudyBlock } from './CaseStudyBlocks';
import { sectionTitles, type CaseStudy, type SectionId } from '@/content/case-studies';
import type { Project } from '@/content/projects';

// Thinking/writing sections are light; systems/building sections are dark (PRD §8).
const defaultSurface: Record<SectionId, 'dark' | 'light'> = {
  overview: 'light',
  problem: 'light',
  idea: 'light',
  rules: 'light',
  architecture: 'dark',
  data: 'dark',
  build: 'dark',
  balance: 'dark',
  interface: 'dark',
  outcome: 'light',
  learned: 'light',
};

const wideBlocks = new Set(['flow']);

interface CaseStudyViewProps {
  project: Project;
  study: CaseStudy;
  next?: Project;
}

/** Reusable case-study layout (PRD §20). Numbering follows the sections present. */
export function CaseStudyView({ project, study, next }: CaseStudyViewProps) {
  return (
    <article>
      {/* Header */}
      <Section surface="dark" grid className="!pt-16">
        <div className="page-grid gap-y-10">
          <div className="col-span-full flex flex-wrap items-center justify-between gap-4">
            <ArrowLink href="/projects">All projects</ArrowLink>
            {study.review === 'draft' && (
              <TechnicalLabel className="border border-current px-2 py-1">Drafted from project docs · under review</TechnicalLabel>
            )}
          </div>
          <header className="col-span-full lg:col-span-9">
            <ProjectMeta project={project} />
            <h1 className="mt-4 text-display-xl">{project.title}</h1>
            <p className="mt-6 max-w-[42rem] text-lead text-muted">{study.lede}</p>
          </header>
          <dl className="col-span-full grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 lg:grid-cols-4">
            {study.facts.map((f) => (
              <div key={f.label}>
                <dt className="label text-muted">{f.label}</dt>
                <dd className="mt-1">{f.value}</dd>
              </div>
            ))}
          </dl>
          {(project.links.live || project.links.source) && (
            <div className="col-span-full flex flex-wrap gap-6">
              {project.links.live && (
                <ArrowLink href={project.links.live} variant="primary">
                  Live site
                </ArrowLink>
              )}
              {project.links.source && <ArrowLink href={project.links.source}>Source on GitHub</ArrowLink>}
            </div>
          )}
        </div>
      </Section>

      {/* Sections */}
      {study.sections.map((section, i) => {
        const index = String(i + 1).padStart(2, '0');
        return (
          <Section
            key={section.id}
            id={section.id}
            surface={section.surface ?? defaultSurface[section.id]}
            aria-labelledby={`${section.id}-title`}
            className="!py-[clamp(4rem,9vw,7rem)]"
          >
            <div className="page-grid gap-y-10">
              <div className="col-span-full lg:col-span-4">
                <TechnicalLabel as="p" marker={`${index} /`}>
                  {sectionTitles[section.id]}
                </TechnicalLabel>
                <h2 id={`${section.id}-title`} className="mt-4 text-display-sm">
                  {section.headline}
                </h2>
              </div>
              {/* Prose sits in a reading column; diagrams and tables get the full width. */}
              {section.blocks.map((block, b) => (
                <div
                  key={b}
                  className={wideBlocks.has(block.kind) ? 'col-span-full' : 'col-span-full lg:col-span-8 lg:col-start-5'}
                >
                  <CaseStudyBlock block={block} />
                </div>
              ))}
            </div>
          </Section>
        );
      })}

      {study.disclaimer && (
        <Section surface="light" className="!py-8 border-t border-line">
          <div className="page-container">
            <p className="max-w-prose text-sm text-muted">{study.disclaimer}</p>
          </div>
        </Section>
      )}

      {/* Next project */}
      {next && (
        <Section surface="dark" grid className="!py-[clamp(4rem,9vw,7rem)]">
          <div className="page-container">
            <TechnicalLabel as="p" marker={`${String(study.sections.length + 1).padStart(2, '0')} /`}>
              Next project
            </TechnicalLabel>
            <Link href={`/projects/${next.slug}`} className="group mt-6 flex items-baseline justify-between gap-6">
              <span className="text-display-lg transition-colors group-hover:text-signal">{next.title}</span>
              <span aria-hidden="true" className="text-display-md transition-transform group-hover:translate-x-2">
                →
              </span>
            </Link>
            <p className="mt-4 max-w-prose text-muted">{next.summary}</p>
          </div>
        </Section>
      )}
    </article>
  );
}
