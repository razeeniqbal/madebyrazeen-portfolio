import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { engagementWhen, modeLabel, type TrainerEngagement } from '@/content/trainer';
import { cn } from '@/lib/utils';

interface EngagementProps {
  engagement: TrainerEngagement;
  /** "001" */
  number: string;
}

/** Facts that exist on the record, in a fixed order. Missing values are left out, never shown as placeholders. */
function facts(e: TrainerEngagement) {
  return [
    { label: 'Date', value: engagementWhen(e) },
    { label: 'Role', value: e.role },
    { label: 'Organization', value: e.organization },
    { label: 'With', value: e.partners.join(', ') },
    { label: 'Format', value: e.format },
    { label: 'Audience', value: e.audience },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));
}

function Facts({ e, wide }: { e: TrainerEngagement; wide?: boolean }) {
  return (
    <dl className={cn('grid grid-cols-2 gap-x-6 gap-y-4', wide && 'lg:grid-cols-3')}>
      {facts(e).map((f) => (
        <div key={f.label} className={cn('border-t border-line pt-3', f.value.length > 40 && 'col-span-2', wide && f.value.length > 40 && 'lg:col-span-3')}>
          <dt className="label text-muted">{f.label}</dt>
          <dd className="mt-1 [overflow-wrap:anywhere]">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Structured training: the primary example. The programme's shape (audience, concept, hands-on,
 * application) leads; the curriculum follows as a few themes rather than a wall of topics.
 */
export function FeaturedEngagement({ engagement: e, number }: EngagementProps) {
  return (
    <article id={e.slug} aria-labelledby={`${e.slug}-title`} className="scroll-mt-24 border border-line bg-raised/40 p-5 md:p-8 lg:p-10">
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <TechnicalLabel as="p" marker={`${number} /`}>
            {modeLabel[e.mode]}
          </TechnicalLabel>
          <h3 id={`${e.slug}-title`} className="mt-4 text-display-md [overflow-wrap:anywhere]">
            {e.title}
          </h3>
          <p className="mt-5 max-w-prose text-lead text-muted">{e.summary}</p>
        </header>
        <div className="lg:col-span-7">
          <Facts e={e} />
        </div>
      </div>

      {e.journey.length > 0 && (
        <ol aria-label="How the programme was shaped" className="mt-10 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {e.journey.map((s, i) => (
            <li key={s.label} className={cn('border-b border-line py-5 sm:pr-6 lg:border-b-0', i > 0 && 'lg:border-l lg:pl-6')}>
              <p className="flex items-center gap-3">
                <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-display-sm uppercase">{s.label}</span>
                {i < e.journey.length - 1 && (
                  <span aria-hidden="true" className="label ml-auto hidden text-muted lg:inline">
                    →
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm text-muted">{s.detail}</p>
            </li>
          ))}
        </ol>
      )}

      {e.topicGroups.length > 0 && (
        <div className="mt-10">
          <TechnicalLabel as="p" marker="//">
            Curriculum · {e.topics.length} topics in {e.topicGroups.length} themes
          </TechnicalLabel>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
            {e.topicGroups.map((g) => (
              <div key={g.label} className="border-t border-line pt-3">
                <dt className="font-semibold">{g.label}</dt>
                <dd className="mt-1 text-sm text-muted">{g.topics.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </article>
  );
}

/**
 * Lighter engagements: technical sharing and internal knowledge sharing. Same facts, less weight:
 * the topics read as a short list, not a matrix.
 */
export function CompactEngagement({ engagement: e, number }: EngagementProps) {
  const internal = e.mode === 'internal-knowledge-sharing';
  return (
    <article id={e.slug} aria-labelledby={`${e.slug}-title`} className="scroll-mt-24 border-t border-line pt-6">
      <TechnicalLabel as="p" marker={`${number} /`}>
        {modeLabel[e.mode]}
      </TechnicalLabel>
      <h3 id={`${e.slug}-title`} className="mt-3 text-display-sm [overflow-wrap:anywhere]">
        {e.title}
      </h3>
      <p className="mt-3 max-w-prose text-muted">{e.summary}</p>
      <div className="mt-5">
        <Facts e={e} />
      </div>
      {e.topics.length > 0 && (
        <div className="mt-5">
          <p className="label text-muted">{internal ? `Sessions · ${e.topics.length} topics` : 'Topics'}</p>
          <ul className={cn('mt-2 text-sm', internal ? 'space-y-1.5' : 'flex flex-wrap gap-x-4 gap-y-1')}>
            {e.topics.map((t) => (
              <li key={t} className={cn(internal && 'flex gap-3')}>
                {internal && <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ink" />}
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
