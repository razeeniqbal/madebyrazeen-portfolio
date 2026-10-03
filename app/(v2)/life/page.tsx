import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { ProjectMeta } from '@/components/v2/work/ProjectMeta';
import { getLifeInterests, type LifeInterest } from '@/content/life';
import { getProject } from '@/content/projects';
import { getTotals, getSyncInfo, isSampleData, formatDate } from '@/content/running';
import { assets } from '@/lib/assets';

export const metadata: Metadata = {
  alternates: { canonical: '/life' },
  title: { absolute: 'Life | Razeen Iqbal' },
  description: 'Running, volleyball, Formula 1 and the interests that sometimes become projects by Razeen Iqbal.',
};

/** Running in numbers, always derived from the synced data (never written into content). */
function RunningFacts() {
  if (isSampleData()) return null;
  const t = getTotals();
  const sync = getSyncInfo();
  const facts = [
    { label: 'Outdoor runs', value: String(t.runs) },
    { label: 'Distance', value: `${t.km.toFixed(0)} km` },
    t.since && { label: 'Since', value: formatDate(t.since, { month: 'short', year: 'numeric' }) },
    sync && { label: 'Updated', value: formatDate(sync.syncedAt) },
  ].filter((f): f is { label: string; value: string } => Boolean(f));
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
      {facts.map((f) => (
        <div key={f.label} className="border-t border-line pt-3">
          <dt className="label text-muted">{f.label}</dt>
          <dd className="mt-1 text-display-sm">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** An interest that became a project: the project's own record, linked, never re-described. */
function RelatedProject({ interest }: { interest: LifeInterest }) {
  const project = interest.relatedProject ? getProject(interest.relatedProject) : undefined;
  if (!project) return null;
  return (
    <Link href={interest.href} className="group block border border-line p-5 transition-colors hover:border-ink md:p-6">
      <TechnicalLabel as="p" marker="→">
        Became a project
      </TechnicalLabel>
      <p className="mt-4 text-display-md transition-colors group-hover:text-signal">{project.title}</p>
      {project.fullName && <p className="mt-1 text-muted">{project.fullName}</p>}
      <ProjectMeta project={project} className="mt-4" />
      {project.origin && <TechnicalLabel as="p" className="mt-3">{project.origin}</TechnicalLabel>}
      <span className="label mt-5 inline-block border-b border-current pb-1">
        View {project.title} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

// Life sits next to the work but is looser: fewer labels, more room. Each interest leads somewhere real:
// Running to /running, Volleyball to VSB, Formula 1 to Sepang Vision Lab (content/data/life.json).
export default function LifePage() {
  const interests = getLifeInterests();

  return (
    <>
      {/* 01 Hero */}
      <Section surface="light" className="!pt-16">
        <PageHeader
          href="/life"
          title={['Not everything', 'needs to be work.']}
          lede={[
            'Running clears my head. Volleyball gives me somewhere to compete and connect. Formula 1 gives me another reason to think about data.',
            'Sometimes those interests stay away from the computer. Sometimes they become projects.',
          ]}
          meta={[{ label: 'Interests', value: interests.map((i) => i.name).join(' · ') }]}
        />
      </Section>

      {/* 02 to 04: one section per interest, in the canonical order */}
      {interests.map((interest, i) => {
        const index = String(i + 2).padStart(2, '0');
        const running = interest.dataSource === 'running';
        return (
          <Section
            key={interest.slug}
            id={interest.slug}
            surface={i % 2 === 0 ? 'dark' : 'light'}
            className="scroll-mt-16"
          >
            <div className="page-grid gap-y-10">
              <div className={running ? 'col-span-full lg:col-span-5' : 'col-span-full lg:col-span-7'}>
                <SectionHeader index={index} eyebrow={`Life / ${interest.name}`} title={[`${interest.name}.`]} size="lg" />
                {interest.story.length > 0 ? (
                  // The interest first, then the problem it surfaced, then the project: a numbered sequence, not a CTA.
                  <ol aria-label={`${interest.name}, step by step`} className="mt-10 border-l border-line">
                    {interest.story.map((s, n) => {
                      const last = n === interest.story.length - 1;
                      return (
                        <li key={s.label} className="relative pb-7 pl-6 last:pb-0">
                          <span
                            aria-hidden="true"
                            className={last ? 'absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-lime ring-1 ring-ink' : 'absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-muted bg-surface'}
                          />
                          <p className="label text-muted">
                            {String(n + 1).padStart(2, '0')} / {s.label}
                          </p>
                          <p className={last ? 'mt-1.5 max-w-prose text-lead text-ink' : 'mt-1.5 max-w-prose text-lead text-muted'}>{s.text}</p>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <div className="mt-8 max-w-prose space-y-4 text-lead text-muted">
                    {interest.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                {running && (
                  <div className="mt-8">
                    <ArrowLink href={interest.href} variant="primary">
                      Open running
                    </ArrowLink>
                  </div>
                )}
              </div>

              <div className={running ? 'col-span-full space-y-8 lg:col-span-6 lg:col-start-7 lg:self-end' : 'col-span-full space-y-8 lg:col-span-4 lg:col-start-9 lg:self-end'}>
                {running ? (
                  <>
                    <PhotoFrame
                      image={assets.running.race}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      aspect="aspect-[4/3]"
                      caption="Road race"
                    />
                    <RunningFacts />
                  </>
                ) : (
                  <RelatedProject interest={interest} />
                )}
              </div>
            </div>
          </Section>
        );
      })}
    </>
  );
}
