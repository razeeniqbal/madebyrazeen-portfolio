import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { RouteMap } from '@/components/v2/running/RouteMap';
import { WeekStrip } from '@/components/v2/running/RunCharts';
import { MonthlyChartInteractive, PaceCalculator } from '@/components/v2/running/RunInteractive';
import { RunLog } from '@/components/v2/running/RunLog';
import { assets } from '@/lib/assets';
import {
  getRuns,
  getLatestRun,
  getPersonalBests,
  getRaces,
  getTotals,
  getMonthly,
  getWeekly,
  getSyncInfo,
  isSampleData,
  formatDate,
  formatDuration,
  formatPace,
  formatPaceSec,
} from '@/content/running';

export const metadata: Metadata = {
  alternates: { canonical: '/running' },
  title: 'Running',
  description: 'Personal bests, races and every outdoor run from Razeen Iqbal, synced from Garmin and Strava.',
};

const principles = ['Consistency', 'Iteration', 'Measurement', 'Adaptation', 'Progress', 'Endurance'];

function SampleBadge() {
  return <TechnicalLabel className="border border-current px-1.5">Sample data · Garmin sync coming</TechnicalLabel>;
}

// Order (R04): personal bests lead, then the year in numbers, races, the latest outdoor run and every run.
// Treadmill runs are excluded throughout (content/running.ts).
export default function RunningPage() {
  const runs = getRuns();
  const run = getLatestRun();
  const sample = isSampleData();
  const bests = getPersonalBests();
  const achieved = bests.filter((b) => b.sec);
  const next = bests.find((b) => !b.sec);
  const races = getRaces();
  const totals = getTotals();
  const months = getMonthly();
  const weeks = getWeekly();
  const activeWeeks = weeks.filter((w) => w.runs > 0).length;
  const sync = getSyncInfo();
  const avgPace = run ? run.durationSec / run.distanceKm : 0;

  return (
    <>
      {/* Header */}
      <Section surface="dark" grid className="!pt-16">
        <div className="page-grid gap-y-10">
          <div className="col-span-full">
            <ArrowLink href="/life#running">Back to Life</ArrowLink>
          </div>
          <div className="col-span-full md:col-span-5 lg:col-span-7 lg:self-start">
            <SectionHeader as="h1" size="xl" eyebrow="Life / Running" title={['Same steps.', 'Better insights.']} />
            <p className="mt-8 max-w-prose text-lead text-muted">
              Running is where engineering habits meet real life: show up, measure, adjust, repeat. Consistency compounds.
            </p>
            <p className="label mt-8 text-muted">
              {sample ? (
                <SampleBadge />
              ) : (
                <>
                  {totals.runs} outdoor runs · {totals.km.toFixed(0)} km since {formatDate(totals.since ?? '', { month: 'short', year: 'numeric' })}
                  {sync && ` · updated ${formatDate(sync.syncedAt)}`}
                </>
              )}
            </p>
          </div>
          <PhotoFrame
            image={assets.running.action}
            sizes="(min-width: 1024px) 38vw, 40vw"
            aspect="aspect-[4/5]"
            priority
            caption="Race day"
            meta="Real Razeen"
            className="col-span-full md:col-span-3 lg:col-span-5"
          />
        </div>
      </Section>

      {/* 01 Personal bests: the highlight */}
      <Section surface="light">
        <div className="page-grid gap-y-10">
          <SectionHeader index="01" eyebrow="Personal bests" title={['Fastest so far.']} size="md" className="lg:col-span-6" />
          <p className="col-span-full self-end text-muted lg:col-span-5 lg:col-start-8">
            Fastest continuous effort inside any outdoor run, measured from the GPS track the way Garmin and Strava do. Treadmill
            runs do not count.
          </p>
          <dl className="col-span-full grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {achieved.map((b) => (
              <div key={b.key} className="border-t-2 border-ink pt-4">
                <dt className="label text-muted">{b.label}</dt>
                <dd className="mt-3 font-display text-display-md font-extrabold tabular-nums">{formatDuration(b.sec!)}</dd>
                <dd className="mt-2 text-sm">
                  {formatPaceSec(b.sec! / b.km)} <span className="text-muted">/km</span>
                </dd>
                {b.run && (
                  <dd className="mt-1 text-sm text-muted">
                    {b.run.race ? <span className="font-medium text-ink">{b.run.race.name}</span> : b.run.title} · {formatDate(b.run.date)}
                  </dd>
                )}
              </div>
            ))}
          </dl>
          <div className="col-span-full lg:col-span-6">
            <PaceCalculator bests={bests.map((b) => ({ key: b.key, label: b.label, km: b.km, sec: b.sec }))} />
          </div>
          {next && (
            <p className="col-span-full flex items-center gap-3 border-t border-line pt-5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border border-ink" />
              <span className="font-semibold">{next.label}</span>
              <span className="text-muted">· not run yet. The next line on this list.</span>
            </p>
          )}
        </div>
      </Section>

      {/* 02 In numbers */}
      {!sample && (
        <Section surface="dark">
          <div className="page-grid gap-y-12">
            <SectionHeader index="02" eyebrow="In numbers" title={['Kilometre', 'by kilometre.']} size="md" className="lg:col-span-6" />
            <dl className="col-span-full grid grid-cols-2 gap-x-6 gap-y-8 lg:col-span-6 lg:grid-cols-2 lg:self-end">
              {[
                { k: 'Outdoor runs', v: String(totals.runs) },
                { k: 'Distance', v: `${totals.km.toFixed(0)} km` },
                { k: 'Time on feet', v: `${Math.round(totals.durationSec / 3600)} h` },
                { k: 'Longest run', v: totals.longest ? `${totals.longest.distanceKm.toFixed(1)} km` : '·' },
              ].map((m) => (
                <div key={m.k} className="border-t border-line pt-3">
                  <dt className="label text-muted">{m.k}</dt>
                  <dd className="mt-2 text-display-sm tabular-nums">{m.v}</dd>
                </div>
              ))}
            </dl>
            <div className="col-span-full lg:col-span-7">
              <TechnicalLabel as="h3" className="mb-4">
                Distance per month (km)
              </TechnicalLabel>
              <MonthlyChartInteractive months={months} />
            </div>
            <div className="col-span-full lg:col-span-4 lg:col-start-9">
              <TechnicalLabel as="h3" className="mb-4">
                Consistency · {activeWeeks} of {weeks.length} weeks with a run
              </TechnicalLabel>
              <WeekStrip weeks={weeks} />
            </div>
          </div>
        </Section>
      )}

      {/* 03 Races */}
      {races.length > 0 && (
        <Section surface="light">
          <div className="page-grid gap-y-8">
            <SectionHeader index="03" eyebrow="Races" title={['Bib on.']} size="md" className="lg:col-span-5" />
            <ol className="col-span-full lg:col-span-7 lg:col-start-6">
              {races.map((r) => {
                const time = r.elapsedSec ?? r.durationSec;
                return (
                  <li key={r.id} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-t border-line py-4 md:grid-cols-[7rem_1fr_5rem_5.5rem]">
                    <span className="label text-muted md:order-none">{formatDate(r.date)}</span>
                    <span className="order-first font-semibold md:order-none">{r.race?.name}</span>
                    <span className="tabular-nums text-muted md:text-ink">{r.distanceKm.toFixed(2)} km</span>
                    <span className="text-right tabular-nums">{formatDuration(time)}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </Section>
      )}

      {/* 04 Latest outdoor run */}
      {run && (
        <Section surface="dark">
          <div className="page-grid gap-y-10">
            <div className="col-span-full flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <TechnicalLabel as="h2" marker="04 /">
                Latest outdoor run · {formatDate(run.date)}
              </TechnicalLabel>
              {run.sample && <SampleBadge />}
            </div>

            <dl className="col-span-full grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
              {[
                { k: 'Distance', v: run.distanceKm.toFixed(2), u: 'km' },
                { k: 'Moving time', v: formatDuration(run.durationSec), u: '' },
                { k: 'Avg pace', v: formatPace(run), u: '/km' },
                { k: 'Avg HR', v: run.avgHr?.toString(), u: 'bpm' },
                { k: 'Elevation', v: run.elevationGainM?.toString(), u: 'm' },
                { k: 'Cadence', v: run.cadenceSpm?.toString(), u: 'spm' },
              ]
                .filter((m) => m.v)
                .map((m) => (
                  <div key={m.k} className="border-t-2 border-ink pt-3">
                    <dt className="label text-muted">{m.k}</dt>
                    <dd className="mt-2 text-display-sm tabular-nums">
                      {m.v}
                      {m.u && <span className="ml-1 text-base font-normal text-muted">{m.u}</span>}
                    </dd>
                  </div>
                ))}
            </dl>

            {run.route && (
              <figure className="col-span-full lg:col-span-7">
                <RouteMap
                  route={run.route}
                  distanceKm={run.distanceKm}
                  label={`Route of the ${run.distanceKm.toFixed(2)} km run${run.sample ? ' (sample shape)' : ''}.`}
                />
                <figcaption className="mt-2 flex justify-between gap-4">
                  <TechnicalLabel>Route · {run.sample ? 'sample shape' : 'ends trimmed for privacy'}</TechnicalLabel>
                  <TechnicalLabel>{run.distanceKm.toFixed(2)} km</TechnicalLabel>
                </figcaption>
              </figure>
            )}

            {run.splits && (
              <div className="col-span-full lg:col-span-5">
                <table className="w-full border-collapse text-left tabular-nums">
                  <caption className="label mb-3 text-left text-muted">Splits · avg {formatPaceSec(avgPace)} /km</caption>
                  <thead>
                    <tr className="border-b border-ink/40">
                      <th scope="col" className="label py-2 font-normal text-muted">Km</th>
                      <th scope="col" className="label py-2 font-normal text-muted">Pace</th>
                      <th scope="col" className="label py-2 text-right font-normal text-muted">vs avg</th>
                      <th scope="col" className="w-1/3 py-2">
                        <span className="sr-only">Relative pace</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {run.splits.map((s, i) => {
                      const pace = s.durationSec / s.km;
                      const delta = Math.round(pace - avgPace);
                      const faster = delta < 0;
                      return (
                        <tr key={i} className="border-b border-line">
                          <td className="py-2">{s.km < 1 ? (i + s.km).toFixed(2) : i + 1}</td>
                          <td className="py-2">{formatPaceSec(pace)}</td>
                          <td className="py-2 text-right">{delta === 0 ? '±0' : `${faster ? '−' : '+'}${Math.abs(delta)}s`}</td>
                          <td className="py-2 pl-4" aria-hidden="true">
                            <span
                              className={faster ? 'block h-1.5 bg-lime' : 'block h-1.5 border border-muted'}
                              style={{ width: `${Math.min(100, 20 + Math.abs(delta) * 6)}%` }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-3 text-sm text-muted">Filled bars: faster than average. Outlined: slower.</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* 05 Every run */}
      {!sample && (
        <Section surface="light" id="all-runs">
          <div className="page-container">
            <SectionHeader index="05" eyebrow="Every run" title={['All of them.']} size="md">
              <p className="mt-4 max-w-prose text-muted">
                {runs.length} outdoor runs, newest first. Routes are shapes only: the ends are cut and no coordinates are published.
              </p>
            </SectionHeader>
            <div className="mt-10">
              <RunLog runs={runs} />
            </div>
          </div>
        </Section>
      )}

      {/* Why running */}
      <Section surface="dark">
        <div className="page-grid gap-y-10">
          <SectionHeader index="06" eyebrow="Why it connects" title={['Training is an', 'engineering loop.']} size="md" className="lg:col-span-6" />
          <ol className="col-span-full grid grid-cols-2 gap-x-6 md:grid-cols-3 lg:col-span-6">
            {principles.map((p, i) => (
              <li key={p} className="border-t border-line py-4">
                <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-1 text-xl font-semibold">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section surface="light">
        <div className="page-grid gap-y-8">
          <PhotoFrame
            image={assets.running.race}
            sizes="(min-width: 1024px) 40vw, 100vw"
            aspect="aspect-[4/5]"
            caption="Road race"
            className="col-span-full md:col-span-4 lg:col-span-5"
          />
          <div className="col-span-full self-start md:col-span-4 lg:col-span-6 lg:col-start-7">
            <SectionHeader index="07" eyebrow="From the journal" title={['Further than', 'yesterday.']} size="md" />
            <p className="mt-6 max-w-prose text-muted">Race reports and training reflections will live in the journal.</p>
            <div className="mt-6">
              <ArrowLink href="/journal">Read the journal</ArrowLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
