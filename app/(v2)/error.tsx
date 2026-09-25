'use client';

import { useEffect } from 'react';
import { EmptyState } from '@/components/v2/system/EmptyState';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      code="Error · Something broke"
      title="It's not you. It's probably me."
      body="This part of the site hit an error. Trying again usually fixes it; if not, the rest of the site still works."
      pose="thinking"
      actions={[{ href: '/', label: 'Back home' }]}
    >
      <button type="button" onClick={reset} className="label mt-8 border-b border-current pb-1">
        Try again ↻
      </button>
    </EmptyState>
  );
}
