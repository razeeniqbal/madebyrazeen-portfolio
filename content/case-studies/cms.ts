/**
 * Server-only helpers for the Keystatic collections (case studies, notes):
 * reads every JSON entry in a folder and converts Keystatic's block format
 * ({ discriminant, value }) into the site's Block type.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveAsset } from '@/lib/assets';
import type { Block } from './types';
import type { NodeType } from '@/components/v2/diagram/FlowDiagram';

export type CmsBlock = { discriminant: string; value: Record<string, unknown> };

const split = (s: string) => s.split('|').map((c) => c.trim());

export function fromCmsBlock(b: CmsBlock): Block | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = b.value as Record<string, any>;
  switch (b.discriminant) {
    case 'text':
      return { kind: 'text', body: v.body ?? [], lead: v.lead || undefined };
    case 'list':
      return { kind: 'list', items: v.items ?? [], numbered: v.numbered || undefined };
    case 'steps':
      return { kind: 'steps', label: v.label ?? '', steps: v.steps ?? [] };
    case 'flow':
      return {
        kind: 'flow',
        label: v.label ?? '',
        caption: v.caption || undefined,
        nodes: (v.nodes ?? []).map((n: { type: NodeType; title: string; detail: string; active?: boolean }) => ({
          type: n.type,
          title: n.title,
          detail: n.detail,
          active: n.active || undefined,
        })),
      };
    case 'metrics':
      return {
        kind: 'metrics',
        items: (v.items ?? []).map((m: { label: string; value: string; note?: string; illustrative?: boolean }) => ({
          label: m.label,
          value: m.value,
          note: m.note || undefined,
          illustrative: m.illustrative || undefined,
        })),
      };
    case 'table':
      return {
        kind: 'table',
        caption: v.caption ?? '',
        columns: split(v.columns ?? ''),
        rows: (v.rows ?? []).map(split),
        note: v.note || undefined,
        highlightRow: typeof v.highlightRow === 'number' ? v.highlightRow : undefined,
      };
    case 'image': {
      const image = resolveAsset(v.image);
      return image ? { kind: 'image', image, caption: v.caption ?? '' } : null;
    }
    default:
      return null;
  }
}

export const fromCmsBlocks = (blocks: CmsBlock[] = []): Block[] =>
  blocks.map(fromCmsBlock).filter((b): b is Block => b !== null);

/** Reads content/data/<folder>/*.json → [{ slug, data }], sorted by slug for stable output. */
export function readCollection<T>(folder: string): { slug: string; data: T }[] {
  const dir = join(process.cwd(), 'content', 'data', folder);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ slug: f.replace(/\.json$/, ''), data: JSON.parse(readFileSync(join(dir, f), 'utf8')) as T }));
}
