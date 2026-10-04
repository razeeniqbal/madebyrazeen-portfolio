import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { NoteList } from '@/components/v2/notes/NoteList';
import { getPublishedJournalEntries } from '@/content/notes';
import { home } from '@/content/home';

/** Home 05. The three newest published journal entries; nothing at all when none are published. */
export function JournalTeaser() {
  const latest = getPublishedJournalEntries().slice(0, 3);
  if (latest.length === 0) return null;

  return (
    // Follows Sharing on the same light surface: a rule instead of a colour change marks the turn.
    <Section surface="light" className="!pb-[clamp(4.5rem,9vw,8rem)] !pt-0">
      <div className="page-container">
        <div className="border-t border-line" />
      </div>
      <div className="page-grid gap-y-12 pt-[clamp(3.5rem,6vw,5rem)]">
        <SectionHeader index="05" eyebrow="Journal" title={home.journal.title} size="md" className="lg:col-span-7" />
        <div className="col-span-full lg:col-span-5 lg:col-start-8">
          <NoteList notes={latest} />
          <div className="border-t border-line pt-8">
            <ArrowLink href="/journal">All entries</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
