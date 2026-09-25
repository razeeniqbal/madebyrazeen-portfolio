import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// Base metadata; the (v2) layout and V1 archive layout refine it.
export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio.madebyrazeen.com'),
  title: 'Razeen Iqbal',
  description: 'Razeen Iqbal: data engineering, AI systems, product building, experiments and running.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Each route group ((v1), (v2)) supplies its own shell and colour context.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
