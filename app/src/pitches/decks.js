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
  if (deck.slug === 'redbull') return redbull.split('{{ASSETS}}').join(ASSETS);
  const d = DATA[deck.file], b = esc(brand || d.brand);
  return standard
    .replace(/{{([A-Z0-9_]+)}}/g, (m, k) => (k in d.slots ? d.slots[k] : m))
    .split('{{BRAND}}').join(b)
    .split('{{ASSETS}}').join(ASSETS);
}
