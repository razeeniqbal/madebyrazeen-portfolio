import Image from 'next/image';
import { orgLogo } from '@/lib/assets';
import { cn } from '@/lib/utils';

/** An employer's or university's logo on a small white tile; renders nothing when none is on file. */
export function OrgLogo({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md'; className?: string }) {
  const logo = orgLogo(name);
  if (!logo) return null;
  return (
    <span className={cn('inline-flex items-center justify-center rounded-sm bg-white', size === 'sm' ? 'h-12 px-2.5' : 'h-16 px-3', className)}>
      <Image
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt={logo.alt}
        sizes="120px"
        className={cn('h-auto w-auto object-contain', size === 'sm' ? 'max-h-9 max-w-[8rem]' : 'max-h-12 max-w-[11rem]')}
      />
    </span>
  );
}
