'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/** Copies a value (an email address) and says so for two seconds; the status is announced politely. */
export function CopyButton({ value, label = 'Copy', className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked (insecure context or permissions): the visible address is still selectable.
        }
      }}
      className={cn('hit label inline-flex items-center gap-2 border border-line px-2.5 py-1 transition-colors hover:border-ink', copied && 'border-lime', className)}
    >
      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full transition-colors', copied ? 'bg-lime' : 'border border-current')} />
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  );
}
