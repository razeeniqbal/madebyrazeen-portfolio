import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/projects';
import { ProjectMeta } from './ProjectMeta';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { cn } from '@/lib/utils';

interface ProjectFeatureProps {
  project: Project;
  size: 'flagship' | 'large' | 'medium';
  sizes: string;
  className?: string;
}

const titleSize = { flagship: 'text-display-md', large: 'text-display-md', medium: 'text-display-sm' };

/** Image-led project block. Size carries the hierarchy (PRD §18: not identical cards). */
export function ProjectFeature({ project, size, sizes, className }: ProjectFeatureProps) {
  const flagship = size === 'flagship';
  return (
    <article data-reveal className={cn('group', className)}>
      {/* Flagship: artwork and text side by side on desktop so the cover never fills the whole screen. */}
      <Link href={`/projects/${project.slug}`} className={cn('block', flagship && 'lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10')}>
        <div className={cn(flagship && 'lg:col-span-8')}>
        {!project.cover && (
          // No artwork yet: a typographic tile at the cover ratio, so the layout holds until art is added.
          <div className="relative flex aspect-[1672/941] flex-col justify-between overflow-hidden border border-line bg-raised p-5 md:p-7">
            <TechnicalLabel>Project / {project.number}</TechnicalLabel>
            <p className="text-display-lg leading-none text-ink transition-transform duration-700 ease-out group-hover:translate-x-1 motion-reduce:transition-none">
              {project.title}
              <span aria-hidden="true" className="ml-[0.04em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-lime" />
            </p>
            {project.links.live && <TechnicalLabel>{project.links.live.replace(/^https?:\/\//, '')}</TechnicalLabel>}
          </div>
        )}
        {project.cover && (
          <div className="relative overflow-hidden border border-line bg-raised">
            <Image
              src={project.cover.src}
              width={project.cover.width}
              height={project.cover.height}
              alt={project.cover.alt}
              sizes={sizes}
              className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
            />
            <span className="label absolute bottom-0 right-0 bg-carbon/85 px-2 py-1 text-[0.625rem] text-warm/80">
              {project.cover.figures === 'real' ? 'Cover art' : 'Cover art · figures illustrative'}
            </span>
          </div>
        )}
        </div>
        <div className={cn('mt-5', flagship && 'lg:col-span-4 lg:mt-0')}>
          <div>
            <ProjectMeta project={project} />
            <h3 className={cn('mt-3 transition-colors group-hover:text-signal', titleSize[size])}>{project.title}</h3>
          </div>
          <div className={cn(flagship ? 'mt-4' : 'mt-3')}>
            <p className={cn('max-w-prose text-muted', flagship && 'text-lead')}>{project.summary}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <TechnicalLabel>{project.stack.slice(0, 4).join(' · ')}</TechnicalLabel>
              <span className="label" aria-hidden="true">
                View project →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
