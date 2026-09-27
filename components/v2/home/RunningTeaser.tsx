import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { assets } from '@/lib/assets';
import { getPersonalBests, getTotals, isSampleData, formatDuration, formatPaceSec } from '@/content/running';

/** Home 05. Personal bests lead (not the latest run, which may be a short easy one). Real data, never invented. */
export function RunningTeaser() {
  const sample = isSampleData();
  const totals = getTotals();
  const bests = getPersonalBests().filter((b) => b.sec && ['5k', '10k', 'half'].includes(b.key));

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

        <div className="col-span-full flex flex-col md:col-span-4 lg:col-span-6 lg:col-start-7 lg:self-end">
          <SectionHeader index="04" eyebrow="Running" title={['Running has become', 'my other kind of', 'problem solving.']} size="md" />

          {sample ? (
            <p className="mt-12 border-t border-line pt-4">
              <TechnicalLabel className="border border-current px-1.5">Sample data · Garmin sync coming</TechnicalLabel>
            </p>
          ) : (
            <div className="mt-12">
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
                <TechnicalLabel>Personal bests</TechnicalLabel>
                <TechnicalLabel>
                  {totals.runs} outdoor runs · {totals.km.toFixed(0)} km
                </TechnicalLabel>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-4">
                {bests.map((b) => (
                  <div key={b.key}>
                    <dt className="label text-muted">{b.short}</dt>
                    <dd className="mt-1 text-display-sm tabular-nums">{formatDuration(b.sec!)}</dd>
                    <dd className="mt-1 text-sm text-muted">{formatPaceSec(b.sec! / b.km)} /km</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-10">
            <ArrowLink href="/running">Explore running</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
