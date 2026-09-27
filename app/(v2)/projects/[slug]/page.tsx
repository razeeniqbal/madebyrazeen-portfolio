import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { ProjectMeta } from '@/components/v2/work/ProjectMeta';
import { getProject, getProjects } from '@/content/projects';
import { getCaseStudy } from '@/content/case-studies';
import { CaseStudyView } from '@/components/v2/case-study/CaseStudyView';
import { JsonLd } from '@/components/v2/seo/JsonLd';
import { SITE_URL } from '@/lib/site';
import type { Project } from '@/content/projects';

const projectLd = (p: Project) => ({
  '@context': 'https://schema.org',
  '@type': p.links.source ? 'SoftwareSourceCode' : 'CreativeWork',
  name: p.title,
  description: p.summary,
  url: `${SITE_URL}/projects/${p.slug}`,
  dateCreated: String(p.year),
  author: { '@type': 'Person', name: 'Razeen Iqbal', url: SITE_URL },
  keywords: [...p.tags, ...p.stack].join(', '),
  ...(p.links.source && { codeRepository: p.links.source }),
});

type Params = { params: Promise<{ slug: string }> };

// Only pre-generated slugs exist; anything else is a real 404 status (not a streamed not-found).
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const study = getCaseStudy(project.slug);
  return {
    title: project.title,
    description: study?.lede ?? project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

// Full case study when one is registered, otherwise an overview from structured data.
export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const study = getCaseStudy(project.slug);
  if (study) {
    const all = getProjects();
    const next = all[(all.findIndex((p) => p.slug === project.slug) + 1) % all.length];
    return (
      <>
        <JsonLd data={projectLd(project)} />
        <CaseStudyView project={project} study={study} next={next} />
      </>
    );
  }

  return (
    <>
      <JsonLd data={projectLd(project)} />
      <Section surface="dark" className="!pt-16">
        <div className="page-grid gap-y-10">
          <div className="col-span-full">
            <ArrowLink href="/projects">All projects</ArrowLink>
          </div>
          <div className="col-span-full lg:col-span-8">
            <ProjectMeta project={project} />
            <h1 className="mt-4 text-display-xl">{project.title}</h1>
            <p className="mt-6 max-w-prose text-lead text-muted">{project.summary}</p>
          </div>
          <dl className="col-span-full space-y-5 self-end lg:col-span-4">
            <div className="border-t border-line pt-3">
              <dt className="label text-muted">Stack</dt>
              <dd className="mt-1">{project.stack.join(' · ')}</dd>
            </div>
            <div className="border-t border-line pt-3">
              <dt className="label text-muted">Tags</dt>
              <dd className="mt-1">{project.tags.join(' · ')}</dd>
            </div>
            {project.metrics?.map((m) => (
              <div key={m.label} className="border-t border-line pt-3">
                <dt className="label text-muted">{m.label}</dt>
                <dd className="mt-1">
                  {m.value}
                  {m.illustrative && <span className="label ml-2 border border-current px-1.5 text-muted">Illustrative</span>}
                </dd>
              </div>
            ))}
          </dl>
          {project.cover && (
            <figure className="col-span-full lg:col-span-9">
              <Image
                src={project.cover.src}
                width={project.cover.width}
                height={project.cover.height}
                alt={project.cover.alt}
                sizes="100vw"
                priority
                className="w-full border border-line"
              />
              <figcaption className="mt-2">
                <TechnicalLabel>{project.cover.figures === 'real' ? 'Cover art' : 'Cover art · figures illustrative'}</TechnicalLabel>
              </figcaption>
            </figure>
          )}
        </div>
      </Section>

      {/* Write-up: overview, what I built, outcome, what I learned. Facts come from projects.json. */}
      <Section surface="light">
        <div className="page-grid gap-y-12">
          <div className="col-span-full space-y-12 lg:col-span-7">
            {project.problem && (
              <section>
                <TechnicalLabel as="h2" marker="01 /">
                  Overview
                </TechnicalLabel>
                <p className="justify-copy mt-4 text-lead">{project.problem}</p>
              </section>
            )}
            {project.highlights.length > 0 && (
              <section>
                <TechnicalLabel as="h2" marker="02 /">
                  What I built
                </TechnicalLabel>
                <ul className="mt-4">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 border-t border-line py-3">
                      <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {project.outcome && (
              <section>
                <TechnicalLabel as="h2" marker="03 /">
                  Outcome
                </TechnicalLabel>
                <p className="justify-copy mt-4">{project.outcome}</p>
              </section>
            )}
            {project.learning && (
              <section>
                <TechnicalLabel as="h2" marker="04 /">
                  What I learned
                </TechnicalLabel>
                <p className="justify-copy mt-4 text-muted">{project.learning}</p>
              </section>
            )}
          </div>
          <aside className="col-span-full flex flex-col items-start gap-5 lg:col-span-4 lg:col-start-9">
            {project.role && (
              <div className="w-full border-t border-line pt-3">
                <p className="label text-muted">Role</p>
                <p className="mt-1">{project.role}</p>
              </div>
            )}
            {project.links.live && (
              <ArrowLink href={project.links.live} variant="primary" arrow="↗">
                Live site
              </ArrowLink>
            )}
            {project.links.source && (
              <ArrowLink href={project.links.source} arrow="↗">
                Source on GitHub
              </ArrowLink>
            )}
            {project.confidential && <TechnicalLabel as="p">Private repository</TechnicalLabel>}
          </aside>
        </div>
      </Section>
    </>
  );
}
