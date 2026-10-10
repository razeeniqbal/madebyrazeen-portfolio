import type { Metadata } from 'next';
import { SiteHeader } from '@/components/v2/layout/SiteHeader';
import { SiteFooter } from '@/components/v2/layout/SiteFooter';
import { AskWidget } from '@/components/v2/chat/AskWidget';
import { CommandMenu, type JumpItem } from '@/components/v2/layout/CommandMenu';
import { getProjects } from '@/content/projects';
import { getPublishedJournalEntries } from '@/content/notes';
import { primaryNav } from '@/lib/site';

/** Everything the quick-jump menu can open: pages, projects with a page, and published journal entries. */
function jumpItems(): JumpItem[] {
  const pages: JumpItem[] = [
    { group: 'Pages', label: 'Home', href: '/' },
    ...primaryNav.map((n) => ({ group: 'Pages' as const, label: n.label, href: n.href })),
    { group: 'Pages', label: 'Credentials', href: '/credentials' },
    { group: 'Pages', label: 'Running', href: '/running' },
    { group: 'Pages', label: 'Resume', href: '/resume' },
    { group: 'Pages', label: 'Contact', href: '/contact' },
  ];
  const projects: JumpItem[] = getProjects().map((p) => ({ group: 'Projects', label: p.title, hint: p.origin ?? p.category, href: `/projects/${p.slug}` }));
  const journal: JumpItem[] = getPublishedJournalEntries().map((n) => ({ group: 'Journal', label: n.title, hint: n.category, href: `/journal/${n.slug}` }));
  return [...pages, ...projects, ...journal];
}

export const metadata: Metadata = {
  title: {
    default: 'Razeen Iqbal · Portfolio',
    template: '%s · Razeen Iqbal',
  },
  description:
    'Razeen Iqbal builds data systems, AI systems and products, experiments with ideas, and keeps learning, in engineering and outside of it.',
  authors: [{ name: 'Razeen Iqbal', url: 'https://portfolio.madebyrazeen.com' }],
  openGraph: { type: 'website', siteName: 'Razeen Iqbal', locale: 'en_MY' },
  twitter: { card: 'summary_large_image' },
};

// V2 shell. Pages compose <Section surface="dark|light"> blocks inside <main>.
export default function V2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-surface="dark" className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <AskWidget />
      <CommandMenu items={jumpItems()} />
    </div>
  );
}
