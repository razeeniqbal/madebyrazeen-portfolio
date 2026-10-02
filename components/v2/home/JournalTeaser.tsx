import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { NoteList } from '@/components/v2/notes/NoteList';
import { getPublishedJournalEntries } from '@/content/notes';

/** Home 04. The three newest published journal entries; nothing at all when none are published. */
export function JournalTeaser() {
  const latest = getPublishedJournalEntries().slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <Section surface="light">
      <div className="page-grid gap-y-12">
        <SectionHeader
          index="03"
          eyebrow="Journal"
          title={['Things I have learned', 'along the way.']}
          size="md"
          className="lg:col-span-5"
        />
        <div className="col-span-full lg:col-span-6 lg:col-start-7">
          <NoteList notes={latest} />
          <div className="border-t border-line pt-8">
            <ArrowLink href="/journal">All entries</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
