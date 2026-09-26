import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { ContactBlock } from '@/components/v2/home/AboutContact';
import { CredentialList } from '@/components/v2/about/CredentialList';
import { StoryTimeline } from '@/components/v2/about/StoryTimeline';
import { PathDiagram } from '@/components/v2/about/PathDiagram';
import { AskButton } from '@/components/v2/contact/AskButton';
import { assets } from '@/lib/assets';
import { profile, recognition, education } from '@/content/profile';
import { achievements } from '@/content/achievements';
import { getProjects } from '@/content/projects';
import { chapters, storyIntro, storyOutro, storyPath, principles } from '@/content/story';

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description:
    'Engineer by training, builder by curiosity. The long way from civil engineering to data engineering and AI, told as a journal.',
};

const gallery = [
  { a: assets.career.briefing1, label: 'Industry demo', span: 'col-span-full md:col-span-8 lg:col-span-6' },
  { a: assets.career.aws, label: 'AWS', span: 'col-span-2 md:col-span-4 lg:col-span-2' },
  { a: assets.career.networking, label: 'Conference', span: 'col-span-2 md:col-span-4 lg:col-span-2' },
  { a: assets.identity.graduation, label: 'Master’s in AI', span: 'col-span-full md:col-span-4 lg:col-span-2' },
];

export default function AboutPage() {
  // "At a glance": every number is derived from content, never typed in.
  const dataSince = Number(storyPath.find((s) => /data/i.test(s.label))?.year) || undefined;
  const glance = [
    dataSince && { value: `${new Date().getFullYear() - dataSince}+`, label: 'Years building with data', note: `Since ${dataSince}` },
    { value: String(getProjects().length), label: 'Projects on this site', note: 'Shipped, shared or in progress' },
    { value: String(achievements.length), label: 'Certifications & courses', note: 'Microsoft, Google, IBM & more' },
    { value: education[0]?.cgpa, label: `${education[0]?.degree}’s in ${education[0]?.field}`, note: `${education[0]?.short} · CGPA` },
  ].filter(Boolean) as { value: string; label: string; note: string }[];

  return (
    <>
      {/* Hero */}
      <Section surface="dark" grid className="!pt-14">
        <div className="page-grid gap-y-12">
          <div className="col-span-full lg:col-span-7">
            <p className="label">
              <span className="text-muted">cat</span> {storyIntro.file} <span className="text-muted"># {storyIntro.path}</span>
            </p>
            <h1 className="mt-6 text-display-xl">
              {storyIntro.title.map((line, i) => (
                <span key={line} className="block">
                  {i === storyIntro.title.length - 1 ? line.replace(/\.$/, '') : line}
                  {i === storyIntro.title.length - 1 && (
                    <span aria-hidden="true" className="ml-[0.04em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-lime" />
                  )}
                </span>
              ))}
            </h1>
            <p className="justify-copy mt-8 max-w-prose text-lead text-muted">{storyIntro.lede}</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <ArrowLink href="/resume" variant="primary">
                Resume
              </ArrowLink>
              <ArrowLink href="#story">Read the story</ArrowLink>
            </div>
          </div>
          <PhotoFrame
            image={assets.identity.milestone}
            sizes="(min-width: 1024px) 38vw, 100vw"
            aspect="aspect-[4/5]"
            priority
            caption="Real Razeen"
            meta={profile.coordinates.label}
            className="col-span-full md:col-span-5 lg:col-span-5"
          />

          <div className="col-span-full border-t border-line pt-8">
            <PathDiagram steps={storyPath} />
          </div>

          <dl className="col-span-full grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 lg:grid-cols-4">
            {glance.map((g) => (
              <div key={g.label}>
                <dt className="label text-muted">{g.label}</dt>
                <dd className="mt-2 font-display text-display-md font-extrabold tabular-nums">{g.value}</dd>
                <dd className="mt-1 text-sm text-muted">{g.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Story */}
      <Section surface="light" id="story" aria-labelledby="story-title">
        <div className="page-grid gap-y-12">
          <div className="col-span-full flex items-end justify-between gap-6">
            <div>
              <TechnicalLabel as="p" marker="01 /">
                The story
              </TechnicalLabel>
              <h2 id="story-title" className="mt-4 text-display-lg uppercase">
                Told step
                <br />
                by step.
              </h2>
              <p className="mt-4 max-w-prose text-muted">{storyIntro.note}</p>
            </div>
            <div className="hidden shrink-0 md:block">
              <MiniRazeen pose="exploring" height={170} />
            </div>
          </div>
          <div className="col-span-full lg:col-span-10">
            <StoryTimeline chapters={chapters} />
          </div>
          <p className="label col-span-full border-t border-line pt-6">{storyOutro}</p>
        </div>
      </Section>

      {/* How I work */}
      <Section surface="dark" grid>
        <div className="page-grid gap-y-12">
          <SectionHeader index="02" eyebrow="How I work" title={['One loop.', 'Everywhere.']} className="lg:col-span-8">
            <p className="mt-6 max-w-prose text-muted">The same loop runs through pipelines, models, products and long runs.</p>
          </SectionHeader>
          <ol className="col-span-full grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => {
              const last = i === principles.length - 1;
              return (
                <li key={p.title} data-reveal className="bg-surface p-6 lg:p-8">
                  <p className="label flex items-center gap-2 text-muted">
                    <span aria-hidden="true" className={last ? 'h-2.5 w-2.5 rounded-full bg-lime' : 'h-2.5 w-2.5 rounded-full border border-muted'} />
                    {String(i + 1).padStart(2, '0')}
                    {!last && <span aria-hidden="true">→</span>}
                  </p>
                  <h3 className="mt-6 text-display-sm uppercase">{p.title}</h3>
                  <p className="mt-3 text-muted">{p.detail}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* Credentials */}
      <Section surface="light" id="credentials">
        <div className="page-grid gap-y-10">
          <SectionHeader
            index="03"
            eyebrow="Credentials"
            title={[`${achievements.length} certifications`, '& courses.']}
            size="md"
            className="lg:col-span-9"
          />
          <div className="col-span-full hidden items-end justify-end lg:col-span-3 lg:flex">
            <MiniRazeen pose="learning" height={140} />
          </div>
          <div className="col-span-full">
            <CredentialList items={achievements} initial={8} />
          </div>
        </div>
      </Section>

      {/* People & places */}
      <Section surface="dark">
        <div className="page-grid gap-y-8">
          <SectionHeader index="04" eyebrow="People · ideas · conversations" title={['Learn. Collaborate.', 'Experiment. Grow.']} size="md" />
          {gallery.map(({ a, label, span }) => (
            <PhotoFrame key={a.src} image={a} sizes="(min-width: 1024px) 40vw, 100vw" aspect="aspect-[4/5]" caption={label} className={span} />
          ))}
          <div className="col-span-full grid gap-6 border-t border-line pt-6 md:grid-cols-3">
            {recognition.map((r) => (
              <div key={r.title}>
                <TechnicalLabel as="p">{r.year}</TechnicalLabel>
                <p className="mt-1 text-xl font-semibold">{r.title}</p>
                <p className="text-sm text-muted">{r.detail}</p>
              </div>
            ))}
            <div className="flex flex-col items-start justify-end gap-4">
              <ArrowLink href="/resume">View resume</ArrowLink>
              <AskButton question="What is Razeen's background in data and AI?">Ask about my background</AskButton>
            </div>
          </div>
        </div>
      </Section>

      <div className="border-t border-line">
        <ContactBlock index="05" />
      </div>
    </>
  );
}
