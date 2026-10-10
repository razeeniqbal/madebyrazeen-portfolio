import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { assets } from '@/lib/assets';
import { contact } from '@/content/profile';
import { CareerTimeline } from '@/components/v2/career/CareerTimeline';
import { getCareerTimeline } from '@/content/career-timeline';
import { home } from '@/content/home';

/**
 * Home 02. The path: the real workshop photo, one paragraph and one link, then the dated career
 * timeline (work and study). The full timeline, with credentials, lives on /experience.
 */
export function PathTeaser() {
  return (
    <Section surface="dark" className="!py-[clamp(5rem,10vw,9rem)]">
      <div className="page-grid gap-y-10">
        <PhotoFrame
          image={assets.career.collaboration}
          sizes="(min-width: 1024px) 58vw, 100vw"
          caption="People · ideas · conversations"
          className="col-span-full lg:col-span-7"
        />
        <div className="col-span-full lg:col-span-4 lg:col-start-9 lg:self-end">
          <SectionHeader index="02" eyebrow="Path" title={home.path.title} size="md" />
          <div className="mt-8">
            <ArrowLink href="/about">More about me</ArrowLink>
          </div>
        </div>
        <div data-reveal className="col-span-full border-t border-line pt-8">
          <CareerTimeline data={getCareerTimeline()} variant="compact" />
        </div>
      </div>
    </Section>
  );
}

interface ContactBlockProps {
  index?: string;
  surface?: 'dark' | 'light';
  title?: [string, string];
}

export function ContactBlock({ index = '11', surface = 'dark', title = ['Have something', 'worth building?'] }: ContactBlockProps) {
  return (
    <Section surface={surface} grid={surface === 'dark'}>
      <div className="page-grid gap-y-10">
        <SectionHeader index={index} eyebrow="Contact" title={title} size="xl" className="lg:col-span-9" />
        <p className="col-span-full text-lead text-muted md:col-span-5 lg:col-span-5">
          Have an idea, project, opportunity, or interesting problem?
        </p>
        <div className="col-span-full flex flex-wrap items-center gap-x-8 gap-y-5">
          <ArrowLink href="/contact" variant="primary">
            Connect
          </ArrowLink>
          <ArrowLink href={contact.linkedin}>LinkedIn</ArrowLink>
          <ArrowLink href={contact.github}>GitHub</ArrowLink>
        </div>
        {/* Email addresses stay lowercase: the label style uppercases everything else. */}
        <TechnicalLabel as="p" className="col-span-full normal-case tracking-[0.04em]">
          <a href={`mailto:${contact.email}`} className="underline-offset-4 hover:underline">
            {contact.email}
          </a>
        </TechnicalLabel>
      </div>
    </Section>
  );
}
