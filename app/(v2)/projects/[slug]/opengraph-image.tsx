import { renderOg, ogSize, ogContentType } from '@/lib/og/template';
import { getProject, getProjects } from '@/content/projects';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Project by Razeen Iqbal';

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

// PROJECT template, generated from the project's own metadata.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  return renderOg({
    kind: 'Project',
    index: p ? `// ${p.number}` : undefined,
    title: p?.title ?? 'Projects',
    subtitle: p?.summary,
    meta: p ? `${p.year} · ${p.stack.slice(0, 3).join(' · ')}` : undefined,
  });
}
