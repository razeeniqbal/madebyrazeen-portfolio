import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { RouteMap } from '@/components/v2/running/RouteMap';
import { assets } from '@/lib/assets';
import {
  getLatestRun,
  getPersonalBests,
  getRaces,
  isSampleData,
  formatDuration,
  formatPace,
  formatPaceSec,
} from '@/content/running';

export const metadata: Metadata = {
  alternates: { canonical: '/running' },
  title: 'Running',
  description: 'Same steps. Better insights. Running data and stories from Razeen Iqbal.',
};

const principles = ['Consistency', 'Iteration', 'Measurement', 'Adaptation', 'Progress', 'Endurance'];

function SampleBadge() {
  return <TechnicalLabel className="border border-current px-1.5">Sample data · Garmin sync coming</TechnicalLabel>;
}

export default function RunningPage() {
  const run = getLatestRun();
  const sample = isSampleData();
  const bests = getPersonalBests();
  const races = getRaces();
  const avgPace = run ? run.durationSec / run.distanceKm : 0;

  return (
    <>
      {/* Header */}
      <Section surface="dark" grid className="!pt-16">
        <div className="page-grid gap-y-10">
          <div className="col-span-full md:col-span-5 lg:col-span-7 lg:self-end">
            <SectionHeader as="h1" size="xl" eyebrow="Running" title={['Same steps.', 'Better insights.']} />
            <p className="mt-8 max-w-prose text-lead text-muted">
              Running is where engineering habits meet real life: show up, measure, adjust, repeat. Consistency compounds.
            </p>
            {sample && (
              <div className="mt-8">
                <SampleBadge />
              </div>
            )}
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

      {/* Latest run */}
      {run && (
        <Section surface="dark" className="!pt-0">
          <div className="page-grid gap-y-10">
            <div className="col-span-full flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <TechnicalLabel as="h2" marker="01 /">
                Latest run · {new Date(`${run.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
              </TechnicalLabel>
              {run.sample && <SampleBadge />}
            </div>

            <dl className="col-span-full grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
              {[
                { k: 'Distance', v: run.distanceKm.toFixed(2), u: 'km' },
                { k: 'Time', v: formatDuration(run.durationSec), u: '' },
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
                      <th scope="col" className="w-1/3 py-2"><span className="sr-only">Relative pace</span></th>
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
                          <td className="py-2 text-right">
                            {delta === 0 ? '±0' : `${faster ? '−' : '+'}${Math.abs(delta)}s`}
                          </td>
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

      {/* Why running */}
      <Section surface="light">
        <div className="page-grid gap-y-10">
          <SectionHeader index="02" eyebrow="Why it connects" title={['Training is an', 'engineering loop.']} size="md" className="lg:col-span-6" />
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

      {/* PBs + races */}
      <Section surface="light" className="!pt-0">
        <div className="page-grid gap-y-12">
          <div className="col-span-full lg:col-span-5">
            <TechnicalLabel as="h2" marker="03 /" className="mb-4">
              Personal bests
            </TechnicalLabel>
            <dl>
              {bests.map((b) => (
                <div key={b.label} className="flex items-baseline justify-between border-t border-line py-3">
                  <dt className="font-semibold">{b.label}</dt>
                  <dd className="tabular-nums">
                    {b.run ? (
                      <>
                        {formatDuration(b.run.durationSec)}
                        {b.run.sample && <span className="label ml-2 text-muted">sample</span>}
                      </>
                    ) : (
                      <span className="label text-muted">Awaiting data</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-full lg:col-span-6 lg:col-start-7">
            <TechnicalLabel as="h2" marker="04 /" className="mb-4">
              Race history
            </TechnicalLabel>
            {races.length > 0 ? (
              <ol>
                {races.map((r) => (
                  <li key={r.id} className="grid grid-cols-[6rem_1fr_auto] gap-4 border-t border-line py-3">
                    <span className="label text-muted">{r.date}</span>
                    <span className="font-semibold">{r.race?.name}</span>
                    <span className="tabular-nums">{formatDuration(r.durationSec)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex items-center gap-6 border-t border-line py-6">
                <MiniRazeen pose="running" height={96} />
                <p className="text-muted">No races synced yet. They&apos;ll appear here once Garmin data is connected.</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section surface="dark">
        <div className="page-grid gap-y-8">
          <PhotoFrame
            image={assets.running.race}
            sizes="(min-width: 1024px) 40vw, 100vw"
            aspect="aspect-[4/5]"
            caption="Road race"
            className="col-span-full md:col-span-4 lg:col-span-5"
          />
          <div className="col-span-full self-end md:col-span-4 lg:col-span-6 lg:col-start-7">
            <SectionHeader index="05" eyebrow="Running stories" title={['Further than', 'yesterday.']} size="md" />
            <p className="mt-6 max-w-prose text-muted">
              Race reports and training reflections will live here, alongside the field notes.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
