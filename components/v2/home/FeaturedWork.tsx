import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { statusLabel } from '@/components/v2/work/ProjectMeta';
import { getProject } from '@/content/projects';
import { getSelectedWork, shortCompany } from '@/content/experience';
import { QualityWorkflowDemo } from '@/components/v2/work/QualityWorkflowDemo';
import { home } from '@/content/home';


/**
 * Home 03. Professional, applied work, kept apart from the personal builds. Facts come from the
 * Experience record and the project (flow, context, status, recognition); the copy is Home's own.
 */
export function FeaturedWork() {
  const project = getProject(home.featuredWork.project);
  const work = getSelectedWork().find((w) => w.projectSlug === home.featuredWork.project);
  if (!project || !work) return null;

  return (
    // A raised black surface and a rule mark the turn from the career story (Path) to applied work,
    // without switching to light just to alternate.
    <Section surface="dark" className="border-t border-line !bg-raised !pt-[clamp(4.5rem,9vw,8rem)]">
      <div className="page-grid gap-y-8 lg:gap-y-10">
        <SectionHeader index="03" eyebrow="Featured work" title={home.featuredWork.title} size="md" className="lg:col-span-8" />

        {/* Phones read: context and one paragraph, the interactive workflow, then recognition and the link.
            Desktop: copy and link on the left, the workflow on the right. */}
        <div className="col-span-full space-y-5 lg:col-span-5 lg:row-start-2">
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
        </div>

        <div data-reveal className="col-span-full lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-2">
          <QualityWorkflowDemo />
        </div>

        <div className="col-span-full space-y-5 lg:col-span-5 lg:row-start-3 lg:self-end lg:pb-8">
          {work.recognition && <TechnicalLabel as="p">{work.recognition}</TechnicalLabel>}
          <ArrowLink href={`/projects/${project.slug}`}>Read the case study</ArrowLink>
        </div>

      </div>
    </Section>
  );
}
