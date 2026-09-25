import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { exploring } from '@/content/lab';
import { notes } from '@/content/notes';
import { NoteList } from '@/components/v2/notes/NoteList';

export function ExploringNotes() {
  return (
    <Section surface="light">
      <div className="page-grid gap-y-16">
        {/* Currently exploring */}
        <div className="col-span-full lg:col-span-5">
          <SectionHeader index="07" eyebrow="Currently exploring" title={['What I’m', 'learning now.']} size="md" />
          <ul className="mt-10">
            {exploring.map((e) => (
              <li key={e.label} className="flex gap-4 border-t border-line py-4">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full border border-ink" />
                <span>
                  <span className="font-semibold">{e.label}</span>
                  <span className="block text-sm text-muted">{e.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden md:block">
            <MiniRazeen pose="learning" height={140} />
          </div>
        </div>

        {/* Field notes */}
        <div className="col-span-full lg:col-span-6 lg:col-start-7">
          <SectionHeader index="08" eyebrow="Field notes" title={['Patterns.', 'Lessons.', 'Practical insights.']} size="md" />
          <div className="mt-10">
            <NoteList notes={notes.slice(0, 3)} />
          </div>
          <div className="border-t border-line pt-8">
            <ArrowLink href="/notes">All notes</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
