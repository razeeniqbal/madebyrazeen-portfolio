import Link from 'next/link';
import type { Project } from '@/content/projects';
import { categoryLabel } from './ProjectMeta';

/** Compact editorial row: number · title · category (or a note such as the employer) · year → */
export function ProjectRow({ project, note }: { project: Project; note?: string }) {
  const detail = note ?? categoryLabel(project.category);
  return (
    <li className="border-t border-line">
      <Link
        href={`/projects/${project.slug}`}
        className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-5 md:grid-cols-[4rem_1fr_12rem_4rem_2rem]"
      >
        <span className="label text-muted">{project.number}</span>
        <span>
          <span className="text-lg font-semibold transition-colors group-hover:text-signal md:text-xl">{project.title}</span>
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
