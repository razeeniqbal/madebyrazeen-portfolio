import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

// The small inline syntax journal prose supports: [text](url), `code`, **bold**, *italics*.
// Anything else is plain text. No HTML is ever interpreted.
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const [, linkText, href, code, bold, em] = m;
    if (linkText && href) {
      const external = /^https?:\/\//.test(href);
      out.push(
        external ? (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="prose-link">
            {linkText}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <Link key={i} href={href} className="prose-link">
            {linkText}
          </Link>
        ),
      );
    } else if (code) {
      out.push(
        <code key={i} className="prose-code">
          {code}
        </code>,
      );
    } else if (bold) {
      out.push(<strong key={i}>{bold}</strong>);
    } else if (em) {
      out.push(<em key={i}>{em}</em>);
    }
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <Fragment>{out}</Fragment>;
}
