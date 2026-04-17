// Local Lighthouse audit — boots `next start` against the production
// build, drives a headless Chrome via chrome-launcher, runs Lighthouse on
// every public route, and prints the four core scores per page.
//
// One-time setup (Node prompts + installs these on first run):
//   npm i -D lighthouse chrome-launcher
//
// Run with:
//   npm run lighthouse            # audits a production build at :3000
//   LH_PORT=4000 npm run lighthouse
//
// Prereqs: Chrome / Chromium installed locally. Headless-mode is used.

import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';

const PORT = Number(process.env.LH_PORT || 3000);
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  '/',
  '/services/web-development',
  '/services/graphic-design',
  '/services/seo-optimization',
  '/services/social-media-marketing',
  '/services/app-development',
  '/services/logistics',
];

async function loadDeps() {
  try {
    const [{ default: lighthouse }, chromeLauncher] = await Promise.all([
      import('lighthouse'),
      import('chrome-launcher'),
    ]);
    return { lighthouse, chromeLauncher };
  } catch (err) {
    console.error(
      '\n❌ Missing Lighthouse deps. Install with:\n   npm i -D lighthouse chrome-launcher\n'
    );
    process.exit(1);
  }
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status < 500) return true;
    } catch {}
    await wait(500);
  }
  throw new Error(`Server at ${url} did not come up in ${timeoutMs}ms`);
}

function score(v) {
  if (v == null) return '  — ';
  const n = Math.round(v * 100);
  const pad = String(n).padStart(3, ' ');
  return n >= 90 ? `\u001b[32m${pad}\u001b[0m` : n >= 50 ? `\u001b[33m${pad}\u001b[0m` : `\u001b[31m${pad}\u001b[0m`;
}

const { lighthouse, chromeLauncher } = await loadDeps();

console.log(`▶ Starting next start on :${PORT}...`);
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  stdio: ['ignore', 'ignore', 'inherit'],
  shell: process.platform === 'win32',
});

try {
  await waitForServer(BASE);
} catch (err) {
  server.kill();
  console.error(err.message);
  process.exit(1);
}
console.log('✓ Server ready — launching Chrome\n');

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });

const header = 'Route'.padEnd(44) + ' ' + ['Perf', ' SEO', ' A11y', ' BP'].map((s) => s.padStart(5)).join(' ');
console.log(header);
console.log('-'.repeat(header.length));

for (const route of ROUTES) {
  const url = `${BASE}${route}`;
  const result = await lighthouse.default(url, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'seo', 'accessibility', 'best-practices'],
  });
  const { categories } = result.lhr;
  const row = [
    route.padEnd(44),
    score(categories.performance?.score),
    score(categories.seo?.score),
    score(categories.accessibility?.score),
    score(categories['best-practices']?.score),
  ].join(' ');
  console.log(row);
}

await chrome.kill();
server.kill();
console.log('\n✓ Done.');
