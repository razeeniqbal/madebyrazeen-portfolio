import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { Trajectory } from '@/components/v2/system/Trajectory';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { CredentialBadge } from '@/components/v2/credentials/CredentialBadge';
import { statusLabel } from '@/components/v2/work/ProjectMeta';
import { assets, type ImageAsset } from '@/lib/assets';
import { profile } from '@/content/profile';
import { selectedCredentials, achievements } from '@/content/achievements';
import { credentialShortTitle } from '@/lib/credentials';
import {
  aboutClosing,
  aboutHero,
  aboutStages,
  beyond,
  currently,
  howIWork,
  learning,
  moments,
  principles,
  whyBuild,
  type Moment,
} from '@/content/story';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description:
    'The story behind Razeen Iqbal’s path from Civil Engineering to Data Engineering, AI systems, personal products and technical knowledge sharing.',
};

const pad = (n: number) => String(n).padStart(2, '0');

/** One narrative moment: heading on the left, the text (and any questions) on the right. */
function MomentSection({
  moment,
  index,
  surface,
  grid,
  photo,
}: {
  moment: Moment;
  index: number;
  surface: 'dark' | 'light';
  grid?: boolean;
  photo?: { image: ImageAsset; caption: string };
}) {
  return (
    <Section surface={surface} grid={grid} id={moment.id} className="scroll-mt-16">
      <div className="page-grid gap-y-10">
        <div className="col-span-full lg:col-span-5">
          <SectionHeader index={pad(index)} eyebrow={moment.eyebrow} title={moment.title} size="md" />
          {photo && (
            <PhotoFrame
              image={photo.image}
              sizes="(min-width: 1024px) 30vw, 100vw"
              aspect="aspect-[4/3] lg:aspect-[4/5]"
              caption={photo.caption}
              className="mt-10 lg:max-w-sm"
            />
          )}
        </div>
        <div className="col-span-full max-w-prose space-y-4 lg:col-span-6 lg:col-start-7">
          {moment.body.map((p, i) => {
            // The sentence that leads into the questions carries the turn, so it is set in ink.
            const bridge = moment.questions.length > 0 && i === moment.body.length - 1;
            return (
              <p key={p} className={i === 0 ? 'text-lead' : bridge ? 'font-semibold text-ink' : 'text-muted'}>
                {p}
              </p>
            );
          })}
          {moment.questions.length > 0 && (
            // The questions are the turn in the story: set large, numbered, on a rule. Not quotation cards.
            <ol aria-label="Questions" className="!my-10 border-l-2 border-lime">
              {moment.questions.map((q, i) => (
                <li key={q} className="flex items-baseline gap-4 py-2 pl-5">
                  <span className="label shrink-0 text-muted">Q{i + 1}</span>
                  <span className="text-display-sm text-ink">{q}</span>
                </li>
              ))}
            </ol>
          )}
          {moment.after.map((p, i) => (
            <p key={p} className={i === moment.after.length - 1 ? 'font-semibold text-ink' : 'text-muted'}>
              {p}
            </p>
          ))}
          {moment.link && (
            <div className="pt-4">
              <ArrowLink href={moment.link.href}>{moment.link.label}</ArrowLink>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

// About answers WHY the path happened. Experience answers WHAT happened, so this page links there for
// dates, roles and work instead of repeating them. All copy lives in content/data/story.json; the
// projects, credentials and growth loop come from their own canonical records.
export default function AboutPage() {
  const byId = (id: string) => moments.find((m) => m.id === id);
  const origin = byId('where-it-started');
  const turning = byId('data-turning-point');
  const intoData = byId('into-data');
  const toAi = byId('data-to-ai');
  const growth = profile.loops.system;

  return (
    <>
      {/* 01 Hero + 02 The path */}
      <Section surface="dark" className="!pt-16">
        <PageHeader
          href="/about"
          title={aboutHero.title}
          lede={aboutHero.lede}
          aside={
            <PhotoFrame
              image={assets.identity.portraitFormal}
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 38vw, 100vw"
              aspect="aspect-[4/3] md:aspect-[4/5]"
              priority
              caption="Razeen"
            />
          }
        />
        <div id="path" className="page-grid mt-20 scroll-mt-20">
          <TechnicalLabel as="h2" marker={`${pad(2)} /`} className="col-span-full mb-6">
            The path
          </TechnicalLabel>
          <ol aria-label="The path, in order" className="col-span-full grid grid-cols-2 border-t border-line md:grid-cols-4">
            {aboutStages.map((s, i) => {
              const last = i === aboutStages.length - 1;
              return (
                <li key={s.label} className={cn('border-b border-line py-6 pr-4 md:border-b-0', i > 0 && 'md:border-l md:pl-6')}>
                  <p className="flex items-center gap-3">
                    <span aria-hidden="true" className={cn('h-2.5 w-2.5 rounded-full', last ? 'bg-lime' : 'border border-muted')} />
                    <span className="label text-muted">{pad(i + 1)}</span>
                    {!last && (
                      <span aria-hidden="true" className="label ml-auto hidden text-muted md:inline">
                        →
                      </span>
                    )}
                  </p>
                  <p className="mt-3 text-display-sm uppercase">{s.label}</p>
                  <p className="mt-1 text-sm text-muted">{s.detail}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {origin && <MomentSection moment={origin} index={3} surface="light" />}
      {turning && <MomentSection moment={turning} index={4} surface="dark" grid />}
      {intoData && <MomentSection moment={intoData} index={5} surface="light" />}
      {toAi && (
        <MomentSection moment={toAi} index={6} surface="dark" photo={{ image: assets.identity.graduation, caption: 'Master of Science, Artificial Intelligence' }} />
      )}

      {/* 07 Why I build: the origin of each primary build, linked to its canonical project */}
      <Section surface="light" id="why-i-build" className="scroll-mt-16 bg-raised">
        <div className="page-grid gap-y-12">
          <SectionHeader index={pad(7)} eyebrow={whyBuild.eyebrow} title={whyBuild.title} size="md" className="lg:col-span-9" />
          <ol className="col-span-full">
            {whyBuild.origins.map((o) => (
              <li key={o.project.slug} className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-line py-8 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <p className="text-display-sm">{o.lead}</p>
                  <p className="mt-3 max-w-prose text-muted">{o.text}</p>
                </div>
                <Link
                  href={`/projects/${o.project.slug}`}
                  className="group block border-l-2 border-ink pl-5 lg:col-span-5 lg:col-start-8 lg:self-center"
                >
                  <span className="label block text-muted">That became</span>
                  <span className="mt-1 block text-display-md transition-colors group-hover:text-signal">{o.project.title}</span>
                  <span className="label mt-2 block text-ink">{o.label}</span>
                  <span className="label mt-1 block text-muted">
                    {statusLabel[o.project.status]} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="col-span-full space-y-1 border-t border-ink pt-8 lg:col-span-8">
            {whyBuild.after.map((p, i) => (
              <p key={p} className={i === whyBuild.after.length - 1 ? 'text-display-sm' : 'text-lead text-muted'}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* 08 How I work */}
      <Section surface="dark" grid id="how-i-work" className="scroll-mt-16">
        <div className="page-grid gap-y-12">
          <SectionHeader index={pad(8)} eyebrow={howIWork.eyebrow} title={howIWork.title} size="md" className="lg:col-span-6" />
          <div className="col-span-full max-w-prose space-y-4 self-end lg:col-span-5 lg:col-start-8">
            {howIWork.body.map((p, i) => (
              <p key={p} className={i === 0 ? 'text-lead' : 'text-muted'}>
                {p}
              </p>
            ))}
          </div>
          <ol aria-label="How I work, in order" className="col-span-full grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => {
              const last = i === principles.length - 1;
              return (
                <li key={p.title} className="border-t border-line pt-5">
                  <p className="flex items-center gap-3">
                    <span aria-hidden="true" className={last ? 'h-2.5 w-2.5 rounded-full bg-lime' : 'h-2.5 w-2.5 rounded-full border border-muted'} />
                    <span className="label text-muted">{pad(i + 1)}</span>
                    <span className="text-display-sm uppercase">{p.title}</span>
                    {!last && (
                      <span aria-hidden="true" className="ml-auto hidden text-muted lg:inline">
                        →
                      </span>
                    )}
                  </p>
                  <p className="mt-3 text-muted">{p.detail}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* 09 Learning and sharing */}
      <Section surface="light" id="learning" className="scroll-mt-16">
        <div className="page-grid gap-y-10">
          <SectionHeader index={pad(9)} eyebrow={learning.eyebrow} title={learning.title} size="md" className="lg:col-span-9" />
          <PhotoFrame
            image={assets.career.briefing2}
            sizes="(min-width: 1024px) 34vw, 100vw"
            aspect="aspect-[4/3]"
            caption="Walking guests through a demo"
            className="col-span-full lg:col-span-5"
          />
          <div className="col-span-full max-w-prose space-y-4 lg:col-span-6 lg:col-start-7">
            {learning.body.map((p, i) => (
              <p key={p} className={i === 0 ? 'text-lead' : i === learning.body.length - 1 ? 'font-semibold text-ink' : 'text-muted'}>
                {p}
              </p>
            ))}
            <div className="!mt-10 border-t border-line pt-5">
              <p className="label mb-4 text-muted">The loop</p>
              <Trajectory steps={growth} />
            </div>
            <div className="pt-4">
              <ArrowLink href="/trainer">Training & speaking</ArrowLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 10 Currently + 11 Selected credentials */}
      <Section surface="dark" id="currently" className="scroll-mt-16">
        <div className="page-grid gap-y-10">
          <SectionHeader index={pad(10)} eyebrow="Currently" title={['Where I am', 'right now.']} size="md" />
          <dl className="col-span-full grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: 'Working on', v: currently.working.map((w) => <p key={w}>{w}</p>) },
              {
                k: 'Building',
                v: currently.building.map((p) => (
                  <p key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="font-semibold hover:underline">
                      {p.title}
                    </Link>
                    <span className="label ml-2 text-muted">{statusLabel[p.status]}</span>
                  </p>
                )),
              },
              { k: 'Exploring', v: currently.exploring.map((w) => <p key={w}>{w}</p>) },
              { k: 'Sharing', v: currently.sharing.map((w) => <p key={w}>{w}</p>) },
            ].map((row) => (
              <div key={row.k} className="border-t border-line pt-4">
                <dt className="label text-muted">{row.k}</dt>
                <dd className="mt-3 space-y-1.5">{row.v}</dd>
              </div>
            ))}
          </dl>

          <div className="col-span-full mt-10 border-t border-line pt-10">
            <TechnicalLabel as="h2" marker={`${pad(11)} /`}>
              Selected credentials
            </TechnicalLabel>
            <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {selectedCredentials.map((a) => (
                <li key={a.id} className="flex items-center gap-4">
                  <CredentialBadge credential={a} size={44} />
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold leading-snug">{credentialShortTitle(a)}</p>
                    <p className="text-muted">{a.organization}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ArrowLink href="/credentials">View all {achievements.length} credentials</ArrowLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 12 Away from the screen */}
      <Section surface="light" id="away" className="scroll-mt-16">
        <div className="page-grid gap-y-10">
          <div className="col-span-full lg:col-span-6 lg:self-center">
            <SectionHeader index={pad(12)} eyebrow={beyond.eyebrow} title={beyond.title} size="md" />
            <div className="mt-8 max-w-prose space-y-4">
              {beyond.body.map((p, i) => (
                <p key={p} className={i === 0 ? 'text-lead' : 'text-muted'}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <ArrowLink href="/life">A little more about Life</ArrowLink>
            </div>
          </div>
          <PhotoFrame
            image={assets.running.race}
            sizes="(min-width: 1024px) 34vw, 100vw"
            aspect="aspect-[4/3] lg:aspect-[4/5]"
            caption="Race day"
            className="col-span-full lg:col-span-4 lg:col-start-9"
          />
        </div>
      </Section>

      {/* Closing */}
      <Section surface="dark" className="border-t border-line">
        <div className="page-grid items-end gap-y-10">
          <h2 className="col-span-full text-display-lg uppercase">
            {aboutClosing.title.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h2>
          <div className="col-span-full flex flex-wrap items-end justify-between gap-8">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <ArrowLink href="/projects" variant="primary">
                View projects
              </ArrowLink>
              <ArrowLink href="/experience">See my experience</ArrowLink>
            </div>
            {/* Desktop only: on phones the floating chat button sits in this corner. */}
            <MiniRazeen pose="laptop" height={96} className="hidden lg:block" />
          </div>
        </div>
      </Section>
    </>
  );
}
