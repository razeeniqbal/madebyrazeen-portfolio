'use client';

import { useSyncExternalStore } from 'react';

/** Whether a media query matches, kept in sync. `server` is what the server render (and hydration) assume. */
export function useMediaQuery(query: string, server: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => server,
  );
}
