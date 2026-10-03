import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import { CredentialBadge } from '@/components/v2/credentials/CredentialBadge';
import { assets } from '@/lib/assets';
import { resumeHref } from '@/lib/site';
import { profile } from '@/content/profile';
import { featuredCredentials } from '@/content/achievements';
import { credentialCode, credentialShortTitle, credentialYear, credentialVerifyUrl } from '@/lib/credentials';

/**
 * Home 01. Real photo + type, with a small credential strip attached to the portrait.
 * Desktop: the portrait starts level with the second headline line (editorial asymmetry, not centred).
 * Mobile order: text → portrait → credentials → CTAs.
 */
export function Hero() {
  const { statement } = profile;
  const creds = featuredCredentials.slice(0, 4);

  return (
    <Section surface="dark" className="!pb-20 !pt-12 md:!pt-16">
      <div className="page-grid gap-y-10 lg:grid-rows-[auto_1fr] lg:gap-y-0">
        <div className="col-span-full md:col-span-5 lg:col-span-7">
          <TechnicalLabel as="p">
            {profile.name} <span className="text-muted">/ {profile.role}</span>
          </TechnicalLabel>
          {/* Sized down from display-xl so the headline leads without swallowing the first screen. */}
          <h1 className="mt-6 text-[clamp(2.75rem,5.8vw,6.75rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em]">
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
        </div>

        {/* Portrait + credentials. lg offset = label + one headline line (5.8vw × 0.9, capped at 6.75rem):
            the portrait starts level with BUILDER., leaving room for the credential strip above the fold. */}
        <div className="col-span-full md:col-span-3 md:row-span-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-[calc(2.5rem+min(5.22vw,6.075rem))]">
          <PhotoFrame
            image={assets.identity.hero}
            sizes="(min-width: 1024px) 38vw, (min-width: 768px) 40vw, 100vw"
            mono
            priority
            aspect="aspect-[4/5] md:aspect-square lg:aspect-[5/4]"
            caption="Real Razeen"
          />

          {creds.length > 0 && (
            <div className="mt-8">
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                <TechnicalLabel as="h2">Selected credentials</TechnicalLabel>
                <Link href="/experience#credentials" className="label text-muted transition-colors hover:text-ink">
                  View all →
                </Link>
              </div>
              {/* Desktop: badges only, details on hover/focus (restrained). Touch/mobile: details written under each badge. */}
              <ul className="mt-4 grid grid-cols-4 gap-x-3 gap-y-4">
                {creds.map((c) => {
                  const url = credentialVerifyUrl(c);
                  const year = credentialYear(c);
                  const meta = `${c.organization}${year ? ` · ${year}` : ''}`;
                  const label = `${credentialShortTitle(c)}, ${meta}${url ? ' (verify)' : ''}`;
                  return (
                    <li key={c.id} className="group relative">
                      <a
                        href={url ?? '/experience#credentials'}
                        aria-label={label}
                        className="block focus-visible:outline-offset-4"
                        {...(url && { target: '_blank', rel: 'noopener noreferrer' })}
                      >
                        <CredentialBadge credential={c} size={60} className="transition-transform group-hover:-translate-y-0.5" />
                        {/* Exam code under the badge (AI-102…); the full name shows on hover/focus. */}
                        <span aria-hidden="true" className="label mt-2 block leading-snug text-ink">
                          {credentialCode(c) ?? credentialShortTitle(c)}
                        </span>
                        <span aria-hidden="true" className="mt-0.5 block text-[0.6875rem] leading-snug text-muted">
                          {c.organization}
                        </span>
                      </a>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-max max-w-[14rem] group-[:last-child]:left-auto group-[:last-child]:right-0 border border-line bg-carbon px-2.5 py-1.5 text-xs leading-snug text-warm opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 lg:block"
                      >
                        <span className="block font-medium">{credentialShortTitle(c)}</span>
                        <span className="block text-muted">{meta}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="col-span-full flex flex-wrap items-center gap-x-8 gap-y-5 md:col-span-5 lg:col-span-7 lg:row-start-2 lg:mt-10 lg:self-start">
          <ArrowLink href="/projects" variant="primary">
            View my projects
          </ArrowLink>
          <ArrowLink href={resumeHref} arrow="↗">
            Resume
          </ArrowLink>
        </div>
      </div>
    </Section>
  );
}
