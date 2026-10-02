#!/usr/bin/env node
/**
 * Writing-rule check for canonical authored content (content/data/**\/*.json).
 *
 * Flags contractions, the em dash character and a short list of banned phrases, and reports
 * file, JSON path and the matched text. It never rewrites anything: fix the source by hand.
 *
 * Not scanned: generated data (content/running), archived or draft journal entries, lockfiles.
 * Possessives ("Razeen's", "Malaysia's") are not contractions and are not flagged.
 *
 * Exit code 1 when anything is found, so CI fails on new violations.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'content', 'data');

// Generated or machine-written data, never authored prose.
const EXCLUDED_DIRS = [join(CONTENT, 'running')];

const A = "['’]"; // straight or curly apostrophe
const rules = [
  { rule: 'contraction', re: new RegExp(`\\b\\w+n${A}t\\b`, 'gi') }, // don't, isn't, can't, won't
  { rule: 'contraction', re: new RegExp(`\\b\\w+${A}(?:re|ve|ll)\\b`, 'gi') }, // we're, I've, they'll
  { rule: 'contraction', re: new RegExp(`\\bI${A}[md]\\b`, 'g') }, // I'm, I'd
  {
    rule: 'contraction',
    re: new RegExp(`\\b(?:it|that|there|here|what|who|let|he|she|where|how)${A}s\\b`, 'gi'),
  }, // it's, that's, let's (possessive 's on other words is allowed)
  { rule: 'contraction', re: new RegExp(`\\b(?:you|we|they|he|she|it|that|there|who)${A}d\\b`, 'gi') },
  { rule: 'em dash', re: /—/g },
  {
    rule: 'banned phrase',
    re: /\b(?:passionate about|results-driven|innovative professional|cutting-edge|leveraging|game-changing|technology enthusiast|AI enthusiast|seamlessly|revolutionary)\b/gi,
  },
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (EXCLUDED_DIRS.includes(p)) return [];
    if (statSync(p).isDirectory()) return walk(p);
    return p.endsWith('.json') ? [p] : [];
  });
}

/** Journal entries that are not published are not public content; skip them. */
function isUnpublishedJournal(file, data) {
  return file.includes(`${sep}notes${sep}`) && data && data.status !== 'published';
}

function* strings(value, path) {
  if (typeof value === 'string') yield [path, value];
  else if (Array.isArray(value)) for (let i = 0; i < value.length; i++) yield* strings(value[i], `${path}[${i}]`);
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) yield* strings(v, path ? `${path}.${k}` : k);
}

const findings = [];
for (const file of walk(CONTENT)) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  if (isUnpublishedJournal(file, data)) continue;
  for (const [path, text] of strings(data, '')) {
    for (const { rule, re } of rules) {
      for (const m of text.matchAll(re)) {
        findings.push({ file: relative(ROOT, file).split(sep).join('/'), path, rule, match: m[0] });
      }
    }
  }
}

if (findings.length === 0) {
  console.log('Writing rules: no violations in canonical content.');
  process.exit(0);
}
for (const f of findings) console.log(`${f.file}  ${f.path}  [${f.rule}]  "${f.match}"`);
console.log(`\nWriting rules: ${findings.length} violation(s). Fix the text by hand; nothing was changed.`);
process.exit(1);
