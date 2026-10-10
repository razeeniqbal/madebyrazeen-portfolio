import Image from 'next/image';
import { orgLogo } from '@/lib/assets';
import { cn } from '@/lib/utils';

/** An employer's or university's logo on a small white tile; renders nothing when none is on file. */
export function OrgLogo({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md'; className?: string }) {
  const logo = orgLogo(name);
  if (!logo) return null;
  return (
    <span className={cn('inline-flex items-center justify-center rounded-sm bg-white', size === 'sm' ? 'h-9 px-2' : 'h-12 px-3', className)}>
      <Image
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt={logo.alt}
        sizes="120px"
        className={cn('h-auto w-auto object-contain', size === 'sm' ? 'max-h-6 max-w-[5.5rem]' : 'max-h-8 max-w-[7.5rem]')}
      />
    </span>
  );
}
