import Link from 'next/link';
import type { Project } from '@/content/projects';
import { categoryLabel } from './ProjectMeta';
import { cn } from '@/lib/utils';

interface ProjectRowProps {
  project: Project;
  /** Replaces the category, e.g. the employer for professional work. */
  note?: string;
  /** Show the one-line summary under the title (professional systems). */
  showSummary?: boolean;
  /** Quieter type for earlier work: still listed, not competing. */
  quiet?: boolean;
}

/** Compact editorial row: number · title · category (or a note such as the employer) · year → */
export function ProjectRow({ project, note, showSummary, quiet }: ProjectRowProps) {
  const detail = note ?? categoryLabel(project.category);
  return (
    <li data-reveal className="border-t border-line">
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          'group grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 gap-y-1 md:grid-cols-[4rem_1fr_12rem_4rem_2rem]',
          quiet ? 'py-3' : 'py-5',
        )}
      >
        <span className="label text-muted">{project.number}</span>
        <span>
          <span
            className={cn(
              'transition-colors group-hover:text-signal',
              quiet ? 'text-base text-muted' : 'text-lg font-semibold md:text-xl',
            )}
          >
            {project.title}
          </span>
          {showSummary && <span className="mt-1 block max-w-prose text-sm text-muted">{project.summary}</span>}
          <span className="mt-1 block max-w-prose text-sm text-muted md:hidden">{detail}</span>
        </span>
        <span className="label hidden text-muted md:block">{detail}</span>
        <span className="label text-muted">{project.year}</span>
        <span aria-hidden="true" className="hidden text-right transition-transform group-hover:translate-x-1 md:block">
          →
        </span>
      </Link>
    </li>
  );
}
