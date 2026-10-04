import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/v2/system/Section';
import { PageHeader } from '@/components/v2/system/PageHeader';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { EntryMeta } from '@/components/v2/journal/EntryMeta';
import { JournalIndex } from '@/components/v2/journal/JournalIndex';
import { getFeaturedEntry, getPublishedJournalEntries, journalCategories, toSummary } from '@/content/notes';

export const metadata: Metadata = {
  alternates: { canonical: '/journal', types: { 'application/rss+xml': '/journal/rss.xml' } },
  title: 'Journal',
  description:
    'Razeen Iqbal’s journal: why something was built, the questions behind an experiment, what changed and what is still open.',
};

// The thinking layer between the finished pages. Built for scarcity: one featured entry, then the
// full index with a category filter. Nothing is invented to fill space; empty categories say so.
export default function JournalPage() {
  const entries = getPublishedJournalEntries().map(toSummary);
  const featured = getFeaturedEntry();
  const lead = featured ? toSummary(featured) : undefined;

  return (
    <>
      <Section surface="light" className="!pt-16">
        <PageHeader
          href="/journal"
          title={['Notes from', 'building and', 'learning.']}
          lede={[
            'Why something was built, the question behind an experiment, what changed along the way and what is still open. The finished work lives in Projects. This is the thinking around it.',
          ]}
          aside={
            <div className="hidden justify-end lg:flex">
              <MiniRazeen pose="learning" height={151} />
            </div>
          }
        />

        {lead ? (
          <div id="featured" className="page-grid mt-20 scroll-mt-20 gap-y-8">
            <TechnicalLabel as="h2" marker="01 /" className="col-span-full">
              {featured?.featured ? 'Featured' : 'Latest'}
            </TechnicalLabel>
            <article className="col-span-full border-t border-ink pt-8 lg:col-span-10">
              <EntryMeta entry={lead} />
              <h3 className="mt-5 text-display-md">
                <Link href={`/journal/${lead.slug}`} className="hover:underline">
                  {lead.title}
                </Link>
              </h3>
              <p className="mt-5 max-w-[44rem] text-lead text-muted">{lead.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
                <ArrowLink href={`/journal/${lead.slug}`}>
                  Read the entry
                </ArrowLink>
                {lead.project && <TechnicalLabel>Related build · {lead.project}</TechnicalLabel>}
              </div>
            </article>
          </div>
        ) : null}
      </Section>

      <Section surface="light" id="index" className="!pt-0 scroll-mt-16">
        <div className="page-grid gap-y-8">
          <TechnicalLabel as="h2" marker={lead ? '02 /' : '01 /'} className="col-span-full">
            Index
          </TechnicalLabel>
          <div className="col-span-full lg:col-span-10">
            {entries.length > 0 ? (
              <JournalIndex entries={entries} categories={journalCategories} />
            ) : (
              <p className="border-t border-line pt-6 text-muted">Nothing is published yet.</p>
            )}
          </div>
          <div className="col-span-full mt-8 flex flex-wrap gap-x-10 gap-y-4 lg:col-span-10">
            <ArrowLink href="/projects">What I build</ArrowLink>
            <ArrowLink href="/trainer">What I share</ArrowLink>
            {/* A feed file, not a page: a plain link so the router does not try to render it. */}
            <a href="/journal/rss.xml" className="label inline-flex items-center gap-3 border-b border-current pb-1 hover:text-signal">
              RSS feed <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
