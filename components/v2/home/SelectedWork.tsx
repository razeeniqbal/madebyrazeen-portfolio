import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ProjectFeature } from '@/components/v2/work/ProjectFeature';
import { ProjectRow } from '@/components/v2/work/ProjectRow';
import { getProjects, getProjectsByTier } from '@/content/projects';

export function SelectedWork() {
  const [flagship] = getProjectsByTier('flagship');
  const featured = getProjectsByTier('featured').slice(0, 2);
  const more = getProjectsByTier('standard').slice(0, 4);
  const total = getProjects().length;

  return (
    <Section surface="dark" id="work">
      <div className="page-grid gap-y-16">
        <SectionHeader index="02" eyebrow="Selected work" title={['Built through', 'curiosity.']} />

        {flagship && (
          <ProjectFeature
            project={flagship}
            size="flagship"
            sizes="(min-width: 1440px) 1344px, 100vw"
            className="col-span-full"
          />
        )}

        {featured[0] && (
          <ProjectFeature
            project={featured[0]}
            size="large"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="col-span-full md:col-span-5 lg:col-span-7"
          />
        )}
        {featured[1] && (
          <ProjectFeature
            project={featured[1]}
            size="medium"
            sizes="(min-width: 1024px) 38vw, (min-width: 768px) 37vw, 100vw"
            className="col-span-full md:col-span-3 lg:col-span-5 md:mt-24"
          />
        )}

        <div className="col-span-full">
          <TechnicalLabel as="p" marker="//" className="mb-4">
            Other experiments
          </TechnicalLabel>
          <ol>
            {more.map((p) => (
              <ProjectRow key={p.slug} project={p} />
            ))}
          </ol>
          <div className="border-t border-line pt-8">
            <ArrowLink href="/work">All {total} projects</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
