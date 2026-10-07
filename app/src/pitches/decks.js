// Brand pitch decks from the handoff (pitches/*.dc.html).
// The ten standard decks share one template (standard-deck.html, the Apple Music deck with its brand-specific
// copy replaced by {{SLOTS}}); decks.json holds each brand's copy. Red Bull is its own verbatim deck.
import standard from './standard-deck.html?raw';
import redbull from './redbull-deck.html?raw';
import DATA from './decks.json';

const ASSETS = import.meta.env.BASE_URL + 'assets/';

// [slug, deck file, index category, index card name]
export const DECKS = [
  ['redbull', 'Red Bull', 'ENERGY · FEATURED', 'Red Bull'],
  ['apple-music', 'Apple Music', 'STREAMING', 'Apple Music'],
  ['spotify', 'Spotify', 'STREAMING', 'Spotify'],
  ['audiomack', 'Audiomack', 'STREAMING', 'Audiomack'],
  ['boomplay', 'Boomplay', 'STREAMING', 'Boomplay'],
  ['youtube-music', 'YouTube Music', 'STREAMING', 'YouTube Music'],
  ['audio-gear', 'Audio Gear', 'AUDIO GEAR', 'Shure · Sennheiser · JBL'],
  ['telcos', 'Telcos', 'TELCO', 'MTN · Airtel'],
  ['drinks', 'Drinks', 'DRINKS', 'Drinks brand'],
  ['streetwear', 'Streetwear', 'FASHION', 'Streetwear brand'],
  ['fintech', 'Fintech', 'FINTECH', 'Fintech brand'],
].map(([slug, file, category, card]) => ({
  slug, file, category, card, featured: slug === 'redbull', editable: slug === 'redbull',
  defaultBrand: slug === 'redbull' ? 'Red Bull' : DATA[file].brand,
}));
export const deckBySlug = slug => DECKS.find(d => d.slug === slug);

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Full deck markup (a run of <section> slides) for a deck, with `brand` swapped in on standard decks.
export function deckHTML(deck, brand) {
  if (deck.slug === 'redbull') return withTavesSlot(redbull).split('{{ASSETS}}').join(ASSETS);
  const d = DATA[deck.file], b = esc(brand || d.brand);
  return standard
    .replace(/{{([A-Z0-9_]+)}}/g, (m, k) => (k in d.slots ? d.slots[k] : m))
    .split('{{BRAND}}').join(b)
    .split('{{ASSETS}}').join(ASSETS);
}

// Red Bull proof slide: the EP.13 (Taves) box has no still in the design, only an outlined "13".
// Give it the same replaceable image + gradient as the other four boxes. Until a photo is added the
// image is a transparent pixel and the gradient stays hidden, so the box looks exactly as designed;
// once filled, the "13" placeholder hides (see .slide rules in styles.css).
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const TAVES_BOX = '<div style="position:relative;border-radius:24px;overflow:hidden;border:1px solid #1c1c1e;display:flex;flex-direction:column;justify-content:flex-end;padding:28px;background:#08080a">';
const TAVES_GHOST = '<div style="position:absolute;top:28px;left:-10px;font-size:220px;';
function withTavesSlot(html) {
  const i = html.indexOf(TAVES_BOX);
  if (i < 0 || html.indexOf(TAVES_GHOST, i) !== i + TAVES_BOX.length) { console.warn('Red Bull proof slot not found'); return html; }
  const slot = `<img data-img="rb-still-13" data-empty="1" src="${BLANK}" alt="" style="position:absolute;inset:0;width:100%;height:100%;filter:grayscale(1) contrast(1.08) brightness(0.7);object-fit:cover;object-position:50% 25%">` +
    '<div data-fill-only="1" style="position:absolute;inset:0;background:linear-gradient(to top, #000 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.1) 100%)"></div>';
  const at = i + TAVES_BOX.length;
  return html.slice(0, at) + slot + html.slice(at).replace(TAVES_GHOST, '<div data-empty-only="1" data-noedit="1" style="position:absolute;top:28px;left:-10px;font-size:220px;');
}
