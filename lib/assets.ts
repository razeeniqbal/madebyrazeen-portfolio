/**
 * Asset manifest (PRD §44). Components reference these keys, never raw paths,
 * so a swapped or re-exported image only changes here.
 * Files live in public/assets/v2. `alt` travels with the image.
 */

export type AssetPath = `/assets/v2/${string}`;

export interface ImageAsset {
  src: AssetPath;
  width: number;
  height: number;
  alt: string;
  /** Cover art only: 'real' when every number painted on it is a true figure (no "illustrative" label). */
  figures?: 'illustrative' | 'real';
}

const img = (src: AssetPath, width: number, height: number, alt: string, figures?: ImageAsset['figures']): ImageAsset => ({
  src,
  width,
  height,
  alt,
  ...(figures && { figures }),
});

export const assets = {
  identity: {
    // Source is 800×800; use at ≤800px CSS width until a higher-resolution original exists.
    hero: img('/assets/v2/identity/razeen-hero.webp', 800, 800, 'Razeen Iqbal smiling with arms crossed on a glass walkway'),
    portraitFormal: img('/assets/v2/identity/razeen-portrait-formal.webp', 1096, 1375, 'Formal portrait of Razeen Iqbal in a suit and tie'),
    graduation: img('/assets/v2/identity/razeen-graduation.webp', 1600, 2400, 'Razeen Iqbal in graduation robes holding a scroll'),
    milestone: img('/assets/v2/identity/razeen-milestone.webp', 1600, 2400, 'Razeen Iqbal holding a certificate and award folder'),
  },
  career: {
    collaboration: img('/assets/v2/career/collaboration-workshop.webp', 2400, 1600, 'Razeen presenting a hand-drawn TIME cover to teammates during a workshop'),
    briefing1: img('/assets/v2/career/industry-briefing-1.webp', 2400, 1800, 'Razeen demonstrating a tablet to a group at an industry event'),
    briefing2: img('/assets/v2/career/industry-briefing-2.webp', 2400, 1800, 'Razeen walking guests through a demo at an industry event'),
    cursorAnthropic: img('/assets/v2/career/event-cursor-anthropic.webp', 1350, 2400, 'Razeen with teammates at the Cursor × Anthropic hackathon'),
    aws: img('/assets/v2/career/event-aws.webp', 1350, 2400, 'Razeen standing beside the AWS logo wall'),
    networking: img('/assets/v2/career/event-networking.webp', 1350, 2400, 'Razeen with a colleague at a conference hall'),
  },
  /** Project cover art. Numbers painted into these boards are illustrative. */
  projects: {
    sepang: img('/assets/v2/projects/sepang-vision-lab/cover.webp', 1672, 941, 'Sepang Vision Lab cover: a race car on track beside the Sepang circuit map and telemetry charts'),
    qualityplus: img('/assets/v2/projects/qualityplus/cover.webp', 1672, 941, 'QualityPlus cover: raw data flowing through completeness, uniqueness, validity, consistency and AI rule-check stages into clean data'),
    nlp: img('/assets/v2/projects/nlp-research/cover.webp', 1672, 941, 'AI / NLP research cover: two questions tokenised, embedded and compared in a semantic space'),
    balang: img(
      '/assets/v2/projects/balang/cover.webp',
      1672,
      941,
      'Balang cover: a glass kuih jar with a red lid on a green game table, kuih tokens drawn one by one, prediction cards and phones joining a room',
      'real',
    ),
  },
  running: {
    action: img('/assets/v2/running/run-action.webp', 1605, 2400, 'Razeen running toward the camera, arms raised, during a road race'),
    race: img('/assets/v2/running/run-race.webp', 1600, 2400, 'Razeen running in a road race with a race bib'),
  },
  /**
   * Mini Razeen poses. front, neutral, thinking and happy come from the pose sheet (sharp, full body);
   * the rest are interim cut-outs from the character model sheet (small, so use ≤ native size).
   */
  miniRazeen: {
    front: img('/assets/v2/identity/mini-razeen/idle.png', 212, 518, 'Mini Razeen standing, hands in hoodie pockets'),
    working: img('/assets/v2/identity/mini-razeen/working.png', 150, 114, 'Mini Razeen working on a laptop'),
    learning: img('/assets/v2/identity/mini-razeen/learning.png', 112, 151, 'Mini Razeen reading a notebook with a lightbulb idea'),
    running: img('/assets/v2/identity/mini-razeen/running.png', 129, 190, 'Mini Razeen running in a cap and sunglasses'),
    exploring: img('/assets/v2/identity/mini-razeen/exploring.png', 97, 188, 'Mini Razeen with a backpack, exploring'),
    thinking: img('/assets/v2/identity/mini-razeen/thinking.png', 201, 516, 'Mini Razeen thinking, hand on chin'),
    happy: img('/assets/v2/identity/mini-razeen/happy.png', 314, 527, 'Mini Razeen celebrating with both arms up'),
    neutral: img('/assets/v2/identity/mini-razeen/idle.png', 212, 518, 'Mini Razeen standing, relaxed smile'),
    laptop: img('/assets/v2/identity/mini-razeen/laptop.png', 103, 164, 'Mini Razeen holding a laptop'),
  },
} as const;

export type MiniRazeenPose = keyof typeof assets.miniRazeen;

/**
 * Mini Razeen Digital Icon System V1.0, cropped (not redrawn) from the icon sheet.
 * Each variant is drawn for a display size; pick by size rather than scaling one image everywhere.
 * 16px avatars read as noise, so the favicon stays the lime node (app/icon.svg).
 * Kept outside `assets` so these don't appear as cover/photo options in the admin.
 */
export const avatarIcons = {
  detailed: img('/assets/v2/identity/mini-razeen/icon/detailed.png', 242, 242, 'Mini Razeen'), // 96px+
  standard: img('/assets/v2/identity/mini-razeen/icon/standard.png', 167, 167, 'Mini Razeen'), // 48px
  simplified: img('/assets/v2/identity/mini-razeen/icon/simplified.png', 123, 123, 'Mini Razeen'), // 32px
  micro: img('/assets/v2/identity/mini-razeen/icon/micro.png', 80, 80, 'Mini Razeen'), // 24px
  minimal: img('/assets/v2/identity/mini-razeen/icon/minimal.png', 51, 51, 'Mini Razeen'), // 16px, use sparingly
  mono: img('/assets/v2/identity/mini-razeen/icon/mono.png', 95, 121, 'Mini Razeen, single colour'), // print / light surfaces
  circular: img('/assets/v2/identity/mini-razeen/icon/circular.png', 121, 121, 'Mini Razeen'), // social / profile
  app: img('/assets/v2/identity/mini-razeen/icon/app.png', 144, 143, 'Mini Razeen app icon'),
} as const;

export type AvatarVariant = keyof typeof avatarIcons;

/** The icon-system variant drawn for a given display size. */
export const avatarFor = (px: number): AvatarVariant =>
  px >= 96 ? 'detailed' : px >= 48 ? 'standard' : px >= 32 ? 'simplified' : px >= 24 ? 'micro' : 'minimal';

/** Resolves a CMS image key like "career.aws" to its asset; "none" or unknown → undefined. */
export function resolveAsset(key: string | null | undefined): ImageAsset | undefined {
  if (!key || key === 'none') return undefined;
  const [group, name] = key.split('.');
  const items = (assets as Record<string, Record<string, ImageAsset>>)[group];
  return items?.[name];
}

/**
 * Chat mascot poses (from the Mini Razeen pose sheet). Same canvas, scale and feet
 * baseline for every pose, so switching poses never shifts the character.
 * `bust` is a head-and-shoulders crop for small spaces like the launcher.
 */
export const botMoods = ['idle', 'wave', 'thinking', 'talking', 'happy', 'sleeping', 'confused'] as const;
export type BotMood = (typeof botMoods)[number];

export const botPoses = Object.fromEntries(
  botMoods.map((m) => [
    m,
    {
      full: `/assets/v2/identity/mini-razeen/bot/${m}.png` as AssetPath,
      bust: `/assets/v2/identity/mini-razeen/bot/${m}-bust.png` as AssetPath,
    },
  ]),
) as Record<BotMood, { full: AssetPath; bust: AssetPath }>;

/** Full-pose canvas size in px (all poses share it). */
export const botPoseSize = { width: 336, height: 543 };
