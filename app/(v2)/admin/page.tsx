import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { SSO_COOKIE, readSession, ssoConfig } from '@/lib/admin/sso';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

const langkahUrl = process.env.LANGKAH_URL ?? 'https://langkah.madebyrazeen.com';
const trackerUrl = process.env.TRACKER_URL ?? 'https://tracker.madebyrazeen.com';

// One sign-in for every madebyrazeen app: the cookie set here is read by Langkah and the course tracker.
const apps = [
  {
    number: '01',
    name: 'Portfolio content',
    note: 'Projects, journal, experience and profile, edited in Keystatic.',
    href: '/keystatic',
    where: '/keystatic',
    kind: 'Content',
  },
  {
    number: '02',
    name: 'Langkah',
    note: 'Plan / Track / Deliver: projects, board and timeline.',
    href: langkahUrl,
    where: new URL(langkahUrl).host,
    kind: 'Planner',
  },
  {
    number: '03',
    name: 'AI Engineering course',
    note: 'Study progress, scripts and episode publishing.',
    href: trackerUrl,
    where: new URL(trackerUrl).host,
    kind: 'Tracker',
  },
];

const errors: Record<string, string> = {
  setup: 'Sign-in is not configured yet. Set MBR_SSO_SECRET and the GitHub client in Vercel, then redeploy.',
  state: 'The sign-in link expired or was opened in another browser. Try again.',
  github: 'GitHub did not complete the sign-in. Try again.',
  denied: 'That GitHub account is not an admin of this site.',
};

const sessionEnds = (d: Date) =>
  new Intl.DateTimeFormat('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const session = readSession((await cookies()).get(SSO_COOKIE)?.value);
  const ready = ssoConfig().ready;

  // Signed out, the sign-in button leads; signed in, sign-out follows the apps.
  const actions = (
    <div className="col-span-full flex flex-wrap items-center justify-between gap-6">
      {session ? (
        <>
          <p className="label text-muted">Signing out here ends the session in all three apps.</p>
          <form method="post" action="/api/admin/logout?next=/admin">
            <button
              type="submit"
              className="label inline-flex items-center gap-3 border border-line px-5 py-3.5 transition-colors hover:border-ink hover:text-signal"
            >
              Sign out of every app
            </button>
          </form>
        </>
      ) : ready ? (
        <>
          <a
            href="/api/admin/login?next=/admin"
            className="label group inline-flex items-center gap-3 bg-lime px-5 py-3.5 text-carbon transition-colors hover:bg-ink hover:text-surface"
          >
            Sign in with GitHub
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <p className="label text-muted">Only the site owner&apos;s GitHub account can sign in.</p>
        </>
      ) : (
        <p className="text-muted">{errors.setup}</p>
      )}
    </div>
  );

  return (
    <Section surface="dark" grid className="!pt-16">
      <PageHeader
        href="/admin"
        label="Admin"
        title={session ? ['Your', 'apps.'] : ['Admin.']}
        lede={[
          session
            ? 'One session for the portfolio, Langkah and the course tracker. Open any of them without signing in again.'
            : 'One sign-in for the portfolio, Langkah and the course tracker.',
        ]}
        meta={
          session
            ? [
                { label: 'Signed in as', value: `@${session.login}` },
                { label: 'Session ends · MYT', value: sessionEnds(session.expires) },
                { label: 'Connected', value: `${apps.length} apps` },
              ]
            : undefined
        }
      />

      <div className="page-grid mt-16 gap-y-10">
        {error && errors[error] && (
          <p role="alert" className="col-span-full border-l-2 border-signal pl-4 text-muted">
            {errors[error]}
          </p>
        )}

        {!session && actions}

        <ul className="col-span-full border-b border-line" aria-label="Apps">
          {apps.map((app) => {
            const row = (
              <>
                <span className="label pt-2 text-muted md:pt-3">{app.number}</span>
                <span>
                  <span
                    className={cn(
                      'block text-2xl font-semibold tracking-tight md:text-4xl',
                      session ? 'transition-colors group-hover:text-lime' : 'text-muted',
                    )}
                  >
                    {app.name}
                  </span>
                  <span className="mt-2 block max-w-prose text-muted">{app.note}</span>
                  <span className="label mt-3 block text-muted lg:hidden">{app.where}</span>
                </span>
                <span className="label hidden self-center text-muted lg:block">{app.kind}</span>
                <span className="label hidden self-center truncate text-muted lg:block">{app.where}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'self-center text-right text-2xl',
                    session ? 'transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' : 'text-muted',
                  )}
                >
                  {session ? '↗' : '·'}
                </span>
              </>
            );
            const grid =
              'grid grid-cols-[2.5rem_1fr_2rem] items-start gap-x-4 py-8 md:grid-cols-[4rem_1fr_2rem] lg:grid-cols-[4rem_1fr_7rem_15rem_2rem]';
            return (
              <li key={app.name} className="border-t border-line">
                {session ? (
                  <a href={app.href} className={cn('group -mx-4 px-4 transition-colors hover:bg-ink/[0.03]', grid)}>
                    {row}
                  </a>
                ) : (
                  <div className={grid} aria-disabled="true">
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {session && actions}
      </div>
    </Section>
  );
}
