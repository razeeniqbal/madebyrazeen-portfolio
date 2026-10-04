import { renderOg, ogSize, ogContentType } from '@/lib/og/template';
import { profile } from '@/content/profile';
import { home } from '@/content/home';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Razeen Iqbal · Portfolio';

// IDENTITY template: default for every page without its own image.
export default function Image() {
  return renderOg({
    kind: 'Portfolio',
    index: profile.role,
    title: profile.statement.join(' '),
    subtitle: 'Data engineering · AI systems · Product building',
    // Same arc as the Home hero.
    meta: home.hero.arc.join(' → '),
    pose: 'front',
  });
}
