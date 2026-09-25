import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { capabilities } from '@/content/capabilities';

export function Capabilities() {
  return (
    <Section surface="light" className="border-t border-line">
      <div className="page-grid gap-y-12">
        <SectionHeader index="04" eyebrow="Capabilities" title={['Organised by', 'purpose.']} size="md" />
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
