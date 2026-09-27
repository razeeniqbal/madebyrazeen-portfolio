import Image from 'next/image';
import { avatarFor, avatarIcons, type AvatarVariant } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface AvatarProps {
  /** Display size in CSS px. Picks the icon-system variant drawn for that size. */
  size: number;
  /** Force a variant (e.g. 'mono' for print). */
  variant?: AvatarVariant;
  /** Decorative by default: it usually sits next to the name or wordmark. */
  alt?: string;
  className?: string;
  priority?: boolean;
}

/** Mini Razeen as a digital identity mark (icon system V1.0). Not for real-life moments: use photos there. */
export function Avatar({ size, variant, alt = '', className, priority }: AvatarProps) {
  const icon = avatarIcons[variant ?? avatarFor(size)];
  return (
    <Image
      src={icon.src}
      width={icon.width}
      height={icon.height}
      alt={alt}
      sizes={`${size}px`}
      priority={priority}
      className={cn('shrink-0', className)}
      style={{ width: size, height: 'auto' }}
    />
  );
}
