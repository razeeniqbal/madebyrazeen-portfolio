'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

const GLYPHS = '01<>/\\_=+*#{}[]';

/**
 * Completes "Then I build." with what gets built, one phrase at a time: each change scrambles through
 * random glyphs and decodes left to right, like data resolving. Monospaced and width-reserved, so the
 * page never shifts. Pauses while hovered; with reduced motion it is a static list. Screen readers get
 * one plain sentence instead of the animation.
 */
export function ScrambleRotator({ phrases, interval = 2800 }: { phrases: string[]; interval?: number }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0]);
  const paused = useRef(false);
  const width = Math.max(...phrases.map((p) => p.length));

  // Advance to the next phrase on a timer (skipped while hovered).
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % phrases.length);
    }, interval);
    return () => clearInterval(t);
  }, [reduced, interval, phrases.length]);

  // Scramble from the current text into the new phrase.
  useEffect(() => {
    if (reduced) return;
    const target = phrases[index];
    let frame = 0;
    let raf = 0;
    let last = 0;
    const step = (now: number) => {
      if (now - last < 32) {
        raf = requestAnimationFrame(step);
        return;
      }
      last = now;
      frame += 1;
      const out = Array.from({ length: target.length }, (_, i) => {
        if (frame > i * 1.6 + 4) return target[i];
        return target[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join('');
      setText(out);
      if (out !== target) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [index, phrases, reduced]);

  const sentence = `I build ${phrases.slice(0, -1).join(', ')} and ${phrases.at(-1)}.`;

  if (reduced) {
    return (
      <p className="font-mono text-[clamp(1rem,1.6vw,1.375rem)] uppercase tracking-[0.06em] text-muted">
        <span className="text-lime" aria-hidden="true">
          ▸{' '}
        </span>
        {phrases.join(' · ')}
      </p>
    );
  }

  return (
    <p
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      className="font-mono text-[clamp(1rem,1.6vw,1.375rem)] uppercase tracking-[0.06em]"
    >
      <span className="sr-only">{sentence}</span>
      <span aria-hidden="true" className="inline-flex items-center">
        <span className="mr-3 text-lime">▸</span>
        <span className="inline-block whitespace-pre text-ink" style={{ minWidth: `${width}ch` }}>
          {text}
        </span>
        <span className="ml-1 inline-block h-[1.1em] w-[0.55em] bg-lime" />
      </span>
    </p>
  );
}
