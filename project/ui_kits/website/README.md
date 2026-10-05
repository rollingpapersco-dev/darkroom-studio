# Darkroom website — UI kit

Click-through recreation of darkroom-site (https://darkroom-site.vercel.app), built from the repo's HTML/CSS.

- `index.html` — app shell; NavBar routes between screens (page persists in localStorage).
- `Home.jsx` — hero, scroll-driven 3D episode carousel (same transform math as index.html), post-carousel CTA.
- `Archive.jsx` — episodes.html grid.
- `Interviews.jsx` — interviews.html.
- `Pricing.jsx` — pricing.html three tiers.
- `About.jsx` — doctrine + rules, apply CTA, 3-step Artist Entry Portal overlay.
- `data.js` — sample episode data (see TODOs — live site pulls from YouTube).
- `loader.js` — loads component sources in-browser for this preview.

Not recreated: hero background video (`/hero-bg.mp4` isn't in the repo — hero shows plain black), YouTube hover previews, admin.html, mobile menu.
