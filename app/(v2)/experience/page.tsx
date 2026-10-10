import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { Trajectory } from '@/components/v2/system/Trajectory';
import { CareerTimeline } from '@/components/v2/career/CareerTimeline';
import { getCareerTimeline } from '@/content/career-timeline';
import { FeaturedWork, Narrative, ProgressionLadder, RoleFacts, SmallBuild, SupportingWork } from '@/components/v2/experience/RoleParts';
import { Capabilities } from '@/components/v2/work/Capabilities';
import { CodingActivity } from '@/components/v2/experience/CodingActivity';
import { achievements } from '@/content/achievements';
import { education, recognition } from '@/content/profile';
import { getCareerStages, getCurrentRole, getExperience, roleSpan, type Role } from '@/content/experience';

export const metadata: Metadata = {
  alternates: { canonical: '/experience' },
  title: 'Experience',
  description:
    'How Razeen Iqbal’s work moved from construction sites to BIM, geotechnical data, analytics and AI data engineering: roles, selected work, credentials and live coding activity.',
};

// GitHub activity is fetched at build and refreshed at most hourly.
export const revalidate = 3600;

/** "05 / AI systems" from the role's place on the career map. */
const stageLabel = (stages: Role[], r: Role) => `${String(stages.indexOf(r) + 1).padStart(2, '0')} / ${r.stage}`;

// Experience answers "what actually happened along the way". Every fact comes from
// content/data/experience.json: the narrative here, the factual lines on /resume.
// Weight follows the story, not the chronology: the current chapter is the largest, the turning point
// (G&P) is set apart, the early engineering roles close the story compactly.
export default function ExperiencePage() {
  const roles = getExperience();
  const stages = getCareerStages();
  const at = (stage: string) => stages.find((r) => r.stage === stage);
  const current = getCurrentRole();
  const parallel = roles.filter((r) => r.relationship === 'parallel');
  const pipelines = at('Pipelines');
  const turning = at('Data');
  const foundations = [at('Model'), at('Site')].filter((r): r is Role => Boolean(r));
  const since = stages[0]?.startDate?.slice(0, 4);

  const work = current?.selectedWork.filter((w) => w.visibility === 'public') ?? [];
  const featured = work.filter((w) => w.tier === 'featured');
  const supporting = work.filter((w) => w.tier === 'supporting');
  const small = work.filter((w) => w.tier === 'small');

  return (
    <>
      {/* Hero + career map */}
      <Section surface="dark" grid className="!pt-16">
        <PageHeader
          href="/experience"
          title={['Built through', 'different disciplines.']}
          lede={[
            'My career started with physical systems, moved through data, and continues today with Data Engineering and AI.',
          ]}
          meta={[
            { label: 'Roles', value: roles.length },
            ...(since ? [{ label: 'Since', value: since }] : []),
            ...(current ? [{ label: 'Now', value: current.role }] : []),
          ]}
        />
        <div className="page-grid mt-20">
          <div className="col-span-full">
            <TechnicalLabel as="h2" marker="//" className="mb-6">
              Career timeline
            </TechnicalLabel>
            <CareerTimeline data={getCareerTimeline()} />
          </div>
        </div>
      </Section>

      {/* Current chapter */}
      {current && (
        <Section surface="dark" id={current.id} className="scroll-mt-16 border-t border-line">
          <div className="page-grid gap-y-10">
            <header className="col-span-full lg:col-span-5">
              <TechnicalLabel as="p" marker={stageLabel(stages, current)}>
                Current chapter
              </TechnicalLabel>
              <h2 className="mt-6 text-display-lg uppercase">{current.role}</h2>
              <p className="mt-3 text-lead">{current.company}</p>
              <RoleFacts role={current} className="mt-8" />
            </header>
            <Narrative role={current} className="col-span-full lg:col-span-6 lg:col-start-7 lg:self-end" />

            <div className="col-span-full mt-10">
              <TechnicalLabel as="h3" marker="//">
                Selected work · {work.length}
              </TechnicalLabel>
            </div>

            {featured.length > 0 && (
              <>
                <p className="label col-span-full -mb-4 text-ink">Featured systems</p>
                {featured.map((w, i) => (
                  <FeaturedWork key={w.id} work={w} number={String(i + 1).padStart(2, '0')} />
                ))}
              </>
            )}

            {(supporting.length > 0 || small.length > 0) && (
              <div className="col-span-full mt-6 grid gap-x-6 gap-y-10 lg:grid-cols-12">
                {supporting.length > 0 && (
                  <div className="lg:col-span-7">
                    <p className="label mb-4 text-ink">Supporting work</p>
                    {supporting.map((w) => (
                      <SupportingWork key={w.id} work={w} />
                    ))}
                  </div>
                )}
                {small.length > 0 && (
                  <div className="lg:col-span-5">
                    <p className="label mb-4 text-ink">Small build</p>
                    {small.map((w) => (
                      <SmallBuild key={w.id} work={w} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Parallel work belongs to the same period; it never replaces the current role. */}
            {parallel.map((p) => (
              <aside
                key={p.id}
                id={p.id}
                aria-labelledby={`${p.id}-title`}
                className="col-span-full mt-6 grid scroll-mt-20 gap-6 border-l-2 border-lime pl-5 md:pl-8 lg:grid-cols-12 lg:gap-x-6"
              >
                <div className="lg:col-span-5">
                  <TechnicalLabel as="p" marker="||">
                    In parallel · {roleSpan(p)}
                  </TechnicalLabel>
                  <h3 id={`${p.id}-title`} className="mt-4 text-display-sm">
                    {p.role}
                  </h3>
                  <p className="mt-1 text-muted">{p.company}</p>
                </div>
                <Narrative role={p} className="lg:col-span-6 lg:col-start-7 [&>p:first-child]:text-base [&>p:first-child]:text-ink" />
              </aside>
            ))}
          </div>
        </Section>
      )}

      {/* Transition: data becomes the job */}
      {pipelines && (
        <Section surface="light" id={pipelines.id} className="scroll-mt-16">
          <div className="page-grid gap-y-10">
            <header className="col-span-full lg:col-span-8">
              <TechnicalLabel as="p" marker={stageLabel(stages, pipelines)}>
                {pipelines.discipline}
              </TechnicalLabel>
              <h2 className="mt-6 text-display-lg uppercase">{pipelines.headline ?? pipelines.role}</h2>
              <p className="mt-4 text-lead">
                {pipelines.role}, {pipelines.company}
              </p>
              <RoleFacts role={pipelines} className="mt-6" />
            </header>
            <div className="col-span-full space-y-10 lg:col-span-6">
              <Narrative role={pipelines} />
              {pipelines.progression.length > 0 && (
                <div>
                  <p className="label mb-3 text-muted">How the interest moved</p>
                  <Trajectory steps={pipelines.progression} />
                </div>
              )}
            </div>
            <div className="col-span-full lg:col-span-5 lg:col-start-8">
              <TechnicalLabel as="h3" marker="//" className="mb-4">
                Selected work · {pipelines.selectedWork.length}
              </TechnicalLabel>
              <div className="space-y-8">
                {pipelines.selectedWork
                  .filter((w) => w.visibility === 'public')
                  .map((w) => (
                    <SupportingWork key={w.id} work={w} />
                  ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Turning point */}
      {turning && (
        <Section surface="dark" grid id={turning.id} className="scroll-mt-16">
          <div className="page-grid gap-y-12">
            <header className="col-span-full">
              <TechnicalLabel as="p" marker={stageLabel(stages, turning)}>
                Turning point
              </TechnicalLabel>
              <h2 className="mt-6 max-w-[16ch] text-display-xl uppercase">{turning.headline ?? turning.role}</h2>
              <p className="mt-6 text-lead">
                {turning.role}, {turning.company}
              </p>
              <RoleFacts role={turning} className="mt-6" />
            </header>
            <Narrative role={turning} className="col-span-full lg:col-span-6" />
            {turning.progression.length > 0 && (
              <div className="col-span-full lg:col-span-4 lg:col-start-9">
                <p className="label mb-5 text-muted">From engineering to data</p>
                <ProgressionLadder steps={turning.progression} label={`${turning.company}: from ${turning.progression[0]} to ${turning.progression.at(-1)}`} />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Foundations */}
      {foundations.length > 0 && (
        <Section surface="light" id="foundations" className="scroll-mt-16">
          <div className="page-grid gap-y-12">
            <SectionHeader eyebrow="Foundations" title={['Where it started.']} size="md" />
            {foundations.map((r) => (
              <article key={r.id} id={r.id} className="col-span-full scroll-mt-20 border-t border-line pt-6 md:col-span-4 lg:col-span-6">
                <TechnicalLabel as="p" marker={stageLabel(stages, r)}>
                  {r.discipline}
                </TechnicalLabel>
                <h3 className="mt-4 text-display-sm">{r.role}</h3>
                <p className="mt-1 text-muted">{r.company}</p>
                <RoleFacts role={r} className="mt-5" />
                <Narrative role={r} className="mt-6 [&>p:first-child]:text-base [&>p:first-child]:text-ink" />
                {r.progression.length > 0 && <Trajectory steps={r.progression} className="mt-6" />}
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* Reference: capabilities, education, credentials, activity */}
      <Capabilities index={null} />

      <Section surface="dark" id="credentials">
        <div className="page-grid gap-y-10">
          <SectionHeader eyebrow="Education and credentials" title={[`${achievements.length} certifications`, '& courses.']} size="md" />
          <ul className="col-span-full grid gap-x-6 gap-y-6 md:grid-cols-2">
            {education.map((e) => (
              <li key={e.institution} className="border-t border-line pt-4">
                <p className="label text-muted">{e.period}</p>
                <p className="mt-1 font-semibold">
                  {e.degree}, {e.field}
                </p>
                <p className="mt-1 text-sm text-muted">{e.institution}</p>
              </li>
            ))}
          </ul>
          <div className="col-span-full">
            <ArrowLink href="/credentials">All {achievements.length} credentials</ArrowLink>
          </div>
          <div className="col-span-full border-t border-line pt-10">
            <TechnicalLabel as="h3" marker="//">
              Achievements
            </TechnicalLabel>
            <ul className="mt-6 grid gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
              {recognition.map((r) => (
                <li key={r.title} className="border-t border-line pt-4">
                  <p className="label text-muted">{r.year}</p>
                  <p className="mt-1 font-semibold">{r.title}</p>
                  <p className="mt-1 text-sm text-muted">{r.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <div className="border-t border-line">
        <CodingActivity />
      </div>

      {/* Closing */}
      <Section surface="dark" grid className="border-t border-line">
        <div className="page-grid gap-y-12">
          <p className="col-span-full max-w-[24ch] text-display-md">
            Different disciplines. <span className="text-muted">The same habit of understanding how things work.</span>
          </p>
          <div className="col-span-full flex flex-wrap gap-x-8 gap-y-4">
            <ArrowLink href="/projects" variant="primary">
              View projects
            </ArrowLink>
            <ArrowLink href="/trainer">Training & speaking</ArrowLink>
          </div>
        </div>
      </Section>
    </>
  );
}
