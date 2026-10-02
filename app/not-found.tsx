import { SiteHeader } from '@/components/v2/layout/SiteHeader';
import { SiteFooter } from '@/components/v2/layout/SiteFooter';
import { EmptyState } from '@/components/v2/system/EmptyState';

// Root 404 sits outside the (v2) group, so it brings the V2 shell with it.
export default function NotFound() {
  return (
    <div data-surface="dark" className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <EmptyState
          code="404 · Path not found"
          title="This route does not exist. Yet."
          body="The link may be old, or I have not built this part. The trajectory continues elsewhere."
          pose="thinking"
          actions={[
            { href: '/', label: 'Back home' },
            { href: '/projects', label: 'See the projects' },
          ]}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
