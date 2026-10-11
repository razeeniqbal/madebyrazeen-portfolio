'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TopicArea, TopicMapData } from '@/content/trainer';

/**
 * A structured programme's curriculum, one theme at a time: the rail shows where the theme sits in the
 * programme, the panel shows its topics. Themes keep the order of the record; no day split is invented.
 */
export function CurriculumExplorer({ groups }: { groups: { label: string; topics: string[] }[] }) {
  const [active, setActive] = useState(0);
  const g = groups[active];
  const total = groups.reduce((n, x) => n + x.topics.length, 0);
  return (
    <div>
      <div role="tablist" aria-label="Curriculum themes" className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-5">
        {groups.map((x, i) => (
          <button
            key={x.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn('flex flex-col items-start gap-2 bg-surface p-3 text-left transition-colors', i === active ? 'bg-ink text-surface' : 'hover:bg-raised')}
          >
            <span className={cn('label', i === active ? 'text-surface/70' : 'text-muted')}>
              {String(i + 1).padStart(2, '0')} · {x.topics.length}
            </span>
            <span className="font-semibold leading-tight">{x.label}</span>
            <span aria-hidden="true" className={cn('h-1 w-full', i <= active ? 'bg-lime' : 'bg-line')} />
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={g.label} className="flex flex-wrap items-center gap-2 border-x border-b border-line p-4">
        {g.topics.map((t) => (
          <span key={t} className="border border-line px-3 py-1.5 text-sm">
            {t}
          </span>
        ))}
        <span className="label ml-auto text-muted">
          {g.topics.length} of {total} topics
        </span>
      </div>
    </div>
  );
}

const areas: TopicArea[] = ['data', 'cloud', 'ai', 'dev'];
const areaName: Record<TopicArea, string> = { data: 'Data', cloud: 'Cloud', ai: 'AI', dev: 'Dev tools' };

/**
 * Everything taught, in one place. Pick an area to see its topics and which sessions covered it; pick a
 * session to see only its topics. Both filters can be cleared.
 */
export function TopicMap({ data }: { data: TopicMapData }) {
  const [area, setArea] = useState<TopicArea | null>(null);
  const [session, setSession] = useState<string | null>(null);

  const shown = data.topics.filter((t) => (!area || t.area === area) && (!session || t.engagements.includes(session)));
  const covers = (slug: string) => data.topics.some((t) => t.engagements.includes(slug) && (!area || t.area === area));
  const count = (a: TopicArea) => data.topics.filter((t) => t.area === a && (!session || t.engagements.includes(session))).length;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Sessions: who was in the room */}
      <ol className="space-y-2 lg:col-span-4">
        {data.engagements.map((e) => {
          const on = session === e.slug;
          const lit = covers(e.slug);
          return (
            <li key={e.slug}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setSession(on ? null : e.slug)}
                className={cn(
                  'block w-full border p-4 text-left transition-[opacity,border-color,background-color]',
                  on ? 'border-ink bg-ink text-surface' : 'border-line hover:border-ink',
                  !lit && !on && 'opacity-35',
                )}
              >
                <span className={cn('label flex justify-between gap-3', on ? 'text-surface/70' : 'text-muted')}>
                  <span>{e.audience}</span>
                  {e.when && <span>{e.when}</span>}
                </span>
                <span className="mt-2 block font-semibold leading-tight">{e.title}</span>
                <span className={cn('label mt-2 block', on ? 'text-surface/70' : 'text-muted')}>{e.mode}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Areas and topics */}
      <div className="lg:col-span-8">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={area === null}
            onClick={() => setArea(null)}
            className={cn('label border px-3 py-2 transition-colors', area === null ? 'border-ink bg-ink text-surface' : 'border-line hover:border-ink')}
          >
            All · {session ? data.topics.filter((t) => t.engagements.includes(session)).length : data.topics.length}
          </button>
          {areas.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={area === a}
              onClick={() => setArea(area === a ? null : a)}
              disabled={count(a) === 0}
              className={cn(
                'label flex items-center gap-2 border px-3 py-2 transition-colors disabled:opacity-30',
                area === a ? 'border-ink bg-ink text-surface' : 'border-line hover:border-ink',
              )}
            >
              {a === 'ai' && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />}
              {areaName[a]} · {count(a)}
            </button>
          ))}
          {(area || session) && (
            <button type="button" onClick={() => {
                setArea(null);
                setSession(null);
              }} className="label ml-auto border-b border-current text-muted hover:text-ink">
              Clear
            </button>
          )}
        </div>
        <ul aria-live="polite" className="mt-5 flex flex-wrap gap-2">
          {shown.map((t) => (
            <li key={t.topic} data-reveal className="flex items-center gap-2 border border-line px-3 py-1.5 text-sm">
              <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', t.area === 'ai' ? 'bg-lime ring-1 ring-ink' : 'border border-muted')} />
              {t.topic}
              {t.engagements.length > 1 && <span className="label text-muted">×{t.engagements.length}</span>}
            </li>
          ))}
        </ul>
        <p className="label mt-4 text-muted">
          {shown.length} topic{shown.length === 1 ? '' : 's'}
          {area ? ` in ${areaName[area]}` : ''}
          {session ? ` · ${data.engagements.find((e) => e.slug === session)?.title}` : ''}
        </p>
      </div>
    </div>
  );
}
