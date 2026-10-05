import { toBlob } from 'html-to-image';
import pf400 from '@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff2?url';
import pf600 from '@fontsource/playfair-display/files/playfair-display-latin-600-italic.woff2?url';
import pf400x from '@fontsource/playfair-display/files/playfair-display-latin-ext-400-italic.woff2?url';
import pf600x from '@fontsource/playfair-display/files/playfair-display-latin-ext-600-italic.woff2?url';

const toDataURL = blob => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });

// Self-hosted Playfair Display, inlined so the exported PNG never falls back to a generic serif (works offline).
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const FACES = [[pf400, 400, LATIN], [pf600, 600, LATIN], [pf400x, 400, EXT], [pf600x, 600, EXT]];
const face = (src, w, range) => `@font-face{font-family:'Playfair Display';font-style:italic;font-weight:${w};font-display:swap;src:url(${src}) format('woff2');unicode-range:${range}}`;

// Registers the self-hosted faces for the live preview.
export function installFonts() {
  const el = document.createElement('style');
  el.textContent = FACES.map(([u, w, r]) => face(u, w, r)).join('\n');
  document.head.appendChild(el);
}

let fontCSSPromise = null;
function getFontCSS() {
  if (!fontCSSPromise) fontCSSPromise = Promise.all(FACES.map(async ([url, w, range]) => face(await toDataURL(await (await fetch(url)).blob()), w, range)))
    .then(parts => parts.join('\n'))
    .catch(e => { fontCSSPromise = null; throw e; });
  return fontCSSPromise;
}
export const warmFonts = () => getFontCSS().catch(() => {});

// Same maths as the board's CSS filter: grayscale(m) contrast(1 + .08m) brightness(1 - .25t).
// Done by hand so exports match in every browser (Safari has no canvas ctx.filter).
function bakeFilter(ctx, w, h, mono, tint) {
  if (!mono && !tint) return;
  const px = ctx.getImageData(0, 0, w, h);
  const a = px.data, g = 1 - mono;
  const c = 1 + 0.08 * mono, b = 1 - 0.25 * tint;
  const r0 = 0.2126 + 0.7874 * g, r1 = 0.7152 - 0.7152 * g, r2 = 0.0722 - 0.0722 * g;
  const g0 = 0.2126 - 0.2126 * g, g1 = 0.7152 + 0.2848 * g, g2 = 0.0722 - 0.0722 * g;
  const b0 = 0.2126 - 0.2126 * g, b1 = 0.7152 - 0.7152 * g, b2 = 0.0722 + 0.9278 * g;
  const off = (0.5 - 0.5 * c) * 255;
  for (let i = 0; i < a.length; i += 4) {
    const R = a[i], G = a[i + 1], B = a[i + 2];
    a[i] = ((r0 * R + r1 * G + r2 * B) * c + off) * b;
    a[i + 1] = ((g0 * R + g1 * G + g2 * B) * c + off) * b;
    a[i + 2] = ((b0 * R + b1 * G + b2 * B) * c + off) * b;
  }
  ctx.putImageData(px, 0, 0);
}

// Bakes every <img> on the board into a self-contained data URL so the exporter never refetches.
async function inlineImages(board, mono, tint) {
  const imgs = Array.from(board.querySelectorAll('img'));
  const saved = [];
  await Promise.all(imgs.map(async img => {
    const src = img.getAttribute('src') || '';
    if (!src) return;
    try {
      if (!img.complete || !img.naturalWidth) await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      if (img.decode) await img.decode().catch(() => {});
      const w = img.naturalWidth, h = img.naturalHeight; if (!w || !h) return;
      const k = Math.min(1, 4096 / Math.max(w, h));
      const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const filtered = (img.getAttribute('style') || '').includes('grayscale(');
      if (filtered) bakeFilter(ctx, c.width, c.height, mono, tint);
      const isPng = /\.png($|\?)|^data:image\/png/i.test(src);
      const data = c.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.95);
      saved.push([img, src, img.style.filter]);
      img.setAttribute('src', data);
      if (filtered) img.style.filter = 'none';
      await new Promise(r => { if (img.complete) r(); else { img.onload = r; img.onerror = r; } });
      if (img.decode) await img.decode().catch(() => {});
    } catch (e) { console.warn('inline failed', src.slice(0, 60), e); }
  }));
  return () => saved.forEach(([img, src, fl]) => { img.setAttribute('src', src); img.style.filter = fl; });
}

const isWebKit = /AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|Edg\//.test(navigator.userAgent);

// Renders the board at `long` px on its long edge (0 = native size). Returns { blob, w, h }.
export async function renderPng(board, T, { long = 0, mono = 1, tint = 0.2, onStatus = () => {} } = {}) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const pr = long ? long / Math.max(T.w, T.h) : 1;
  let fontEmbedCSS = '';
  try { fontEmbedCSS = await getFontCSS(); } catch (e) { onStatus('Font embed failed — serif may fall back'); }
  onStatus('Preparing images…');
  const restore = await inlineImages(board, mono, tint);
  try {
    onStatus('Rendering…');
    const opts = { width: T.w, height: T.h, pixelRatio: pr, cacheBust: false, fontEmbedCSS, backgroundColor: '#000', style: { transform: 'none' } };
    // WebKit often paints images inside the SVG snapshot only from the second pass on.
    if (isWebKit) { await toBlob(board, { ...opts, pixelRatio: 0.25 }); await toBlob(board, { ...opts, pixelRatio: 0.25 }); }
    const blob = await toBlob(board, opts);
    if (!blob) throw new Error('empty export');
    return { blob, w: Math.round(T.w * pr), h: Math.round(T.h * pr) };
  } finally { restore(); }
}
