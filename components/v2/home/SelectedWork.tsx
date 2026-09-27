import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ProjectFeature } from '@/components/v2/work/ProjectFeature';
import { getHomeProjects, getProjects } from '@/content/projects';

/** Home 02. One primary + two supporting, finished work only (active builds live on /projects and /lab). */
export function SelectedWork() {
  const [primary, ...supporting] = getHomeProjects(3);
  const total = getProjects().length;

  return (
    <Section surface="light" id="work">
      <div className="page-grid gap-y-16">
        <SectionHeader index="01" eyebrow="Selected work" title={['Built through', 'curiosity.']} />

        {primary && (
          <ProjectFeature
            project={primary}
            size="flagship"
            sizes="(min-width: 1440px) 1344px, 100vw"
            className="col-span-full"
          />
        )}
        {supporting[0] && (
          <ProjectFeature
            project={supporting[0]}
            size="large"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="col-span-full md:col-span-5 lg:col-span-7"
          />
        )}
        {supporting[1] && (
          <ProjectFeature
            project={supporting[1]}
            size="medium"
            sizes="(min-width: 1024px) 38vw, (min-width: 768px) 37vw, 100vw"
            className="col-span-full md:col-span-3 lg:col-span-5 md:mt-24"
          />
        )}

        <div className="col-span-full flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <ArrowLink href="/projects">View all projects</ArrowLink>
          <TechnicalLabel>{total} projects · experience · capabilities</TechnicalLabel>
        </div>
      </div>
    </Section>
  );
}
