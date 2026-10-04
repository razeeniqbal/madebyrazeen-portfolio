import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { statusLabel } from '@/components/v2/work/ProjectMeta';
import { evidenceLabel } from '@/lib/assets';
import { getProject, getProjects, type Project } from '@/content/projects';
import { home } from '@/content/home';
import { cn } from '@/lib/utils';

// Desktop: a staggered 2 × 2. The wide cards anchor the left and right edges in turn, the narrow ones
// drop or lift so no row reads as a uniform strip. Tablet and phone: an even 2 × 2.
const layout = [
  'lg:col-span-7',
  'lg:col-span-5 lg:mt-20',
  'lg:col-span-5',
  'lg:col-span-7 lg:-mt-10',
];

/**
 * Home 01. Four builds chosen on purpose (home.json), each led by where it started, not by its stack.
 * Images are real captures of each product; the card only has to make someone open the case study.
 */
export function SelectedBuilds() {
  const builds = home.builds.projects.map((slug) => getProject(slug)).filter((p): p is Project => Boolean(p));
  const total = getProjects().length;

  return (
    <Section surface="light" id="work">
      <div className="page-grid gap-y-12 md:gap-y-16">
        <SectionHeader index="01" eyebrow="Selected builds" title={home.builds.title} size="md" />

        <ul className="col-span-full grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16">
          {builds.map((p, i) => (
            <li key={p.slug} className={cn('min-w-0', layout[i])}>
              <BuildCard project={p} wide={i === 0 || i === 3} />
            </li>
          ))}
        </ul>

        <div className="col-span-full flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <ArrowLink href="/projects">View all projects</ArrowLink>
          <TechnicalLabel>{total} projects</TechnicalLabel>
        </div>
      </div>
    </Section>
  );
}

function BuildCard({ project: p, wide }: { project: Project; wide: boolean }) {
  const image = p.productImage ?? p.cover;
  const live = p.status === 'active' || p.status === 'under-construction';
  return (
    <article data-reveal className="group">
      <Link href={`/projects/${p.slug}`} className="block">
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden border border-line bg-raised">
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
              sizes={wide ? '(min-width: 1024px) 56vw, 50vw' : '(min-width: 1024px) 40vw, 50vw'}
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
            />
            {image.evidence && (
              <span className="label absolute bottom-0 right-0 hidden bg-carbon/85 px-2 py-1 text-[0.625rem] text-warm/80 md:block">
                {evidenceLabel[image.evidence]}
              </span>
            )}
          </div>
        )}
        {p.origin && <p className="label mt-4 text-muted">{p.origin}</p>}
        <h3 className={cn('mt-2 font-bold leading-none tracking-[-0.03em] transition-colors group-hover:text-signal', wide ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-4xl')}>
          {p.title}
        </h3>
        {/* The one-line summary is a desktop and tablet detail; phones get origin, name and state only. */}
        <p className="mt-3 hidden max-w-prose text-muted md:line-clamp-2">{p.summary}</p>
        <p className="label mt-3 flex flex-wrap items-center gap-x-2 text-muted">
          <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', live ? 'bg-lime' : 'border border-current')} />
          {statusLabel[p.status]}
          {p.links.live && ' · Live'}
          <span aria-hidden="true" className="ml-auto hidden text-ink md:inline">
            Case study →
          </span>
        </p>
      </Link>
    </article>
  );
}
