import Image from 'next/image';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { evidenceCaption, type ImageAsset } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface EvidenceImageProps {
  image: ImageAsset;
  /** What the screen shows. */
  caption?: string;
  /** "01" for screens shown in sequence. */
  index?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * A product capture as evidence: the image opens at full size (interface text stays readable on a
 * phone), the caption says what the screen shows, and the evidence class says what kind of image it is
 * (real product, current build, concept artwork). Phone captures keep a phone width.
 */
export function EvidenceImage({ image, caption, index, sizes, priority, className }: EvidenceImageProps) {
  const portrait = image.height > image.width;
  const kind = evidenceCaption(image);
  return (
    <figure className={cn(portrait && 'mx-auto w-full max-w-[20rem]', className)}>
      <a
        href={image.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open full size: ${image.alt}`}
        className="group block overflow-hidden border border-line bg-raised"
      >
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          sizes={sizes}
          priority={priority}
          className="w-full transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transition-none"
        />
      </a>
      {(caption || kind) && (
        <figcaption className="mt-3 flex flex-col gap-1">
          {caption && (
            <p className="text-sm">
              {index && <span className="label mr-2 text-muted">{index}</span>}
              {caption}
            </p>
          )}
          {kind && <TechnicalLabel>{kind}</TechnicalLabel>}
        </figcaption>
      )}
    </figure>
  );
}

/** Product evidence in one of three layouts (see the `gallery` block). */
export function EvidenceGallery({ layout, items }: { layout: 'pair' | 'sequence' | 'grid'; items: { image: ImageAsset; caption: string }[] }) {
  if (layout === 'pair') {
    return (
      <div className="grid items-start gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:gap-6">
        {items.map((i) => (
          <EvidenceImage
            key={i.image.src}
            image={i.image}
            caption={i.caption}
            sizes={i.image.height > i.image.width ? '(min-width: 768px) 22vw, 320px' : '(min-width: 768px) 66vw, 100vw'}
          />
        ))}
      </div>
    );
  }
  if (layout === 'grid') {
    return (
      <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
        {items.map((i) => (
          <EvidenceImage key={i.image.src} image={i.image} caption={i.caption} sizes="(min-width: 768px) 45vw, 100vw" />
        ))}
      </div>
    );
  }
  return (
    <ol className="space-y-12">
      {items.map((i, n) => (
        <li key={i.image.src}>
          <EvidenceImage image={i.image} caption={i.caption} index={String(n + 1).padStart(2, '0')} sizes="(min-width: 1024px) 90vw, 100vw" />
        </li>
      ))}
    </ol>
  );
}
