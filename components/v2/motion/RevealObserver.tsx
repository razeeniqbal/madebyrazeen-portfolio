'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Adds `.is-visible` to [data-reveal] elements as they enter the viewport.
 * The hidden starting state only applies after this runs (html.reveal-ready),
 * so without JS, or with reduced motion, everything is simply visible.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'));

    // Anything already on screen is revealed immediately, never hidden first.
    const vh = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add('is-visible');
    });
    root.classList.add('reveal-ready');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    els.forEach((el) => !el.classList.contains('is-visible') && io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
