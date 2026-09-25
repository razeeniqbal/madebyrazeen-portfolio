import { cn } from '@/lib/utils';

interface TechnicalLabelProps {
  children: React.ReactNode;
  /** Leading marker from the annotation language: "//", "01", "+", etc. */
  marker?: React.ReactNode;
  as?: 'span' | 'p' | 'div' | 'h2' | 'h3';
  className?: string;
}

export function TechnicalLabel({ children, marker, as: Tag = 'span', className }: TechnicalLabelProps) {
  return (
    <Tag className={cn('label text-muted', className)}>
      {marker != null && <span className="mr-2 text-ink">{marker}</span>}
      {children}
    </Tag>
  );
}
