import { TechnicalLabel } from './TechnicalLabel';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  /** "02" */
  index?: string;
  /** "Selected work" */
  eyebrow: string;
  /** Display lines; each renders on its own line. */
  title: readonly string[];
  as?: 'h1' | 'h2';
  size?: 'xl' | 'lg' | 'md';
  className?: string;
  children?: React.ReactNode;
}

const sizes = { xl: 'text-display-xl', lg: 'text-display-lg', md: 'text-display-md' };

/** 02 / SELECTED WORK — then the display statement. */
export function SectionHeader({ index, eyebrow, title, as: Tag = 'h2', size = 'lg', className, children }: SectionHeaderProps) {
  return (
    <div data-reveal className={cn('col-span-full', className)}>
      <TechnicalLabel as="p" marker={index ? `${index} /` : undefined}>
        {eyebrow}
      </TechnicalLabel>
      <Tag className={cn('mt-6 uppercase', sizes[size])}>
        {title.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </Tag>
      {children}
    </div>
  );
}
