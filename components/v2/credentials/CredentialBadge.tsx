import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';
import type { Achievement } from '@/content/achievements';
import { credentialCode } from '@/lib/credentials';
import { cn } from '@/lib/utils';

const issuerMark: Record<string, string> = {
  Microsoft: 'MS',
  'Google Cloud': 'GC',
  Anthropic: 'AN',
  'IBM SkillsBuild': 'IBM',
  'Python Institute': 'PI',
  Apache: 'ASF',
  Axiata: 'AX',
};

/** Official artwork only if the file is really in /public (the V1 paths were never shipped). Server-only. */
function artwork(a: Achievement) {
  if (!a.image || !a.image.startsWith('/')) return undefined;
  return existsSync(join(process.cwd(), 'public', a.image)) ? a.image : undefined;
}

/**
 * A credential's badge: the official artwork, uncoloured, when available; otherwise a neutral
 * typographic tile (exam code or issuer mark). Never a recoloured or invented logo.
 */
export function CredentialBadge({ credential, size = 48, className }: { credential: Achievement; size?: number; className?: string }) {
  const src = artwork(credential);
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
  const code = credentialCode(credential) ?? issuerMark[credential.organization] ?? credential.organization.slice(0, 2).toUpperCase();
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
