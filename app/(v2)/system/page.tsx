import type { Metadata } from 'next';
import Image from 'next/image';
import { Wordmark } from '@/components/v2/identity/Wordmark';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { assets, botMoods, type MiniRazeenPose } from '@/lib/assets';
import { BotAvatar } from '@/components/v2/chat/BotAvatar';
import { profile } from '@/content/profile';
import { getProjects, type ProjectTier } from '@/content/projects';

// M01 review page: the V2 foundation rendered on real content. Not linked or indexed.
export const metadata: Metadata = {
  title: 'System · razeeniqbal.',
  robots: { index: false, follow: false },
};

const palette = [
  { name: 'Carbon Black', hex: '#090909', className: 'bg-carbon', note: 'Dark sections' },
  { name: 'Warm White', hex: '#F3F1EB', className: 'bg-warm', note: 'Light sections' },
  { name: 'Secondary Grey', hex: '#9A9A94', className: 'bg-grey', note: 'Muted text on dark only' },
  { name: 'Signal Lime', hex: '#D8FF3E', className: 'bg-lime', note: 'Signal, never a field' },
];

const poses: MiniRazeenPose[] = ['front', 'working', 'learning', 'running', 'exploring', 'thinking', 'happy', 'laptop'];

const tierLabel: Record<ProjectTier, string> = {
  flagship: 'Flagship',
  featured: 'Featured',
  standard: 'Standard',
  archive: 'Earlier work',
};

function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <div className="col-span-full mb-12 flex items-baseline gap-4 border-t border-line pt-4">
      <TechnicalLabel marker={index}>{title}</TechnicalLabel>
    </div>
  );
}

export default function SystemPage() {
  const projects = getProjects();

  return (
    <main>
      {/* ── Identity ─────────────────────────────────────────── */}
      <Section surface="dark" grid className="!pt-16">
        <div className="page-grid gap-y-16">
          <div className="col-span-full flex items-center justify-between">
            <TechnicalLabel marker="//">V2 System · M01 Foundation</TechnicalLabel>
            <TechnicalLabel className="hidden md:inline">
              {profile.coordinates.label} &nbsp; {profile.coordinates.lat} {profile.coordinates.lng}
            </TechnicalLabel>
          </div>

          <div className="col-span-full lg:col-span-7">
            <Wordmark withUmbrella className="text-display-lg" />
            <h1 className="mt-16 text-display-xl uppercase">
              {profile.statement.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-prose text-lead text-muted">{profile.supporting}</p>
          </div>

          <figure className="col-span-full md:col-span-4 lg:col-span-5 lg:self-end">
            <Image
              src={assets.identity.hero.src}
              width={assets.identity.hero.width}
              height={assets.identity.hero.height}
              alt={assets.identity.hero.alt}
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              className="w-full grayscale"
              priority
            />
            <figcaption className="mt-3 flex justify-between">
              <TechnicalLabel>Real Razeen · Monochrome treatment</TechnicalLabel>
              <TechnicalLabel>800 × 800 source</TechnicalLabel>
            </figcaption>
          </figure>

          <div className="col-span-full flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-6">
            {profile.loops.philosophy.map((step, i) => (
              <span key={step} className="label flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={i === profile.loops.philosophy.length - 1 ? 'h-2 w-2 rounded-full bg-lime' : 'h-2 w-2 rounded-full border border-muted'}
                />
                {step}
                {i < profile.loops.philosophy.length - 1 && <span className="text-muted">→</span>}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Palette ──────────────────────────────────────────── */}
      <Section surface="light">
        <div className="page-grid gap-y-8">
          <SectionHead index="01" title="Palette" />
          {palette.map((c) => (
            <div key={c.hex} className="col-span-2 md:col-span-2 lg:col-span-3">
              <div className={`${c.className} aspect-[4/3] border border-line`} />
              <p className="mt-3 font-semibold">{c.name}</p>
              <TechnicalLabel as="p">{c.hex}</TechnicalLabel>
              <p className="mt-1 text-sm text-muted">{c.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Typography ───────────────────────────────────────── */}
      <Section surface="light" className="!pt-0">
        <div className="page-grid gap-y-10">
          <SectionHead index="02" title="Typography" />
          <div className="col-span-full lg:col-span-8 space-y-8">
            <div>
              <TechnicalLabel as="p" className="mb-2">Display XL · Inter 800</TechnicalLabel>
              <p className="text-display-xl">I turn ideas</p>
            </div>
            <div>
              <TechnicalLabel as="p" className="mb-2">Display LG</TechnicalLabel>
              <p className="text-display-lg">
                Built through curiosity
                <span aria-hidden="true" className="ml-[0.05em] inline-block h-[0.2em] w-[0.2em] rounded-full bg-lime" />
              </p>
            </div>
            <div>
              <TechnicalLabel as="p" className="mb-2">Display MD</TechnicalLabel>
              <p className="text-display-md">Sepang Vision Lab</p>
            </div>
            <div>
              <TechnicalLabel as="p" className="mb-2">Lead · Inter 400</TechnicalLabel>
              <p className="max-w-prose text-lead">{profile.supporting}</p>
            </div>
            <div>
              <TechnicalLabel as="p" className="mb-2">Body · Inter 400</TechnicalLabel>
              <p className="max-w-prose text-muted">
                Notes should be visually quieter than project pages. Reading experience takes priority, so body copy
                sits at 16px with a comfortable measure of roughly 65 characters.
              </p>
            </div>
          </div>
          <div className="col-span-full lg:col-span-4 space-y-3 lg:border-l lg:border-line lg:pl-8">
            <TechnicalLabel as="p" className="mb-4">Technical · JetBrains Mono</TechnicalLabel>
            <TechnicalLabel as="p" marker="//">Semantic similarity</TechnicalLabel>
            <TechnicalLabel as="p" marker="01">Telemetry</TechnicalLabel>
            <TechnicalLabel as="p" marker="+">Node active</TechnicalLabel>
            <TechnicalLabel as="p" marker="×">Data × Simulation × Intelligence</TechnicalLabel>
            <TechnicalLabel as="p">Project / 004 &nbsp;·&nbsp; 2026</TechnicalLabel>
          </div>
        </div>
      </Section>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <Section surface="dark">
        <div className="page-grid gap-y-4">
          <SectionHead index="03" title="Grid · 4 / 8 / 12 columns" />
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-24 border border-line bg-raised ${i >= 4 ? 'hidden md:block' : ''} ${i >= 8 ? 'md:hidden lg:block' : ''}`}
            >
              <TechnicalLabel className="block p-2">{String(i + 1).padStart(2, '0')}</TechnicalLabel>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Mini Razeen ──────────────────────────────────────── */}
      <Section surface="dark" className="!pt-0">
        <div className="page-grid gap-y-10">
          <SectionHead index="04" title="Mini Razeen · interim cut-outs" />
          <div className="col-span-full flex flex-wrap items-end gap-x-10 gap-y-8">
            {poses.map((pose) => (
              <div key={pose} className="flex flex-col items-center gap-3">
                <MiniRazeen pose={pose} height={150} />
                <TechnicalLabel>{pose}</TechnicalLabel>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Chat mascot moods ────────────────────────────────── */}
      <Section surface="dark" className="!pt-0">
        <div className="page-grid gap-y-10">
          <SectionHead index="04b" title="Chat mascot · moods (animated)" />
          <div className="col-span-full flex flex-wrap items-end gap-x-10 gap-y-8">
            {botMoods.map((m) => (
              <div key={m} className="flex flex-col items-center gap-3">
                <BotAvatar mood={m} variant="full" size={180} />
                <BotAvatar mood={m} size={62} />
                <TechnicalLabel>{m}</TechnicalLabel>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Photography ──────────────────────────────────────── */}
      <Section surface="light">
        <div className="page-grid gap-y-8">
          <SectionHead index="05" title="Photography · real Razeen" />
          {[
            { a: assets.career.collaboration, span: 'col-span-full lg:col-span-8', label: 'Career / Collaboration' },
            { a: assets.running.action, span: 'col-span-2 md:col-span-4 lg:col-span-4', label: 'Running / Action' },
            { a: assets.career.cursorAnthropic, span: 'col-span-2 md:col-span-4 lg:col-span-4', label: 'Career / Hackathon' },
            { a: assets.running.race, span: 'col-span-2 md:col-span-4 lg:col-span-4', label: 'Running / Race' },
            { a: assets.identity.graduation, span: 'col-span-2 md:col-span-4 lg:col-span-4', label: 'Milestone / Graduation' },
          ].map(({ a, span, label }) => (
            <figure key={a.src} className={span}>
              <Image
                src={a.src}
                width={a.width}
                height={a.height}
                alt={a.alt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full max-h-[36rem] w-full object-cover"
              />
              <figcaption className="mt-2">
                <TechnicalLabel>{label}</TechnicalLabel>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ── Content: projects by tier ────────────────────────── */}
      <Section surface="dark">
        <div className="page-grid">
          <SectionHead index="06" title={`Content · ${projects.length} published projects`} />
          <ol className="col-span-full">
            {projects.map((p) => (
              <li
                key={p.slug}
                className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-1 border-t border-line py-4 md:grid-cols-[4rem_1fr_8rem_8rem]"
              >
                <TechnicalLabel>{p.number}</TechnicalLabel>
                <span className={p.tier === 'flagship' ? 'text-display-sm' : 'font-semibold'}>{p.title}</span>
                <TechnicalLabel className="col-start-2 md:col-start-auto">
                  {p.tier === 'flagship' && <span aria-hidden="true" className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lime align-middle" />}
                  {tierLabel[p.tier]}
                </TechnicalLabel>
                <TechnicalLabel className="col-start-2 md:col-start-auto">{p.year}</TechnicalLabel>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </main>
  );
}
