import type { Metadata } from 'next';
import { SiteHeader } from '@/components/v2/layout/SiteHeader';
import { SiteFooter } from '@/components/v2/layout/SiteFooter';
import { AskWidget } from '@/components/v2/chat/AskWidget';

export const metadata: Metadata = {
  title: {
    default: 'Razeen Iqbal · Engineer. Builder. Runner. Curious human.',
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
    </div>
  );
}
