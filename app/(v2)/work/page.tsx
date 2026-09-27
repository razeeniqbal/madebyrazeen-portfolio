import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ProjectFeature } from '@/components/v2/work/ProjectFeature';
import { ProjectIndex } from '@/components/v2/work/ProjectIndex';
import { Experience } from '@/components/v2/work/Experience';
import { Capabilities } from '@/components/v2/work/Capabilities';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { getProjects, getProjectsByTier } from '@/content/projects';

export const metadata: Metadata = {
  alternates: { canonical: '/work' },
  title: 'Work',
  description: 'Data systems, AI systems, products and experiments by Razeen Iqbal.',
};

// The professional evidence hub (refinement spec §19): highlighted work, every project, then experience and capabilities.
export default function WorkPage() {
  const highlighted = getProjectsByTier('flagship', 'featured');

  return (
    <>
      <Section surface="dark" className="!pt-16">
        <div className="page-grid gap-y-16">
          <SectionHeader as="h1" size="xl" eyebrow={`Work · ${getProjects().length} projects`} title={['Built through', 'curiosity.']} />
          {highlighted.map((p, i) => (
            <ProjectFeature
              key={p.slug}
              project={p}
              size={i === 0 ? 'flagship' : 'large'}
              sizes={i === 0 ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
              className={i === 0 ? 'col-span-full' : 'col-span-full md:col-span-4 lg:col-span-6'}
            />
          ))}
        </div>
      </Section>

      <Section surface="light">
        <div className="page-container">
          <TechnicalLabel as="h2" marker="//" className="mb-8">
            Index · every project
          </TechnicalLabel>
          <ProjectIndex projects={getProjects()} />
        </div>
      </Section>

      <Experience index="01" flush={false} surface="dark" />
      <Capabilities index="02" />

      <Section surface="light" className="border-t border-line !py-12">
        <div className="page-container flex flex-wrap items-center justify-between gap-6">
          <TechnicalLabel>Unfinished builds, experiments and live GitHub activity</TechnicalLabel>
          <ArrowLink href="/lab">Enter the lab</ArrowLink>
        </div>
      </Section>
    </>
  );
}
