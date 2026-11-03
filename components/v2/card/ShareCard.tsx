'use client';

import { useState } from 'react';

/** Share: the phone's share sheet where there is one, otherwise copy the link. */
export function ShareCard({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        if ((e as Error).name === 'AbortError') return; // dismissed the share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link', url); // no share sheet and no clipboard: show the link to copy by hand
    }
  };
  return (
    <button type="button" onClick={share} className={className} aria-live="polite">
      {copied ? 'Link copied' : 'Share'}
    </button>
  );
}
