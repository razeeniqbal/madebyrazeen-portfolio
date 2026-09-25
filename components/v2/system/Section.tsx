import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Dark = systems / building. Light = thinking / writing (PRD §8). */
  surface: 'dark' | 'light';
  /** Faint technical grid texture behind the section. */
  grid?: boolean;
}

export function Section({ surface, grid, className, children, ...rest }: SectionProps) {
  return (
    <section data-surface={surface} className={cn('relative py-section', grid && 'bg-tech-grid', className)} {...rest}>
      {children}
    </section>
  );
}
