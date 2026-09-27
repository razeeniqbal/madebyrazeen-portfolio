import { renderOg, ogSize, ogContentType } from '@/lib/og/template';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Razeen Iqbal · Portfolio';

// IDENTITY template: default for every page without its own image.
export default function Image() {
  return renderOg({
    kind: 'Portfolio',
    title: 'Engineer. Builder. Curious human.',
    subtitle: 'Data engineering · AI systems · Product building',
    meta: 'Ideas → Systems → Impact',
    pose: 'front',
  });
}
