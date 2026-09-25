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

const titleSize = { flagship: 'text-display-lg', large: 'text-display-md', medium: 'text-display-sm' };

/** Image-led project block. Size carries the hierarchy (PRD §18: not identical cards). */
export function ProjectFeature({ project, size, sizes, className }: ProjectFeatureProps) {
  return (
    <article data-reveal className={cn('group', className)}>
      <Link href={`/work/${project.slug}`} className="block">
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
              Cover art · figures illustrative
            </span>
          </div>
        )}
        <div className={cn('mt-5', size === 'flagship' && 'md:grid md:grid-cols-2 md:gap-10')}>
          <div>
            <ProjectMeta project={project} />
            <h3 className={cn('mt-3 transition-colors group-hover:text-signal', titleSize[size])}>{project.title}</h3>
          </div>
          <div className={cn(size === 'flagship' ? 'mt-4 md:mt-7' : 'mt-3')}>
            <p className={cn('max-w-prose text-muted', size === 'flagship' && 'text-lead')}>{project.summary}</p>
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
