import { existsSync } from 'node:fs';
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
  /** A short sequence drawn under the subtitle, e.g. a journal cover's stages. */
  motif?: readonly string[];
  /** Index of the motif stage to mark (defaults to the last). */
  motifMark?: number;
  /** A real capture (1200×630 JPEG or PNG on disk) shown full-bleed behind the text, under a dark scrim. Dark surface only. */
  photo?: string;
}

const fontFile = (name: string) => readFile(join(process.cwd(), 'lib/og/fonts', name));

/** The background capture for a project's share image, if one exists: lib/og/backgrounds/<slug>.jpg. */
export function ogBackground(slug: string): string | undefined {
  const file = join(process.cwd(), 'lib/og/backgrounds', `${slug}.jpg`);
  return existsSync(file) ? file : undefined;
}

export async function renderOg({ kind, index, title, subtitle, meta, surface = 'dark', pose, motif, motifMark, photo }: OgOptions) {
  const [interBold, interRegular, mono] = await Promise.all([
    fontFile('inter-latin-800-normal.woff'),
    fontFile('inter-latin-400-normal.woff'),
    fontFile('jetbrains-mono-latin-400-normal.woff'),
  ]);
  const character = pose
    ? `data:image/png;base64,${(await readFile(join(process.cwd(), 'public', assets.miniRazeen[pose].src))).toString('base64')}`
    : null;
  const background = photo && surface === 'dark' ? `data:image/jpeg;base64,${(await readFile(photo)).toString('base64')}` : null;

  const dark = surface === 'dark';
  const bg = dark ? C.carbon : C.warm;
  const fg = dark ? C.warm : C.carbon;
  const muted = dark ? C.grey : C.greyInk;
  const line = dark ? 'rgba(243,241,235,0.12)' : 'rgba(9,9,9,0.12)';
  const titleSize = background ? (title.length > 14 ? 72 : 96) : title.length > 48 ? 64 : title.length > 28 ? 80 : 104;

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
          position: 'relative',
          ...(background
            ? {}
            : {
                backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
                backgroundSize: '100px 100px',
              }),
        }}
      >
        {background && <img src={background} width={ogSize.width} height={ogSize.height} style={{ position: 'absolute', top: 0, left: 0 }} alt="" />}
        {background && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: ogSize.width,
              height: ogSize.height,
              display: 'flex',
              backgroundImage: 'linear-gradient(90deg, rgba(9,9,9,0.95) 0%, rgba(9,9,9,0.85) 40%, rgba(9,9,9,0.2) 70%, rgba(9,9,9,0) 100%)',
            }}
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${line}`, paddingBottom: 18 }}>
          <div style={{ ...label, color: fg, display: 'flex' }}>Razeen Iqbal // {kind}</div>
          <div style={{ ...label, display: 'flex' }}>{index ?? 'Build · Learn · Experiment · Improve'}</div>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: background ? 560 : character ? 820 : 1050 }}>
            <div style={{ display: 'flex', fontWeight: 800, fontSize: titleSize, lineHeight: 0.98, letterSpacing: -3 }}>{title}</div>
            {subtitle && (
              <div style={{ display: 'flex', marginTop: 26, fontSize: background ? 24 : 30, lineHeight: 1.35, color: background ? '#C8C8C2' : muted, fontWeight: 400 }}>{subtitle}</div>
            )}
            {motif && motif.length > 0 && (
              <div style={{ ...label, display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginTop: 30, fontSize: 16, color: fg }}>
                {motif.map((m, i) => (
                  <div key={m} style={{ display: 'flex', alignItems: 'center' }}>
                    {i === (motifMark ?? motif.length - 1) && (
                      <div style={{ width: 12, height: 12, borderRadius: 12, background: C.lime, border: `1px solid ${fg}`, marginRight: 10, display: 'flex' }} />
                    )}
                    {m}
                    {i < motif.length - 1 && <div style={{ display: 'flex', margin: '0 12px', color: muted }}>→</div>}
                  </div>
                ))}
              </div>
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
