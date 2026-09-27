import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { assets } from '@/lib/assets';
import { contact } from '@/content/profile';
import { storyPath } from '@/content/story';
import { home } from '@/content/home';

/** Home 03. The journey in four steps (same data as the About path diagram), a real photo, one link. */
export function AboutTeaser() {
  return (
    <Section surface="dark">
      <div className="page-grid gap-y-10">
        <PhotoFrame
          image={assets.career.collaboration}
          sizes="(min-width: 1024px) 58vw, 100vw"
          caption="People · ideas · conversations"
          className="col-span-full lg:col-span-7"
        />
        <div className="col-span-full lg:col-span-4 lg:col-start-9 lg:self-end">
          <SectionHeader index="02" eyebrow="About" title={home.aboutTeaser.title} size="md" />
          <ol className="mt-8" aria-label="Career path">
            {storyPath.map((step, i) => (
              <li key={step.label} className="flex items-baseline gap-4 border-t border-line py-2.5">
                <span className="label w-10 text-muted">{step.year}</span>
                <span className="font-semibold">{step.label}</span>
                {i < storyPath.length - 1 ? (
                  <span aria-hidden="true" className="ml-auto text-muted">↓</span>
                ) : (
                  <span aria-hidden="true" className="ml-auto h-2 w-2 self-center rounded-full bg-lime" />
                )}
              </li>
            ))}
          </ol>
          <p className="justify-copy mt-6 text-muted">{home.aboutTeaser.body}</p>
          <div className="mt-8">
            <ArrowLink href="/about">More about me</ArrowLink>
          </div>
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

export function ContactBlock({ index = '11', surface = 'dark', title = ['Let’s build', 'something useful.'] }: ContactBlockProps) {
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
