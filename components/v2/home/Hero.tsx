import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { assets } from '@/lib/assets';
import { resumeHref } from '@/lib/site';
import { profile } from '@/content/profile';

/** Home 01. Low density: real photo + type. The lime period is the node later motion grows from. */
export function Hero() {
  const { statement } = profile;
  return (
    <Section surface="dark" className="!pb-20 !pt-12 md:!pt-20">
      <div className="page-grid gap-y-12">
        <div className="col-span-full md:col-span-5 lg:col-span-7 lg:self-end">
          <TechnicalLabel as="p">
            {profile.name} <span className="text-muted">/ {profile.role}</span>
          </TechnicalLabel>
          <h1 className="mt-6 text-display-xl uppercase">
            {statement.map((line, i) => (
              <span key={line} className="block">
                {i === statement.length - 1 ? line.replace(/\.$/, '') : line}
                {i === statement.length - 1 && (
                  <span aria-hidden="true" className="ml-[0.04em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-lime" />
                )}
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-[34rem] text-lead text-muted">{profile.supporting}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ArrowLink href="/work" variant="primary">
              View my work
            </ArrowLink>
            <ArrowLink href={resumeHref} arrow="↗">
              Resume
            </ArrowLink>
          </div>
        </div>

        <PhotoFrame
          image={assets.identity.hero}
          sizes="(min-width: 1024px) 38vw, (min-width: 768px) 40vw, 100vw"
          mono
          priority
          aspect="aspect-[4/5] md:aspect-square"
          caption="Real Razeen"
          className="col-span-full md:col-span-3 lg:col-span-5 lg:self-end"
        />
      </div>
    </Section>
  );
}
