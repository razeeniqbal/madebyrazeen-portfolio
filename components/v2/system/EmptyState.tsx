import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { TechnicalLabel } from './TechnicalLabel';
import { ArrowLink } from './ArrowLink';
import type { MiniRazeenPose } from '@/lib/assets';

interface EmptyStateProps {
  code: string; // "404", "UNDER CONSTRUCTION"
  title: string;
  body: string;
  pose: MiniRazeenPose;
  actions?: { href: string; label: string }[];
  as?: 'h1' | 'h2';
  children?: React.ReactNode;
}

/** PRD §35: short, slightly playful, Mini Razeen does the storytelling. */
export function EmptyState({ code, title, body, pose, actions = [], as: Tag = 'h1', children }: EmptyStateProps) {
  return (
    <div className="page-grid min-h-[70svh] items-center gap-y-10 py-section">
      <div className="col-span-full flex justify-center md:col-span-3 lg:col-span-4 lg:col-start-2">
        <MiniRazeen pose={pose} height={220} />
      </div>
      <div className="col-span-full md:col-span-5 lg:col-span-6">
        <TechnicalLabel as="p" marker="//">
          {code}
        </TechnicalLabel>
        <Tag className="mt-4 text-display-md uppercase">{title}</Tag>
        <p className="mt-4 max-w-prose text-muted">{body}</p>
        {children}
        {actions.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-6">
            {actions.map((a, i) => (
              <ArrowLink key={a.href} href={a.href} variant={i === 0 ? 'primary' : 'plain'}>
                {a.label}
              </ArrowLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
