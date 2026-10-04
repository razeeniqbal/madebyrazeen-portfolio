import Image from 'next/image';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { statusLabel } from '@/components/v2/work/ProjectMeta';
import { evidenceCaption } from '@/lib/assets';
import { getProject } from '@/content/projects';
import { getSelectedWork, shortCompany, type FlowStepType } from '@/content/experience';
import { home } from '@/content/home';
import { cn } from '@/lib/utils';

// Who does what in the flow. The checks are deterministic code; AI only suggests; a person decides.
const role: Partial<Record<FlowStepType, string>> = {
  PROCESS: 'Deterministic checks',
  AGENT: 'Suggests',
  USER: 'A person decides',
};

/**
 * Home 03. Professional, applied work, kept apart from the personal builds. Facts come from the
 * Experience record and the project (flow, context, status, recognition); the copy is Home's own.
 */
export function FeaturedWork() {
  const project = getProject(home.featuredWork.project);
  const work = getSelectedWork().find((w) => w.projectSlug === home.featuredWork.project);
  if (!project || !work) return null;
  // Only the first "person" step gets the annotation, so the label marks where the decision is made.
  const firstUser = work.flow.findIndex((s) => s.type === 'USER');

  return (
    <Section surface="dark" className="border-t border-line !pt-[clamp(4.5rem,9vw,8rem)]">
      <div className="page-grid gap-y-10">
        <SectionHeader index="03" eyebrow="Featured work" title={home.featuredWork.title} size="md" className="lg:col-span-8" />

        <div className="col-span-full space-y-6 lg:col-span-5">
          <p className="label flex flex-wrap gap-x-2 gap-y-1 text-muted">
            <span className="text-ink">{project.title}</span>
            <span aria-hidden="true">·</span>
            <span>Professional work at {shortCompany(work.company)}</span>
            {project.status && (
              <>
                <span aria-hidden="true">·</span>
                <span>{statusLabel[project.status]}</span>
              </>
            )}
          </p>
          {home.featuredWork.body.map((p) => (
            <p key={p} className="text-muted">
              {p}
            </p>
          ))}
          {work.recognition && <TechnicalLabel as="p">{work.recognition}</TechnicalLabel>}
          <ArrowLink href={`/projects/${project.slug}`}>Read the case study</ArrowLink>
        </div>

        {project.cover && (
          <figure data-reveal className="col-span-full lg:col-span-7">
            <div className="relative overflow-hidden border border-line bg-raised">
              <Image
                src={project.cover.src}
                width={project.cover.width}
                height={project.cover.height}
                alt={project.cover.alt}
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="w-full"
              />
            </div>
            <figcaption className="label mt-3 text-muted">{evidenceCaption(project.cover)}</figcaption>
          </figure>
        )}

        {/* Phones: one compact row per step. Desktop: the seven steps side by side. */}
        <ol aria-label={`${project.title} workflow`} className="col-span-full border-t border-line lg:grid lg:grid-cols-7 lg:gap-px lg:border lg:bg-line">
          {work.flow.map((s, i) => {
            const note = s.type === 'USER' ? (i === firstUser ? role.USER : undefined) : role[s.type];
            return (
              <li
                key={s.label}
                className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 border-b border-line py-2.5 lg:block lg:border-0 lg:bg-surface lg:p-4"
              >
                <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                <p className="font-semibold leading-snug lg:mt-2">{s.label}</p>
                {note ? <p className={cn('label lg:mt-2', s.type === 'AGENT' ? 'text-muted' : 'text-signal')}>{note}</p> : <span />}
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
