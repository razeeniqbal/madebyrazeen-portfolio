import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { capabilities } from '@/content/capabilities';
import { capabilityIcon } from '@/lib/tech-icons';

/** The tool's logo when there is a fitting one, otherwise a short monogram in the same tile. */
function CapabilityMark({ name }: { name: string }) {
  const mark = capabilityIcon(name);
  return (
    <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center border border-line">
      {'icon' in mark ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
          <path d={mark.icon.path} />
        </svg>
      ) : (
        <span className="font-mono text-[0.5rem] font-semibold uppercase leading-none tracking-tight text-muted">{mark.monogram}</span>
      )}
    </span>
  );
}

/** `index={null}` drops the section number (used where the page has its own numbering). */
export function Capabilities({ index = '04' }: { index?: string | null }) {
  return (
    <Section surface="light" className="border-t border-line">
      <div className="page-grid gap-y-12">
        <SectionHeader index={index ?? undefined} eyebrow="Capabilities" title={['Organised by', 'purpose.']} size="md" />
        {capabilities.map((c, i) => (
          <div key={c.group} className="col-span-2 md:col-span-4 lg:col-span-3">
            <h3 className="label flex items-center gap-3 border-t-2 border-ink pt-3">
              <span className="text-muted">{String(i + 1).padStart(2, '0')}</span>
              {c.group}
            </h3>
            <ul className="mt-4 space-y-2">
              {c.items.map((item) => (
                <li key={item} className="flex items-center gap-3 border-b border-line pb-2">
                  <CapabilityMark name={item} />
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
