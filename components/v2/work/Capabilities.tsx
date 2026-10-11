import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { capabilities } from '@/content/capabilities';
import { techIcons, type TechIcon } from '@/lib/tech-icons';

// Tools Razeen's own work uses, each with its real logo (Simple Icons), in a reading order.
const tools: TechIcon[] = ['python', 'postgresql', 'scikitlearn', 'ollama', 'n8n', 'react', 'typescript', 'fastapi', 'docker', 'githubactions', 'googlecloud'];

/** `index={null}` drops the section number (used where the page has its own numbering). */
export function Capabilities({ index = '04' }: { index?: string | null }) {
  return (
    <Section surface="light" className="border-t border-line">
      <div className="page-grid gap-y-12">
        <SectionHeader index={index ?? undefined} eyebrow="Capabilities" title={['Organised by', 'purpose.']} size="md" />

        {/* Tools: real logos, one colour, so the row reads as one set. */}
        <div className="col-span-full">
          <h3 className="label border-t-2 border-ink pt-3">Tools I use</h3>
          <ul className="mt-5 grid grid-cols-3 gap-px border border-line bg-line sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
            {tools.map((t) => (
              <li key={t} className="group flex flex-col items-center justify-center gap-3 bg-surface px-2 py-5 text-center">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current opacity-70 transition-opacity group-hover:opacity-100">
                  <path d={techIcons[t].path} />
                </svg>
                <span className="label text-muted transition-colors group-hover:text-ink">{techIcons[t].title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills: what the tools are used for, as plain text. */}
        {capabilities.map((c, i) => (
          <div key={c.group} className="col-span-2 md:col-span-4 lg:col-span-3">
            <h3 className="label flex items-center gap-3 border-t-2 border-ink pt-3">
              <span className="text-muted">{String(i + 1).padStart(2, '0')}</span>
              {c.group}
            </h3>
            <ul className="mt-4 space-y-2">
              {c.items.map((item) => (
                <li key={item} className="border-b border-line pb-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
