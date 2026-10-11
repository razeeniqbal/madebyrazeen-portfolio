import { orgLogo } from '@/lib/assets';
import { cn } from '@/lib/utils';

/**
 * An employer's or university's logo as a single-colour mark in the current text colour (a CSS mask,
 * so it reads on dark and light surfaces alike), at 70% until hovered. Every mark shares one height.
 * Renders nothing when no logo is on file.
 */
export function OrgLogo({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md'; className?: string }) {
  const logo = orgLogo(name);
  if (!logo) return null;
  const mask = `url(${logo.src}) center / contain no-repeat`;
  return (
    <span
      role="img"
      aria-label={`${logo.alt} logo`}
      style={{ aspectRatio: `${logo.width} / ${logo.height}`, mask, WebkitMask: mask }}
      className={cn('inline-block shrink-0 bg-current opacity-70 transition-opacity hover:opacity-100', size === 'sm' ? 'h-6' : 'h-8', className)}
    />
  );
}
