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
  /**
   * What the image is evidence of, so concept art is never mistaken for working software:
   * real-product (a capture of the shipped or running product), current-build (a capture of work in
   * progress), concept (artwork, not an interface), brand-asset (logo or approved identity art).
   */
  evidence?: Evidence;
  /** Context that must travel with a capture, e.g. "Development preview with sample data". */
  note?: string;
}

export type Evidence = 'real-product' | 'current-build' | 'concept' | 'brand-asset';

export const evidenceLabel: Record<Evidence, string> = {
  'real-product': 'Real product',
  'current-build': 'Current build',
  concept: 'Concept artwork',
  'brand-asset': 'Brand asset',
};

/** "Real product · Development preview with sample data", "Concept artwork · figures illustrative". */
export function evidenceCaption(a: ImageAsset): string | undefined {
  if (!a.evidence) return a.figures ? (a.figures === 'real' ? 'Cover art' : 'Cover art · figures illustrative') : undefined;
  const parts: string[] = [evidenceLabel[a.evidence]];
  if (a.evidence === 'concept' && a.figures === 'illustrative') parts.push('figures illustrative');
  if (a.note) parts.push(a.note);
  return parts.join(' · ');
}

const img = (src: AssetPath, width: number, height: number, alt: string, figures?: ImageAsset['figures']): ImageAsset => ({
  src,
  width,
  height,
  alt,
  ...(figures && { figures }),
});

/** A product capture with its evidence class (and note, when the data shown needs context). */
const shot = (src: AssetPath, width: number, height: number, alt: string, evidence: Evidence, note?: string): ImageAsset => ({
  src,
  width,
  height,
  alt,
  evidence,
  ...(note && { note }),
});

const LIVE = 'vsb.madebyrazeen.com';
const VSB_PREVIEW = 'Development preview with sample data';
const FORMA_EXAMPLE = 'Built-in example project and sample data';
const SVL_SESSION = '2026 Sepang race replay, recorded OpenF1 data';

/**
 * Organisation logos (employers, universities), supplied by Razeen. Shown small, on a white tile so
 * they read on either surface. Matched to a company or institution name by `orgLogo`.
 */
export const logos = {
  aem: img('/assets/v2/logos/aem.webp', 480, 87, 'AEM Enersol logo'),
  eismartwork: img('/assets/v2/logos/eismartwork.webp', 480, 136, 'EISmartwork logo'),
  gnp: img('/assets/v2/logos/gnp.webp', 287, 240, 'G&P logo'),
  threeDtech: img('/assets/v2/logos/3dtech.webp', 265, 240, '3Dtech Solutions logo'),
  upm: img('/assets/v2/logos/upm.webp', 480, 220, 'Universiti Putra Malaysia logo'),
  umpsa: img('/assets/v2/logos/umpsa.webp', 325, 240, 'Universiti Malaysia Pahang Al-Sultan Abdullah logo'),
};

const logoMatchers: [RegExp, keyof typeof logos][] = [
  [/\bAEM\b/i, 'aem'],
  [/EISmartwork/i, 'eismartwork'],
  [/G&P/i, 'gnp'],
  [/3Dtech/i, 'threeDtech'],
  [/Universiti Putra Malaysia|\bUPM\b/i, 'upm'],
  [/Universiti Malaysia Pahang|UMPSA/i, 'umpsa'],
];

/** The logo for an organisation name, or undefined when there is none on file. */
export const orgLogo = (name: string): ImageAsset | undefined => {
  const hit = logoMatchers.find(([re]) => re.test(name));
  return hit ? logos[hit[1]] : undefined;
};

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
    sepang: shot('/assets/v2/projects/sepang-vision-lab/hero.webp', 2400, 1350, 'Sepang Vision Lab race replay: three cars in team-style liveries nose to tail through a kerbed corner on the opening lap, seen from a trackside TV camera', 'real-product', SVL_SESSION),
    qualityplus: { ...img('/assets/v2/projects/qualityplus/cover.webp', 1672, 941, 'QualityPlus cover: raw data flowing through completeness, uniqueness, validity, consistency and AI rule-check stages into clean data', 'illustrative'), evidence: 'concept' },
    nlp: { ...img('/assets/v2/projects/nlp-research/cover.webp', 1672, 941, 'AI / NLP research cover: two questions tokenised, embedded and compared in a semantic space', 'illustrative'), evidence: 'concept' },
    balang: {
      ...img(
        '/assets/v2/projects/balang/cover.webp',
        1672,
        941,
        'Balang cover: a glass kuih jar with a red lid on a green game table, kuih tokens drawn one by one, prediction cards and phones joining a room',
        'real',
      ),
      evidence: 'concept',
    },
  },
  /** VSB captures. Live pages are signed out; session and profile screens use the app's own dev preview with sample data. */
  vsb: {
    landingDesktop: shot('/assets/v2/projects/vsb/product/vsb-landing-desktop.webp', 2400, 1500, 'VSB home page on desktop: the headline Same court, more people, better games beside illustrated VSB players, with Find a game and See who is playing buttons', 'real-product', LIVE),
    landingMobile: shot('/assets/v2/projects/vsb/product/vsb-landing-mobile.webp', 1170, 2532, 'VSB home page on a phone: the headline, Find a game and See who is playing buttons stacked above the illustrated players', 'real-product', LIVE),
    howItWorks: shot('/assets/v2/projects/vsb/product/vsb-how-it-works.webp', 2400, 892, 'VSB home page section How VSB works: Find, Book and Play, with frequently asked questions below', 'real-product', LIVE),
    playerIdentity: shot('/assets/v2/projects/vsb/product/vsb-player-identity.webp', 2400, 1050, 'VSB home page section Your player, your VSB identity: an example player card beside a list of what the card shows', 'real-product', LIVE),
    sessionCards: shot('/assets/v2/projects/vsb/product/vsb-session-cards.webp', 2400, 1658, 'VSB session cards: four sessions with date, venue, level, who is playing, filled places and price, one fully booked with a waitlist', 'real-product', VSB_PREVIEW),
    sessionDetail: shot('/assets/v2/projects/vsb/product/vsb-session-detail.webp', 2400, 2850, 'VSB session details: date, venue, court, price and a Book my spot button, then Who is playing shown as players placed on a volleyball court with open slots', 'real-product', VSB_PREVIEW),
    sessionMobile: shot('/assets/v2/projects/vsb/product/vsb-session-mobile.webp', 1170, 2532, 'VSB session details on a phone: the court header, session name, level and the date, time, venue and court facts', 'real-product', VSB_PREVIEW),
    myVsb: shot('/assets/v2/projects/vsb/product/vsb-my-vsb.webp', 2400, 1500, 'My VSB for a sample profile: a player card with position and level beside games, venues and upcoming counts', 'real-product', 'Development preview, sample profile'),
  },
  /** FORMA captures, all from the running app on its example project. */
  forma: {
    sourceViewer: shot('/assets/v2/projects/forma/product/forma-source-viewer.webp', 2400, 1500, 'FORMA Sources page: an Excel workbook with three sheets listed by row and column count, and the pipeline that uses it', 'real-product', FORMA_EXAMPLE),
    analystWorkbench: shot('/assets/v2/projects/forma/product/forma-analyst-workbench.webp', 2400, 1500, 'FORMA analyst workbench: pipeline steps, a data preview of invoice rows, a before and after comparison, the step inspector and a data profile', 'real-product', FORMA_EXAMPLE),
    extraction: shot('/assets/v2/projects/forma/product/forma-extraction.webp', 2400, 1500, 'FORMA extraction view: the raw spreadsheet in the source viewer, failed rows grouped by issue type with Fix, Ignore and Exclude actions, and the generated Python for the validation step', 'real-product', FORMA_EXAMPLE),
    pipelineRun: shot('/assets/v2/projects/forma/product/forma-pipeline-run.webp', 2400, 1500, 'FORMA pipeline canvas after a run: eleven steps from source to destination with row counts and timings, summarised as 1,001 input, 985 ready and 16 to review', 'real-product', FORMA_EXAMPLE),
    runMonitor: shot('/assets/v2/projects/forma/product/forma-run-monitor.webp', 2400, 1500, 'FORMA monitor view: run history, validation health with completeness, validity, uniqueness and consistency, run logs per step and the failed rows', 'real-product', FORMA_EXAMPLE),
    reviewQueue: shot('/assets/v2/projects/forma/product/forma-review-queue.webp', 2400, 1500, 'FORMA review queue: sixteen rows held back with their issue, and a panel to correct the value, keep the original, exclude the row or ignore the warning', 'real-product', FORMA_EXAMPLE),
    export: shot('/assets/v2/projects/forma/product/forma-export.webp', 2400, 1500, 'FORMA export: options for a Python script, a Python project, Airflow or Prefect, beside the generated pandas code', 'real-product', FORMA_EXAMPLE),
  },
  /** Sepang Vision Lab: captures of the live build (sepangvisionlab.madebyrazeen.com) replaying the 2026 Sepang race. */
  sepang: {
    tvCamera: shot('/assets/v2/projects/sepang-vision-lab/product/sepang-tv-camera.webp', 2400, 1500, 'Sepang Vision Lab race replay on the TV camera: the timing tower for all 22 cars, a safety car message, the track map and weather, Charles Leclerc on track with his speed, gear, throttle, g-meter and lap times, and the replay bar', 'real-product', SVL_SESSION),
    chaseCorner: shot('/assets/v2/projects/sepang-vision-lab/product/sepang-chase-corner.webp', 2400, 1500, 'Sepang Vision Lab chase camera behind Lando Norris through a corner on lap 9, with the rev arc, gear, g-meter and a stewards message about a Turn 9 incident', 'real-product', SVL_SESSION),
    inspect: shot('/assets/v2/projects/sepang-vision-lab/product/sepang-inspect.webp', 2400, 1500, 'Sepang Vision Lab inspect camera orbiting Lewis Hamilton\'s car in a red and white team-style livery at 226 km/h under the safety car', 'real-product', SVL_SESSION),
    pitLane: shot('/assets/v2/projects/sepang-vision-lab/product/sepang-pit-lane.webp', 2400, 1500, 'Sepang Vision Lab chase camera following Max Verstappen down the pit lane at 29 km/h past the garages on lap 34', 'real-product', SVL_SESSION),
    phone: shot('/assets/v2/projects/sepang-vision-lab/product/sepang-phone.webp', 1170, 2532, 'Sepang Vision Lab on a phone: session tabs, the 3D chase view, the replay bar and the followed driver\'s live telemetry card', 'real-product', SVL_SESSION),
  },
  /** BALANG captures from a real local game against the built-in computer players. */
  balangPlay: {
    landing: shot('/assets/v2/projects/balang/product/balang-landing.webp', 2400, 1500, 'BALANG landing page: Agak. Risiko. Menang. beside the kuih jar and prediction cards, with a four-step summary of a round', 'real-product'),
    observe: shot('/assets/v2/projects/balang/product/balang-observe.webp', 2400, 1500, 'BALANG round start: the jar contents counted by kuih type and the six secret prediction cards dealt to the player', 'real-product'),
    table: shot('/assets/v2/projects/balang/product/balang-table.webp', 2400, 1500, 'BALANG game table: players and scores, the jar, the draw track, the live jar count and the player prediction cards', 'real-product'),
    discard: shot('/assets/v2/projects/balang/product/balang-discard.webp', 2400, 1500, 'BALANG discard step: two prediction cards marked for discarding after five draws', 'real-product'),
    lock: shot('/assets/v2/projects/balang/product/balang-lock.webp', 2400, 1500, 'BALANG final placement: one of the last three prediction cards placed on the negative side with twelve tokens drawn', 'real-product'),
    kawKaw: shot('/assets/v2/projects/balang/product/balang-kaw-kaw.webp', 2400, 1500, 'BALANG KAW-KAW choice: double the value of one positive card, at the risk of losing it, or play safe', 'real-product'),
    roundResult: shot('/assets/v2/projects/balang/product/balang-round-result.webp', 2400, 1500, 'BALANG round result: a negative card that did not come true, a KAW-KAW card that did, one card wrong, the fourteen drawn tokens and the scores', 'real-product'),
    tableMobile: shot('/assets/v2/projects/balang/product/balang-table-mobile.webp', 1170, 2532, 'BALANG game table on a phone: the jar, token counts, draw track and swipeable prediction cards', 'real-product'),
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
 * Tab icon: app/favicon.ico (16 minimal / 32 simplified / 48 standard) + app/icon.png (96, detailed).
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
