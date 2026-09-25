import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  /** primary = lime block (one per view); plain = underlined label. */
  variant?: 'primary' | 'plain';
  className?: string;
}

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

export function ArrowLink({ href, children, variant = 'plain', className }: ArrowLinkProps) {
  const cls = cn(
    'label group inline-flex items-center gap-3 transition-colors',
    variant === 'primary'
      ? 'bg-lime px-5 py-3.5 text-carbon hover:bg-ink hover:text-surface'
      : 'border-b border-current pb-1 hover:text-signal',
    className,
  );
  const arrow = (
    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
      →
    </span>
  );

  if (isExternal(href)) {
    return (
      <a href={href} className={cls} {...(href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}>
        {children}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {arrow}
    </Link>
  );
}
