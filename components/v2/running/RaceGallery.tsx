'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ImageAsset } from '@/lib/assets';
import { cn } from '@/lib/utils';

export interface RaceGroup {
  /** The race name from the Strava record, or "More race days". */
  name: string;
  /** "18 Jul 2026", when the group has a race date. */
  when?: string;
  photos: ImageAsset[];
}

/**
 * Race-day photos, grouped by race. A row of filters picks one race (or all); the photos sit in a
 * masonry of columns so portrait and landscape shots keep their shape.
 */
export function RaceGallery({ groups }: { groups: RaceGroup[] }) {
  const [pick, setPick] = useState<number | null>(null);
  const shown = pick === null ? groups : [groups[pick]];
  const total = groups.reduce((n, g) => n + g.photos.length, 0);

  return (
    <div>
      <div role="group" aria-label="Filter photos by race" className="flex flex-wrap gap-1">
        {[null, ...groups.map((_, i) => i)].map((i) => {
          const on = pick === i;
          const label = i === null ? 'All' : groups[i].name;
          const count = i === null ? total : groups[i].photos.length;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => setPick(i)}
              className={cn('label border px-3 py-2 transition-colors', on ? 'border-ink bg-ink text-surface' : 'border-line text-muted hover:border-ink hover:text-ink')}
            >
              {label} <span className={on ? 'text-surface/70' : 'text-muted'}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 columns-2 gap-3 md:columns-3 lg:columns-4 lg:gap-4">
        {shown.flatMap((g) =>
          g.photos.map((p) => (
            <figure key={p.src} className="mb-3 break-inside-avoid lg:mb-4">
              <Image src={p.src} width={p.width} height={p.height} alt={p.alt} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 48vw" className="h-auto w-full" />
              <figcaption className="label mt-1.5 text-muted">
                {g.name}
                {g.when && ` · ${g.when}`}
              </figcaption>
            </figure>
          )),
        )}
      </div>
    </div>
  );
}
