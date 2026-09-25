import Image from 'next/image';
import { TechnicalLabel } from './TechnicalLabel';
import type { ImageAsset } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface PhotoFrameProps {
  image: ImageAsset;
  sizes: string;
  caption?: React.ReactNode;
  meta?: React.ReactNode;
  mono?: boolean;
  priority?: boolean;
  /** Crop to a fixed ratio, e.g. "aspect-[4/5]". */
  aspect?: string;
  className?: string;
}

/** Real photography with the annotation language: corner registration marks + mono caption. */
export function PhotoFrame({ image, sizes, caption, meta, mono, priority, aspect, className }: PhotoFrameProps) {
  return (
    <figure data-reveal={priority ? undefined : ''} className={cn('relative', className)}>
      <div className={cn('relative overflow-hidden', aspect)}>
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          sizes={sizes}
          priority={priority}
          className={cn('h-full w-full object-cover', mono && 'grayscale')}
        />
        {/* Registration marks */}
        <span aria-hidden="true" className="absolute left-2 top-2 h-3 w-3 border-l border-t border-warm/70" />
        <span aria-hidden="true" className="absolute right-2 top-2 h-3 w-3 border-r border-t border-warm/70" />
        <span aria-hidden="true" className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-warm/70" />
        <span aria-hidden="true" className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-warm/70" />
      </div>
      {(caption || meta) && (
        <figcaption className="mt-3 flex justify-between gap-4">
          {caption && <TechnicalLabel>{caption}</TechnicalLabel>}
          {meta && <TechnicalLabel>{meta}</TechnicalLabel>}
        </figcaption>
      )}
    </figure>
  );
}
