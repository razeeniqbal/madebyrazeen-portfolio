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
