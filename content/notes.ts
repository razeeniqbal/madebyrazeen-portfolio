/**
 * Journal (URL /journal): content/data/notes/<slug>.json (admin → Journal).
 * Bodies reuse the case-study block types (text, list, table, flow…).
 *
 * status:
 *   'published': the only state that appears anywhere public (Journal, Home, sitemap, JSON-LD, assistant).
 *   'draft':     work in progress, never public.
 *   'archived':  withdrawn, kept for history, never public.
 * To publish: set status to Published and add the real publication date. Dates are never assigned automatically.
 * category: building | learning | notes.
 */
import type { Block } from './case-studies/types';
import { resolveAsset, type ImageAsset } from '@/lib/assets';
import { fromCmsBlocks, readCollection, type CmsBlock } from './case-studies/cms';

export type JournalCategory = 'building' | 'learning' | 'notes';

export const journalCategories: { value: JournalCategory; label: string }[] = [
  { value: 'building', label: 'Building' },
  { value: 'learning', label: 'Learning' },
  { value: 'notes', label: 'Notes' },
];

export interface Note {
  slug: string;
  number: string;
  title: string;
  summary: string;
  topic: 'Data Engineering' | 'AI' | 'Product' | 'Architecture' | 'Running' | 'Retrospective';
  status: 'published' | 'draft' | 'archived';
  category: JournalCategory;
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
      category: data.category ?? 'notes',
      date: data.date ?? undefined,
      readingMinutes: data.readingMinutes ?? undefined,
      photo: image ? { image, caption: data.photoCaption ?? '' } : undefined,
      body: body.length ? body : undefined,
    };
  })
  .sort((a, b) => b.number.localeCompare(a.number)); // newest entry first

/** The only entries that may appear publicly. */
export const getPublishedJournalEntries = (): Note[] => notes.filter((n) => n.status === 'published' && n.body);
/** @deprecated alias kept for existing call sites. */
export const getPublishedNotes = getPublishedJournalEntries;
/** Entries with a public page: published only. */
export const getReadableNotes = getPublishedJournalEntries;
export const getNote = (slug: string) => getPublishedJournalEntries().find((n) => n.slug === slug);
