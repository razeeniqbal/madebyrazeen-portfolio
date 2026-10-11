'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';
import { cn } from '@/lib/utils';

interface LoopVideoProps {
  src: string;
  poster: string;
  width: number;
  height: number;
  /** What the video shows, for screen readers. */
  label: string;
  className?: string;
}

/**
 * A silent product video that plays on its own, like a moving screenshot: muted, looping, inline on phones.
 * It only plays while on screen, never autoplays for reduced-motion visitors (they get the poster and a
 * play button), and always has a pause control, since it runs longer than five seconds.
 */
export function LoopVideo({ src, poster, width, height, label, className }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  // null: follow the page (play when visible); true/false: the visitor chose.
  const [choice, setChoice] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const wantPlay = choice ?? !reduced;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && wantPlay) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [wantPlay]);

  return (
    <div className={cn('relative', className)}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        width={width}
        height={height}
        autoPlay={wantPlay}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block h-auto w-full border border-line bg-carbon"
      />
      <button
        type="button"
        onClick={() => setChoice(!playing)}
        aria-label={playing ? 'Pause video' : 'Play video'}
        className="label absolute bottom-2 right-2 flex items-center gap-1.5 border border-warm/30 bg-carbon/70 px-2 py-1.5 text-warm sm:bottom-3 sm:right-3 sm:gap-2 sm:px-3 sm:py-2 backdrop-blur-sm transition-colors hover:bg-carbon/90"
      >
        <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
