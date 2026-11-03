'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * "Show QR": the card's QR full screen, for holding up to someone else's camera. Opens on its own
 * when the page is visited as /card?qr (the home-screen shortcut). Tap anywhere or Esc closes it.
 */
export function ShowQr({ svg, name, url }: { svg: string; name: string; url: string }) {
  // Render inside <Suspense>: Next needs it for useSearchParams on a static page.
  const params = useSearchParams();
  const [open, setOpen] = useState(() => params.has('qr'));
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Show QR code full screen"
        className="label flex h-9 shrink-0 items-center gap-2 border border-line px-3 transition-colors hover:border-ink"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M1 1h6v6H1V1Zm1.5 1.5v3h3v-3h-3ZM9 1h6v6H9V1Zm1.5 1.5v3h3v-3h-3ZM1 9h6v6H1V9Zm1.5 1.5v3h3v-3h-3ZM9 9h2v2H9V9Zm2 2h2v2h-2v-2Zm2-2h2v2h-2V9Zm-2 4h-2v2h2v-2Zm4 0h-2v2h2v-2Z" />
        </svg>
        QR
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`QR code for ${name}`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6 text-center text-[#0b0b0b]"
        >
          <div className="w-full max-w-[22rem]" dangerouslySetInnerHTML={{ __html: svg }} />
          <p className="mt-6 text-2xl font-extrabold tracking-tight">{name}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest opacity-60">Scan to open my card</p>
          <p className="mt-1 break-all font-mono text-xs opacity-60">{url.replace(/^https?:\/\//, '')}</p>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="mt-10 border border-current px-5 py-3 font-mono text-xs uppercase tracking-widest">
            Close
          </button>
        </div>
      )}
    </>
  );
}
