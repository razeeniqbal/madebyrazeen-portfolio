'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StickyShowcaseProps {
  /** One visual per story, in the same order. */
  visuals: ReactNode[];
  stories: ReactNode[];
  /** Short names for the progress rail ("VSB", "FORMA"…). */
  names: string[];
}

/**
 * Desktop scroll story: the visual column stays pinned while the stories scroll past; whichever story
 * is in the middle of the viewport decides which visual is shown, with a short cross-fade. A progress
 * rail shows where you are. Only rendered from lg up; phones use the stacked layout.
 */
export function StickyShowcase({ visuals, stories, names }: StickyShowcaseProps) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      // A thin band across the middle of the viewport: the story crossing it is the active one.
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-x-10">
      <div className="col-span-7">
        <div className="sticky top-[calc(var(--header-h)+3rem)]">
          <div className="relative">
            {visuals.map((v, i) => (
              <div
                key={i}
                aria-hidden={i !== active}
                className={cn(
                  'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
                  i === 0 ? 'relative' : 'absolute inset-x-0 top-0',
                  i === active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
                )}
              >
                {v}
              </div>
            ))}
          </div>
          <ol aria-hidden="true" className="mt-10 flex gap-2">
            {names.map((n, i) => (
              <li key={n} className="flex-1">
                <span className={cn('block h-0.5 transition-colors duration-500', i === active ? 'bg-lime' : i < active ? 'bg-ink/50' : 'bg-line')} />
                <span className={cn('label mt-2 block transition-colors', i === active ? 'text-ink' : 'text-muted')}>{n}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="col-span-5">
        {stories.map((s, i) => (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className={cn('flex min-h-[85vh] items-center border-t border-line py-16 transition-opacity duration-500', i === active ? 'opacity-100' : 'opacity-40')}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
