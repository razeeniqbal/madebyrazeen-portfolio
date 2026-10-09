import Image from 'next/image';
import Link from 'next/link';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { statusLabel } from './ProjectMeta';
import { evidenceCaption } from '@/lib/assets';
import type { Project } from '@/content/projects';
import { cn } from '@/lib/utils';

interface PrimaryBuildProps {
  project: Project;
  /** "01" */
  index: string;
  /** Which side the evidence sits on; alternating keeps four different products from reading as one template. */
  side: 'left' | 'right';
}

/**
 * One primary build on /projects: origin, what it is, status and role, beside real product evidence.
 * The evidence comes from the project record (`productImage`, plus `productImageMobile` when the product
 * has a phone layout), so a product with a phone view shows both and one without shows a single wide screen.
 */
export function PrimaryBuild({ project: p, index, side }: PrimaryBuildProps) {
  return (
    <article
      id={p.slug}
      aria-labelledby={`${p.slug}-title`}
      className="grid scroll-mt-20 grid-cols-1 items-center gap-x-10 gap-y-8 border-t border-line pt-10 lg:grid-cols-12"
    >
      <div className={cn('lg:col-span-7', side === 'right' && 'lg:order-2 lg:col-start-6')}>
        <PrimaryBuildEvidence project={p} />
      </div>
      <div className={cn('lg:col-span-5', side === 'right' && 'lg:order-1')}>
        <PrimaryBuildStory project={p} index={index} />
      </div>
    </article>
  );
}

/** The real product capture (and phone capture when the product has one), linked to the case study. */
export function PrimaryBuildEvidence({ project: p, priority }: { project: Project; priority?: boolean }) {
  const main = p.productImage ?? p.cover;
  const phone = p.productImageMobile;
  const href = `/projects/${p.slug}`;
  const kind = main ? evidenceCaption(main) : undefined;
  return (
    <>
        {main && (
          <figure>
            <Link href={href} className="group relative block" aria-label={`${p.title} case study`}>
              <div className="overflow-hidden border border-line bg-raised">
                <Image
                  src={main.src}
                  width={main.width}
                  height={main.height}
                  alt={main.alt}
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  priority={priority}
                  className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
                />
              </div>
              {phone && (
                // The phone capture overlaps the corner on wide screens and sits below on narrow ones.
                <div className="mx-auto mt-4 w-[38%] max-w-[11rem] overflow-hidden rounded-[1.1rem] border-4 border-ink/80 bg-raised shadow-[0_18px_40px_rgb(0_0_0/0.35)] sm:absolute sm:-bottom-6 sm:mt-0 sm:w-[22%] sm:-right-4 sm:max-w-none lg:-bottom-8 lg:w-[24%]">
                  <Image src={phone.src} width={phone.width} height={phone.height} alt={phone.alt} sizes="(min-width: 1024px) 14vw, 30vw" className="w-full" />
                </div>
              )}
            </Link>
            {kind && (
              <figcaption className={cn('mt-3', phone && 'sm:mt-10 lg:mt-12')}>
                <TechnicalLabel>{kind}</TechnicalLabel>
              </figcaption>
            )}
          </figure>
        )}
    </>
  );
}

/** Origin, name, summary, status and role, with the case study and live links. */
export function PrimaryBuildStory({ project: p, index, titleId = `${p.slug}-title` }: { project: Project; index: string; titleId?: string }) {
  const building = p.status === 'under-construction';
  const href = `/projects/${p.slug}`;
  return (
    <div>
        <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
          <span className="text-ink">{index}</span>
          {p.origin && <span className="text-ink">{p.origin}</span>}
        </p>
        <h3 id={titleId} className="mt-4 text-display-lg">
          <Link href={href} className="transition-colors hover:text-signal">
            {p.title}
          </Link>
        </h3>
        {(p.fullName || p.tagline) && <p className="mt-2 text-lead text-muted">{p.fullName ?? p.tagline}</p>}
        <p className="mt-5 max-w-prose">{p.summary}</p>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 text-sm">
          <div>
            <dt className="label text-muted">Status</dt>
            <dd className={cn('mt-1 flex items-center gap-2', building && 'font-semibold')}>
              <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', building ? 'border-2 border-signal' : 'bg-lime ring-1 ring-ink')} />
              {statusLabel[p.status]}
              {p.links.live && <span className="text-muted">· Live</span>}
            </dd>
          </div>
          {p.role && (
            <div>
              <dt className="label text-muted">Role</dt>
              <dd className="mt-1">{p.role}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {p.caseStudy && (
            <ArrowLink href={href} variant="primary">
              Case study
            </ArrowLink>
          )}
          {p.links.live && (
            <ArrowLink href={p.links.live} arrow="↗">
              View live product
            </ArrowLink>
          )}
        </div>
    </div>
  );
}
