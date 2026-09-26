import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { assets } from '@/lib/assets';
import { contact } from '@/content/profile';
import { achievements } from '@/content/achievements';
import { home } from '@/content/home';

export function AboutTeaser() {
  const certifications = achievements.filter((a) => a.category === 'certification').length;
  return (
    <Section surface="light">
      <div className="page-grid gap-y-10">
        <PhotoFrame
          image={assets.career.collaboration}
          sizes="(min-width: 1024px) 58vw, 100vw"
          caption="People · ideas · conversations"
          meta="Workshop"
          className="col-span-full lg:col-span-7"
        />
        <div className="col-span-full lg:col-span-4 lg:col-start-9 lg:self-end">
          <SectionHeader index="10" eyebrow="About" title={home.aboutTeaser.title} size="md" />
          <p className="justify-copy mt-6 text-muted">{home.aboutTeaser.body}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-4">
            <div>
              <dt className="label text-muted">Certifications</dt>
              <dd className="text-display-sm">{certifications}</dd>
            </div>
            <div>
              <dt className="label text-muted">Master&apos;s</dt>
              <dd className="text-display-sm">AI</dd>
            </div>
          </dl>
          <div className="mt-8">
            <ArrowLink href="/about">More about me</ArrowLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ContactBlock({ index = '11' }: { index?: string }) {
  return (
    <Section surface="dark" grid>
      <div className="page-grid gap-y-10">
        <SectionHeader index={index} eyebrow="Contact" title={['Let’s build', 'something useful.']} size="xl" className="lg:col-span-9" />
        <p className="col-span-full text-lead text-muted md:col-span-5 lg:col-span-5">
          Have an idea, project, opportunity, or interesting problem?
        </p>
        <div className="col-span-full flex flex-wrap items-center gap-x-8 gap-y-5">
          <ArrowLink href={`mailto:${contact.email}`} variant="primary">
            Let&apos;s talk
          </ArrowLink>
          <ArrowLink href={contact.linkedin}>LinkedIn</ArrowLink>
          <ArrowLink href={contact.github}>GitHub</ArrowLink>
        </div>
        <TechnicalLabel as="p" className="col-span-full">
          {contact.email}
        </TechnicalLabel>
      </div>
    </Section>
  );
}
