import { CaseStudyBlock } from '@/components/v2/case-study/CaseStudyBlocks';
import { EvidenceImage } from '@/components/v2/work/EvidenceImage';
import type { ArticleBlock } from '@/content/notes';
import { Inline } from './Inline';
import { JournalFigureBlock } from './Figures';

/** One journal block. Prose stays in the reading measure; figures, tables and code run wider. */
function Block({ block, figureIndex }: { block: ArticleBlock; figureIndex: number }) {
  switch (block.kind) {
    case 'text':
      return (
        <>
          {block.body.map((p, i) => (
            <p key={i} className={block.lead ? 'text-lead' : undefined}>
              <Inline text={p} />
            </p>
          ))}
        </>
      );
    case 'heading':
      return block.level === 2 ? (
        <h2 id={block.id}>{block.text}</h2>
      ) : (
        <h3 id={block.id}>{block.text}</h3>
      );
    case 'bullets': {
      const List = block.numbered ? 'ol' : 'ul';
      return (
        <List>
          {block.items.map((item, i) => (
            <li key={i}>
              <Inline text={item} />
            </li>
          ))}
        </List>
      );
    }
    case 'quote':
      return (
        <figure>
          <blockquote>
            <p>
              <Inline text={block.text} />
            </p>
          </blockquote>
          {block.cite && <figcaption className="label mt-3 pl-5 text-muted">{block.cite}</figcaption>}
        </figure>
      );
    case 'code':
      // Dark block on either surface; scrolls sideways instead of wrapping, and is focusable so
      // keyboard users can scroll it too.
      return (
        <figure className="journal-wide">
          <div data-surface="dark" className="border border-line">
            {block.language && (
              <div className="label border-b border-line px-4 py-2 text-muted">{block.language}</div>
            )}
            <pre
              tabIndex={0}
              aria-label={block.language ? `Code sample, ${block.language}` : 'Code sample'}
              className="overflow-x-auto p-4 font-mono text-[0.875rem] leading-relaxed"
            >
              <code>{block.code}</code>
            </pre>
          </div>
          {block.caption && <figcaption className="mt-3 text-sm text-muted">{block.caption}</figcaption>}
        </figure>
      );
    case 'divider':
      return <hr />;
    case 'figure':
      return <JournalFigureBlock figure={block.figure} caption={block.caption} index={figureIndex} />;
    case 'image':
      return (
        <EvidenceImage
          image={block.image}
          caption={block.caption}
          sizes="(min-width: 1024px) 56rem, 100vw"
          className="journal-wide"
        />
      );
    case 'list':
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>
              <strong>{item.title}</strong>
              {item.detail && (
                <>
                  {'. '}
                  <Inline text={item.detail} />
                </>
              )}
            </li>
          ))}
        </ul>
      );
    default:
      // Tables, steps, flows and galleries reuse the case-study renderers at the wider measure.
      return (
        <div className="journal-wide">
          <CaseStudyBlock block={block} />
        </div>
      );
  }
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="journal-prose">
      {blocks.map((block, i) => (
        <Block key={i} block={block} figureIndex={blocks.slice(0, i + 1).filter((b) => b.kind === 'figure').length} />
      ))}
    </div>
  );
}
