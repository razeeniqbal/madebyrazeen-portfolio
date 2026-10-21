import Link from 'next/link';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { todayMYT, type LangkahDigest, type PortfolioDigest, type TrackerDigest } from '@/lib/admin/digest';
import { cn } from '@/lib/utils';

/** The admin hub once signed in: one panel per app with the numbers worth knowing before opening it. */

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat('en-MY', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

const hours = (minutes: number) => `${(minutes / 60).toFixed(minutes % 60 ? 1 : 0)} h`;

const runTime = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m} min`;
};

function Panel({
  number,
  name,
  href,
  children,
}: {
  number: string;
  name: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col bg-surface p-6 md:p-8" aria-label={name}>
      <header className="flex items-baseline justify-between gap-4">
        <TechnicalLabel marker={number}>{name}</TechnicalLabel>
        <a href={href} className="label group inline-flex items-center gap-2 hover:text-lime">
          Open
          <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            ↗
          </span>
        </a>
      </header>
      <div className="mt-8 flex flex-1 flex-col gap-8">{children}</div>
    </section>
  );
}

function Big({ value, unit, caption }: { value: React.ReactNode; unit?: string; caption: string }) {
  return (
    <div>
      <p className="text-display-md tabular-nums">
        {value}
        {unit && <span className="ml-1 text-2xl text-muted">{unit}</span>}
      </p>
      <p className="label mt-2 text-muted">{caption}</p>
    </div>
  );
}

function Facts({ items }: { items: { label: string; value: React.ReactNode; alert?: boolean }[] }) {
  return (
    <dl className="grid grid-cols-3 gap-4 border-t border-line pt-4">
      {items.map((f) => (
        <div key={f.label}>
          <dt className="label text-muted">{f.label}</dt>
          <dd className={cn('mt-1 text-lg font-semibold tabular-nums', f.alert && 'text-signal')}>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Bar({ label, percent, note }: { label: React.ReactNode; percent: number; note?: string }) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate">{label}</span>
        <span className="label tabular-nums text-muted">
          {note && <span className="mr-2">{note}</span>}
          {Math.round(percent)}%
        </span>
      </div>
      <div className="mt-1.5 h-1 w-full bg-line" aria-hidden="true">
        <div className="h-full bg-lime" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
    </li>
  );
}

function List({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-auto">
      <TechnicalLabel as="h3" className="mb-3">
        {title}
      </TechnicalLabel>
      <ul className="divide-y divide-line border-y border-line">{children}</ul>
    </div>
  );
}

function Unavailable({ name }: { name: string }) {
  return (
    <p className="text-muted">
      {name} did not answer just now. Open it to check, or reload this page in a moment.
    </p>
  );
}

export function LangkahPanel({ data, href }: { data: LangkahDigest | null; href: string }) {
  const today = todayMYT();
  return (
    <Panel number="02" name="Langkah" href={href}>
      {!data ? (
        <Unavailable name="Langkah" />
      ) : (
        <>
          <Big value={Math.round(data.overall)} unit="%" caption="Overall progress, from cards" />
          <Facts
            items={[
              { label: 'Late', value: data.lateCount, alert: data.lateCount > 0 },
              { label: 'Due soon', value: data.dueThisWeek },
              { label: 'Active', value: data.cards.doing + data.cards.review },
            ]}
          />
          {data.projects.length > 0 && (
            <ul className="space-y-4">
              {data.projects.map((p) => (
                <Bar
                  key={p.code}
                  label={
                    <>
                      <span className="label mr-2 text-muted">{p.code}</span>
                      {p.name}
                    </>
                  }
                  percent={p.progress}
                  note={p.late ? `${p.late} late` : undefined}
                />
              ))}
            </ul>
          )}
          {data.attention.length > 0 && (
            <List title="Needs attention">
              {data.attention.map((c) => {
                const late = c.due < today;
                return (
                  <li key={`${c.project}-${c.title}-${c.due}`} className="flex items-baseline justify-between gap-3 py-2.5 text-sm">
                    <span className="min-w-0 truncate">
                      <span className="label mr-2 text-muted">{c.project}</span>
                      {c.title}
                    </span>
                    <span className={cn('label shrink-0 tabular-nums', late ? 'text-signal' : 'text-muted')}>
                      {late ? 'Late · ' : ''}
                      {shortDate(c.due)}
                    </span>
                  </li>
                );
              })}
            </List>
          )}
        </>
      )}
    </Panel>
  );
}

export function TrackerPanel({ data, href }: { data: TrackerDigest | null; href: string }) {
  return (
    <Panel number="03" name="AI Engineering course" href={href}>
      {!data ? (
        <Unavailable name="The course tracker" />
      ) : (
        <>
          <Big
            value={
              <>
                {data.published}
                <span className="text-muted">/{data.total}</span>
              </>
            }
            caption="Episodes published"
          />
          <Facts
            items={[
              { label: 'Study · week', value: hours(data.studyMinutesWeek) },
              { label: 'Streak', value: `${data.streak} d` },
              { label: 'Weekly goal', value: `${data.pace.thisWeek}/${data.pace.target}` },
            ]}
          />
          <ul className="space-y-4">
            {data.rings.map((r) => (
              <Bar key={r.key} label={r.label} percent={r.percent} />
            ))}
          </ul>
          {data.upNext.length > 0 && (
            <List title="Up next">
              {data.upNext.map((e) => (
                <li key={e.key}>
                  <a
                    href={`${href}/episodes/${e.key}`}
                    className="group flex items-baseline justify-between gap-3 py-2.5 text-sm hover:text-lime"
                  >
                    <span className="min-w-0 truncate">
                      <span className="label mr-2 text-muted">{e.code}</span>
                      {e.title}
                    </span>
                    <span className="label shrink-0 text-muted">{e.statusLabel}</span>
                  </a>
                </li>
              ))}
            </List>
          )}
          {data.pace.finishAtPace && (
            <p className="label text-muted">
              At {data.pace.perWeek.toFixed(1)} a week, the course finishes {shortDate(data.pace.finishAtPace)}.
            </p>
          )}
        </>
      )}
    </Panel>
  );
}

export function PortfolioPanel({ data }: { data: PortfolioDigest }) {
  return (
    <Panel number="01" name="Portfolio content" href="/keystatic">
      <Big value={data.projects} caption="Projects on the site" />
      <Facts
        items={[
          { label: 'Journal', value: data.published },
          { label: 'Drafts', value: data.drafts },
          { label: 'Run', value: data.run ? `${data.run.distanceKm.toFixed(1)} km` : '·' },
        ]}
      />
      <List title="Latest">
        {data.latest && (
          <li>
            <Link
              href={`/journal/${data.latest.slug}`}
              className="flex items-baseline justify-between gap-3 py-2.5 text-sm hover:text-lime"
            >
              <span className="min-w-0 truncate">
                <span className="label mr-2 text-muted">Journal</span>
                {data.latest.title}
              </span>
              <span className="label shrink-0 text-muted">{shortDate(data.latest.date)}</span>
            </Link>
          </li>
        )}
        {data.run && (
          <li>
            <Link href="/running" className="flex items-baseline justify-between gap-3 py-2.5 text-sm hover:text-lime">
              <span className="min-w-0 truncate">
                <span className="label mr-2 text-muted">Run</span>
                {data.run.title} · {runTime(data.run.durationSec)}
              </span>
              <span className="label shrink-0 text-muted">{shortDate(data.run.date.slice(0, 10))}</span>
            </Link>
          </li>
        )}
      </List>
    </Panel>
  );
}
