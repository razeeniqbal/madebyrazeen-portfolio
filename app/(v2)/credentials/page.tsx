import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { CredentialBadge } from '@/components/v2/credentials/CredentialBadge';
import { CredentialList } from '@/components/v2/work/CredentialList';
import { achievements, areaLabel, learningPath, selectedCredentials } from '@/content/achievements';
import { withBadges } from '@/content/credential-badges';
import { credentialVerifyUrl } from '@/lib/credentials';

export const metadata: Metadata = {
  alternates: { canonical: '/credentials' },
  title: 'Credentials',
  description:
    'How Razeen Iqbal kept learning as the work moved from Engineering to Data to AI: selected credentials, the learning path by year, and the full archive.',
};

/** What each year of the record shows, read from the credentials issued that year. */
const yearNote: Record<string, string> = {
  '2022': 'Engineering registration',
  '2023': 'Into data',
  '2024': 'Cloud and AI foundations',
  '2025': 'Data science, big data and applied AI',
  '2026': 'Data platforms and AI agents',
  Undated: 'Recorded without an issue date',
};

// Credentials support the story; they are not the identity. Three levels: a small selected set that
// follows Engineering → Data → AI, the learning path by year, then every record.
export default function CredentialsPage() {
  const path = learningPath();
  const dated = achievements.filter((a) => /\d{4}/.test(a.issuedDate)).length;

  return (
    <>
      <Section surface="dark" className="!pt-16">
        <PageHeader
          href="/credentials"
          label="Credentials"
          title={['Kept learning', 'as the work changed.']}
          lede={[
            'Each credential here was earned alongside the work it relates to: engineering registration, then data, then cloud and AI.',
            'Selected credentials follow that path. The archive below holds every record, with a link to the issuer where one exists.',
          ]}
          meta={[
            { label: 'Credentials', value: achievements.length },
            { label: 'Dated', value: dated },
            { label: 'Years', value: `${path.find((y) => y.year !== 'Undated')?.year} to ${[...path].reverse().find((y) => y.year !== 'Undated')?.year}` },
          ]}
        />

        {/* Level 01: selected */}
        <div id="selected" className="page-grid mt-20 scroll-mt-20 gap-y-8">
          <SectionHeader index="01" eyebrow="Selected" title={['One per step', 'of the path.']} size="md" />
          <ol className="col-span-full grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {selectedCredentials.map((a) => {
              const verify = credentialVerifyUrl(a);
              return (
                <li key={a.id} className="flex gap-4 bg-surface p-5">
                  <CredentialBadge credential={a} size={56} />
                  <div className="min-w-0">
                    <p className="label text-muted">
                      {areaLabel(a.area)} · {a.issuedDate || 'Undated'}
                    </p>
                    <p className="mt-1 font-semibold leading-snug [overflow-wrap:anywhere]">{a.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{a.organization}</p>
                    {verify && (
                      <a href={verify} target="_blank" rel="noopener noreferrer" className="label mt-3 inline-block border-b border-current" aria-label={`Verify ${a.title} (opens the issuer page)`}>
                        Verify ↗
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* Level 02: learning path */}
      <Section surface="light" id="path" className="scroll-mt-16">
        <div className="page-grid gap-y-10">
          <SectionHeader index="02" eyebrow="Learning path" title={['How the learning', 'moved.']} size="md" className="lg:col-span-7" />
          <p className="col-span-full max-w-prose self-end text-muted lg:col-span-5">
            Grouped by the year each credential was issued. The counts come straight from the archive below.
          </p>
          <ol aria-label="Credentials by year" className="col-span-full border-t border-line">
            {path.map((y) => {
              const total = y.items.length;
              return (
                <li key={y.year} className="grid grid-cols-1 gap-x-6 gap-y-3 border-b border-line py-6 md:grid-cols-[8rem_1fr] lg:grid-cols-[10rem_1fr_16rem]">
                  <div>
                    <p className="text-display-sm">{y.year}</p>
                    <p className="label mt-1 text-muted">{total} credential{total === 1 ? '' : 's'}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{yearNote[y.year] ?? ''}</p>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                      {(y.items.some((a) => a.selected || a.featured || credentialVerifyUrl(a))
                        ? y.items.filter((a) => a.selected || a.featured || credentialVerifyUrl(a))
                        : y.items
                      )
                        .slice(0, 4)
                        .map((a) => (
                          <li key={a.id} className="[overflow-wrap:anywhere]">
                            {a.title}
                          </li>
                        ))}
                    </ul>
                  </div>
                  {/* Area mix: a thin bar per area, proportional, with its count as text. */}
                  <dl className="space-y-1.5 md:col-start-2 lg:col-start-auto">
                    {y.areas.map((a) => (
                      <div key={a.area} className="grid grid-cols-[9.5rem_1fr_1.5rem] items-center gap-2 text-sm">
                        <dt className="label text-muted">{areaLabel(a.area)}</dt>
                        <dd aria-hidden="true" className="h-1.5 bg-ink/10">
                          <span className="block h-full bg-ink" style={{ width: `${(a.count / total) * 100}%` }} />
                        </dd>
                        <dd className="label text-right">{a.count}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* Level 03: everything */}
      <Section surface="dark" id="all" className="scroll-mt-16">
        <div className="page-grid gap-y-8">
          <SectionHeader index="03" eyebrow="All credentials" title={[`${achievements.length} credentials.`]} size="md" className="lg:col-span-8" />
          <TechnicalLabel as="p" className="col-span-full lg:col-span-4 lg:self-end lg:text-right">
            Verify ↗ opens the issuer&apos;s own record where one exists
          </TechnicalLabel>
          <div className="col-span-full">
            <CredentialList items={withBadges(achievements)} />
          </div>
          <div className="col-span-full flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-8">
            <ArrowLink href="/experience">See the experience</ArrowLink>
            <ArrowLink href="/trainer">Training &amp; speaking</ArrowLink>
          </div>
        </div>
      </Section>
    </>
  );
}
