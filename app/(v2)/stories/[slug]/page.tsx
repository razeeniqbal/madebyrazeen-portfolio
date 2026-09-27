import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { CaseStudyBlock } from '@/components/v2/case-study/CaseStudyBlocks';
import { getNote, getReadableNotes } from '@/content/notes';
import { JsonLd } from '@/components/v2/seo/JsonLd';
import { SITE_URL } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

// Only pre-generated slugs exist; anything else is a real 404 status (not a streamed not-found).
export const dynamicParams = false;

export function generateStaticParams() {
  return getReadableNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const note = getNote((await params).slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary,
    // Drafts are readable by link but kept out of search until published.
    alternates: { canonical: `/stories/${note.slug}` },
    robots: note.status === 'published' ? undefined : { index: false, follow: true },
    openGraph: { type: 'article', title: note.title, description: note.summary, publishedTime: note.date },
  };
}

export default async function NotePage({ params }: Params) {
  const note = getNote((await params).slug);
  if (!note?.body) notFound();

  return (
    <Section surface="light" className="!pt-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: note.title,
          description: note.summary,
          url: `${SITE_URL}/stories/${note.slug}`,
          ...(note.date && { datePublished: note.date }),
          author: { '@type': 'Person', name: 'Razeen Iqbal', url: SITE_URL },
        }}
      />
      <article className="page-container">
        <div className="mx-auto max-w-[44rem]">
          <ArrowLink href="/stories">All stories</ArrowLink>

          {note.status === 'draft' && (
            <p className="label mt-8 border border-current px-3 py-2">Draft · not yet published · wording under review</p>
          )}

          <header className="mt-10 border-b border-line pb-8">
            <TechnicalLabel as="p">
              Story_{note.number} · {note.topic}
              {note.readingMinutes && ` · ${note.readingMinutes} min read`}
              {note.date && ` · ${note.date}`}
            </TechnicalLabel>
            <h1 className="mt-4 text-display-md">{note.title}</h1>
            <p className="mt-4 text-lead text-muted">{note.summary}</p>
          </header>

          {/* Reading measure: prose blocks already cap at ~65ch. */}
          <div className="mt-10 space-y-8 [&_p]:text-[1.0625rem] [&_p]:leading-[1.75]">
            {note.body.map((block, i) => (
              <CaseStudyBlock key={i} block={block} />
            ))}
          </div>

          <footer className="mt-16 border-t border-line pt-8">
            <ArrowLink href="/stories">More stories</ArrowLink>
          </footer>
        </div>
      </article>
    </Section>
  );
}
