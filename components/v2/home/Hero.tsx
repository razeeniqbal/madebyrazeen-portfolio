import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { assets } from '@/lib/assets';
import { resumeHref } from '@/lib/site';
import { profile } from '@/content/profile';
import { home } from '@/content/home';

/**
 * Home 00. The portfolio narrative in one statement, the career arc as a quiet line, two actions and
 * the real portrait. Credentials live on /credentials, not here.
 * Desktop: the portrait starts level with the second headline line (editorial asymmetry, not centred).
 * Mobile order follows the DOM: label → headline → copy → arc → actions → portrait.
 */
export function Hero() {
  const { statement } = profile;

  return (
    <Section surface="dark" className="!pb-14 !pt-12 md:!pb-20 md:!pt-16">
      <div className="page-grid gap-y-10 lg:grid-rows-[auto_1fr] lg:gap-y-0">
        <div className="col-span-full md:col-span-5 lg:col-span-7">
          <TechnicalLabel as="p">
            {profile.name} <span className="text-muted">/ {profile.role}</span>
          </TechnicalLabel>
          <h1 className="mt-6 text-[clamp(2.75rem,6.4vw,7.25rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em]">
            {statement.map((line, i) => (
              <span key={line} className="block">
                {i === statement.length - 1 ? line.replace(/\.$/, '') : line}
                {i === statement.length - 1 && (
                  <span aria-hidden="true" className="ml-[0.04em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-lime" />
                )}
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-[36rem] text-lead text-muted">{profile.supporting}</p>
          <ol aria-label="Career path" className="label mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            {home.hero.arc.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className={i === home.hero.arc.length - 1 ? 'text-ink' : undefined}>{step}</span>
                {i < home.hero.arc.length - 1 && <span aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
        </div>

        <div className="col-span-full flex flex-wrap items-center gap-x-8 gap-y-5 md:col-span-5 lg:col-span-7 lg:row-start-2 lg:mt-10 lg:self-start">
          <ArrowLink href="/projects" variant="primary">
            View my projects
          </ArrowLink>
          <ArrowLink href={resumeHref} arrow="↗">
            Resume
          </ArrowLink>
        </div>

        {/* Portrait. lg offset = label + one headline line, so it starts level with THEN I BUILD. */}
        <div className="col-span-full md:col-span-3 md:col-start-6 md:row-span-2 md:row-start-1 lg:col-span-5 lg:col-start-8 lg:mt-[calc(2.5rem+min(5.76vw,6.525rem))]">
          <PhotoFrame
            image={assets.identity.hero}
            sizes="(min-width: 1024px) 38vw, (min-width: 768px) 40vw, 100vw"
            mono
            priority
            aspect="aspect-[5/4] md:aspect-[4/5] lg:aspect-square"
            caption="Real Razeen"
          />
        </div>
      </div>
    </Section>
  );
}
