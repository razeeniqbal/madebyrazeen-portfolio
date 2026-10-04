import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { assets } from '@/lib/assets';
import { beyond } from '@/content/story';
import { getLifeInterests } from '@/content/life';
import { getProject } from '@/content/projects';
import { getPersonalBests, getTotals, isSampleData, formatDuration, formatPaceSec } from '@/content/running';

/**
 * Home 06. Life, broader than running: the race-day photo and real running numbers anchor it, then
 * volleyball and Formula 1 as short threads (the Life page's own steps). Numbers come from
 * content/running, so Home changes when the data does.
 */
export function LifeTeaser() {
  const sample = isSampleData();
  const totals = getTotals();
  const bests = getPersonalBests().filter((b) => b.sec && ['5k', '10k', 'half'].includes(b.key));
  const threads = getLifeInterests().filter((i) => i.story.length > 0);

  return (
    <Section surface="dark">
      <div className="page-grid gap-y-12">
        <PhotoFrame
          image={assets.running.action}
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
          aspect="aspect-[4/3] md:aspect-[4/5]"
          caption="Race day"
          meta="Real Razeen"
          className="col-span-full md:col-span-4 lg:col-span-5"
        />

        <div className="col-span-full md:col-span-4 lg:col-span-6 lg:col-start-7 lg:self-end">
          <SectionHeader index="06" eyebrow="Life" title={beyond.title} size="md" />
          <p className="mt-6 max-w-prose text-muted">{beyond.body[0]}</p>

          <div className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
              <h3 className="font-semibold">
                <Link href="/running" className="hover:underline">
                  Running
                </Link>
              </h3>
              {!sample && (
                <TechnicalLabel>
                  {totals.runs} outdoor runs · {totals.km.toFixed(0)} km
                </TechnicalLabel>
              )}
            </div>
            {sample ? (
              <p className="mt-3">
                <TechnicalLabel className="border border-current px-1.5">Sample data · Garmin sync coming</TechnicalLabel>
              </p>
            ) : (
              <dl className="mt-4 grid grid-cols-3 gap-4">
                {bests.map((b) => (
                  <div key={b.key}>
                    <dt className="label text-muted">{b.short} best</dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums md:text-3xl">{formatDuration(b.sec!)}</dd>
                    <dd className="mt-0.5 text-sm text-muted">{formatPaceSec(b.sec! / b.km)} /km</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {threads.map((t) => {
            // Where the interest led: the step that names the project links to it (VSB), or the project
            // is added as the last step when the story stops before naming it (F1 → Sepang Vision Lab).
            const project = t.relatedProject ? getProject(t.relatedProject) : undefined;
            const steps = t.story.map((s) => s.label);
            if (project && !steps.includes(project.title)) steps.push(project.title);
            return (
              <div key={t.slug} className="mt-6 border-t border-line pt-4">
                <h3 className="font-semibold">
                  <Link href={`/life#${t.slug}`} className="hover:underline">
                    {t.name}
                  </Link>
                </h3>
                <ol aria-label={`${t.name}, step by step`} className="label mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
                  {steps.map((label, i) => (
                    <li key={label} className="flex items-center gap-3">
                      {project && label === project.title ? (
                        <Link href={`/projects/${project.slug}`} className="text-ink underline underline-offset-4">
                          {label}
                        </Link>
                      ) : (
                        <span>{label}</span>
                      )}
                      {i < steps.length - 1 && <span aria-hidden="true">→</span>}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}

          <div className="mt-10">
            <ArrowLink href="/life">More from life</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
