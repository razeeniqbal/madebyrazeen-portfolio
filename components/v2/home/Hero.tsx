import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { Trajectory } from '@/components/v2/system/Trajectory';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { assets } from '@/lib/assets';
import { profile } from '@/content/profile';

export function Hero() {
  const { statement } = profile;
  return (
    <Section surface="dark" grid className="!pb-12 !pt-10 md:!pt-14">
      <div className="page-grid gap-y-10">
        {/* Annotation row — trimmed on mobile (PRD §38). */}
        <div className="col-span-full flex items-start justify-between">
          <ul className="label hidden space-y-1 text-muted md:block" aria-label="Disciplines">
            {profile.disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <TechnicalLabel as="p" className="md:hidden">
            {profile.name}
          </TechnicalLabel>
          <TechnicalLabel as="p" className="text-right">
            <span aria-hidden="true" className="mr-2 text-ink">+</span>
            {profile.coordinates.label}
            <span className="hidden md:inline">
              <br />
              {profile.coordinates.lat}
              <br />
              {profile.coordinates.lng}
            </span>
          </TechnicalLabel>
        </div>

        <div className="col-span-full md:col-span-5 lg:col-span-7 lg:self-end">
          <TechnicalLabel as="p" className="hidden md:block">
            {profile.name}
          </TechnicalLabel>
          <h1 className="mt-4 text-display-xl uppercase">
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
              Explore my work
            </ArrowLink>
            <ArrowLink href="/about">About me</ArrowLink>
          </div>
        </div>

        <PhotoFrame
          image={assets.identity.hero}
          sizes="(min-width: 1024px) 38vw, (min-width: 768px) 40vw, 100vw"
          mono
          priority
          aspect="aspect-[4/5] md:aspect-square"
          caption="Real Razeen"
          meta="Build / Learn / Run / Repeat"
          className="col-span-full md:col-span-3 lg:col-span-5 lg:self-end"
        />

        <div className="col-span-full border-t border-line pt-6">
          <Trajectory steps={profile.loops.philosophy} animate />
        </div>
      </div>
    </Section>
  );
}
