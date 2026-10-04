import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { getTrainerEngagements, modeLabel, trainerApproach } from '@/content/trainer';
import { learning } from '@/content/story';

const shortOrg = (org: string) => org.replace(/\s+Sdn\.?\s+Bhd\.?$/i, '').split(' ')[0];

/**
 * Home 04. A typographic teaser for /trainer: the three kinds of sharing (from trainer.json, in the
 * same order as the Trainer page) and the approach. No photographs: none exist yet.
 */
export function SharingTeaser() {
  const engagements = getTrainerEngagements();

  return (
    <Section surface="light" className="!pb-[clamp(3.5rem,6vw,5rem)] !pt-[clamp(4.5rem,9vw,8rem)]">
      <div className="page-grid gap-y-10">
        <SectionHeader index="04" eyebrow="Sharing" title={learning.title} size="md" className="lg:col-span-7" />

        <div className="col-span-full lg:col-span-5 lg:col-start-8 lg:self-end">
          <ol aria-label="Training and speaking">
            {engagements.map((e) => (
              <li key={e.title} className="grid gap-x-6 gap-y-1 border-t border-line py-4 sm:grid-cols-[1fr_auto]">
                <p>
                  <span className="font-semibold">{e.title}</span>
                  {/* The organisation, when the title does not already name it (UPM for Google AI Build). */}
                  {!e.title.includes(shortOrg(e.organization)) && <span className="ml-2 text-sm text-muted">{e.organization}</span>}
                </p>
                <TechnicalLabel as="p" className="sm:text-right">
                  {modeLabel[e.mode]}
                </TechnicalLabel>
              </li>
            ))}
          </ol>
          <ol aria-label="How a session is shaped" className="label flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-4 text-muted">
            {trainerApproach.map((a, i) => (
              <li key={a.step} className="flex items-center gap-3">
                <span className="text-ink">{a.step}</span>
                {i < trainerApproach.length - 1 && <span aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <ArrowLink href="/trainer">Explore training &amp; speaking</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
