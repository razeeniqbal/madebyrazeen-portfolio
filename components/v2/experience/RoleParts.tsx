import Link from 'next/link';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { FlowDiagram } from '@/components/v2/diagram/FlowDiagram';
import { paragraphs, roleSpan, type Role, type SelectedWork } from '@/content/experience';
import { cn } from '@/lib/utils';

const statusLabel: Record<NonNullable<SelectedWork['status']>, string> = {
  active: 'Active',
  'under-construction': 'Under construction',
  'proof-of-concept': 'Proof of concept',
  completed: 'Completed',
  archived: 'Archived',
};

/** Facts line for a role: dates, employment type, work mode, location. Missing values are left out. */
export function RoleFacts({ role, className }: { role: Role; className?: string }) {
  const facts = [
    { k: 'Dates', v: roleSpan(role) },
    role.datesConfirmed && role.employmentType ? { k: 'Type', v: role.employmentType.charAt(0).toUpperCase() + role.employmentType.slice(1) } : null,
    role.workMode ? { k: 'Mode', v: role.workMode } : null,
    role.location ? { k: 'Location', v: role.location.split(',')[0] } : null,
  ].filter((f): f is { k: string; v: string } => Boolean(f && f.v));
  return (
    <dl className={cn('flex flex-wrap gap-x-8 gap-y-3', className)}>
      {facts.map((f) => (
        <div key={f.k}>
          <dt className="label text-muted">{f.k}</dt>
          <dd className="mt-1 text-sm">{f.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Role narrative: the first paragraph leads, the rest follow at reading size. */
export function Narrative({ role, className }: { role: Role; className?: string }) {
  return (
    <div className={cn('max-w-prose space-y-4', className)}>
      {role.narrative.map((p, i) => (
        <p key={p} className={i === 0 ? 'text-lead' : 'text-muted'}>
          {p}
        </p>
      ))}
    </div>
  );
}

/** Context · type · status · scale, as technical labels. */
function WorkLabels({ work }: { work: SelectedWork }) {
  const labels = [work.context, work.type, work.status && statusLabel[work.status], work.scale].filter(Boolean) as string[];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {labels.map((l) => (
        <li key={l} className="label text-muted">
          {l}
        </li>
      ))}
    </ul>
  );
}

function WorkFacts({ work }: { work: SelectedWork }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-4 text-sm">
      {work.technologies.length > 0 && (
        <div className="col-span-2">
          <dt className="label text-muted">Technology</dt>
          <dd className="mt-1">{work.technologies.join(' · ')}</dd>
        </div>
      )}
      <div>
        <dt className="label text-muted">AI</dt>
        <dd className="mt-1">{work.aiUsed ? 'Yes' : 'No'}</dd>
      </div>
      {work.recognition && (
        <div>
          <dt className="label text-muted">Recognition</dt>
          <dd className="mt-1">{work.recognition}</dd>
        </div>
      )}
    </dl>
  );
}

/** A featured system: heading and facts, the description, then its flow across the full width. */
export function FeaturedWork({ work, number }: { work: SelectedWork; number: string }) {
  return (
    <article id={work.id} className="col-span-full grid scroll-mt-20 grid-cols-4 gap-x-4 gap-y-8 border-t border-line pt-10 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6">
      <header className="col-span-4 md:col-span-8 lg:col-span-5">
        <TechnicalLabel as="p">Work / {number}</TechnicalLabel>
        <h4 className="mt-3 text-display-md">{work.name}</h4>
        <div className="mt-4">
          <WorkLabels work={work} />
        </div>
        {work.facets.length > 0 && (
          <div className="mt-6">
            <p className="label text-muted">Core dimensions</p>
            <ul className="mt-2 grid grid-cols-2 border-l border-t border-line">
              {work.facets.map((f) => (
                <li key={f} className="border-b border-r border-line px-3 py-2 text-sm font-semibold">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
      <div className="col-span-4 space-y-6 md:col-span-8 lg:col-span-6 lg:col-start-7">
        <div className="max-w-prose space-y-4">
          {paragraphs(work.description).map((p, i) => (
            <p key={p} className={i === 0 ? 'text-lead' : 'text-muted'}>
              {p}
            </p>
          ))}
        </div>
        <WorkFacts work={work} />
        {work.projectSlug && (
          <Link href={`/projects/${work.projectSlug}`} className="hit label inline-block border-b border-current pb-1 hover:text-signal">
            {work.name} case study <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      {work.flow.length > 0 && (
        <figure className="col-span-full">
          <figcaption className="label mb-4 text-muted">Flow · {work.flow.length} steps</figcaption>
          <FlowDiagram
            label={`${work.name}: ${work.flow.map((f) => f.label).join(', then ')}`}
            nodes={work.flow.map((f, i) => ({ type: f.type, title: f.label, active: i === work.flow.length - 1 }))}
            horizontalFrom={work.flow.length > 5 ? 'xl' : 'lg'}
          />
        </figure>
      )}
    </article>
  );
}

/** Supporting work: one compact row, no diagram. */
export function SupportingWork({ work, className }: { work: SelectedWork; className?: string }) {
  return (
    <article id={work.id} className={cn('scroll-mt-20 border-t border-line pt-6', className)}>
      <h4 className="text-display-sm">{work.name}</h4>
      <div className="mt-3">
        <WorkLabels work={work} />
      </div>
      <div className="mt-4 max-w-prose space-y-3 text-muted">
        {paragraphs(work.description).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <p className="label mt-4 text-muted">
        {[work.technologies.join(' · '), `AI · ${work.aiUsed ? 'Yes' : 'No'}`].filter(Boolean).join('   /   ')}
      </p>
    </article>
  );
}

/** A small build: deliberately lighter, a short break in the seriousness. */
export function SmallBuild({ work }: { work: SelectedWork }) {
  return (
    <article id={work.id} data-surface="light" className="scroll-mt-20 bg-surface p-6 text-ink md:p-8">
      <TechnicalLabel as="p" marker="+">
        Small build · {work.name}
      </TechnicalLabel>
      {work.headline && <h4 className="mt-4 max-w-[22ch] text-display-sm">{work.headline}</h4>}
      <div className="mt-4 max-w-prose space-y-2 text-muted">
        {paragraphs(work.description).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {work.projectSlug && (
        <Link href={`/projects/${work.projectSlug}`} className="label mt-5 inline-block border-b border-current pb-1">
          {work.name} <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}

/** A role progression as a vertical ladder (G&P), each step numbered; the last step is the destination. */
export function ProgressionLadder({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol aria-label={label} className="border-l border-line">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={s} className="relative pb-5 pl-6 last:pb-0">
            <span
              aria-hidden="true"
              className={cn('absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full', last ? 'bg-lime ring-1 ring-ink' : 'border border-muted bg-surface')}
            />
            <span className="label mr-3 text-muted">{String(i + 1).padStart(2, '0')}</span>
            <span className={cn('uppercase', last ? 'text-display-sm' : 'text-lg font-semibold tracking-tight')}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}
