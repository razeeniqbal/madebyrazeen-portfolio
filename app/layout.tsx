import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Self-hosted (latin subset, from Google Fonts) so builds never depend on fonts.googleapis.com.
// Licences (SIL OFL) sit next to the files in app/fonts.
const inter = localFont({
  src: './fonts/inter-latin-variable.woff2',
  weight: '100 900',
  variable: '--font-inter',
  display: 'swap',
});

const mono = localFont({
  src: [
    { path: './fonts/jetbrains-mono-latin-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jetbrains-mono-latin-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
  adjustFontFallback: false,
});

// Base metadata; the (v2) layout refines it.
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

// The (v2) route group supplies the shell and colour context.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
