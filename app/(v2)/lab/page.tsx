import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { ContributionGraph } from '@/components/v2/lab/ContributionGraph';
import { experiments, type Experiment } from '@/content/lab';
import { fetchGitHubStats } from '@/lib/github';
import { contact } from '@/content/profile';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  alternates: { canonical: '/lab' },
  title: 'Lab',
  description: "Things Razeen Iqbal is testing, learning, breaking and rebuilding.",
};

// GitHub data is fetched at build and refreshed at most hourly.
export const revalidate = 3600;

const statusText: Record<Experiment['status'], string> = {
  live: 'Live',
  prototype: 'Prototype',
  planned: 'Planned · not built yet',
};
const statusDot: Record<Experiment['status'], string> = {
  live: 'bg-lime',
  prototype: 'border border-current',
  planned: 'border border-dashed border-current',
};

export default async function LabPage() {
  const gh = await fetchGitHubStats(process.env.GITHUB_TOKEN);
  const langs = gh ? Object.entries(gh.topLanguages) : [];
  const langTotal = langs.reduce((s, [, n]) => s + n, 0);

  return (
    <>
      <Section surface="dark" grid className="!pt-16">
        <div className="page-grid gap-y-10">
          <SectionHeader as="h1" size="xl" eyebrow="Lab" title={['Testing, breaking,', 'rebuilding.']} className="lg:col-span-9">
            <p className="mt-6 max-w-prose text-lead text-muted">
              Things I&apos;m testing, learning, breaking and rebuilding. Experimental doesn&apos;t mean broken: everything
              here says what state it&apos;s in.
            </p>
          </SectionHeader>
          <div className="col-span-full hidden items-end justify-end lg:col-span-3 lg:flex">
            <MiniRazeen pose="laptop" height={164} />
          </div>
        </div>
      </Section>

      {/* Experiments */}
      <Section surface="light">
        <div className="page-container">
          <TechnicalLabel as="h2" marker="//" className="mb-6">
            Experiments · {experiments.length}
          </TechnicalLabel>
          <ol>
            {experiments.map((e, i) => {
              const body = (
                <>
                  <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="text-xl font-semibold">{e.title}</span>
                    <span className="mt-1 block max-w-prose text-sm text-muted">{e.summary}</span>
                  </span>
                  <span className="label flex items-center gap-2 md:justify-end">
                    <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', statusDot[e.status])} />
                    {statusText[e.status]}
                    {e.href && <span aria-hidden="true">{e.external ? '↗' : '↓'}</span>}
                  </span>
                </>
              );
              const cls = 'grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-2 py-6 md:grid-cols-[4rem_1fr_16rem]';
              return (
                <li key={e.slug} className="border-t border-line">
                  {e.href ? (
                    <a
                      href={e.href}
                      className={cn(cls, 'group hover:[&_.text-xl]:underline')}
                      {...(e.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* Coding activity — migrated from the V1 dashboard */}
      <Section surface="dark" id="coding-activity">
        <div className="page-grid gap-y-10">
          <div className="col-span-full flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="01 / Coding activity" title={['Commit by commit.']} size="md" />
            <TechnicalLabel>
              <span aria-hidden="true" className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lime align-middle" />
              Live from GitHub · refreshed hourly
            </TechnicalLabel>
          </div>

          {gh ? (
            <>
              <dl className="col-span-full grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
                {[
                  { k: 'Contributions · last year', v: gh.contributionCalendar?.totalContributions ?? gh.contributions },
                  { k: 'Public repositories', v: gh.repos },
                  { k: 'Stars', v: gh.totalStars },
                  { k: 'Followers', v: gh.followers },
                ].map((m) => (
                  <div key={m.k} className="border-t-2 border-ink pt-3">
                    <dt className="label text-muted">{m.k}</dt>
                    <dd className="mt-2 text-display-md tabular-nums">{m.v.toLocaleString('en')}</dd>
                  </div>
                ))}
              </dl>

              {gh.contributionCalendar && (
                <div className="col-span-full">
                  <ContributionGraph calendar={gh.contributionCalendar} />
                </div>
              )}

              {langTotal > 0 && (
                <div className="col-span-full lg:col-span-8">
                  <TechnicalLabel as="h3" className="mb-3">
                    Primary language by repository
                  </TechnicalLabel>
                  <div className="flex h-3 w-full gap-px" aria-hidden="true">
                    {langs.map(([lang, n], i) => (
                      <span
                        key={lang}
                        style={{ width: `${(n / langTotal) * 100}%`, opacity: 1 - i * 0.18 }}
                        className="bg-lime"
                      />
                    ))}
                  </div>
                  <ul className="label mt-3 flex flex-wrap gap-x-6 gap-y-1">
                    {langs.map(([lang, n]) => (
                      <li key={lang}>
                        {lang} <span className="text-muted">{n} repos · {Math.round((n / langTotal) * 100)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="col-span-full max-w-prose text-muted">
              GitHub data is unavailable right now. The activity itself is still on{' '}
              <a href={contact.github} className="underline">
                GitHub
              </a>
              .
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
