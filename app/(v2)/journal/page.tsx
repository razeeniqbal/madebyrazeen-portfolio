import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { NoteList } from '@/components/v2/notes/NoteList';
import { notes } from '@/content/notes';

export const metadata: Metadata = {
  alternates: { canonical: '/journal' },
  title: 'Journal',
  description: 'A journal on engineering, AI, data, building, learning and running: what I think, learn and discover while building.',
};

// The journal is visually quieter than project pages: one light surface, reading first (PRD §30).
export default function JournalPage() {
  return (
    <Section surface="light" className="!pt-16">
      <div className="page-grid gap-y-12">
        <SectionHeader
          as="h1"
          size="xl"
          eyebrow="Journal"
          title={['Things I’ve learned', 'along the way.']}
          className="lg:col-span-9"
        />
        <div className="col-span-full hidden items-end justify-end lg:col-span-3 lg:flex">
          <MiniRazeen pose="learning" height={151} />
        </div>
        <div className="col-span-full lg:col-span-8">
          <NoteList notes={notes} />
        </div>
      </div>
    </Section>
  );
}
