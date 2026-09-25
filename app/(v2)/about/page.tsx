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
import { AskButton } from '@/components/v2/contact/AskButton';
import { assets } from '@/lib/assets';
import { profile, recognition } from '@/content/profile';
import { achievements } from '@/content/achievements';
import { chapters, storyIntro, storyOutro } from '@/content/story';

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
  return (
    <>
      {/* Intro */}
      <Section surface="light" className="!pt-16">
        <div className="page-grid gap-y-12">
          <div className="col-span-full lg:col-span-7">
            <p className="label">
              <span className="text-muted">cat</span> {storyIntro.file}{' '}
              <span className="text-muted"># {storyIntro.path}</span>
            </p>
            <h1 className="mt-6 text-display-xl">
              {storyIntro.title.map((line, i) => (
                <span key={line} className="block">
                  {line}
                  {i === storyIntro.title.length - 1 && (
                    <span aria-hidden="true" className="ml-[0.04em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-lime ring-1 ring-ink" />
                  )}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-prose text-lead">{storyIntro.lede}</p>
            <p className="mt-4 max-w-prose text-sm text-muted">{storyIntro.note}</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <ArrowLink href="/resume" variant="primary">
                Resume
              </ArrowLink>
              <ArrowLink href="#credentials">Credentials</ArrowLink>
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
        </div>
      </Section>

      {/* Story */}
      <Section surface="light" className="!pt-0" aria-labelledby="story-title">
        <div className="page-grid gap-y-10">
          <div className="col-span-full lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <TechnicalLabel as="p" marker="01 /">
                The story
              </TechnicalLabel>
              <h2 id="story-title" className="mt-4 text-display-sm">
                Told step by step.
              </h2>
              <div className="mt-8 hidden lg:block">
                <MiniRazeen pose="exploring" height={150} />
              </div>
            </div>
          </div>
          <div className="col-span-full lg:col-span-8 lg:col-start-5">
            <StoryTimeline chapters={chapters} />
            <p className="label mt-12 border-t border-line pt-6">{storyOutro}</p>
          </div>
        </div>
      </Section>

      {/* People & places */}
      <Section surface="dark">
        <div className="page-grid gap-y-8">
          <SectionHeader index="02" eyebrow="People · ideas · conversations" title={['Learn. Collaborate.', 'Experiment. Grow.']} size="md" />
          {gallery.map(({ a, label, span }) => (
            <PhotoFrame key={a.src} image={a} sizes="(min-width: 1024px) 40vw, 100vw" aspect="aspect-[4/5]" caption={label} className={span} />
          ))}
          <div className="col-span-full grid gap-6 border-t border-line pt-6 md:grid-cols-2">
            {recognition.map((r) => (
              <div key={r.title}>
                <TechnicalLabel as="p">{r.year}</TechnicalLabel>
                <p className="mt-1 text-xl font-semibold">{r.title}</p>
                <p className="text-sm text-muted">{r.detail}</p>
              </div>
            ))}
          </div>
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
            <CredentialList items={achievements} />
          </div>
          <div className="col-span-full flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
            <ArrowLink href="/resume">View resume</ArrowLink>
            <AskButton question="What is Razeen's background in data and AI?">Ask about my background</AskButton>
          </div>
        </div>
      </Section>

      <ContactBlock index="04" />
    </>
  );
}
