/**
 * Journal (URL /journal): content/data/notes/<slug>.json (admin → Journal).
 *
 * The Journal is the thinking layer: why something was built, the questions behind an experiment,
 * what changed and what is still open. Project facts live in the case studies; the Journal links to
 * them instead of repeating them.
 *
 * status:
 *   'published': the only state that appears anywhere public (Journal, Home, sitemap, RSS, JSON-LD, assistant).
 *   'draft':     work in progress, never public.
 *   'archived':  withdrawn, kept for history, never public.
 * Dates are never assigned automatically. `date` is the real publication date; `updated` is set only
 * for a meaningful revision, never for a typo fix.
 * category: building | learning | notes. A Note can be a title and a few paragraphs: no image,
 * no headings, no table of contents.
 */
import type { Block } from './case-studies/types';
import { resolveAsset, type ImageAsset } from '@/lib/assets';
import { fromCmsBlock, readCollection, type CmsBlock } from './case-studies/cms';
import { headingId, type JournalCategory } from '@/lib/journal';
import { getProject } from './projects';

export { journalCategories, categoryLabel, formatJournalDate, type JournalCategory } from '@/lib/journal';

/** Article-only blocks, on top of the shared case-study blocks (text, list, table, image, steps…). */
export type ArticleBlock =
  | Block
  | { kind: 'heading'; level: 2 | 3; text: string; id: string }
  | { kind: 'bullets'; items: string[]; numbered?: boolean }
  | { kind: 'quote'; text: string; cite?: string }
  | { kind: 'code'; code: string; language?: string; caption?: string }
  | { kind: 'divider' };

export interface Note {
  slug: string;
  title: string;
  /** The deck: one or two sentences shown under the title, in lists and as the meta description. */
  description: string;
  category: JournalCategory;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  /** ISO date of first publication. */
  date?: string;
  /** ISO date of the last meaningful revision. */
  updated?: string;
  /** Slug of a related project, e.g. "forma". */
  relatedProject?: string;
  tags: string[];
  photo?: { image: ImageAsset; caption: string; alt: string };
  seoTitle?: string;
  seoDescription?: string;
  body: ArticleBlock[];
  /** Derived from the body text, never typed in. */
  words: number;
  readingMinutes: number;
}

type CmsNote = {
  title: string;
  summary: string;
  category?: JournalCategory;
  status: Note['status'];
  featured?: boolean;
  date: string | null;
  updated?: string | null;
  relatedProject?: string;
  tags?: string[];
  photo?: string;
  photoCaption?: string;
  photoAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  body?: CmsBlock[];
};

function toArticleBlock(b: CmsBlock): ArticleBlock | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = b.value as Record<string, any>;
  switch (b.discriminant) {
    case 'heading': {
      const text = String(v.text ?? '').trim();
      return text ? { kind: 'heading', level: v.level === '3' ? 3 : 2, text, id: headingId(text) } : null;
    }
    case 'bullets':
      return { kind: 'bullets', items: (v.items ?? []).filter(Boolean), numbered: v.numbered || undefined };
    case 'quote':
      return v.text ? { kind: 'quote', text: v.text, cite: v.cite || undefined } : null;
    case 'code':
      return v.code ? { kind: 'code', code: String(v.code).replace(/\s+$/, ''), language: v.language || undefined, caption: v.caption || undefined } : null;
    case 'divider':
      return { kind: 'divider' };
    default:
      return fromCmsBlock(b);
  }
}

/** Visible words in a block, for the word count and reading time. */
function blockWords(b: ArticleBlock): string {
  switch (b.kind) {
    case 'text':
      return b.body.join(' ');
    case 'heading':
    case 'quote':
      return b.text;
    case 'bullets':
      return b.items.join(' ');
    case 'list':
      return b.items.map((i) => `${i.title} ${i.detail}`).join(' ');
    case 'code':
      return b.code;
    case 'image':
      return b.caption;
    case 'steps':
      return b.steps.join(' ');
    case 'table':
      return [b.caption, ...b.columns, ...b.rows.flat()].join(' ');
    default:
      return '';
  }
}

const WORDS_PER_MINUTE = 225;
const countWords = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).filter((w) => /\w/.test(w)).length;

export const notes: Note[] = readCollection<CmsNote>('notes')
  .map(({ slug, data }) => {
    const body = (data.body ?? []).map(toArticleBlock).filter((b): b is ArticleBlock => b !== null);
    const image = resolveAsset(data.photo);
    const words = countWords([data.summary, ...body.map(blockWords)].join(' '));
    return {
      slug,
      title: data.title,
      description: data.summary,
      category: data.category ?? 'notes',
      status: data.status,
      featured: Boolean(data.featured),
      date: data.date ?? undefined,
      updated: data.updated || undefined,
      relatedProject: data.relatedProject && data.relatedProject !== 'none' ? data.relatedProject : undefined,
      tags: data.tags ?? [],
      photo: image ? { image, caption: data.photoCaption ?? '', alt: data.photoAlt || image.alt } : undefined,
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      body,
      words,
      readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    } satisfies Note;
  })
  // Newest first by publication date; undated (unpublished) entries last.
  .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title));

/** The only entries that may appear publicly: published, dated and with a body. */
export const getPublishedJournalEntries = (): Note[] => notes.filter((n) => n.status === 'published' && n.date && n.body.length > 0);
export const getNote = (slug: string) => getPublishedJournalEntries().find((n) => n.slug === slug);
/** The featured entry, or the newest when none is marked. */
export const getFeaturedEntry = (): Note | undefined => {
  const entries = getPublishedJournalEntries();
  return entries.find((n) => n.featured) ?? entries[0];
};
/** Published entries that point at a project, for a small cross-link on its case study. */
export const getEntriesForProject = (project: string) => getPublishedJournalEntries().filter((n) => n.relatedProject === project);

/** Headings that make a table of contents worth showing: long articles with at least four sections. */
export function tableOfContents(note: Note) {
  const headings = note.body.filter((b): b is Extract<ArticleBlock, { kind: 'heading' }> => b.kind === 'heading' && b.level === 2);
  return note.words >= 1000 && headings.length >= 4 ? headings : [];
}

/** The serialisable summary used by lists and the index filter (no body). */
export function toSummary(n: Note) {
  return {
    slug: n.slug,
    title: n.title,
    description: n.description,
    category: n.category,
    date: n.date ?? '',
    updated: n.updated,
    readingMinutes: n.readingMinutes,
    project: n.relatedProject ? getProject(n.relatedProject)?.title : undefined,
  };
}
