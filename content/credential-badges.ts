/**
 * Server-only: attaches each credential's badge path when the official artwork really ships in /public.
 * Client components (the filterable archive) receive the resolved path, so they never need `fs`.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Achievement } from './achievements';

export const badgeFor = (a: Achievement): string | undefined =>
  a.image && a.image.startsWith('/') && existsSync(join(process.cwd(), 'public', a.image)) ? a.image : undefined;

export const withBadges = (items: Achievement[]) => items.map((a) => ({ ...a, badge: badgeFor(a) }));
