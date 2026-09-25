import { EmptyState } from './EmptyState';
import type { MiniRazeenPose } from '@/lib/assets';

interface UnderConstructionProps {
  title: string;
  body: string;
  milestone: string;
  pose?: MiniRazeenPose;
  children?: React.ReactNode;
}

/** Placeholder for V2 routes whose milestone hasn't shipped yet. States its status plainly (PRD §56). */
export function UnderConstruction({ title, body, milestone, pose = 'laptop', children }: UnderConstructionProps) {
  return (
    <EmptyState
      code={`Under construction · ${milestone}`}
      title={title}
      body={body}
      pose={pose}
      actions={[
        { href: '/', label: 'Back home' },
        { href: '/archive/v1', label: 'See the V1 version' },
      ]}
    >
      {children}
    </EmptyState>
  );
}
