import type { Project } from '@/content/projects';
import { projectCategories } from '@/content/projects';
import { cn } from '@/lib/utils';

export const statusLabel: Record<Project['status'], string> = {
  active: 'Active',
  'under-construction': 'Under construction',
  'proof-of-concept': 'Proof of concept',
  completed: 'Completed',
  archived: 'Archived',
};

export const categoryLabel = (c: Project['category']) => projectCategories.find((p) => p.value === c)?.label ?? c;

/** PROJECT / 001 · 2026 · DATA ENGINEERING · ● ACTIVE */
export function ProjectMeta({ project, className }: { project: Project; className?: string }) {
  const active = project.status === 'active' || project.status === 'under-construction';
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
          {project.links.live && ' · Live'}
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
