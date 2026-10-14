import { buildKnowledge } from '@/lib/assistant/knowledge';

/** /llms-full.txt: the site's full text for language models, the same knowledge the on-site assistant answers from. */
export const dynamic = 'force-static';

export function GET() {
  return new Response(`${buildKnowledge()}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
