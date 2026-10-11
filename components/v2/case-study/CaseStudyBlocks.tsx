import { Fragment } from 'react';
import { CaseStudyDemo } from './CaseStudyDemo';
import { FlowExplorer } from '@/components/v2/diagram/FlowExplorer';
import { FlowDiagram } from '@/components/v2/diagram/FlowDiagram';
import { EvidenceGallery, EvidenceImage } from '@/components/v2/work/EvidenceImage';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import type { Block } from '@/content/case-studies';
import { cn } from '@/lib/utils';

/** Renders one case-study content block. All layout decisions for content live here. */
export function CaseStudyBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case 'text':
      return (
        <div className="justify-copy max-w-prose space-y-4">
          {block.body.map((p) => (
            <p key={p} className={block.lead ? 'text-lead' : 'text-muted'}>
              {p}
            </p>
          ))}
        </div>
      );

    case 'list':
      return (
        <ol className="grid gap-x-8 md:grid-cols-2">
          {block.items.map((item, i) => (
            <li key={item.title} className="border-t border-line py-4">
              <p className="flex items-baseline gap-3 font-semibold">
                {block.numbered && <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>}
                {item.title}
              </p>
              <p className="mt-1 text-sm text-muted">{item.detail}</p>
            </li>
          ))}
        </ol>
      );

    case 'flow':
      return (
        <figure>
          {/* Nodes with details become a walkable flow; detail-less flows stay a static diagram. */}
          {block.nodes.some((n) => n.detail) ? (
            <FlowExplorer nodes={block.nodes} label={block.label} />
          ) : (
            <FlowDiagram nodes={block.nodes} label={block.label} />
          )}
          {block.caption && (
            <figcaption className="mt-4">
              <TechnicalLabel>{block.caption}</TechnicalLabel>
            </figcaption>
          )}
        </figure>
      );

    case 'demo':
      return <CaseStudyDemo demo={block.demo} caption={block.caption} />;

    case 'steps':
      return (
        <ol aria-label={block.label} className="flex flex-wrap items-center gap-x-2 gap-y-3">
          {block.steps.map((s, i) => (
            <Fragment key={s}>
              {i > 0 && (
                <li aria-hidden="true" className="text-muted">
                  →
                </li>
              )}
              <li className="label flex items-center gap-2 border border-line px-3 py-2">
                <span
                  aria-hidden="true"
                  className={cn('h-1.5 w-1.5 rounded-full', i === block.steps.length - 1 ? 'bg-lime ring-1 ring-ink' : 'border border-current')}
                />
                {s}
              </li>
            </Fragment>
          ))}
        </ol>
      );

    case 'metrics':
      return (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {block.items.map((m) => (
            <div key={m.label} className="border-t-2 border-ink pt-3">
              <dt className="label text-muted">{m.label}</dt>
              <dd className="mt-2 text-display-md tabular-nums">{m.value}</dd>
              {(m.note || m.illustrative) && (
                <dd className="mt-1 text-sm text-muted">
                  {m.note}
                  {m.illustrative && <span className="label ml-2 border border-current px-1.5">Illustrative</span>}
                </dd>
              )}
            </div>
          ))}
        </dl>
      );

    case 'table':
      return (
        <figure>
          <figcaption className="mb-3">
            <TechnicalLabel>{block.caption}</TechnicalLabel>
          </figcaption>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left tabular-nums">
              <thead>
                <tr className="border-b border-ink/40">
                  {block.columns.map((c, i) => (
                    <th key={c} scope="col" className={cn('label py-3 pr-4 font-normal text-muted', i > 0 && 'text-right')}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={row[0]} className={cn('border-b border-line', r === block.highlightRow && 'font-semibold')}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={i} scope="row" className="py-3 pr-4 font-[inherit]">
                          {r === block.highlightRow && (
                            <span aria-hidden="true" className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lime align-middle ring-1 ring-ink" />
                          )}
                          {cell}
                        </th>
                      ) : (
                        <td key={i} className="py-3 pr-4 text-right">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && <p className="mt-3 text-sm text-muted">{block.note}</p>}
        </figure>
      );

    case 'image':
      return <EvidenceImage image={block.image} caption={block.caption} sizes="(min-width: 1024px) 90vw, 100vw" />;

    case 'gallery':
      return <EvidenceGallery layout={block.layout} items={block.items} />;
  }
}
