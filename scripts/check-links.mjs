#!/usr/bin/env node
/**
 * Internal-link check. Crawls a running build (default http://localhost:3000, or BASE_URL),
 * starting from / and every URL in /sitemap.xml, and follows every internal href it finds.
 * Fails when any internal page or asset does not end in a 200 after redirects.
 *
 * Usage: npm run build && npm start, then npm run check:links
 */
const BASE = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
// Admin and API routes are not pages a visitor follows.
const SKIP = [/^\/keystatic/, /^\/api\//, /^\/_next\//, /^\/cdn-cgi\//];

const seen = new Map(); // path -> status
const referrers = new Map(); // path -> first page that linked to it
const queue = ['/'];

async function fromSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

function internalPath(href, from) {
  if (!href || href.startsWith('#') || /^(mailto|tel|javascript|data):/i.test(href)) return null;
  const url = new URL(href, `${BASE}${from}`);
  if (url.origin !== BASE && url.hostname !== 'portfolio.madebyrazeen.com') return null;
  const path = decodeURI(url.pathname);
  return SKIP.some((re) => re.test(path)) ? null : path;
}

async function visit(path) {
  const res = await fetch(`${BASE}${encodeURI(path)}`, { redirect: 'follow' });
  seen.set(path, res.status);
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok || !type.includes('text/html')) return;
  const html = await res.text();
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const next = internalPath(m[1].replace(/&amp;/g, '&'), path);
    if (next && !seen.has(next) && !queue.includes(next)) {
      queue.push(next);
      referrers.set(next, path);
    }
  }
}

try {
  for (const p of await fromSitemap()) if (!queue.includes(p)) queue.push(p);
} catch (e) {
  console.error(`Could not read the sitemap at ${BASE}: ${e.message}`);
  process.exit(1);
}

while (queue.length) {
  const batch = queue.splice(0, 8);
  await Promise.all(batch.map((p) => (seen.has(p) ? null : visit(p).catch(() => seen.set(p, 0)))));
}

const broken = [...seen].filter(([, s]) => s !== 200);
console.log(`Checked ${seen.size} internal URLs.`);
if (broken.length === 0) {
  console.log('Internal links: all 200.');
  process.exit(0);
}
for (const [p, s] of broken) console.log(`${s || 'ERR'}  ${p}  (linked from ${referrers.get(p) ?? 'sitemap'})`);
console.log(`\nInternal links: ${broken.length} broken.`);
process.exit(1);
