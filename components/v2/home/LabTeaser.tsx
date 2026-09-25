import { Section } from '@/components/v2/system/Section';
import { SectionHeader } from '@/components/v2/system/SectionHeader';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { experiments, type Experiment } from '@/content/lab';
import { cn } from '@/lib/utils';

const statusStyle: Record<Experiment['status'], string> = {
  live: 'bg-lime',
  prototype: 'border border-current',
  planned: 'border border-dashed border-current',
};

export function LabTeaser() {
  return (
    <Section surface="dark" grid>
      <div className="page-grid gap-y-12">
        <SectionHeader index="09" eyebrow="Lab" title={['Testing, breaking,', 'rebuilding.']} className="lg:col-span-8">
          <p className="mt-6 max-w-prose text-lead text-muted">Things I&apos;m testing, learning, breaking and rebuilding.</p>
        </SectionHeader>
        <div className="col-span-full hidden items-end justify-end lg:col-span-4 lg:flex">
          <MiniRazeen pose="laptop" height={164} />
        </div>

        <ul className="col-span-full grid gap-px bg-line md:grid-cols-3">
          {experiments.map((e) => (
            <li key={e.slug} className="bg-surface p-6">
              <p className="label flex items-center gap-2 text-muted">
                <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', statusStyle[e.status])} />
                {e.status}
              </p>
              <h3 className="mt-4 text-xl font-semibold">{e.title}</h3>
              <p className="mt-2 text-sm text-muted">{e.summary}</p>
            </li>
          ))}
        </ul>

        <div className="col-span-full">
          <ArrowLink href="/lab">Enter the lab</ArrowLink>
        </div>
      </div>
    </Section>
  );
}
