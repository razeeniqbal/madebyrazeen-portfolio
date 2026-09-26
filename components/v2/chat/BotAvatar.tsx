import Image from 'next/image';
import { botMoods, botPoses, botPoseSize, type BotMood } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface BotAvatarProps {
  mood: BotMood;
  /** bust = head and shoulders (square); full = whole body. */
  variant?: 'bust' | 'full';
  /** Rendered height in px. */
  size: number;
  className?: string;
}

/**
 * Mini Razeen, the chat mascot. All poses are stacked and cross-faded, so a mood change
 * is instant (no image loading mid-animation). Motion per mood lives in globals.css
 * (.bot-*) and is disabled under prefers-reduced-motion. Purely decorative.
 */
export function BotAvatar({ mood, variant = 'bust', size, className }: BotAvatarProps) {
  const width = variant === 'bust' ? size : Math.round((botPoseSize.width / botPoseSize.height) * size);
  return (
    <span aria-hidden="true" className={cn('relative block', className)} style={{ width, height: size }}>
      <span className={cn('bot-anim absolute inset-0 block', `bot-${mood}`)}>
        {botMoods.map((m) => (
          <Image
            key={m}
            src={variant === 'bust' ? botPoses[m].bust : botPoses[m].full}
            alt=""
            width={width}
            height={size}
            style={{ width, height: size }}
            className={cn('absolute inset-0 transition-opacity duration-200', m === mood ? 'opacity-100' : 'opacity-0')}
          />
        ))}
      </span>
      {mood === 'sleeping' && (
        <span className="bot-zzz label absolute -right-1 -top-2 text-[11px] font-semibold text-lime">z</span>
      )}
    </span>
  );
}
