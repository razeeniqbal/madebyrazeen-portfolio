import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { PrintButton } from '@/components/v2/resume/PrintButton';
import { CredentialBadge } from '@/components/v2/credentials/CredentialBadge';
import { Avatar } from '@/components/v2/identity/Avatar';
import { Wordmark } from '@/components/v2/identity/Wordmark';
import { profile, contact, education, recognition, bio } from '@/content/profile';
import { experience } from '@/content/experience';
import { capabilities } from '@/content/capabilities';
import { achievements, type Achievement } from '@/content/achievements';
import { getProjectsByTier, type Project } from '@/content/projects';
import { credentialShortTitle, credentialVerifyUrl, credentialYear } from '@/lib/credentials';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Resume',
  description: `Resume of Razeen Iqbal: ${profile.role}. Experience, selected work, skills, credentials and education.`,
  alternates: { canonical: '/resume' },
};

// Curated credential list: featured first, then vendor certifications worth a CV line. Everything else: /work#credentials.
const CV_ISSUERS = ['Microsoft', 'Google Cloud', 'Anthropic', 'Apache', 'Axiata', 'Board of Engineers Malaysia', 'Python Institute'];
const MAX_CERTS = 8;

const statusText: Record<Project['status'], string> = {
  live: 'Live',
  shipped: 'Shipped',
  'in-progress': 'In development',
  prototype: 'Experiment',
  archived: 'Archived',
};

const bare = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

/** Strong sans heading with a hairline: compact, no oversized display type. */
function Block({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h2 className="mb-4 border-b border-ink pb-2 text-sm font-bold uppercase tracking-[0.08em]">{title}</h2>
      {children}
    </section>
  );
}

function Cert({ a }: { a: Achievement }) {
  const year = credentialYear(a);
  const verify = credentialVerifyUrl(a);
  return (
    <li data-keep className="flex gap-3">
      <CredentialBadge credential={a} size={30} />
      <div className="min-w-0 text-sm leading-snug">
        <p className="font-medium">{credentialShortTitle(a)}</p>
        <p className="text-muted">
          {a.organization}
          {year && ` · ${year}`}
          {verify && (
            <>
              {' · '}
              <a href={verify} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                Verify ↗
              </a>
            </>
          )}
        </p>
      </div>
    </li>
  );
}

export default function ResumePage() {
  const year = new Date().getFullYear();
  const certs = [
    ...achievements.filter((a) => a.featured),
    ...achievements.filter((a) => !a.featured && a.category === 'certification' && CV_ISSUERS.includes(a.organization)),
  ].slice(0, MAX_CERTS);
  const certTotal = achievements.length;
  const projects = getProjectsByTier('flagship', 'featured');

  const contactRows = [
    { k: 'Location', v: profile.location },
    contact.phone && { k: 'Phone', v: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}` },
    { k: 'Email', v: contact.email, href: `mailto:${contact.email}` },
    { k: 'Website', v: bare(SITE_URL), href: SITE_URL },
    { k: 'LinkedIn', v: bare(contact.linkedin).replace(/^www\./, ''), href: contact.linkedin },
    { k: 'GitHub', v: bare(contact.github), href: contact.github },
  ].filter(Boolean) as { k: string; v: string; href?: string }[];

  const downloadPdf = (
    <a
      href={profile.resume}
      download
      className="label inline-flex items-center gap-3 bg-lime px-5 py-3.5 text-carbon transition-colors hover:bg-ink hover:text-surface"
    >
      Download PDF <span aria-hidden="true">↓</span>
    </a>
  );

  return (
    <Section surface="light" className="!pt-10 md:!pt-14 print:!py-0">
      <article className="resume-print page-container">
        {/* Header: compact; the content starts within the first screen */}
        <header className="flex flex-col gap-6 border-b-2 border-ink pb-8 lg:flex-row lg:items-end lg:justify-between print:pb-4">
          <div className="max-w-3xl">
            <p className="label text-muted">Resume / {year}</p>
            <h1 className="mt-3 text-display-md print:text-[22pt]">{profile.name}</h1>
            <p className="mt-2 text-lg font-semibold">{profile.role}</p>
            <p className="justify-copy mt-4 text-muted">{bio.short}</p>
          </div>
          <div data-print-hide className="flex shrink-0 flex-wrap items-center gap-6">
            {downloadPdf}
            <PrintButton />
          </div>
        </header>

        <div className="resume-grid mt-10 print:mt-5">
          {/* LEFT (top): contact */}
          <div data-area="contact">
            <Block title="Contact">
              <dl className="space-y-2.5 text-sm">
                {contactRows.map((r) => (
                  <div key={r.k}>
                    <dt className="label text-muted">{r.k}</dt>
                    <dd className="break-words">
                      {r.href ? (
                        <a
                          href={r.href}
                          className="underline-offset-2 hover:underline"
                          {...(r.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                        >
                          {r.v}
                          {r.href.startsWith('http') && <span aria-hidden="true"> ↗</span>}
                        </a>
                      ) : (
                        r.v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Block>
          </div>

          {/* MAIN: experience + selected work */}
          <div data-area="main" className="space-y-10 print:space-y-5">
            <Block title="Work experience">
              <ol className="space-y-7 print:space-y-4">
                {experience.map((r) => (
                  <li key={r.company} data-keep>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="label">{r.period}</p>
                      <p className="label text-muted">
                        {r.location.split(',')[0]} · {r.type}
                      </p>
                    </div>
                    <h3 className="mt-1.5 text-lg font-bold leading-tight print:text-[11pt]">{r.company}</h3>
                    <p className="text-sm font-medium text-muted">{r.role}</p>
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {r.highlights.slice(0, 5).map((h) => (
                        <li key={h} className="flex gap-2.5">
                          <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ink" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </Block>

            <Block title="Selected work">
              <ul className="space-y-5 print:space-y-3">
                {projects.map((p) => (
                  <li key={p.slug} data-keep className="text-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-bold">
                        <Link href={`/work/${p.slug}`} className="hover:underline">
                          {p.title}
                        </Link>
                      </p>
                      <p className="label text-muted">
                        {p.year} · {statusText[p.status]}
                      </p>
                    </div>
                    <p className="mt-1 text-muted">{p.summary}</p>
                    <p className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="label text-muted">{p.stack.slice(0, 4).join(' · ')}</span>
                      <span className="label flex gap-4" data-print-hide>
                        {p.links.live && (
                          <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Live ↗
                          </a>
                        )}
                        <Link href={`/work/${p.slug}`} className="hover:underline">
                          {p.caseStudy ? 'Case study →' : 'Details →'}
                        </Link>
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          {/* RIGHT: skills by purpose (no levels, no bars) */}
          <div data-area="skills" className="space-y-10 print:space-y-5">
            <Block title="Skills">
              <dl className="space-y-4 text-sm">
                {capabilities.map((c) => (
                  <div key={c.group} data-keep>
                    <dt className="font-semibold">{c.group}</dt>
                    <dd className="mt-0.5 text-muted">{c.items.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </Block>
            <Block title="Languages">
              <ul className="space-y-1 text-sm text-muted">
                {profile.languages.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </Block>
          </div>

          {/* LEFT (below contact): credentials, education, achievements */}
          <div data-area="rest" className="space-y-10 print:space-y-5">
            <Block title="Certifications">
              <ul className="space-y-3.5">
                {certs.map((a) => (
                  <Cert key={a.id} a={a} />
                ))}
              </ul>
              <Link href="/work#credentials" className="label mt-4 inline-block text-muted hover:text-ink" data-print-hide>
                View all {certTotal} credentials →
              </Link>
            </Block>

            <Block title="Education">
              <ul className="space-y-4 text-sm">
                {education.map((e) => (
                  <li key={e.institution} data-keep>
                    <p className="font-semibold leading-snug">
                      {e.degree}, {e.field}
                    </p>
                    <p className="text-muted">{e.institution}</p>
                    <p className="label mt-0.5 text-muted">
                      {e.period} · CGPA {e.cgpa}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Achievements">
              <ul className="space-y-3 text-sm">
                {recognition.map((r) => (
                  <li key={r.title} data-keep>
                    <p className="font-medium leading-snug">{r.title}</p>
                    <p className="text-muted">
                      {r.year} · {r.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </div>

        {/* Footer: the only identity mark on the page */}
        <footer className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6 print:mt-6 print:pt-3">
          <p className="flex items-center gap-2.5">
            <span data-print-hide>
              <Avatar size={24} />
            </span>
            <Wordmark className="text-lg" />
          </p>
          <div data-print-hide>{downloadPdf}</div>
          <p className="label hidden text-muted print:block">{bare(SITE_URL)}/resume</p>
        </footer>
      </article>
    </Section>
  );
}
