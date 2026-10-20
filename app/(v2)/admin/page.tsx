import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { SSO_COOKIE, ssoConfig, verifyToken } from '@/lib/admin/sso';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

// One sign-in for every madebyrazeen app: the cookie set here is read by Langkah and the course tracker.
const apps = [
  {
    name: 'Portfolio content',
    note: 'Projects, journal, experience and profile, edited in Keystatic.',
    href: '/keystatic',
  },
  {
    name: 'Langkah',
    note: 'Plan / Track / Deliver: projects, board and timeline.',
    href: process.env.LANGKAH_URL ?? 'https://langkah.madebyrazeen.com',
  },
  {
    name: 'AI Engineering course',
    note: 'Study progress, scripts and episode publishing.',
    href: process.env.TRACKER_URL ?? 'https://tracker.madebyrazeen.com',
  },
];

const errors: Record<string, string> = {
  setup: 'Sign-in is not configured yet. Set MBR_SSO_SECRET and the GitHub client in Vercel, then redeploy.',
  state: 'The sign-in link expired or was opened in another browser. Try again.',
  github: 'GitHub did not complete the sign-in. Try again.',
  denied: 'That GitHub account is not an admin of this site.',
};

const action = 'label inline-flex items-center gap-3 bg-lime px-5 py-3.5 text-carbon transition-colors hover:bg-ink hover:text-surface';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const login = verifyToken((await cookies()).get(SSO_COOKIE)?.value);
  const ready = ssoConfig().ready;

  return (
    <Section surface="dark" grid className="!pt-16">
      <PageHeader
        href="/admin"
        label="Admin"
        title={login ? ['Signed in.'] : ['Admin.']}
        lede={[login ? `Signed in with GitHub as @${login}. Every app below uses this session.` : 'One sign-in for the portfolio, Langkah and the course tracker.']}
      />

      <div className="page-grid mt-12 gap-y-8">
        {error && errors[error] && (
          <p role="alert" className="col-span-full border-l-2 border-signal pl-4 text-muted">
            {errors[error]}
          </p>
        )}

        {login ? (
          <>
            <ul className="col-span-full grid gap-px border border-line bg-line md:grid-cols-3">
              {apps.map((app) => (
                <li key={app.name} className="bg-surface">
                  <a href={app.href} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-ink/5">
                    <TechnicalLabel>{app.name}</TechnicalLabel>
                    <span className="text-muted">{app.note}</span>
                    <span className="label mt-auto pt-4 group-hover:text-lime">
                      Open <span aria-hidden="true">→</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <form method="post" action="/api/admin/logout?next=/admin" className="col-span-full">
              <button type="submit" className="label hit border-b border-current pb-1 hover:text-signal">
                Sign out of every app
              </button>
            </form>
          </>
        ) : (
          <div className="col-span-full">
            {ready ? (
              <a href="/api/admin/login?next=/admin" className={action}>
                Sign in with GitHub <span aria-hidden="true">→</span>
              </a>
            ) : (
              <p className="text-muted">{errors.setup}</p>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
