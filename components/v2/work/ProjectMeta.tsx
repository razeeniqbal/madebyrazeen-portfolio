import type { Project } from '@/content/projects';
import { projectCategories } from '@/content/projects';
import { cn } from '@/lib/utils';

// Stored values stay as they are; the display vocabulary is Shipped / Active / Experiment / Archived.
const statusLabel: Record<Project['status'], string> = {
  live: 'Shipped · Live',
  'in-progress': 'Active',
  shipped: 'Shipped',
  prototype: 'Experiment',
  archived: 'Archived',
};

export const categoryLabel = (c: Project['category']) => projectCategories.find((p) => p.value === c)?.label ?? c;

/** PROJECT / 001 · 2026 · DATA ENGINEERING · ● ACTIVE */
export function ProjectMeta({ project, className }: { project: Project; className?: string }) {
  const active = project.status === 'in-progress' || project.status === 'live';
  return (
    <dl className={cn('label flex flex-wrap gap-x-6 gap-y-1 text-muted', className)}>
      <div>
        <dt className="sr-only">Project number</dt>
        <dd>Project / {project.number}</dd>
      </div>
      <div>
        <dt className="sr-only">Year</dt>
        <dd>{project.year}</dd>
      </div>
      <div>
        <dt className="sr-only">Category</dt>
        <dd>{categoryLabel(project.category)}</dd>
      </div>
      <div>
        <dt className="sr-only">Status</dt>
        <dd className="flex items-center gap-2">
          <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-lime' : 'border border-current')} />
          {statusLabel[project.status]}
        </dd>
      </div>
      {project.placeholder && (
        <div>
          <dt className="sr-only">Content</dt>
          <dd className="border border-current px-1.5">Details coming</dd>
        </div>
      )}
    </dl>
  );
}
