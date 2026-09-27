import { PhotoFrame } from '@/components/v2/system/PhotoFrame';
import type { StoryChapter } from '@/content/story';

/**
 * About › The path. An editorial narrative, not a CV timeline: stage + period on the left,
 * why/what/how in one paragraph, a real photo where one exists. Employer detail lives on Work/Resume.
 */
export function PathNarrative({ chapters }: { chapters: StoryChapter[] }) {
  return (
    <ol className="col-span-full">
      {chapters.map((c, i) => {
        const last = i === chapters.length - 1;
        return (
          <li key={c.stage || c.title} data-reveal className="page-grid !px-0 gap-y-6 border-t border-line py-12 md:py-16">
            <div className="col-span-full md:col-span-3 lg:col-span-4">
              <p className="label text-muted">
                {String(i + 1).padStart(2, '0')} · {c.period}
              </p>
              <p className="mt-3 flex items-center gap-3 text-display-sm">
                {c.stage}
                {last && <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-lime" />}
              </p>
              {!last && (
                <span aria-hidden="true" className="mt-4 hidden text-2xl text-muted md:block">
                  ↓
                </span>
              )}
            </div>
            <div className={c.photo ? 'col-span-full md:col-span-5 lg:col-span-4' : 'col-span-full md:col-span-5 lg:col-span-6'}>
              <h3 className="text-xl font-semibold">{c.title}</h3>
              {c.body.map((p) => (
                <p key={p.slice(0, 32)} className="justify-copy mt-3 max-w-prose text-muted">
                  {p}
                </p>
              ))}
            </div>
            {c.photo && (
              <PhotoFrame
                image={c.photo.image}
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 60vw, 100vw"
                aspect="aspect-[4/3]"
                caption={c.photo.caption}
                className="col-span-full md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
