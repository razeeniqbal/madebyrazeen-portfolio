import type { Metadata } from 'next';
import { Section } from '@/components/v2/system/Section';
import { PrintButton } from '@/components/v2/resume/PrintButton';
import { CredentialBadge } from '@/components/v2/credentials/CredentialBadge';
import { Avatar } from '@/components/v2/identity/Avatar';
import { Wordmark } from '@/components/v2/identity/Wordmark';
import { profile, contact, education } from '@/content/profile';
import { firstSentence, getCurrentRole, getResumeRoles } from '@/content/experience';
import { getTrainerEngagements, engagementWhen } from '@/content/trainer';
import { capabilities } from '@/content/capabilities';
import { achievements, type Achievement } from '@/content/achievements';
import { getResumeProjects, type Project } from '@/content/projects';
import { credentialShortTitle, credentialVerifyUrl, credentialYear } from '@/lib/credentials';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Resume of Mohamad Razeen Iqbal Roslan, AI Data Engineer: experience, selected professional work, training, projects, certifications and skills.',
  alternates: { canonical: '/resume' },
};

// Curated credential list: featured first, then vendor certifications worth a CV line. Everything else: /credentials.
const CV_ISSUERS = ['Microsoft', 'Google Cloud', 'Anthropic', 'Confluent', 'Axiata', 'Board of Engineers Malaysia', 'Python Institute'];
const MAX_CERTS = 5;
const MAX_LINES_PER_ROLE = 5;

const statusText: Record<Project['status'], string> = {
  active: 'Active',
  'under-construction': 'In development',
  'proof-of-concept': 'Proof of concept',
  completed: 'Completed',
  archived: 'Archived',
};

const bare = (url: string) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');

/** Strong sans heading with a hairline: compact, no oversized display type. `order` is the reading order on narrow screens. */
function Block({ title, order, children }: { title: string; order: number; children: React.ReactNode }) {
  return (
    <section style={{ order }}>
      <h2 className="mb-4 border-b border-ink pb-2 text-sm font-bold uppercase tracking-[0.08em] print:mb-2.5">{title}</h2>
      {children}
    </section>
  );
}

function Cert({ a }: { a: Achievement }) {
  const year = credentialYear(a);
  const verify = credentialVerifyUrl(a);
  return (
    <li data-keep className="flex gap-3">
      <CredentialBadge credential={a} size={26} />
      <div className="min-w-0 text-sm leading-snug">
        <p className="font-medium">{credentialShortTitle(a)}</p>
        <p className="text-muted">
          {a.organization}
          {year && ` · ${year}`}
          {verify && (
            <>
              {' · '}
              <a href={verify} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                Verify
              </a>
            </>
          )}
        </p>
      </div>
    </li>
  );
}

// The resume is a factual derivative of the canonical records: roles and their `responsibilities`,
// the first sentence of each selected work, trainer engagements, projects flagged `resume`, and the
// credentials list. The editorial story stays on /experience. The PDF is printed from this page
// (npm run resume:pdf), so the two never drift.
export default function ResumePage() {
  const year = new Date().getFullYear();
  const current = getCurrentRole();
  const roles = getResumeRoles();
  const professionalWork = roles.flatMap((r) =>
    r.selectedWork.filter((w) => w.visibility === 'public' && w.tier !== 'small').map((w) => ({ ...w, company: r.company })),
  );
  const certs = [
    ...achievements.filter((a) => a.featured),
    ...achievements.filter((a) => !a.featured && a.category === 'certification' && CV_ISSUERS.includes(a.organization)),
  ].slice(0, MAX_CERTS);
  const projects = getResumeProjects();
  const training = getTrainerEngagements();

  const contactRows = [
    { k: 'Email', v: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { k: 'Phone', v: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}` },
    { k: 'Website', v: bare(SITE_URL), href: SITE_URL },
    { k: 'LinkedIn', v: bare(contact.linkedin), href: contact.linkedin },
    { k: 'GitHub', v: bare(contact.github), href: contact.github },
  ].filter(Boolean) as { k: string; v: string; href: string }[];

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
        {/* Header: identity, domains, contact */}
        <header className="border-b-2 border-ink pb-8 print:pb-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="label text-muted" data-print-hide>
                Resume / {year}
              </p>
              <h1 className="mt-3 text-display-md uppercase print:mt-0 print:text-[21pt]">{profile.legalName}</h1>
              <p className="mt-2 text-lg font-semibold">
                {current?.role}
                {current?.location && <span className="font-normal text-muted"> · {current.location}</span>}
              </p>
              <p className="label mt-3">{profile.resumeDomains.join('  ·  ')}</p>
            </div>
            <div data-print-hide className="flex shrink-0 flex-wrap items-center gap-6">
              {downloadPdf}
              <PrintButton />
            </div>
          </div>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm print:mt-3 print:gap-x-6">
            {contactRows.map((r) => (
              <div key={r.k}>
                <dt className="label text-muted">{r.k}</dt>
                <dd>
                  <a
                    href={r.href}
                    className="underline-offset-2 hover:underline"
                    {...(r.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {r.v}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="resume-grid mt-10 print:mt-5">
          <div data-col="main">
            <Block title="Profile" order={1}>
              <div className="max-w-prose space-y-2 text-sm">
                {profile.resumeProfile.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Block>

            <Block title="Experience" order={2}>
              <ol className="space-y-6 print:space-y-3.5">
                {roles.map((r) => {
                  const parallel = r.relationship === 'parallel';
                  return (
                    <li key={r.id} data-keep>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-base font-bold leading-tight">
                          {r.role}
                          <span className="font-normal text-muted"> · {r.company}</span>
                        </h3>
                        <p className="label shrink-0">{r.period}</p>
                      </div>
                      <p className="label mt-1 text-muted">
                        {parallel
                          ? 'Parallel contract, alongside the current role'
                          : [r.employmentType && r.employmentType.charAt(0).toUpperCase() + r.employmentType.slice(1), r.workMode, r.location?.split(',')[0]]
                              .filter(Boolean)
                              .join(' · ')}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {r.highlights.slice(0, MAX_LINES_PER_ROLE).map((h) => (
                          <li key={h} className="flex gap-2.5">
                            <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ink" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            </Block>

            <Block title="Selected professional work" order={3}>
              <ul className="space-y-3.5 print:space-y-2">
                {professionalWork.map((w) => (
                  <li key={w.id} data-keep className="text-sm">
                    <p>
                      <span className="font-bold">{w.name}</span>
                      <span className="text-muted"> · {[w.context, w.type, w.scale].filter(Boolean).join(' · ')}</span>
                    </p>
                    <p className="mt-0.5">
                      {firstSentence(w.description)}
                      {w.recognition && <span className="text-muted"> {w.recognition}.</span>}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Selected projects" order={6}>
              <ul className="space-y-3.5 print:space-y-2">
                {projects.map((p) => (
                  <li key={p.slug} data-keep className="text-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p>
                        {/* Absolute, so the printed PDF links to the live site, not the machine it was printed on. */}
                        <a href={`${SITE_URL}/projects/${p.slug}`} className="font-bold hover:underline">
                          {p.title}
                        </a>
                        {p.fullName && <span className="text-muted"> ({p.fullName})</span>}
                      </p>
                      <p className="label text-muted">
                        {p.year} · {statusText[p.status]}
                      </p>
                    </div>
                    <p className="mt-0.5">{p.summary}</p>
                    <p className="label mt-1 text-muted">
                      {p.stack.slice(0, 4).join(' · ')}
                      {(p.links.live || p.links.source) && (
                        <>
                          {'  ·  '}
                          <a href={p.links.live ?? p.links.source} target="_blank" rel="noopener noreferrer" className="normal-case hover:underline">
                            {bare(p.links.live ?? p.links.source ?? '')}
                          </a>
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <div data-col="side">
            <Block title="Education" order={4}>
              <ul className="space-y-3 text-sm">
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

            <Block title="Training & speaking" order={5}>
              <ul className="space-y-3 text-sm">
                {training.map((t) => {
                  const when = engagementWhen(t);
                  return (
                    <li key={t.slug} data-keep>
                      <p className="font-semibold leading-snug">{t.title}</p>
                      <p className="text-muted">{[t.role, t.organization].join(' · ')}</p>
                      {when && <p className="label mt-0.5 text-muted">{when}</p>}
                    </li>
                  );
                })}
              </ul>
            </Block>

            <Block title="Certifications" order={7}>
              <ul className="space-y-3">
                {certs.map((a) => (
                  <Cert key={a.id} a={a} />
                ))}
              </ul>
              <a href={`${SITE_URL}/credentials`} className="mt-3 inline-block text-sm text-muted hover:text-ink">
                All {achievements.length} credentials on the portfolio <span aria-hidden="true">→</span>
              </a>
            </Block>

            <Block title="Technical skills" order={8}>
              <dl className="space-y-3 text-sm">
                {capabilities.map((c) => (
                  <div key={c.group} data-keep>
                    <dt className="font-semibold">{c.group}</dt>
                    <dd className="mt-0.5 text-muted">{c.items.join(', ')}</dd>
                  </div>
                ))}
                <div data-keep>
                  <dt className="font-semibold">Languages</dt>
                  <dd className="mt-0.5 text-muted">{profile.languages.join(', ')}</dd>
                </div>
              </dl>
            </Block>
          </div>
        </div>

        {/* Footer: the only identity mark on the page */}
        <footer className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6 print:mt-5 print:pt-3">
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
