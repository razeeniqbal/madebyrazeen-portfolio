import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/v2/system/Section';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { ArrowLink } from '@/components/v2/system/ArrowLink';
import { EvidenceImage } from '@/components/v2/work/EvidenceImage';
import { JsonLd } from '@/components/v2/seo/JsonLd';
import { ArticleBody } from '@/components/v2/journal/ArticleBody';
import { EntryMeta } from '@/components/v2/journal/EntryMeta';
import { getNote, getPublishedJournalEntries, tableOfContents, toSummary } from '@/content/notes';
import { getProject } from '@/content/projects';
import { SITE_URL } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

// Only published entries are pre-generated; any other slug (drafts included) is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedJournalEntries().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const note = getNote((await params).slug);
  if (!note) return {};
  const title = note.seoTitle ?? note.title;
  const description = note.seoDescription ?? note.description;
  return {
    title,
    description,
    alternates: { canonical: `/journal/${note.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/journal/${note.slug}`,
      publishedTime: note.date,
      ...(note.updated && { modifiedTime: note.updated }),
      authors: ['Razeen Iqbal'],
    },
  };
}

export default async function JournalEntryPage({ params }: Params) {
  const note = getNote((await params).slug);
  if (!note) notFound();

  const entry = toSummary(note);
  const project = note.relatedProject ? getProject(note.relatedProject) : undefined;
  const toc = tableOfContents(note);
  // Older and newer entries in publication order (the list is newest first).
  const all = getPublishedJournalEntries();
  const at = all.findIndex((n) => n.slug === note.slug);
  const newer = at > 0 ? all[at - 1] : undefined;
  const older = at >= 0 && at < all.length - 1 ? all[at + 1] : undefined;
  const related = all.filter((n) => n.slug !== note.slug && (n.category === note.category || (note.relatedProject && n.relatedProject === note.relatedProject))).slice(0, 3);

  return (
    <Section surface="light" className="!pt-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: note.title,
          description: note.description,
          url: `${SITE_URL}/journal/${note.slug}`,
          mainEntityOfPage: `${SITE_URL}/journal/${note.slug}`,
          datePublished: note.date,
          ...(note.updated && { dateModified: note.updated }),
          wordCount: note.words,
          inLanguage: 'en',
          author: { '@type': 'Person', name: 'Razeen Iqbal', url: SITE_URL },
          ...(project && { about: { '@type': 'CreativeWork', name: project.title, url: `${SITE_URL}/projects/${project.slug}` } }),
        }}
      />
      <article className="page-grid gap-y-10">
        <header className="col-span-full lg:col-span-9 lg:col-start-4">
          <ArrowLink href="/journal">Journal</ArrowLink>
          <EntryMeta entry={entry} className="mt-10" />
          <h1 className="mt-5 max-w-[48rem] text-display-md">{note.title}</h1>
          <p className="mt-6 max-w-[40rem] text-lead text-muted">{note.description}</p>

          {project && (
            <aside aria-label="Related build" className="mt-10 max-w-[40rem] border-y border-line py-5">
              <TechnicalLabel as="p">Related build</TechnicalLabel>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                <div>
                  <p className="text-xl font-semibold">{project.title}</p>
                  {project.tagline && <p className="mt-1 text-muted">{project.tagline}</p>}
                </div>
                <ArrowLink href={`/projects/${project.slug}`}>View case study</ArrowLink>
              </div>
            </aside>
          )}
        </header>

        {toc.length > 0 && (
          <nav aria-label="Contents" className="col-span-full lg:col-span-3">
            {/* Phones and tablets: a native disclosure above the text. Desktop: a quiet sticky list. */}
            <details className="border-b border-line pb-3 lg:hidden">
              <summary className="label cursor-pointer py-1.5">Contents</summary>
              <TocList toc={toc} />
            </details>
            <div className="sticky top-[calc(var(--header-h)+2rem)] hidden lg:block">
              <TechnicalLabel as="p">Contents</TechnicalLabel>
              <TocList toc={toc} />
            </div>
          </nav>
        )}

        <div className="col-span-full min-w-0 lg:col-span-9 lg:col-start-4">
          {note.photo && (
            <EvidenceImage image={{ ...note.photo.image, alt: note.photo.alt }} caption={note.photo.caption} sizes="(min-width: 1024px) 56rem, 100vw" priority className="mb-12 max-w-[56rem]" />
          )}
          <ArticleBody blocks={note.body} />

          <footer className="mt-20 max-w-[40rem] space-y-10 border-t border-line pt-8">
            {related.length > 0 && (
              <div>
                <TechnicalLabel as="h2">Related writing</TechnicalLabel>
                <ul className="mt-3 space-y-2">
                  {related.map((n) => (
                    <li key={n.slug}>
                      <Link href={`/journal/${n.slug}`} className="prose-link">
                        {n.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(older || newer) && (
              <nav aria-label="More entries" className="grid gap-6 sm:grid-cols-2">
                {older && (
                  <Link href={`/journal/${older.slug}`} className="group block">
                    <TechnicalLabel as="span">← Older</TechnicalLabel>
                    <span className="mt-1 block font-semibold group-hover:underline">{older.title}</span>
                  </Link>
                )}
                {newer && (
                  <Link href={`/journal/${newer.slug}`} className="group block sm:col-start-2 sm:text-right">
                    <TechnicalLabel as="span">Newer →</TechnicalLabel>
                    <span className="mt-1 block font-semibold group-hover:underline">{newer.title}</span>
                  </Link>
                )}
              </nav>
            )}
            <ArrowLink href="/journal">Back to the Journal</ArrowLink>
          </footer>
        </div>
      </article>
    </Section>
  );
}

function TocList({ toc }: { toc: { id: string; text: string }[] }) {
  return (
    <ol className="mt-3 space-y-2 text-sm">
      {toc.map((h, i) => (
        <li key={h.id} className="flex gap-3">
          <span className="label pt-0.5 text-muted">{String(i + 1).padStart(2, '0')}</span>
          <a href={`#${h.id}`} className="hit text-muted transition-colors hover:text-ink">
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}
