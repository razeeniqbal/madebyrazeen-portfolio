import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { EngagementEntry } from '@/components/v2/trainer/EngagementEntry';
import { getTrainerEngagements } from '@/content/trainer';

export const metadata: Metadata = {
  alternates: { canonical: '/trainer' },
  title: { absolute: 'Training & Speaking | Razeen Iqbal' },
  description:
    'Training and speaking by Razeen Iqbal across Data, Cloud and AI, including technical knowledge sharing, student sessions and structured professional training.',
};

const approach = ['Practical', 'Grounded', 'Hands-on', 'Connected to actual use'];

// Structural foundation for the Trainer section. Records come from content/data/trainer.json; the page
// shows only what a record holds. No photographs until real event images exist.
export default function TrainerPage() {
  const engagements = getTrainerEngagements();
  const organizations = [...new Set(engagements.map((e) => e.organization))];

  return (
    <>
      {/* 01 Hero */}
      <Section surface="dark" grid className="!pt-16">
        <PageHeader
          href="/trainer"
          title={['Learn.', 'Build.', 'Share.']}
          lede={[
            'I want to understand Data and AI deeply enough to build with it, explain it clearly, and make it useful to someone else.',
            'Teaching has become part of that process.',
          ]}
          meta={[
            { label: 'Engagements', value: engagements.length },
            { label: 'Organizations', value: organizations.join(' · ') },
          ]}
        />

        {/* 02 Engagements: continues the hero surface. */}
        <div id="engagements" className="page-grid mt-24 scroll-mt-20 gap-y-4">
          <SectionHeader index="02" eyebrow="Engagements" title={['Sessions and', 'engagements.']} size="md" />
          <div className="col-span-full mt-6">
            {engagements.map((e, i) => (
              <EngagementEntry key={e.slug} engagement={e} number={String(i + 1).padStart(3, '0')} />
            ))}
          </div>
        </div>
      </Section>

      {/* 03 Approach */}
      <Section surface="light" id="approach">
        <div className="page-grid gap-y-10">
          <SectionHeader index="03" eyebrow="Training approach" title={['How I teach.']} size="md" className="lg:col-span-5" />
          <ol className="col-span-full grid border-t border-line sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {approach.map((a, i) => (
              <li key={a} className="flex items-baseline gap-4 border-b border-line py-5 sm:odd:pr-6">
                <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-display-sm">{a}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 04 Contact path */}
      <Section surface="dark">
        <div className="page-grid items-end gap-y-8">
          <SectionHeader index="04" eyebrow="Training or speaking" title={['Planning a session?']} size="md" className="lg:col-span-7" />
          <div className="col-span-full space-y-6 lg:col-span-5">
            <p className="max-w-prose text-muted">
              For training or speaking on Data, Cloud or AI, the contact page lists the ways to reach me.
            </p>
            <ArrowLink href="/contact">Get in touch</ArrowLink>
          </div>
        </div>
      </Section>
    </>
  );
}
