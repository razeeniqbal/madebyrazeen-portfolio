import type { Metadata } from 'next';
import KeystaticApp from './keystatic';
import { keystaticReady } from '@/lib/keystatic-env';

export const metadata: Metadata = {
  title: 'Admin — razeeniqbal.',
  robots: { index: false, follow: false },
};

// Admin UI. The root layout already provides <html>/<body>.
export default function KeystaticLayout() {
  if (!keystaticReady) {
    return (
      <main style={{ fontFamily: 'system-ui', padding: '4rem 1.5rem', maxWidth: '36rem', margin: '0 auto' }}>
        <h1>Admin not configured yet</h1>
        <p>
          Production editing signs in with GitHub. Finish the one-time GitHub App setup described in
          docs/v2/ADMIN-AND-CHAT.md, add its environment variables in Vercel, and redeploy.
        </p>
      </main>
    );
  }
  return <KeystaticApp />;
}
