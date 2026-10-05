// Renders the PWA icons from assets/logo.png (white wordmark on black) using Playwright's Chromium.
// Usage: npm run icons   (requires `playwright` to be resolvable, e.g. installed globally)
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(execSync('npm root -g').toString().trim() + '/playwright'); }

const logo = 'data:image/png;base64,' + readFileSync(new URL('../public/assets/logo.png', import.meta.url)).toString('base64');
const icons = [
  ['icon-192.png', 192, 0.78], ['icon-512.png', 512, 0.78],
  ['maskable-512.png', 512, 0.6], ['apple-touch-icon.png', 180, 0.74],
];
const browser = await pw.chromium.launch();
const page = await browser.newPage();
for (const [name, size, frac] of icons) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0;width:${size}px;height:${size}px;background:#000;display:flex;align-items:center;justify-content:center">
    <img src="${logo}" style="width:${Math.round(size * frac)}px;height:auto;display:block"></body>`);
  await page.waitForFunction(() => document.images[0].complete);
  await page.screenshot({ path: new URL('../public/icons/' + name, import.meta.url).pathname });
  console.log('wrote', name);
}
await browser.close();
