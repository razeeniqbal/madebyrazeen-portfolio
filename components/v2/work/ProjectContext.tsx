import Link from 'next/link';
import { getRoleForProject } from '@/content/experience';
import { getLifeInterests } from '@/content/life';

/**
 * Where a project sits in the wider site, derived from canonical records (nothing is restated):
 * the role whose selected work links to it (QualityPlus → AEM Energy Solutions) and the Life interest
 * it grew out of (VSB → Volleyball, Sepang Vision Lab → Formula 1).
 */
export function ProjectContext({ slug }: { slug: string }) {
  const role = getRoleForProject(slug);
  const interest = getLifeInterests().find((i) => i.relatedProject === slug);
  if (!role && !interest) return null;
  return (
    <ul aria-label="Related" className="label flex flex-wrap gap-x-6 gap-y-2 text-muted">
      {role && (
        <li>
          Professional work ·{' '}
          <Link href={`/experience#${role.id}`} className="border-b border-current text-ink hover:text-signal">
            {role.company}
          </Link>
        </li>
      )}
      {interest && (
        <li>
          From{' '}
          <Link href={`/life#${interest.slug}`} className="border-b border-current text-ink hover:text-signal">
            Life / {interest.name}
          </Link>
        </li>
      )}
    </ul>
  );
}
