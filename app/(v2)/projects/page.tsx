import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ProjectFeature } from '@/components/v2/work/ProjectFeature';
import { ProjectIndex } from '@/components/v2/work/ProjectIndex';
import { getProjects, getProjectsByTier } from '@/content/projects';

export const metadata: Metadata = {
  alternates: { canonical: '/projects' },
  title: 'Projects',
  description: 'Data systems, AI systems, products and experiments by Razeen Iqbal.',
};

// Project work only: highlighted projects, then the full index. Roles, skills and credentials live on /experience.
export default function ProjectsPage() {
  const highlighted = getProjectsByTier('flagship', 'featured');

  return (
    <>
      <Section surface="dark" className="!pt-16">
        <div className="page-grid gap-y-16">
          <SectionHeader as="h1" size="xl" eyebrow={`Projects · ${getProjects().length}`} title={['Built through', 'curiosity.']} />
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
          <Suspense fallback={null}>
            <ProjectIndex projects={getProjects()} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
