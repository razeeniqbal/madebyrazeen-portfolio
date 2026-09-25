import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { LocalTime } from '@/components/v2/contact/LocalTime';
import { AskButton } from '@/components/v2/contact/AskButton';
import { assets } from '@/lib/assets';
import { contact, profile } from '@/content/profile';
import { availability, helpWith, quickAnswers } from '@/content/contact';

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact',
  description: 'Have an idea, project, opportunity, or interesting problem? Get in touch with Razeen Iqbal.',
};

// PRD §33: direct channels, no form. (V1's form never sent anything.)
const channels = [
  { label: 'Email', value: contact.email, href: `mailto:${contact.email}`, note: 'Best for anything detailed' },
  { label: 'LinkedIn', value: 'in/razeeniqbal', href: contact.linkedin, note: 'Career & professional' },
  { label: 'GitHub', value: '@razeeniqbal', href: contact.github, note: 'Code & open projects' },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero + channels */}
      <Section surface="dark" grid className="!pt-16">
        <div className="page-grid gap-y-12">
          <SectionHeader as="h1" size="xl" eyebrow="Contact" title={['Let’s build', 'something useful.']} className="lg:col-span-9" />
          <div className="col-span-full hidden items-end justify-end lg:col-span-3 lg:flex">
            <MiniRazeen pose="happy" height={132} />
          </div>

          <div className="col-span-full md:col-span-4 lg:col-span-5">
            <p className="text-lead text-muted">
              Have an idea,
              <br />
              project,
              <br />
              opportunity,
              <br />
              or interesting problem?
            </p>

            {/* Status: dot shape + words, not colour alone */}
            <div className="mt-10 border-t border-line pt-5">
              <p className="label flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={availability.open ? 'h-2 w-2 rounded-full bg-lime' : 'h-2 w-2 rounded-full border border-muted'}
                />
                {availability.headline}
              </p>
              <p className="mt-2 text-muted">{availability.detail}</p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
              <div>
                <dt className="label text-muted">Local time · MYT</dt>
                <dd className="mt-1 text-xl font-semibold">
                  <LocalTime />
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Based in</dt>
                <dd className="mt-1">{profile.location}</dd>
              </div>
              <div className="col-span-2">
                <dt className="label text-muted">Languages</dt>
                <dd className="mt-1">{profile.languages.join(' · ')}</dd>
              </div>
            </dl>
          </div>

          <ul className="col-span-full md:col-span-4 lg:col-span-6 lg:col-start-7">
            {channels.map((c) => (
              <li key={c.label} className="border-t border-line">
                <a
                  href={c.href}
                  className="group flex items-baseline justify-between gap-4 py-5"
                  {...(c.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <span className="w-24 shrink-0">
                    <TechnicalLabel className="block">{c.label}</TechnicalLabel>
                  </span>
                  <span className="flex-1">
                    <span className="block break-all text-xl font-semibold group-hover:text-signal md:text-display-sm">{c.value}</span>
                    <span className="mt-1 block text-sm text-muted">{c.note}</span>
                  </span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </a>
              </li>
            ))}
            <li className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-8">
              <ArrowLink href={`mailto:${contact.email}`} variant="primary">
                Let&apos;s talk
              </ArrowLink>
              <ArrowLink href="/resume">View resume</ArrowLink>
            </li>
          </ul>
        </div>
      </Section>

      {/* What I can help with */}
      <Section surface="light">
        <div className="page-grid gap-y-10">
          <SectionHeader index="01" eyebrow="Where I can help" title={['Good reasons', 'to get in touch.']} size="md" className="lg:col-span-5" />
          <ol className="col-span-full grid gap-x-8 md:grid-cols-2 lg:col-span-7">
            {helpWith.map((h, i) => (
              <li key={h.title} className="border-t border-line py-5">
                <p className="flex items-baseline gap-3 text-xl font-semibold">
                  <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                  {h.title}
                </p>
                <p className="mt-2 text-muted">{h.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Quick answers + photo */}
      <Section surface="light" className="!pt-0">
        <div className="page-grid gap-y-10">
          <PhotoFrame
            image={assets.career.briefing1}
            sizes="(min-width: 1024px) 45vw, 100vw"
            aspect="aspect-[4/3]"
            caption="People · ideas · conversations"
            className="col-span-full lg:col-span-6"
          />
          <div className="col-span-full lg:col-span-5 lg:col-start-8">
            <TechnicalLabel as="h2" marker="02 /" className="mb-4">
              Quick answers
            </TechnicalLabel>
            <dl>
              {quickAnswers.map((qa) => (
                <div key={qa.q} className="border-t border-line py-4">
                  <dt className="font-semibold">{qa.q}</dt>
                  <dd className="mt-1 text-muted">{qa.a}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
              <AskButton>Ask the assistant</AskButton>
              <ArrowLink href="/about">More about me</ArrowLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
