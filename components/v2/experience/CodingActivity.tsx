import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ContributionGraph } from './ContributionGraph';
import { fetchGitHubStats } from '@/lib/github';
import { contact } from '@/content/profile';

/** Live GitHub activity (formerly on /lab). Pages using this should set `export const revalidate = 3600`. */
export async function CodingActivity() {
  const gh = await fetchGitHubStats(process.env.GITHUB_TOKEN);
  const langs = gh ? Object.entries(gh.topLanguages) : [];
  const langTotal = langs.reduce((s, [, n]) => s + n, 0);

  // Coding activity, migrated from the V1 dashboard.
  return (
    <Section surface="dark" id="coding-activity">
      <div className="page-grid gap-y-10">
        <div className="col-span-full flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="04 / Coding activity" title={['Commit by commit.']} size="md" />
          <TechnicalLabel>
            <span aria-hidden="true" className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lime align-middle" />
            Live from GitHub · refreshed hourly
          </TechnicalLabel>
        </div>

        {gh ? (
          <>
            <dl className="col-span-full grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
              {[
                {
                  k: 'Contributions · last year',
                  v: gh.contributionCalendar?.totalContributions ?? gh.contributions,
                },
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
                      style={{
                        width: `${(n / langTotal) * 100}%`,
                        opacity: 1 - i * 0.18,
                      }}
                      className="bg-lime"
                    />
                  ))}
                </div>
                <ul className="label mt-3 flex flex-wrap gap-x-6 gap-y-1">
                  {langs.map(([lang, n]) => (
                    <li key={lang}>
                      {lang}{' '}
                      <span className="text-muted">
                        {n} repos · {Math.round((n / langTotal) * 100)}%
                      </span>
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
  );
}
