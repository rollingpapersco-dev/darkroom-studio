// Template catalogue, ported from project/ui_kits/social/Social Studio.dc.html.
const BASE = import.meta.env.BASE_URL;
export const LOGO = BASE + 'assets/logo.png';
export const EPI = n => BASE + 'assets/episodes/ep' + String(n).padStart(2, '0') + '.jpg';
export const CREDIT = 'A ROLLINGPAPERSCO PRODUCTION';
const HANDLE = '@darkroomperformances';
const STORY_SAFE = [{ x: 0, y: 0, w: 1080, h: 250 }, { x: 0, y: 1580, w: 1080, h: 340 }];

const ARCH_SIZES = [['4:5', 1080, 1350], ['9:16', 1080, 1920, STORY_SAFE], ['1:1', 1080, 1080], ['16:9', 1920, 1080]];
export const TEMPLATES = {
  archA: { name: 'Archives A · Full-bleed', group: 'Archives', w: 1080, h: 1350, sizes: ARCH_SIZES,
    fields: [['img', 'Still', 'image'], ['badge', 'Badge'], ['eyebrow', 'Eyebrow'], ['title', 'Title (line breaks ok)', 'area'], ['sub', 'Serif line'], ['date', 'Date'], ['platforms', 'Platforms'], ['handle', 'Handle']],
    d: { img: EPI(9), imgX: 50, imgY: 20, badge: 'COMING SOON', eyebrow: 'SEASON ONE · EP.01 – EP.15', title: 'The\nArchives.', sub: 'Fifteen takes. Back in the room.', date: 'From 5 Oct', platforms: '· IG · TikTok · YouTube', handle: HANDLE } },
  archB: { name: 'Archives B · Framed', group: 'Archives', w: 1080, h: 1350, sizes: ARCH_SIZES,
    fields: [['img', 'Still', 'image'], ['badge', 'Frame badge'], ['eyebrow', 'Eyebrow'], ['title', 'Title'], ['titleEm', 'Title (serif)'], ['sub', 'Sub line', 'area'], ['date', 'Date'], ['handle', 'Handle'], ['ghost', 'Ghost word']],
    d: { img: EPI(5), imgX: 50, imgY: 20, badge: 'EP.01 – EP.15', eyebrow: 'COMING SOON', title: 'Darkroom', titleEm: 'Archives.', sub: 'Season One, revisited. One take at a time.', date: 'From 5 Oct', handle: HANDLE, ghost: 'ARCHIVE' } },
  announceA: { name: 'Announcement A', group: 'Episode', w: 1080, h: 1350,
    fields: [['img', 'Still', 'image'], ['ep', 'Episode badge'], ['eyebrow', 'Eyebrow'], ['artist', 'Artist (line breaks ok)', 'area'], ['track', 'Track'], ['genre', 'Genre'], ['showCredit', 'RPCO credit', 'toggle'], ['handle', 'Handle']],
    d: { img: EPI(8), imgX: 72, imgY: 15, ep: 'EP.08', eyebrow: 'Season One · Episode 08', artist: 'RANDY\nMORGAN', track: 'Changes', genre: 'Hip-Hop · Rap', showCredit: true, handle: HANDLE } },
  announceB: { name: 'Announcement B', group: 'Episode', w: 1080, h: 1350,
    fields: [['img', 'Still', 'image'], ['ep', 'Episode badge'], ['artist', 'Artist'], ['track', 'Track'], ['genre', 'Genre'], ['context', 'Context line', 'area'], ['showCredit', 'RPCO credit', 'toggle'], ['handle', 'Handle']],
    d: { img: EPI(9), imgX: 50, imgY: 15, ep: 'EP.09', artist: 'FIDO', track: 'Dance for Jesus', genre: 'Afrofusion · Street-Gospel', context: 'A record built for fifty thousand people, performed in a room built for one.', showCredit: true, handle: HANDLE } },
  outA: { name: 'Out now A', group: 'Episode', w: 1080, h: 1920, safe: STORY_SAFE,
    fields: [['img', 'Still', 'image'], ['ep', 'Episode badge'], ['label', 'Label'], ['artist', 'Artist (line breaks ok)', 'area'], ['track', 'Track'], ['cta', 'Button'], ['handle', 'Handle']],
    d: { img: EPI(6), imgX: 50, imgY: 50, ep: 'EP.06', label: 'Out now', artist: 'YKB AND\nDANPAPA', track: 'Dey My Body', cta: 'Stream Episode ↗', handle: HANDLE } },
  outB: { name: 'Out now B', group: 'Episode', w: 1080, h: 1920, safe: STORY_SAFE,
    fields: [['img', 'Still', 'image'], ['ep', 'Episode badge'], ['eyebrow', 'Eyebrow'], ['headline', 'Headline'], ['headlineEm', 'Headline (serif)'], ['artist', 'Artist'], ['genre', 'Genre'], ['activeEp', 'Active pill', 'number'], ['totalEps', 'Total episodes', 'number'], ['handle', 'Handle']],
    d: { img: EPI(5), imgX: 50, imgY: 15, ep: 'EP.05', eyebrow: 'The Archive · Season One', headline: 'EP.05 is', headlineEm: 'live.', artist: 'NELLY BARADI', genre: 'Afrobeats', activeEp: 5, totalEps: 9, handle: HANDLE } },
  coming: { name: 'Coming soon', group: 'Episode', w: 1080, h: 1350,
    fields: [['eyebrow', 'Eyebrow'], ['big', 'Big text'], ['em', 'Serif line'], ['season', 'Footer label'], ['range', 'Footer highlight'], ['handle', 'Handle']],
    d: { eyebrow: 'Next in the room', big: 'EP.10', em: 'Coming soon.', season: 'Season One ·', range: 'EP.01–10', handle: HANDLE } },
  lyricA: { name: 'Lyric card A', group: 'Episode', w: 1080, h: 1350,
    fields: [['ep', 'Episode badge'], ['quote', 'Quote', 'area'], ['quoteEm', 'Quote ending (serif)'], ['artist', 'Artist'], ['track', 'Track'], ['genre', 'Genre'], ['handle', 'Handle']],
    d: { ep: 'EP.08', quote: 'I don dey see', quoteEm: 'changes.', artist: 'RANDY MORGAN', track: 'Changes', genre: 'Hip-Hop · Rap', handle: HANDLE } },
  lyricB: { name: 'Lyric card B', group: 'Episode', w: 1080, h: 1350,
    fields: [['img', 'Still', 'image'], ['quote', 'Quote', 'area'], ['quoteEm', 'Quote ending (serif)'], ['attribution', 'Attribution'], ['handle', 'Handle']],
    d: { img: EPI(9), imgX: 50, imgY: 15, quote: 'A record built for fifty thousand people, performed in', quoteEm: 'a room built for one.', attribution: 'FIDO · EP.09', handle: HANDLE } },
  lineup: { name: 'Season lineup', group: 'Episode', w: 1080, h: 1350,
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['titleEm', 'Title (serif)'], ['count', 'Count'], ['cta', 'Footer line'], ['handle', 'Handle']].concat(Array.from({ length: 15 }, (_, i) => i + 1).map(n => ['img' + n, 'EP.' + String(n).padStart(2, '0') + ' still', 'image'])),
    d: Object.assign({ eyebrow: 'The Archive', title: 'Season', titleEm: 'One', count: 'Playlist · 15 episodes', cta: 'Stream every episode ↗', handle: HANDLE },
      ...Array.from({ length: 15 }, (_, i) => i + 1).map(n => ({ ['img' + n]: n <= 9 ? EPI(n) : '', ['img' + n + 'X']: 50, ['img' + n + 'Y']: 15 }))) },
  apply: { name: 'Apply to feature', group: 'Promo', w: 1080, h: 1920, safe: STORY_SAFE,
    fields: [['eyebrow', 'Eyebrow'], ['headline', 'Headline'], ['headlineEm', 'Headline (serif)'], ['body', 'Body', 'area'], ['rule1', 'Rule 01'], ['rule2', 'Rule 02'], ['rule3', 'Rule 03'], ['cta', 'Button'], ['url', 'URL line'], ['showCredit', 'RPCO credit', 'toggle']],
    d: { eyebrow: 'Lagos · Nigeria · Now casting', headline: 'Your record.', headlineEm: 'This room.', body: 'Applications are reviewed manually by our core visual directors team.', rule1: 'No audience', rule2: 'No second chances', rule3: 'No unbranded content', cta: 'Apply to Feature', url: 'darkroom-site.vercel.app · ' + HANDLE, showCredit: true } },
  pricing: { name: 'Pricing promo', group: 'Promo', w: 1080, h: 1350,
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['titleEm', 'Title (serif)'], ['t1name', 'Tier 1 name'], ['t1desc', 'Tier 1 details'], ['t1price', 'Tier 1 price'], ['t2name', 'Tier 2 name (featured)'], ['t2desc', 'Tier 2 details'], ['t2price', 'Tier 2 price'], ['t3name', 'Tier 3 name'], ['t3desc', 'Tier 3 details'], ['t3price', 'Tier 3 price'], ['unit', 'Unit'], ['cta', 'Button'], ['handle', 'Handle']],
    d: { eyebrow: 'Studio Access · Lekki', title: 'Performance', titleEm: 'Tiers', t1name: 'TIER 01 · BASIC', t1desc: 'Single camera · Teaser cut · Rollout cards', t1price: '₦200k', t2name: 'TIER 02 · STANDARD', t2desc: 'Multi-camera · Pro grade · Reels/TikTok cut', t2price: '₦350k', t3name: 'TIER 03 · PREMIUM', t3desc: 'DP · Custom set · Interview + BTS', t3price: '₦1M+', unit: '/ PER EPISODE', cta: 'Apply to Record', handle: HANDLE } },
  countdown: { name: 'Countdown', group: 'Promo', w: 1080, h: 1920, safe: STORY_SAFE,
    fields: [['eyebrow', 'Eyebrow'], ['number', 'Number'], ['unit', 'Unit (serif)'], ['filled', 'Segments filled', 'number'], ['total', 'Segments total', 'number'], ['handle', 'Handle']],
    d: { eyebrow: 'EP.10 enters the room in', number: '3', unit: 'days.', filled: 4, total: 7, handle: HANDLE } },
  ytThumb: { name: 'YouTube thumbnail', group: 'Platform', w: 1280, h: 720,
    fields: [['img', 'Still', 'image'], ['ep', 'Episode badge'], ['artist', 'Artist (line breaks ok)', 'area'], ['track', 'Track']],
    d: { img: EPI(8), imgX: 50, imgY: 15, ep: 'EP.08', artist: 'RANDY\nMORGAN', track: 'Changes' } },
  tiktok: { name: 'TikTok cover', group: 'Platform', w: 1080, h: 1920, safe: [{ x: 0, y: 240, w: 1080, h: 1440 }],
    fields: [['img', 'Still', 'image'], ['ep', 'Episode badge'], ['artist', 'Artist'], ['track', 'Track']],
    d: { img: EPI(1), imgX: 50, imgY: 50, ep: 'EP.01', artist: 'KJUNI', track: 'Leather' } },
  xHeader: { name: 'X / Twitter header', group: 'Platform', w: 1500, h: 500, safe: [{ x: 40, y: 350, w: 260, h: 150 }],
    fields: [['img1', 'Still 1', 'image'], ['img2', 'Still 2', 'image'], ['img3', 'Still 3', 'image'], ['eyebrow', 'Eyebrow'], ['line', 'Headline (line breaks ok)', 'area'], ['em', 'Serif line']],
    d: { img1: EPI(5), img2: EPI(8), img3: EPI(9), eyebrow: 'Lagos · Nigeria', line: 'One room.\nOne take.', em: 'No spectacle.' } },
  ytBanner: { name: 'YouTube banner', group: 'Platform', w: 2560, h: 1440, safe: [{ x: 507, y: 508, w: 1546, h: 423 }],
    fields: [['headline', 'Headline'], ['em', 'Serif line'], ['showCredit', 'RPCO credit', 'toggle']],
    d: { headline: 'One room. One take.', em: 'No spectacle.', showCredit: true } },
};
export const ORDER = Object.keys(TEMPLATES);
export const GROUPS = ['Archives', 'Episode', 'Promo', 'Platform'];

export function dimsOf(k, data) {
  const T = TEMPLATES[k]; if (!T.sizes) return T;
  const i = (data[k] || {}).size ?? 0; const z = T.sizes[i] || T.sizes[0];
  return { ...T, w: z[1], h: z[2], safe: z[3] };
}

const SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif';
const SERIF = "'Playfair Display',Georgia,serif";
export const TYPE_OPTS = {
  font: [['Default', null], ['Sans', 'sans'], ['Serif italic', 'serif'], ['Sans italic', 'sansi']],
  weight: [['Default', null], ['400', 400], ['600', 600], ['800', 800]],
  color: [['Default', null, ''], ['White', '#ffffff', '#ffffff'], ['Soft', '#f5f5f7', '#f5f5f7'], ['Grey', '#86868b', '#86868b'], ['Red', '#C8362A', '#C8362A']],
  case: [['Default', null], ['Aa', 'none'], ['AA', 'uppercase']],
};

export function typeVars(key, t) {
  const v = {};
  if (!t) return v;
  if (t.s != null && t.s !== 100) v['--s-' + key] = String(t.s / 100);
  if (t.ls != null) v['--ls-' + key] = (t.ls / 100) + 'em';
  if (t.font === 'sans') { v['--ff-' + key] = SANS; v['--fs-' + key] = 'normal'; }
  if (t.font === 'sansi') { v['--ff-' + key] = SANS; v['--fs-' + key] = 'italic'; }
  if (t.font === 'serif') { v['--ff-' + key] = SERIF; v['--fs-' + key] = 'italic'; if (t.w == null) v['--w-' + key] = '400'; }
  if (t.w != null) v['--w-' + key] = String(t.w);
  if (t.c) v['--c-' + key] = t.c;
  if (t.tt) v['--tt-' + key] = t.tt;
  return v;
}
