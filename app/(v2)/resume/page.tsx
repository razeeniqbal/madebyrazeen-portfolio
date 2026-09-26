import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { PrintButton } from '@/components/v2/resume/PrintButton';
import { profile, contact, education, recognition } from '@/content/profile';
import { experience } from '@/content/experience';
import { capabilities } from '@/content/capabilities';
import { achievements } from '@/content/achievements';
import { getProjectsByTier } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Online resume of Razeen Iqbal: Data Engineer & AI Specialist. Read it here or download the PDF.',
  alternates: { canonical: '/resume' },
};

// Credentials worth listing on a one-page CV: professional registrations and vendor certifications.
const KEY_ISSUERS = ['Microsoft', 'Google Cloud', 'Board of Engineers Malaysia', 'The Institution of Engineers Malaysia', 'Asia Pacific University (APU/APIIT)', 'Python Institute'];

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="label mb-4 border-b-2 border-ink pb-2 text-ink print:mb-2 print:pb-1">{children}</h2>
  );
}

export default function ResumePage() {
  const projects = getProjectsByTier('flagship', 'featured', 'standard').slice(0, 5);
  const keyCerts = achievements.filter((a) => a.category === 'certification' && KEY_ISSUERS.includes(a.organization));
  const otherCount = achievements.length - keyCerts.length;

  return (
    <Section surface="light" className="!pt-12 print:!py-0">
      <div className="page-container">
        {/* Toolbar, hidden when printing */}
        <div className="mx-auto mb-10 flex max-w-[52rem] flex-wrap items-center justify-between gap-4 print:hidden">
          <TechnicalLabel>Online resume · updated from this site&apos;s content</TechnicalLabel>
          <div className="flex flex-wrap items-center gap-6">
            <PrintButton />
            <ArrowLink href={profile.resume} variant="primary">
              Download PDF
            </ArrowLink>
          </div>
        </div>

        <article className="mx-auto max-w-[52rem] border border-line bg-surface p-6 md:p-12 print:max-w-none print:border-0 print:p-0">
          {/* Header */}
          <header className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between print:pb-4">
            <div>
              <h1 className="text-display-md print:text-4xl">{profile.name}</h1>
              <p className="mt-2 text-lead">{profile.role}</p>
            </div>
            <ul className="space-y-1 text-sm md:text-right">
              <li>{profile.location}</li>
              <li>
                <a href={`mailto:${contact.email}`} className="underline-offset-2 hover:underline">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.linkedin} className="underline-offset-2 hover:underline">
                  linkedin.com/in/razeeniqbal
                </a>
              </li>
              <li>
                <a href={contact.github} className="underline-offset-2 hover:underline">
                  github.com/razeeniqbal
                </a>
              </li>
              <li>{profile.domains.portfolio}</li>
            </ul>
          </header>

          <div className="mt-8 grid gap-10 md:grid-cols-[1fr_14rem] print:mt-4 print:grid-cols-[1fr_12rem] print:gap-6">
            <div className="space-y-10 print:space-y-5">
              <section>
                <Heading>Profile</Heading>
                <p className="justify-copy text-muted print:text-sm">
                  Data engineer with a civil engineering background and a Master&apos;s in Artificial Intelligence. I build
                  data pipelines, analytics and AI systems, from ETL and dashboards to LLM-assisted products, and ship side
                  projects that test ideas end to end.
                </p>
              </section>

              <section>
                <Heading>Experience</Heading>
                <ol className="space-y-6 print:space-y-3">
                  {experience.map((r) => (
                    <li key={r.company} className="break-inside-avoid">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-semibold">
                          {r.role} · {r.company}
                        </h3>
                        <span className="label text-muted">{r.period}</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-muted">
                        {r.highlights.map((h) => (
                          <li key={h} className="flex gap-2">
                            <span aria-hidden="true">→</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <Heading>Selected projects</Heading>
                <ul className="space-y-3 print:space-y-2">
                  {projects.map((p) => (
                    <li key={p.slug} className="break-inside-avoid text-sm">
                      <Link href={`/work/${p.slug}`} className="font-semibold hover:underline">
                        {p.title}
                      </Link>{' '}
                      <span className="label text-muted">{p.year}</span>
                      <p className="text-muted">{p.summary}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-10 print:space-y-5">
              <section>
                <Heading>Education</Heading>
                <ul className="space-y-4 text-sm">
                  {education.map((e) => (
                    <li key={e.institution}>
                      <p className="font-semibold">
                        {e.degree}, {e.field}
                      </p>
                      <p className="text-muted">{e.short} · {e.period}</p>
                      <p className="text-muted">CGPA {e.cgpa}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <Heading>Skills</Heading>
                <dl className="space-y-3 text-sm">
                  {capabilities.map((c) => (
                    <div key={c.group}>
                      <dt className="font-semibold">{c.group}</dt>
                      <dd className="text-muted">{c.items.join(', ')}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section>
                <Heading>Certifications</Heading>
                <ul className="space-y-2 text-sm">
                  {keyCerts.map((a) => (
                    <li key={a.id}>
                      {a.title.replace('Microsoft Certified: ', '')}
                      <span className="block text-muted">
                        {a.organization} · {a.issuedDate}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-muted">+ {otherCount} more courses & certificates</p>
              </section>

              <section>
                <Heading>Recognition</Heading>
                <ul className="space-y-2 text-sm">
                  {recognition.map((r) => (
                    <li key={r.title}>{r.title}</li>
                  ))}
                </ul>
              </section>

              <section>
                <Heading>Languages</Heading>
                <p className="text-sm text-muted">{profile.languages.join(', ')}</p>
              </section>
            </aside>
          </div>
        </article>
      </div>
    </Section>
  );
}
