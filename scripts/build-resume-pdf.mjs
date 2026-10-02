#!/usr/bin/env node
/**
 * Prints the web resume (/resume) to public/Razeen_Iqbal_Resume.pdf, so the PDF is always a rendering of
 * the canonical data and never a separately maintained document.
 *
 * Uses an installed Chromium-family browser in headless mode (Chrome, Edge or Chromium), which keeps
 * selectable text and live links, and applies the page's own print stylesheet (A4, 14 mm margins).
 * No npm dependency is needed.
 *
 * Usage: build and start the site, then
 *   npm run resume:pdf                         (default BASE_URL http://localhost:3000)
 *   BASE_URL=http://localhost:3123 npm run resume:pdf
 *   CHROME_PATH=/path/to/chrome npm run resume:pdf
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const BASE = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const OUT = resolve('public', 'Razeen_Iqbal_Resume.pdf');

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error('No Chrome, Edge or Chromium found. Set CHROME_PATH to a Chromium-family browser.');
  process.exit(1);
}

const res = await fetch(`${BASE}/resume`).catch(() => null);
if (!res?.ok) {
  console.error(`${BASE}/resume is not reachable (${res?.status ?? 'no response'}). Build and start the site first.`);
  process.exit(1);
}

// A throwaway profile, so the run never touches the user's browser profile.
const profileDir = mkdtempSync(join(tmpdir(), 'resume-pdf-'));
try {
  execFileSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${profileDir}`,
      '--no-pdf-header-footer',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=10000',
      `--print-to-pdf=${OUT}`,
      `${BASE}/resume`,
    ],
    { stdio: 'inherit', timeout: 120_000 },
  );
} finally {
  rmSync(profileDir, { recursive: true, force: true });
}

if (!existsSync(OUT) || statSync(OUT).size < 10_000) {
  console.error('The PDF was not written (or is empty).');
  process.exit(1);
}
console.log(`Wrote ${OUT} (${Math.round(statSync(OUT).size / 1024)} KB) from ${BASE}/resume using ${browser}`);
