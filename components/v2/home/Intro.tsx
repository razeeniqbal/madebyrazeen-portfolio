import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { home } from '@/content/home';

export function Intro() {
  return (
    <Section surface="light">
      <div className="page-grid gap-y-12">
        <SectionHeader
          index="01"
          eyebrow="About the work"
          title={home.intro.title}
          className="lg:col-span-7"
        />

        <ul className="col-span-full self-end md:col-span-4 lg:col-span-4 lg:col-start-9" aria-label="Focus areas">
          {home.intro.pillars.map((p) => (
            <li key={p} className="border-t border-line py-2 text-display-sm text-muted first:text-ink">
              {p}
            </li>
          ))}
        </ul>

        <div className="col-span-full md:col-span-4 lg:col-span-5 lg:col-start-1">
          <p className="text-lead">{home.intro.lead}</p>
          <p className="mt-4 text-muted">{home.intro.body}</p>
        </div>

        <div className="col-span-full hidden items-end justify-end md:col-span-4 md:flex lg:col-span-3 lg:col-start-10">
          <MiniRazeen pose="working" height={114} />
        </div>
      </div>
    </Section>
  );
}
