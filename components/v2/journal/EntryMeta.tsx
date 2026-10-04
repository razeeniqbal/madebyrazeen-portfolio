import { cn } from '@/lib/utils';
import { categoryLabel, formatJournalDate, type JournalCategory } from '@/lib/journal';

export interface EntrySummary {
  slug: string;
  title: string;
  description: string;
  category: JournalCategory;
  date: string;
  updated?: string;
  readingMinutes: number;
  /** Related project title, when the entry has one. */
  project?: string;
}

/** 4 OCT 2026 · 6 MIN READ · BUILDING. The date is a real <time>; "Updated" appears only after a real revision. */
export function EntryMeta({ entry, className }: { entry: EntrySummary; className?: string }) {
  return (
    <p className={cn('label flex flex-wrap gap-x-2 gap-y-1 text-muted', className)}>
      <time dateTime={entry.date}>{formatJournalDate(entry.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{entry.readingMinutes} min read</span>
      <span aria-hidden="true">·</span>
      <span className="text-ink">{categoryLabel(entry.category)}</span>
      {entry.updated && entry.updated !== entry.date && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Updated <time dateTime={entry.updated}>{formatJournalDate(entry.updated)}</time>
          </span>
        </>
      )}
    </p>
  );
}
