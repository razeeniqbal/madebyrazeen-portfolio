import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { NoteList } from '@/components/v2/notes/NoteList';
import { getPublishedJournalEntries, journalCategories } from '@/content/notes';

export const metadata: Metadata = {
  alternates: { canonical: '/journal' },
  title: 'Journal',
  description: 'Notes from what Razeen Iqbal is building and learning: ideas that need more room than a project card.',
};

// The journal is visually quieter than project pages: one light surface, reading first (PRD §30).
// Only published entries appear. Entries are grouped by category (Building, Learning, Notes); a category
// appears only when it has a published entry, and the category index only when there is more than one.
export default function JournalPage() {
  const entries = getPublishedJournalEntries();
  const groups = journalCategories
    .map((c) => ({ ...c, entries: entries.filter((e) => e.category === c.value) }))
    .filter((g) => g.entries.length > 0);

  return (
    <Section surface="light" className="!pt-16">
      <PageHeader
        href="/journal"
        title={['Notes from what', 'I am building', 'and learning.']}
        lede={['A place for ideas that need more room than a project card.']}
        aside={
          <div className="hidden justify-end lg:flex">
            <MiniRazeen pose="learning" height={151} />
          </div>
        }
      />
      <div className="page-grid mt-12">
        <div className="col-span-full lg:col-span-8">
          {groups.length === 0 ? (
            <p className="border-t border-line pt-6 text-lead">Nothing is published yet.</p>
          ) : (
            <>
              {groups.length > 1 && (
                <nav aria-label="Categories" className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
                  {groups.map((g) => (
                    <a key={g.value} href={`#${g.value}`} className="label border-b border-current pb-1">
                      {g.label} · {g.entries.length}
                    </a>
                  ))}
                </nav>
              )}
              <div className="space-y-14">
                {groups.map((g) => (
                  <section key={g.value} id={g.value} aria-labelledby={`${g.value}-title`} className="scroll-mt-20">
                    <TechnicalLabel as="h2" marker="//" className="mb-4">
                      <span id={`${g.value}-title`}>{g.label}</span>
                    </TechnicalLabel>
                    <NoteList notes={g.entries} />
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
