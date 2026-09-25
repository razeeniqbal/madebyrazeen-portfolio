import type { Metadata } from 'next';
import Link from 'next/link';
import { Allura } from 'next/font/google';
import ModernSidebar from '@/components/v1/layout/ModernSidebar';
import MobileMenu from '@/components/v1/layout/MobileMenu';

const allura = Allura({ subsets: ['latin'], weight: '400', variable: '--font-allura', display: 'swap' });

export const metadata: Metadata = {
  title: 'V1 Archive (2025) — Razeen Iqbal',
  robots: { index: false, follow: true },
};

// V1 shell, archived at /archive/v1 (PRD §47). Unchanged apart from the return link.
// The `v1 dark` wrapper replaces the old `<html class="dark">` and scopes V1's global styles.
export default function V1Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`v1 dark lg:relative ${allura.variable}`}>
      <MobileMenu />

      {/* Desktop: Connected Floating Window */}
      <div className="hidden lg:flex min-h-screen items-center justify-center p-8">
        <div className="flex bg-primary-50 dark:bg-primary-950 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh]">
          <ModernSidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden rounded-r-2xl">{children}</main>
        </div>
      </div>

      {/* Mobile: Scrollable Layout with Fixed Header */}
      <main className="lg:hidden min-h-screen pt-16">
        <div className="min-h-[calc(100vh-4rem)]">{children}</div>
      </main>

      <Link
        href="/archive"
        className="fixed bottom-4 right-4 z-[110] rounded-full bg-black/80 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-white ring-1 ring-white/20 hover:bg-black"
      >
        V1 · 2025 archive — back to current →
      </Link>
    </div>
  );
}
