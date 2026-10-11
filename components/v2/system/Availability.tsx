import { availability } from '@/content/contact';
import { cn } from '@/lib/utils';

/** What Razeen is open to, from content/data/contact.json (the Contact page uses the same record). */
export function Availability({ className }: { className?: string }) {
  return (
    <p className={cn('flex items-start gap-3 text-sm', className)}>
      <span
        aria-hidden="true"
        className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', availability.open ? 'bg-lime' : 'border border-muted')}
      />
      <span>
        <span className="font-semibold text-ink">{availability.headline}.</span>{' '}
        <span className="text-muted">{availability.detail}</span>
      </span>
    </p>
  );
}
