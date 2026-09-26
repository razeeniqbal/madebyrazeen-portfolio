import { renderOg, ogSize, ogContentType } from '@/lib/og/template';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Razeen Iqbal · Running';

// RUNNING STORY template.
export default function Image() {
  return renderOg({
    kind: 'Running',
    title: 'Further than yesterday.',
    subtitle: 'Same steps. Better insights.',
    meta: 'Input → Train → Adapt → Progress',
    pose: 'running',
  });
}
