import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PrimaryBuild } from '@/components/v2/work/PrimaryBuild';
import { ProjectRow } from '@/components/v2/work/ProjectRow';
import { getPrimaryBuilds, getProjects, getSecondaryProjectGroups } from '@/content/projects';
import { getRoleForProject, shortCompany } from '@/content/experience';

export const metadata: Metadata = {
  alternates: { canonical: '/projects' },
  title: 'Projects',
  description: 'Primary builds, professional systems, research and experiments by Razeen Iqbal.',
};

/** Work done in a role is labelled with the employer instead of a category (QualityPlus → AEM Energy Solutions). */
function roleNote(slug: string) {
  const role = getRoleForProject(slug);
  return role ? shortCompany(role.company) : undefined;
}

// Hierarchy first (taxonomy in content/data/projects.json): the four primary builds, then everything
// else grouped by kind. Professional systems point back to the role they belong to.
export default function ProjectsPage() {
  const primary = getPrimaryBuilds();
  const groups = getSecondaryProjectGroups();

  return (
    <>
      <Section surface="dark" className="!pt-16">
        <PageHeader
          href="/projects"
          title={['Built through', 'curiosity.']}
          lede={['Something catches my attention. I understand the problem. I learn what I need. Then I try to build it.']}
          meta={[
            { label: 'Primary builds', value: primary.length },
            { label: 'Projects', value: getProjects().length },
          ]}
        />

        {/* 01 Primary builds: same surface as the heading, so the hierarchy reads as one block. */}
        <div id="primary" className="page-grid mt-24 scroll-mt-20 gap-y-12">
          <SectionHeader index="01" eyebrow={`Primary builds · ${primary.length}`} title={['Four builds,', 'four origins.']} size="md" />
          <div className="col-span-full space-y-20">
            {primary.map((p, i) => (
              <PrimaryBuild key={p.slug} project={p} index={String(i + 1).padStart(2, '0')} side={i % 2 === 0 ? 'left' : 'right'} />
            ))}
          </div>
        </div>
      </Section>

      {/* 02+ Secondary groups */}
      <Section surface="light" id="more">
        <div className="page-container space-y-20">
          {groups.map((g, gi) => {
            const roles = [...new Map(g.projects.map((p) => getRoleForProject(p.slug)).filter((r) => r !== undefined).map((r) => [r.id, r])).values()];
            return (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-20">
                <TechnicalLabel as="h2" marker={`${String(gi + 2).padStart(2, '0')} /`} className="mb-6">
                  <span id={`${g.id}-title`}>
                    {g.label} · {g.projects.length}
                  </span>
                </TechnicalLabel>
                <ol>
                  {g.projects.map((p) => (
                    <ProjectRow
                      key={p.slug}
                      project={p}
                      note={roleNote(p.slug)}
                      showSummary={g.id === 'professional'}
                      quiet={g.id === 'earlier'}
                    />
                  ))}
                </ol>
                {roles.length > 0 && (
                  <div className="flex flex-wrap gap-6 border-t border-line pt-6">
                    {roles.map((r) => (
                      <ArrowLink key={r.id} href={`/experience#${r.id}`}>
                        {shortCompany(r.company)} in Experience
                      </ArrowLink>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </Section>
    </>
  );
}
