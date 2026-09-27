import type { GitHubStats } from '@/lib/github';

type Calendar = NonNullable<GitHubStats['contributionCalendar']>;

const CELL = 11;
const GAP = 3;

// Opacity steps of lime on dark. Every cell also carries its count in a <title>.
const level = (n: number) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 10 ? 3 : 4);
const fills = ['rgb(var(--bg-raised))', 'rgb(var(--lime) / 0.28)', 'rgb(var(--lime) / 0.5)', 'rgb(var(--lime) / 0.75)', 'rgb(var(--lime))'];

/** Server-rendered SVG heatmap of the last 52 weeks. */
export function ContributionGraph({ calendar }: { calendar: Calendar }) {
  const weeks = calendar.weeks.slice(-52);
  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP);
  const days = weeks.flatMap((w) => w.contributionDays);
  const activeDays = days.filter((d) => d.contributionCount > 0).length;

  return (
    <figure>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={`${calendar.totalContributions} GitHub contributions in the last year, on ${activeDays} of ${days.length} days.`}
          className="max-w-none"
        >
          {weeks.map((week, x) =>
            week.contributionDays.map((day) => {
              const y = new Date(`${day.date}T00:00:00Z`).getUTCDay();
              return (
                <rect
                  key={day.date}
                  x={x * (CELL + GAP)}
                  y={y * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  fill={fills[level(day.contributionCount)]}
                >
                  <title>{`${day.contributionCount} contributions on ${day.date}`}</title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>
      <figcaption className="label mt-3 flex flex-wrap items-center justify-between gap-4 text-muted">
        <span>
          Active {activeDays} of {days.length} days
        </span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          Less
          {fills.map((f) => (
            <span key={f} className="inline-block h-2.5 w-2.5" style={{ background: f }} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}
