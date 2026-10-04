import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { currently } from '@/content/story';

/** Home: a compact snapshot under the hero (same source as About › Currently). */
export function Currently() {
  const groups: { label: string; items: React.ReactNode[] }[] = [
    { label: 'Working on', items: currently.working },
    {
      label: 'Building',
      items: currently.building.map((p) => (
        <Link key={p.slug} href={`/projects/${p.slug}`} className="hit underline-offset-4 hover:underline">
          {p.title}
        </Link>
      )),
    },
    { label: 'Exploring', items: currently.exploring },
  ];

  return (
    <Section surface="dark" aria-labelledby="currently-title" className="!pb-16 !pt-0 md:!pb-20">
      <div className="page-container">
        <div className="grid gap-y-6 border-t border-line pt-6 lg:grid-cols-12 lg:gap-x-6">
          <TechnicalLabel as="h2" marker="//" className="lg:col-span-3">
            <span id="currently-title">Currently</span>
          </TechnicalLabel>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 lg:col-span-9">
            {groups.map((g) => (
              <div key={g.label}>
                <TechnicalLabel as="h3">{g.label}</TechnicalLabel>
                <ul className="mt-2 space-y-0.5 font-semibold">
                  {g.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
