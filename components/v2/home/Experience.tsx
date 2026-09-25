import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { experience } from '@/content/experience';
import { education } from '@/content/profile';

export function Experience({ index = '05', flush = true }: { index?: string; flush?: boolean }) {
  return (
    <Section surface="light" className={flush ? '!pt-0' : undefined}>
      <div className="page-grid gap-y-10">
        <SectionHeader index={index} eyebrow="Experience" title={['Engineer by training.', 'Builder by curiosity.']} size="md" />

        <ol className="col-span-full">
          {experience.map((r, i) => (
            <li key={r.company} className="grid grid-cols-4 gap-x-4 gap-y-3 border-t border-line py-8 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6">
              <p className="label col-span-4 flex items-center gap-2 md:col-span-2">
                <span
                  aria-hidden="true"
                  className={i === 0 ? 'h-2 w-2 rounded-full bg-lime ring-1 ring-ink' : 'h-2 w-2 rounded-full border border-muted'}
                />
                {r.period}
              </p>
              <div className="col-span-4 md:col-span-6 lg:col-span-4">
                <h3 className="text-display-sm">{r.role}</h3>
                <p className="mt-1 text-muted">
                  {r.company} · {r.location.split(',')[0]}
                </p>
              </div>
              <ul className="col-span-4 space-y-1.5 text-sm text-muted md:col-span-6 md:col-start-3 lg:col-span-6 lg:col-start-7">
                {(r.worked ? [r.worked, r.changed, r.learned].filter(Boolean) : r.highlights.slice(0, 3)).map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden="true">—</span>
                    {h}
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {education.map((e) => (
            <li key={e.institution} className="grid grid-cols-4 gap-x-4 gap-y-1 border-t border-line py-5 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6">
              <p className="label col-span-4 text-muted md:col-span-2">{e.period}</p>
              <p className="col-span-4 md:col-span-6 lg:col-span-10">
                {e.degree} · {e.field} <span className="text-muted">— {e.institution}</span>
              </p>
            </li>
          ))}
        </ol>

        <div className="col-span-full">
          <ArrowLink href="/resume">View resume</ArrowLink>
        </div>
      </div>
    </Section>
  );
}
