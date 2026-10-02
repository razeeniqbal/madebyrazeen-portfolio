import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { PathNarrative } from '@/components/v2/about/PathNarrative';
import { assets } from '@/lib/assets';
import { profile, education, recognition } from '@/content/profile';
import { getActiveBuilds } from '@/content/projects';
import { getCurrentRole } from '@/content/experience';
import { beyond, chapters, storyIntro, principles } from '@/content/story';

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description:
    'Who Razeen is, how a civil engineer became a data and AI engineer, the loop he works by, and what happens away from the screen.',
};

// About = meeting Razeen, not reading the CV twice (R03 §9). Credentials and experience live on /experience and /resume.
// Five moments: Intro · The path · How I think · Beyond the screen · Currently.
export default function AboutPage() {
  const building = getActiveBuilds();
  const current = getCurrentRole();
  const latestEducation = education[0];

  return (
    <>
      {/* 01 Intro */}
      <Section surface="dark" className="!pt-14">
        <div className="page-grid gap-y-12">
          <div className="col-span-full md:col-span-5 lg:col-span-7 lg:self-center">
            <TechnicalLabel as="p">About Razeen</TechnicalLabel>
            {/* Same words as the Home hero, set smaller and in sentence case so it is not the hero twice. */}
            <h1 className="mt-6 text-display-lg">
              {[profile.statement.slice(0, 2).join(' '), ...profile.statement.slice(2)].map((line, i, all) => (
                <span key={line} className="block">
                  {i === all.length - 1 ? line.replace(/\.$/, '') : line}
                  {i === all.length - 1 && (
                    <span aria-hidden="true" className="ml-[0.04em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-lime" />
                  )}
                </span>
              ))}
            </h1>
            <div className="mt-10 max-w-prose space-y-4">
              <p className="justify-copy text-lead">{storyIntro.lede}</p>
              {storyIntro.body.map((p) => (
                <p key={p.slice(0, 32)} className="justify-copy text-muted">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <PhotoFrame
            image={assets.identity.portraitFormal}
            sizes="(min-width: 1024px) 34vw, (min-width: 768px) 38vw, 100vw"
            aspect="aspect-[4/5]"
            priority
            caption="Real Razeen"
            className="col-span-full md:col-span-3 lg:col-span-4 lg:col-start-9"
          />
        </div>
      </Section>

      {/* 02 The path */}
      <Section surface="light" id="path">
        <div className="page-container">
          <SectionHeader index="01" eyebrow="The path" title={storyIntro.title} size="md" />
          <div className="mt-12">
            <PathNarrative chapters={chapters} />
          </div>
        </div>
      </Section>

      {/* 03 How I think */}
      <Section surface="dark">
        <div className="page-grid gap-y-12">
          <SectionHeader index="02" eyebrow="How I think" title={['One loop.', 'Everywhere.']} size="md" className="lg:col-span-6">
            <p className="mt-6 max-w-prose text-muted">
              The same loop runs through pipelines, models, products, learning and long runs.
            </p>
          </SectionHeader>
          <TechnicalLabel as="p" className="col-span-full self-end lg:col-span-5 lg:col-start-8 lg:text-right">
            {profile.loops.system.join(' · ')}
          </TechnicalLabel>
          <ol className="col-span-full grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => {
              const last = i === principles.length - 1;
              return (
                <li key={p.title} className="border-t border-line pt-5">
                  <p className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={last ? 'h-2.5 w-2.5 rounded-full bg-lime' : 'h-2.5 w-2.5 rounded-full border border-muted'}
                    />
                    <span className="text-display-sm uppercase">{p.title}</span>
                    {!last && (
                      <span aria-hidden="true" className="ml-auto text-muted">
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

      {/* 04 Beyond the screen */}
      <Section surface="light">
        <div className="page-grid gap-y-8">
          <SectionHeader index="03" eyebrow="Beyond the screen" title={beyond.title} size="md" className="lg:col-span-7" />
          <div className="col-span-full space-y-3 self-end lg:col-span-4 lg:col-start-9">
            {beyond.body.map((p) => (
              <p key={p.slice(0, 32)} className="justify-copy text-muted">
                {p}
              </p>
            ))}
          </div>
          {/* Editorial composition: one tall running photo, a wide event photo, two portraits. Ratios chosen so both columns end level on desktop. */}
          <PhotoFrame
            image={assets.running.race}
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
            aspect="aspect-[4/5] lg:aspect-[3/5]"
            caption="Race day"
            className="col-span-full md:col-span-4 lg:col-span-5"
          />
          <div className="col-span-full grid grid-cols-2 gap-x-4 gap-y-8 md:col-span-4 md:gap-x-6 lg:col-span-7">
            <PhotoFrame
              image={assets.career.briefing1}
              sizes="(min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw"
              aspect="aspect-[16/10]"
              caption="Industry demo"
              className="col-span-2"
            />
            <PhotoFrame image={assets.career.aws} sizes="(min-width: 1024px) 27vw, 50vw" aspect="aspect-square" caption="AWS" />
            <PhotoFrame image={assets.career.networking} sizes="(min-width: 1024px) 27vw, 50vw" aspect="aspect-square" caption="Conference" />
          </div>
          <div className="col-span-full flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
            <ArrowLink href="/running">Running</ArrowLink>
            <ArrowLink href="/journal">Journal</ArrowLink>
          </div>
        </div>
      </Section>

      {/* 05 Currently */}
      <Section surface="dark" className="border-b border-line">
        <div className="page-grid gap-y-10">
          {/* Career and education first (R05): where I work, what I studied, what I have earned, what I am building. */}
          <SectionHeader index="04" eyebrow="Currently" title={['Where I am', 'right now.']} size="md" className="lg:col-span-5" />
          <dl className="col-span-full grid gap-x-6 gap-y-8 md:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {current && (
              <div className="border-t border-line pt-4">
                <dt className="label text-muted">Working</dt>
                <dd className="mt-2">
                  <Link href={`/experience#${current.id}`} className="block font-semibold hover:underline">
                    {current.role}, {current.company}
                  </Link>
                  <p className="text-muted">
                    {[current.period, current.location?.split(',')[0]].filter(Boolean).join(' · ')}
                  </p>
                </dd>
              </div>
            )}
            {latestEducation && (
              <div className="border-t border-line pt-4">
                <dt className="label text-muted">Education</dt>
                <dd className="mt-2">
                  <p className="font-semibold">
                    {latestEducation.degree}, {latestEducation.field}
                  </p>
                  <p className="text-muted">
                    {latestEducation.short} · {latestEducation.period} · CGPA {latestEducation.cgpa}
                  </p>
                </dd>
              </div>
            )}
            {recognition.length > 0 && (
              <div className="border-t border-line pt-4">
                <dt className="label text-muted">Recognition</dt>
                <dd className="mt-2 space-y-1">
                  {recognition.slice(0, 3).map((r) => (
                    <p key={r.title}>
                      <span className="font-semibold">{r.title}</span> <span className="text-muted">· {r.year}</span>
                    </p>
                  ))}
                </dd>
              </div>
            )}
            {building.length > 0 && (
              <div className="border-t border-line pt-4">
                <dt className="label text-muted">Building</dt>
                <dd className="mt-2 space-y-1">
                  {building.map((p) => (
                    <Link key={p.slug} href={`/projects/${p.slug}`} className="block font-semibold hover:underline">
                      {p.title}
                    </Link>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          <div className="col-span-full flex flex-wrap items-end justify-between gap-8 border-t border-line pt-8">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <ArrowLink href="/projects" variant="primary">
                Explore projects
              </ArrowLink>
              <ArrowLink href="/experience">Experience</ArrowLink>
              <ArrowLink href="/trainer">Training</ArrowLink>
              <ArrowLink href="/life">Life</ArrowLink>
              <ArrowLink href="/resume" arrow="↗">
                View resume
              </ArrowLink>
            </div>
            {/* The one Mini Razeen on About: personality, not representation. */}
            <MiniRazeen pose="laptop" height={96} />
          </div>
        </div>
      </Section>
    </>
  );
}
