import type { ReactNode } from 'react';
import { journalFigures, type JournalCover, type JournalFigure } from '@/lib/journal';
import { cn } from '@/lib/utils';

/**
 * Journal editorial figures, drawn in code: real text, no image weight, and the same technical
 * language as the rest of the site (thin rules, mono labels, one Signal Lime accent).
 * Covers sit on Carbon Black (the system); inline figures sit on the page (the thinking).
 */

// ── Glyphs ───────────────────────────────────────────────────────────────────────────────────────
// Small line drawings, one per stage. Decorative: the stage name beside each says the same thing.

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 120 72"
      aria-hidden="true"
      focusable="false"
      className="h-auto w-full max-w-[5.5rem] sm:max-w-[9rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const glyphs: Record<string, ReactNode> = {
  structure: (
    <Glyph>
      <path d="M10 56 H100 M25 24 H85 M10 56 L25 24 L40 56 L55 24 L70 56 L85 24 L100 56" />
      <path d="M10 56 l-5 9 h10 z M100 56 l-5 9 h10 z" />
      {[10, 40, 70, 100, 25, 55, 85].map((x, i) => (
        <circle key={x} cx={x} cy={i < 4 ? 56 : 24} r={1.8} fill="currentColor" />
      ))}
    </Glyph>
  ),
  measurements: (
    <Glyph>
      <path d="M10 24 H110 M10 18 V30 M110 18 V30 M16 21 L10 24 L16 27 M104 21 L110 24 L104 27" />
      <path d="M10 56 H110" />
      {Array.from({ length: 11 }, (_, i) => 10 + i * 10).map((x, i) => (
        <path key={x} d={`M${x} 56 V${i % 5 === 0 ? 44 : 50}`} />
      ))}
    </Glyph>
  ),
  data: (
    <Glyph>
      <path d="M8 62 H112 M8 62 V10" opacity={0.5} />
      <path d="M10 46 L18 44 L24 47 L31 42 L38 45 L45 41 L52 44 L58 40 L63 18 L68 42 L75 39 L82 43 L89 38 L96 41 L103 37 L110 39" />
      <circle cx={63} cy={18} r={7} strokeDasharray="2 2.5" />
    </Glyph>
  ),
  code: (
    <Glyph>
      <rect x={10} y={8} width={100} height={56} rx={1} />
      <path d="M10 18 H110" />
      <circle cx={17} cy={13} r={1.4} fill="currentColor" />
      <circle cx={23} cy={13} r={1.4} fill="currentColor" />
      <path d="M18 28 l5 4 l-5 4 M28 36 H52 M18 44 H70 M18 52 H44" />
      <rect x={48} y={49} width={5} height={6} fill="currentColor" stroke="none" />
    </Glyph>
  ),
  pipeline: (
    <Glyph>
      <rect x={6} y={28} width={24} height={16} />
      <rect x={46} y={28} width={24} height={16} />
      <path d="M30 36 H46 M70 36 H86 M41 33 l5 3 l-5 3 M81 33 l5 3 l-5 3" />
      <ellipse cx={100} cy={26} rx={12} ry={4} />
      <path d="M88 26 V46 M112 26 V46 M88 46 a12 4 0 0 0 24 0" />
    </Glyph>
  ),
  ai: (
    <Glyph>
      <path d="M60 36 L22 16 M60 36 L22 56 M60 36 L98 14 M60 36 L100 58 M60 36 L60 8 M22 16 L22 56 M98 14 L100 58" opacity={0.7} />
      {[
        [22, 16],
        [22, 56],
        [98, 14],
        [100, 58],
        [60, 8],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} className="fill-surface" />
      ))}
      <circle cx={60} cy={36} r={8} className="fill-lime stroke-lime" />
    </Glyph>
  ),
  check: (
    <Glyph>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={14 + c * 24} y={8 + r * 19} width={20} height={15} opacity={0.75} />),
      )}
      {[0, 1, 2].map((r) => (
        <path key={r} d={`M${96} ${14 + r * 19} l3 3 l6 -6`} />
      ))}
    </Glyph>
  ),
  find: (
    <Glyph>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={14 + c * 24} y={8 + r * 19} width={20} height={15} opacity={0.35} />),
      )}
      {[
        [1, 0],
        [2, 1],
        [0, 2],
      ].map(([c, r]) => (
        <g key={`${c}${r}`}>
          <rect x={14 + c * 24} y={8 + r * 19} width={20} height={15} strokeWidth={1.75} />
          <path d={`M${20 + c * 24} ${12 + r * 19} l8 7 M${28 + c * 24} ${12 + r * 19} l-8 7`} />
        </g>
      ))}
    </Glyph>
  ),
  assist: (
    <Glyph>
      <rect x={10} y={14} width={64} height={30} rx={2} />
      <path d="M22 44 l-4 10 l12 -10" />
      <path d="M20 25 H58 M20 33 H46" />
      <circle cx={96} cy={30} r={11} className="fill-lime stroke-lime" />
      <path d="M74 30 H85" strokeDasharray="2 2.5" />
    </Glyph>
  ),
  review: (
    <Glyph>
      <circle cx={60} cy={36} r={24} className="fill-warm stroke-warm" />
      <path d="M48 36 l8 8 l16 -16" className="stroke-carbon" strokeWidth={2.5} />
    </Glyph>
  ),
};

// ── Covers ───────────────────────────────────────────────────────────────────────────────────────

type CoverStage = { key: string; label: string; zone?: 'deterministic' | 'ai' | 'human' };

const coverStages: Record<JournalCover, CoverStage[]> = {
  career: [
    { key: 'structure', label: 'Structure' },
    { key: 'measurements', label: 'Measurements' },
    { key: 'data', label: 'Data' },
    { key: 'code', label: 'Code' },
    { key: 'pipeline', label: 'Pipeline' },
    { key: 'ai', label: 'AI system' },
  ],
  quality: [
    { key: 'check', label: 'Check', zone: 'deterministic' },
    { key: 'find', label: 'Find', zone: 'deterministic' },
    { key: 'assist', label: 'Assist', zone: 'ai' },
    { key: 'review', label: 'Review', zone: 'human' },
  ],
};

const coverText: Record<JournalCover, { alt: string; left: string; right: string }> = {
  career: {
    alt: 'Cover diagram: the path from civil engineering to AI drawn as six linked stages. Structure, measurements, data, code, pipeline and AI system, each shown as a small technical drawing, with only the last stage highlighted.',
    left: 'Civil engineering → Data → AI → Building products',
    right: '06 stages',
  },
  quality: {
    alt: 'Cover diagram: a data quality workflow in four stages. Check and find are deterministic, assist is AI assistance and review is a human decision, each drawn in a different treatment.',
    left: 'Deterministic → AI assistance → Human review',
    right: '04 stages',
  },
};

const zoneLabel = { deterministic: 'Deterministic', ai: 'AI assistance', human: 'Human review' } as const;

function ZoneSwatch({ zone }: { zone: NonNullable<CoverStage['zone']> }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block h-2 w-2 shrink-0',
        zone === 'deterministic' && 'border border-muted',
        zone === 'ai' && 'rounded-full bg-lime',
        zone === 'human' && 'bg-ink',
      )}
    />
  );
}

/** The article cover: one row of stages on desktop, a grid on phones. */
export function JournalCoverFigure({ cover, className }: { cover: JournalCover; className?: string }) {
  const stages = coverStages[cover];
  const text = coverText[cover];
  const six = stages.length === 6;
  return (
    <div
      data-surface="dark"
      role="img"
      aria-label={text.alt}
      className={cn('bg-tech-grid border border-line bg-surface text-ink', className)}
    >
      <div aria-hidden="true" className="label flex items-start justify-between gap-4 border-b border-line px-3 py-3 text-muted sm:px-5">
        <span>{text.left}</span>
        <span className="shrink-0">{text.right}</span>
      </div>
      <div aria-hidden="true" className={cn('grid', six ? 'grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 lg:grid-cols-4')}>
        {stages.map((s, i) => {
          const last = i === stages.length - 1;
          const perRow = six ? 3 : 2;
          return (
            <div
              key={s.key}
              className={cn(
                'relative flex flex-col justify-between gap-4 border-line p-3 sm:gap-6 sm:p-5',
                // Rules between cells only: the frame already has a border.
                (i + 1) % perRow !== 0 && 'border-r',
                i < stages.length - perRow && 'border-b lg:border-b-0',
                !last && 'lg:border-r',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cn('label', last && !s.zone ? 'text-lime' : 'text-muted')}>{String(i + 1).padStart(2, '0')}</span>
                {!last && <span className="label text-muted">→</span>}
              </div>
              <div className={cn('flex min-h-[3rem] items-center sm:min-h-[4.5rem]', !s.zone && !last && 'text-ink/80')}>{glyphs[s.key]}</div>
              <div className="space-y-1.5">
                <p className="label text-ink max-sm:tracking-[0.06em]">{s.label}</p>
                {s.zone && (
                  <p className="label flex items-center gap-2 text-muted">
                    <ZoneSwatch zone={s.zone} />
                    {zoneLabel[s.zone]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Inline figures ───────────────────────────────────────────────────────────────────────────────

type PathStage = { name: string; anchor: string; when?: string };

// Dates come only from roles, study and credentials on this site. Conceptual stages carry none.
const careerPath: PathStage[] = [
  { name: 'Civil engineering', anchor: 'Bachelor (Hons) Civil Engineering at UPM, then site, BIM and geotechnical roles', when: '2017 to 2024' },
  { name: 'Engineering data', anchor: 'Time-series readings from engineering equipment at G&P Geotechnic, some datasets in the millions', when: '2022 to 2024' },
  { name: 'Automation', anchor: 'VBA for Excel calculations, Python for engineering and data workflows. Still part of the work.' },
  { name: 'Analytics', anchor: 'DP-900, Certified Data Analyst Associate, PCEP and PL-300 in 2023, then Data Analyst at EISmartwork', when: '2023 to 2025' },
  { name: 'Data engineering', anchor: 'AI Data Engineer at AEM Energy Solutions: migration, automation and data quality', when: '2025 to now' },
  { name: 'AI', anchor: 'Master of Science in Artificial Intelligence at UMPSA, then agentic workflows at work', when: '2024 to now' },
  { name: 'Product building', anchor: 'FORMA, VSB, Sepang Vision Lab and BALANG', when: 'Now' },
];

function CareerPath() {
  return (
    <ol className="relative">
      {/* One continuous rule behind every stage: the line is the point of the figure. */}
      <span aria-hidden="true" className="absolute bottom-6 left-[0.6875rem] top-6 w-px bg-ink/30" />
      {careerPath.map((s, i) => {
        const last = i === careerPath.length - 1;
        return (
          <li key={s.name} className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 py-3.5 sm:grid-cols-[1.5rem_11rem_minmax(0,1fr)_7rem] sm:gap-x-6">
            <span aria-hidden="true" className="flex h-6 items-center justify-center">
              <span className={cn('h-3 w-3 rounded-full border border-ink', last ? 'bg-lime' : 'bg-surface')} />
            </span>
            <p className="font-semibold leading-6">
              <span className="label mr-2 font-normal text-muted">{String(i + 1).padStart(2, '0')}</span>
              {s.name}
            </p>
            <p className="col-start-2 text-[0.9375rem] leading-relaxed text-muted sm:col-start-3">{s.anchor}</p>
            <p className="label col-start-2 mt-1 text-muted sm:col-start-4 sm:row-start-1 sm:mt-0 sm:pt-1 sm:text-right">
              {s.when ?? <span className="sr-only">No date for this stage</span>}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

type BoundaryNode = { title: string; detail: string };
const boundary: { zone: keyof typeof zoneLabel; nodes: BoundaryNode[] }[] = [
  {
    zone: 'deterministic',
    nodes: [
      { title: 'Data', detail: 'A dataset uploaded into a project.' },
      { title: 'Quality assessment', detail: 'Completeness, uniqueness, validity and consistency rules, run the same way every time.' },
      { title: 'Findings', detail: 'A score per dimension and the exact rows and cells that failed.' },
    ],
  },
  {
    zone: 'ai',
    nodes: [{ title: 'AI assistance', detail: 'Suggests rules, summarises findings and proposes fixes with a reason and a confidence.' }],
  },
  {
    zone: 'human',
    nodes: [
      { title: 'Human review', detail: 'Accept, modify or reject each suggestion. Owners decide, and a rejection needs a reason.' },
      { title: 'Approved result', detail: 'A corrected version, with a record of how every value changed.' },
    ],
  },
];

// Running step numbers across zones (01 to 06).
const boundaryStart = boundary.map((_, zi) => boundary.slice(0, zi).reduce((sum, z) => sum + z.nodes.length, 0));

function QualityBoundary() {
  return (
    <div className="space-y-2">
      {boundary.map((z, zi) => (
        <div key={z.zone}>
          {zi > 0 && (
            <p aria-hidden="true" className="label py-1 text-center text-muted sm:pl-[10.5rem] sm:text-left">
              ↓
            </p>
          )}
          <section
            aria-label={zoneLabel[z.zone]}
            className={cn(
              'grid gap-3 border p-3 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-4',
              z.zone === 'deterministic' && 'border-line',
              // Lime is a signal, never a field: a bar down the side marks the AI zone.
              z.zone === 'ai' && 'border-ink shadow-[inset_4px_0_0_rgb(var(--lime))]',
              z.zone === 'human' && 'border-2 border-ink',
            )}
          >
            <p className={cn('label flex items-start gap-2 pt-1 text-ink', z.zone === 'ai' && 'pl-2')}>
              <span className="pt-[0.2rem]">
                <ZoneSwatch zone={z.zone} />
              </span>
              {zoneLabel[z.zone]}
            </p>
            <ol className={cn('grid gap-2', z.nodes.length === 3 && 'md:grid-cols-3', z.nodes.length === 2 && 'md:grid-cols-2')}>
              {z.nodes.map((node, ni) => {
                const n = boundaryStart[zi] + ni + 1;
                return (
                  <li key={node.title} className="border border-line bg-surface p-3">
                    <p className="flex items-baseline gap-2">
                      <span className="label text-muted">{String(n).padStart(2, '0')}</span>
                      <span className="font-semibold leading-tight">{node.title}</span>
                    </p>
                    <p className="mt-1.5 text-sm leading-snug text-muted">{node.detail}</p>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      ))}
    </div>
  );
}

const figureBody: Record<JournalFigure, () => ReactNode> = {
  'career-path': CareerPath,
  'quality-boundary': QualityBoundary,
};

/** An inline figure: label, the drawing (real text, so it reads without the caption), and the caption. */
export function JournalFigureBlock({ figure, caption, index }: { figure: JournalFigure; caption: string; index: number }) {
  const Body = figureBody[figure];
  return (
    <figure data-reveal className="journal-wide journal-figure border-y border-ink py-5">
      <p className="label mb-4 text-muted">
        Fig. {index} / {journalFigures[figure]}
      </p>
      <Body />
      {caption && <figcaption className="mt-5 border-t border-line pt-4 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
