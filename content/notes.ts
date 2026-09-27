/**
 * Journal (URL /journal): content/data/notes/<slug>.json (admin → Journal).
 * Bodies reuse the case-study block types (text, list, table, flow…).
 *
 * status:
 *   'published':  listed and indexed.
 *   'draft':      has a body; readable at /journal/<slug> with a DRAFT banner, noindex.
 *   'in-writing': planned topic only; listed, not linked.
 * To publish: set status to Published and add a date.
 */
import type { Block } from './case-studies/types';
import { resolveAsset, type ImageAsset } from '@/lib/assets';
import { fromCmsBlocks, readCollection, type CmsBlock } from './case-studies/cms';

export interface Note {
  slug: string;
  number: string;
  title: string;
  summary: string;
  topic: 'Data Engineering' | 'AI' | 'Product' | 'Architecture' | 'Running' | 'Retrospective';
  status: 'published' | 'draft' | 'in-writing';
  date?: string; // ISO
  readingMinutes?: number;
  /** Real photo or project artwork from the asset manifest. */
  photo?: { image: ImageAsset; caption: string };
  body?: Block[];
}

type CmsNote = Omit<Note, 'slug' | 'body' | 'date' | 'readingMinutes' | 'photo'> & {
  date: string | null;
  readingMinutes: number | null;
  photo?: string;
  photoCaption?: string;
  body: CmsBlock[];
};

export const notes: Note[] = readCollection<CmsNote>('notes')
  .map(({ slug, data }) => {
    const body = fromCmsBlocks(data.body);
    const image = resolveAsset(data.photo);
    return {
      slug,
      number: data.number,
      title: data.title,
      summary: data.summary,
      topic: data.topic,
      status: data.status,
      date: data.date ?? undefined,
      readingMinutes: data.readingMinutes ?? undefined,
      photo: image ? { image, caption: data.photoCaption ?? '' } : undefined,
      body: body.length ? body : undefined,
    };
  })
  .sort((a, b) => b.number.localeCompare(a.number)); // newest entry first

export const getPublishedNotes = () => notes.filter((n) => n.status === 'published');
export const getReadableNotes = () => notes.filter((n) => n.status !== 'in-writing' && n.body);
export const getNote = (slug: string) => getReadableNotes().find((n) => n.slug === slug);
