import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { assets } from '@/lib/assets';
import { getLatestRun, formatDuration, formatPace } from '@/content/running';

export function RunningTeaser() {
  const run = getLatestRun();

  return (
    <Section surface="dark">
      <div className="page-grid gap-y-12">
        <PhotoFrame
          image={assets.running.action}
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
          aspect="aspect-[4/5]"
          caption="Race day"
          meta="Real Razeen"
          className="col-span-full md:col-span-4 lg:col-span-5"
        />

        <div className="col-span-full flex flex-col md:col-span-4 lg:col-span-6 lg:col-start-7">
          <SectionHeader index="06" eyebrow="Beyond work" title={['Running keeps', 'me grounded.']} />

          {run && (
            <div className="mt-12">
              <div className="flex items-center justify-between border-t border-line pt-4">
                <TechnicalLabel>Latest run</TechnicalLabel>
                {run.sample && (
                  <TechnicalLabel className="border border-current px-1.5">Sample data · Garmin sync coming</TechnicalLabel>
                )}
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { k: 'Distance', v: run.distanceKm.toFixed(2), u: 'km' },
                  { k: 'Time', v: formatDuration(run.durationSec), u: '' },
                  { k: 'Pace', v: formatPace(run), u: '/km' },
                ].map((m) => (
                  <div key={m.k}>
                    <dt className="label text-muted">{m.k}</dt>
                    <dd className="mt-1 text-display-sm tabular-nums">
                      {m.v}
                      {m.u && <span className="ml-1 text-base font-normal text-muted">{m.u}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <p className="mt-10 text-lead">
            Consistency compounds.
            <br />
            <span className="text-muted">In training and engineering.</span>
          </p>
          <div className="mt-8">
            <ArrowLink href="/running">Explore running</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
