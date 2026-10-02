import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { engagementWhen, type TrainerEngagement } from '@/content/trainer';

interface EngagementEntryProps {
  engagement: TrainerEngagement;
  /** "001" */
  number: string;
}

/**
 * One training or speaking engagement as a technical record: index, title, facts, summary, topic matrix.
 * Every field is optional except the title; a missing value is left out, never shown as a placeholder.
 */
export function EngagementEntry({ engagement: e, number }: EngagementEntryProps) {
  const facts = [
    { label: 'Date', value: engagementWhen(e) },
    { label: 'Role', value: e.role },
    { label: 'Organization', value: e.organization },
    { label: 'With', value: e.partners.join(', ') },
    { label: 'Format', value: e.format },
    { label: 'Audience', value: e.audience },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <article id={e.slug} className="grid scroll-mt-24 grid-cols-4 gap-x-4 gap-y-8 border-t border-line py-12 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6">
      <header className="col-span-4 md:col-span-8 lg:col-span-5">
        <TechnicalLabel as="p">Engagement / {number}</TechnicalLabel>
        <h3 className="mt-4 text-display-md">{e.title}</h3>
        {e.summary && <p className="mt-5 max-w-prose text-muted">{e.summary}</p>}
      </header>

      <dl className="col-span-4 grid grid-cols-2 content-start gap-x-6 gap-y-5 md:col-span-8 lg:col-span-6 lg:col-start-7">
        {facts.map((f) => (
          <div key={f.label} className={f.value.length > 40 ? 'col-span-2 border-t border-line pt-3' : 'border-t border-line pt-3'}>
            <dt className="label text-muted">{f.label}</dt>
            <dd className="mt-1">{f.value}</dd>
          </div>
        ))}
      </dl>

      {e.topics.length > 0 && (
        <div className="col-span-4 md:col-span-8 lg:col-span-11 lg:col-start-2">
          <TechnicalLabel as="p" marker="//">
            Topics · {e.topics.length}
          </TechnicalLabel>
          {/* Topic matrix: a hairline grid, read across. */}
          <ul className="mt-4 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {e.topics.map((t, i) => (
              <li key={t} className="flex gap-3 border-b border-r border-line px-3 py-2.5 text-sm">
                <span className="label pt-0.5 text-muted">{String(i + 1).padStart(2, '0')}</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
