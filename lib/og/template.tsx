import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { assets, type MiniRazeenPose } from '@/lib/assets';

/** OpenGraph templates (PRD §41): identity, portfolio, project, technical note, running story. 1200×630. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const C = { carbon: '#090909', warm: '#F3F1EB', grey: '#9A9A94', greyInk: '#5E5E59', lime: '#D8FF3E' };

interface OgOptions {
  kind: string; // "PROJECT", "TECHNICAL NOTE"…
  index?: string; // "// 03"
  title: string;
  subtitle?: string;
  meta?: string; // bottom-left line
  surface?: 'dark' | 'light';
  pose?: MiniRazeenPose;
}

const fontFile = (name: string) => readFile(join(process.cwd(), 'lib/og/fonts', name));

export async function renderOg({ kind, index, title, subtitle, meta, surface = 'dark', pose }: OgOptions) {
  const [interBold, interRegular, mono] = await Promise.all([
    fontFile('inter-latin-800-normal.woff'),
    fontFile('inter-latin-400-normal.woff'),
    fontFile('jetbrains-mono-latin-400-normal.woff'),
  ]);
  const character = pose
    ? `data:image/png;base64,${(await readFile(join(process.cwd(), 'public', assets.miniRazeen[pose].src))).toString('base64')}`
    : null;

  const dark = surface === 'dark';
  const bg = dark ? C.carbon : C.warm;
  const fg = dark ? C.warm : C.carbon;
  const muted = dark ? C.grey : C.greyInk;
  const line = dark ? 'rgba(243,241,235,0.12)' : 'rgba(9,9,9,0.12)';
  const titleSize = title.length > 48 ? 64 : title.length > 28 ? 80 : 104;

  const label = { fontFamily: 'Mono', fontSize: 18, letterSpacing: 3, textTransform: 'uppercase' as const, color: muted };

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: bg,
          color: fg,
          padding: '44px 56px',
          fontFamily: 'Inter',
          backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${line}`, paddingBottom: 18 }}>
          <div style={{ ...label, color: fg, display: 'flex' }}>Razeen Iqbal // {kind}</div>
          <div style={{ ...label, display: 'flex' }}>{index ?? 'Build · Learn · Experiment · Improve'}</div>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: character ? 820 : 1050 }}>
            <div style={{ display: 'flex', fontWeight: 800, fontSize: titleSize, lineHeight: 0.98, letterSpacing: -3 }}>{title}</div>
            {subtitle && (
              <div style={{ display: 'flex', marginTop: 26, fontSize: 30, lineHeight: 1.35, color: muted, fontWeight: 400 }}>{subtitle}</div>
            )}
          </div>
          {character && <img src={character} height={260} style={{ objectFit: 'contain' }} alt="" />}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${line}`, paddingTop: 20 }}>
          <div style={{ ...label, display: 'flex' }}>{meta ?? 'portfolio.madebyrazeen.com'}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', fontWeight: 800, fontSize: 40, letterSpacing: -2, color: fg }}>
            razeeniqbal
            <div style={{ width: 10, height: 10, borderRadius: 10, background: C.lime, marginLeft: 3, marginBottom: 9, display: 'flex' }} />
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: 'Inter', data: interBold, weight: 800, style: 'normal' },
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
}
