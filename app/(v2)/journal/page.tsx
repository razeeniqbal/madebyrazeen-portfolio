import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { NoteList } from '@/components/v2/notes/NoteList';
import { getPublishedJournalEntries, journalCategories } from '@/content/notes';

export const metadata: Metadata = {
  alternates: { canonical: '/journal' },
  title: 'Journal',
  description: 'A journal on engineering, AI, data, building, learning and running: what I think, learn and discover while building.',
};

// The journal is visually quieter than project pages: one light surface, reading first (PRD §30).
// Only published entries appear; with none published, the page says so plainly.
export default function JournalPage() {
  const entries = getPublishedJournalEntries();
  return (
    <Section surface="light" className="!pt-16">
      <div className="page-grid gap-y-12">
        <SectionHeader
          as="h1"
          size="xl"
          eyebrow="Journal"
          title={['Things I have learned', 'along the way.']}
          className="lg:col-span-9"
        />
        <div className="col-span-full hidden items-end justify-end lg:col-span-3 lg:flex">
          <MiniRazeen pose="learning" height={151} />
        </div>
        <div className="col-span-full lg:col-span-8">
          {entries.length > 0 ? (
            <NoteList notes={entries} />
          ) : (
            <div className="border-t border-line pt-6">
              <p className="text-lead">Nothing is published yet.</p>
              <p className="mt-2 max-w-prose text-muted">
                Entries will appear here under {journalCategories.map((c) => c.label).join(', ').replace(/, ([^,]*)$/, ' and $1')} once they are written and dated.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
