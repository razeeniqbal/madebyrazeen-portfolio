import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { NoteList } from '@/components/v2/notes/NoteList';
import { notes } from '@/content/notes';

/** Home 04. Three journal entries, text only. Unpublished ones show their "In writing" / "Draft" badge. */
export function JournalTeaser() {
  const latest = notes.slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <Section surface="light">
      <div className="page-grid gap-y-12">
        <SectionHeader
          index="03"
          eyebrow="Journal"
          title={['Things I’ve learned', 'along the way.']}
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
