import { TechnicalLabel } from './TechnicalLabel';
import { sectionFor } from '@/lib/site';
import { CountUp } from './CountUp';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /** The page's route. Its navigation entry supplies the page number and name: PAGE / 03 · TRAINER. */
  href: string;
  /** Overrides the label when the route is not a primary section (e.g. "Life / Running"). */
  label?: string;
  /** Display lines; each renders on its own line. */
  title: readonly string[];
  /** Short supporting statement: one or more paragraphs. */
  lede?: readonly string[];
  /** Structured facts under the statement (only pass values that exist). */
  meta?: readonly { label: string; value: React.ReactNode }[];
  /** Right-hand column on wide screens (an image, Mini Razeen, a link). Omit for a full-width heading. */
  aside?: React.ReactNode;
  /** Above the heading, e.g. a "Back to Life" link. */
  before?: React.ReactNode;
  className?: string;
}

/**
 * The page-heading system: technical label, editorial headline, short statement, optional facts.
 * Shared parts keep pages related; `aside`, `meta` and the title length let each page compose differently.
 */
export function PageHeader({ href, label, title, lede, meta, aside, before, className }: PageHeaderProps) {
  const section = sectionFor(href);
  return (
    <div className={cn('page-grid gap-y-10', className)}>
      {before && <div className="col-span-full">{before}</div>}
      <div data-reveal className={cn('col-span-full', aside && 'md:col-span-5 lg:col-span-8 lg:self-end')}>
        <TechnicalLabel as="p" marker={section ? `Page / ${section.index}` : undefined}>
          {label ?? section?.label}
        </TechnicalLabel>
        <h1 className="mt-6 text-display-xl uppercase">
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        {lede && lede.length > 0 && (
          <div className="mt-8 max-w-prose space-y-3 text-lead text-muted">
            {lede.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        )}
        {meta && meta.length > 0 && (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="label text-muted">{m.label}</dt>
                <dd className="mt-1">{typeof m.value === 'number' && m.value < 1000 ? <CountUp value={m.value} /> : m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {aside && <div className="col-span-full md:col-span-3 lg:col-span-4 lg:self-end">{aside}</div>}
    </div>
  );
}
