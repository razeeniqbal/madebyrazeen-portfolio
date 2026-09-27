import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { Experience } from '@/components/v2/work/Experience';
import { Capabilities } from '@/components/v2/work/Capabilities';
import { CredentialList } from '@/components/v2/work/CredentialList';
import { CodingActivity } from '@/components/v2/experience/CodingActivity';
import { achievements } from '@/content/achievements';
import { recognition } from '@/content/profile';
import { experience } from '@/content/experience';

export const metadata: Metadata = {
  alternates: { canonical: '/experience' },
  title: 'Experience',
  description: 'Razeen Iqbal’s roles, education, capabilities, certifications, achievements and live coding activity.',
};

// GitHub activity is fetched at build and refreshed at most hourly.
export const revalidate = 3600;

// The professional record, split out of /projects: roles and education, capabilities, credentials and
// achievements, then live coding activity (which used to live on the removed Lab page).
export default function ExperiencePage() {
  return (
    <>
      <Section surface="dark" className="!pb-8 !pt-16">
        <div className="page-grid gap-y-8">
          <SectionHeader
            as="h1"
            size="xl"
            eyebrow={`Experience · ${experience.length} roles`}
            title={['Where the', 'work happened.']}
            className="lg:col-span-8"
          />
          <div className="col-span-full flex flex-col items-start gap-4 self-end lg:col-span-4">
            <p className="text-muted">
              Roles, education, skills and credentials in one place. The same facts as the resume, with more room.
            </p>
          </div>
        </div>
      </Section>

      <Experience index="01" flush={false} surface="dark" />
      <Capabilities index="02" />

      {/* Credentials (externally issued proof) and achievements (things won or earned) stay distinct. */}
      <Section surface="dark" id="credentials">
        <div className="page-grid gap-y-10">
          <SectionHeader index="03" eyebrow="Credentials" title={[`${achievements.length} certifications`, '& courses.']} size="md" />
          <div className="col-span-full">
            <CredentialList items={achievements} initial={8} />
          </div>

          <div className="col-span-full border-t border-line pt-10">
            <TechnicalLabel as="h2" marker="//">
              Achievements
            </TechnicalLabel>
            <ul className="mt-6 grid gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
              {recognition.map((r) => (
                <li key={r.title} className="border-t border-line pt-4">
                  <p className="label text-muted">{r.year}</p>
                  <p className="mt-1 font-semibold">{r.title}</p>
                  <p className="mt-1 text-sm text-muted">{r.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <div className="border-t border-line">
        <CodingActivity />
      </div>
    </>
  );
}
