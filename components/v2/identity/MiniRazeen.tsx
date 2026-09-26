import Image from 'next/image';
import { assets, type MiniRazeenPose } from '@/lib/assets';

interface MiniRazeenProps {
  pose: MiniRazeenPose;
  /** Rendered height in px. Interim cut-outs are small, so this is capped at native height. */
  height?: number;
  className?: string;
  /** Decorative by default: Mini Razeen accompanies content, it doesn't carry it. */
  decorative?: boolean;
}

export function MiniRazeen({ pose, height, className, decorative = true }: MiniRazeenProps) {
  const a = assets.miniRazeen[pose];
  const h = Math.min(height ?? a.height, a.height);
  const w = Math.round((a.width / a.height) * h);
  return (
    <Image
      src={a.src}
      width={w}
      height={h}
      alt={decorative ? '' : a.alt}
      className={className}
      style={{ width: w, height: h }}
    />
  );
}
