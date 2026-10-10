'use client';

import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';

/** The visitor's reduced-motion preference, kept in sync. On the server it assumes reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => true,
  );
}
