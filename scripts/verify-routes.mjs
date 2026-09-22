// Multi-page delivery gate. The old verify-site.mjs was written for the hash-routed SPA and
// checks one document; this checks that every route declared in app/routes.ts is a real page
// that loads, carries the right base, and links only within it.
//
// It exists because `vinext build` reports an unprerendered route as "skipped" and still exits
// 0 — a green build silently shipped without /applications and /evidence once already.
//
// Usage: node scripts/verify-routes.mjs <base-url> [shot-dir]
import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = (process.argv[2] || '').replace(/\/?$/, '/');
const shots = process.argv[3];
if (!site.startsWith('http')) { console.error('usage: verify-routes.mjs <base-url> [shot-dir]'); process.exit(1); }

const routeSrc = fs.readFileSync(path.join(root, 'app/routes.ts'), 'utf8');
const declared = [...routeSrc.matchAll(/href:\s*'([^']+)'/g)].map(m => m[1]);
if (declared.length < 8) { console.error(`Only ${declared.length} routes parsed from app/routes.ts`); process.exit(1); }

const basePath = new URL(site).pathname;
const fails = [];
const browser = await chromium.launch();

for (const width of [1440, 390]) {
  const page = await browser.newPage({viewport: {width, height: 900}});
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 140)); });

  for (const route of declared) {
    const url = site + (route === '/' ? '' : route.replace(/^\//, '') + '.html');
    const before = errors.length;
    const resp = await page.goto(url, {waitUntil: 'networkidle'});
    await page.waitForTimeout(500);
    // Scroll the whole page so entrance animations resolve; a block stuck at opacity 0 is
    // invisible to a screenshot but is a real reader-facing defect.
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 700) { await page.evaluate(v => scrollTo({top: v, behavior: 'instant'}), y); await page.waitForTimeout(60); }
    await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
    // Entrance delays run to 700ms via data-rv-delay, and on a page with a live WebGL canvas a
    // starved renderer can park a transition for seconds. A single sample at a fixed moment
    // therefore measures the animation, not the outcome: the same unchanged page reported 7
    // blocks hidden at 250ms, 0 at 800ms, and intermittently 2 at 1000ms. Poll for the settled
    // state instead, and only fail when it never settles.
    await page.waitForFunction(
      () => [...document.querySelectorAll('[data-rv]')].every(e => parseFloat(getComputedStyle(e).opacity) >= 0.99),
      null, {timeout: 6000},
    ).catch(() => {});

    const d = await page.evaluate(bp => ({
      base: document.querySelector('meta[name="site-base"]')?.getAttribute('content'),
      offBase: [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href')).filter(h => !h.startsWith(bp)),
      brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')),
      // Two different failures: never got the class (the observer missed it) versus still
      // transparent after settling (the transition never ran).
      neverRevealed: [...document.querySelectorAll('[data-rv]')].filter(e => !e.classList.contains('rv-in')).length,
      stillHidden: [...document.querySelectorAll('[data-rv]')].filter(e => parseFloat(getComputedStyle(e).opacity) < 0.99).length,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      title: document.title,
      nav: document.querySelectorAll('.main-nav a').length,
    }), basePath);

    const problems = [];
    if (resp.status() !== 200) problems.push('status ' + resp.status());
    if (d.base !== basePath) problems.push(`site-base "${d.base}" != "${basePath}"`);
    if (d.offBase.length) problems.push('links outside base: ' + d.offBase.slice(0, 3).join(', '));
    if (d.brokenImgs.length) problems.push('broken images: ' + d.brokenImgs.slice(0, 3).join(', '));
    if (d.neverRevealed) problems.push(`${d.neverRevealed} block(s) never got rv-in`);
    if (d.stillHidden) problems.push(`${d.stillHidden} block(s) still transparent after settling`);
    if (d.overflowX) problems.push('horizontal overflow');
    if (!d.nav) problems.push('no primary nav');
    if (errors.length > before) problems.push(errors.slice(before, before + 2).join(' | '));

    const tag = `${width === 390 ? 'phone ' : 'desktop'} ${route}`;
    if (problems.length) { fails.push(`${tag}: ${problems.join('; ')}`); console.log(`FAIL ${tag}: ${problems.join('; ')}`); }
    else console.log(`ok   ${tag}  ${d.title.slice(0, 60)}`);

    if (shots) {
      fs.mkdirSync(shots, {recursive: true});
      await page.screenshot({path: path.join(shots, `${width}-${(route === '/' ? 'home' : route.slice(1)).replace(/\//g, '-')}.png`), fullPage: width === 1440});
    }
  }
  await page.close();
}
await browser.close();

if (fails.length) { console.error(`\n${fails.length} check(s) failed.`); process.exit(1); }
console.log(`\nALL ROUTES PASS (${declared.length} routes x 2 widths)`);
