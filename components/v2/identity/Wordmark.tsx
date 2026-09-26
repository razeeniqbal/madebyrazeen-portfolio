import { cn } from '@/lib/utils';

interface WordmarkProps {
  className?: string;
  /** Adds the "MADE BY RAZEEN" line under the wordmark. */
  withUmbrella?: boolean;
}

/**
 * razeeniqbal. is rendered as live text rather than an image so it stays crisp,
 * inherits the section's ink colour and costs no request. The period is the
 * brand's lime "progress point".
 */
export function Wordmark({ className, withUmbrella }: WordmarkProps) {
  return (
    <span className={cn('inline-flex flex-col', className)}>
      <span className="font-display font-extrabold tracking-[-0.055em] leading-none">
        <span className="sr-only">Razeen Iqbal</span>
        <span aria-hidden="true">razeeniqbal</span>
        <span
          aria-hidden="true"
          className="ml-[0.04em] inline-block h-[0.22em] w-[0.22em] rounded-full bg-lime align-baseline"
        />
      </span>
      {withUmbrella && (
        <span className="label mt-[0.6em] text-muted" aria-hidden="true">
          Made by Razeen
        </span>
      )}
    </span>
  );
}
