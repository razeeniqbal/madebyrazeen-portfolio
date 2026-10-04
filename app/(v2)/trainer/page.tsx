import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { CompactEngagement, FeaturedEngagement } from '@/components/v2/trainer/EngagementEntry';
import { getTrainerEngagements, trainerApproach } from '@/content/trainer';

export const metadata: Metadata = {
  alternates: { canonical: '/trainer' },
  title: 'Training & Speaking',
  description:
    'Training and speaking by Razeen Iqbal across Data, Cloud and AI, including technical knowledge sharing, student sessions and structured professional training.',
};

const approach = trainerApproach;

// Trainer: learning becomes more useful when it can be explained and shared. Records come from
// content/data/trainer.json and keep their order; their mode sets their weight (structured training
// leads, technical sharing and internal sharing follow). No photographs until real event images exist.
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
          <div className="col-span-full mt-6 space-y-14">
            {engagements
              .filter((e) => e.mode === 'structured-training')
              .map((e) => (
                <FeaturedEngagement key={e.slug} engagement={e} number={String(engagements.indexOf(e) + 1).padStart(3, '0')} />
              ))}
            <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-2">
              {engagements
                .filter((e) => e.mode !== 'structured-training')
                .map((e) => (
                  <CompactEngagement key={e.slug} engagement={e} number={String(engagements.indexOf(e) + 1).padStart(3, '0')} />
                ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 03 Approach */}
      <Section surface="light" id="approach">
        <div className="page-grid gap-y-10">
          <SectionHeader index="03" eyebrow="Approach" title={['How I approach', 'technical sharing.']} size="md" className="lg:col-span-6" />
          <p className="col-span-full max-w-prose self-end text-lead lg:col-span-5 lg:col-start-8">
            I learn best when I can connect a concept to something tangible. I try to teach the same way: explain what something is, show how it works, let people work through it, then connect it to a real use case.
          </p>
          <ol aria-label="Approach, in order" className="col-span-full grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((a, i) => (
              <li key={a.step} className={'border-b border-line py-5 sm:pr-6 lg:border-b-0' + (i > 0 ? ' lg:border-l lg:pl-6' : '')}>
                <p className="flex items-center gap-3">
                  <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-display-sm uppercase">{a.step}</span>
                  {i < approach.length - 1 && (
                    <span aria-hidden="true" className="label ml-auto hidden text-muted lg:inline">
                      →
                    </span>
                  )}
                </p>
                <p className="mt-2 text-sm text-muted">{a.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 04 Contact path */}
      <Section surface="dark">
        <div className="page-grid items-end gap-y-8">
          <SectionHeader index="04" eyebrow="Contact" title={['Training or', 'technical sharing?']} size="md" className="lg:col-span-7" />
          <div className="col-span-full space-y-6 lg:col-span-5">
            <p className="max-w-prose text-muted">
              For training or technical sharing related to Data, Cloud, or AI, you can reach me through the contact page.
            </p>
            <ArrowLink href="/contact">Get in touch</ArrowLink>
          </div>
        </div>
      </Section>
    </>
  );
}
