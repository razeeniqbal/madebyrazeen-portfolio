import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
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
  url: `${SITE_URL}/work/${p.slug}`,
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
    alternates: { canonical: `/work/${project.slug}` },
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
            <ArrowLink href="/work">All work</ArrowLink>
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
            <figure className="col-span-full">
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
                <TechnicalLabel>Cover art · figures illustrative</TechnicalLabel>
              </figcaption>
            </figure>
          )}
        </div>
      </Section>

      <Section surface="light">
        <div className="page-grid gap-y-10">
          <div className="col-span-full flex items-start gap-8 md:col-span-6 lg:col-span-7">
            <MiniRazeen pose="thinking" height={120} className="hidden shrink-0 md:block" />
            <div>
              <TechnicalLabel as="p" marker="//">
                Full case study coming
              </TechnicalLabel>
              <p className="mt-4 text-lead">
                {project.problem ??
                  'The full write-up (problem, thinking, architecture, build, outcome and what I learned) is being written.'}
              </p>
            </div>
          </div>
          <div className="col-span-full flex flex-col items-start gap-5 md:col-span-2 lg:col-span-3 lg:col-start-10">
            {project.links.live && <ArrowLink href={project.links.live} variant="primary">Live site</ArrowLink>}
            {project.links.source && <ArrowLink href={project.links.source}>Source on GitHub</ArrowLink>}
            {project.confidential && <TechnicalLabel as="p">Private repository</TechnicalLabel>}
          </div>
        </div>
      </Section>
    </>
  );
}
