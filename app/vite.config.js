import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Emits sw.js with a precache list of every built file, so the installed app works offline.
function serviceWorker() {
  let outDir;
  return {
    name: 'darkroom-sw',
    apply: 'build',
    configResolved(c) { outDir = c.build.outDir; },
    writeBundle: {
      sequential: true,
      async handler() {
        const { writeFileSync } = await import('node:fs');
        const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
        const files = walk(outDir).map(p => './' + relative(outDir, p).split('\\').join('/')).filter(f => f !== './sw.js');
        const version = Date.now().toString(36);
        writeFileSync(join(outDir, 'sw.js'), `// generated at build time
const CACHE = 'dr-studio-${version}';
const PRECACHE = ${JSON.stringify(['./', ...files])};
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('dr-studio-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return r; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
`);
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), serviceWorker()],
  build: { assetsInlineLimit: 0 },
});
