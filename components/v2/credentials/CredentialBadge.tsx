import Image from 'next/image';
import type { Achievement } from '@/content/achievements';
import { credentialMark } from '@/lib/credentials';
import { badgeFor } from '@/content/credential-badges';
import { cn } from '@/lib/utils';

/**
 * A credential's badge: the official artwork, uncoloured, when available; otherwise a neutral
 * typographic tile (exam code or issuer mark). Never a recoloured or invented logo.
 */
export function CredentialBadge({ credential, size = 48, className }: { credential: Achievement; size?: number; className?: string }) {
  const src = badgeFor(credential);
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size * 2}
        height={size * 2}
        className={cn('shrink-0 object-contain', className)}
        style={{ width: size, height: size }}
      />
    );
  }
  const code = credentialMark(credential);
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 flex-col items-center justify-center border border-line bg-raised font-mono font-semibold leading-none tracking-tight text-ink',
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(8, Math.round(size / 5)) }}
    >
      {code}
    </span>
  );
}
