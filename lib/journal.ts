/** Client-safe Journal helpers (no file access), shared by server pages and the index filter. */

export type JournalCategory = 'building' | 'learning' | 'notes';

export const journalCategories: { value: JournalCategory; label: string }[] = [
  { value: 'building', label: 'Building' },
  { value: 'learning', label: 'Learning' },
  { value: 'notes', label: 'Notes' },
];

export const categoryLabel = (c: JournalCategory) => journalCategories.find((x) => x.value === c)?.label ?? c;

/** Heading anchors: "What I am still figuring out" → "what-i-am-still-figuring-out". */
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

/** "2026-10-04" → "4 Oct 2026" (dates are stored as plain ISO days; no timezone shift). */
export function formatJournalDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'][m - 1];
  return `${d} ${month} ${y}`;
}

/**
 * Editorial figures drawn in code (real text, no image weight), registered by key so an entry can
 * pick one in the admin. A cover explains the article's system at the top; a figure explains one
 * idea inline. `motif` is the same sequence in words, reused on the social card; `mark` is the stage
 * drawn in Signal Lime on the cover, marked the same way on the card.
 */
export const journalCovers = {
  career: { label: 'Structure to AI system', motif: ['Structure', 'Measurements', 'Data', 'Code', 'Pipeline', 'AI system'], mark: 5 },
  quality: { label: 'Check, find, assist, review', motif: ['Check', 'Find', 'Assist', 'Review'], mark: 2 },
} as const;
export type JournalCover = keyof typeof journalCovers;

export const journalFigures = {
  'career-path': 'The path was not a jump',
  'quality-boundary': 'Where the AI sits',
  'career-timeline': 'The path, dated',
  'quality-demo': 'Try it: switch the AI off',
  'forma-loop': 'The core loop',
  'sepang-motion': 'Raw versus smoothed',
} as const;
export type JournalFigure = keyof typeof journalFigures;
