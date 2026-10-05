# Darkroom Social Studio (installable PWA)

A mobile app version of the Social Studio from the Claude Design handoff
(`project/ui_kits/social/Social Studio.dc.html`). It has the same 17 templates and the same edit
controls, and exports PNG or 4K. It's built phone first, installs to the home screen and works offline.

## Run

```bash
cd app
npm install
npm run dev       # http://localhost:5173 (also on your LAN, so you can open it on a phone)
npm run build     # production build to dist/ (static files, deploy anywhere, e.g. Vercel)
npm run preview   # serve the production build (includes the service worker)
```

To install on a phone, open the deployed URL. On iPhone, tap Safari's Share button, then **Add to Home Screen**.
On Android, Chrome offers **Install app**. A service worker only registers over HTTPS or on localhost.

## Using it on a phone

- **☰ + template name** (top bar): pick from the Archives, Episode, Promo and Platform groups.
- **Text** tab: every copy field. The **Aa** button opens size, tracking, font, weight, color and case controls.
- **Image** tab: tap to pick a photo from the camera roll, then set Focus X/Y and Scale. You can also
  drag the preview to reframe and pinch to scale.
- **Look** tab: aspect ratio (Archives templates), logo size, black tint, B&W, safe-area guides and reset.
- Tapping the active tab (or ×) hides the panel so the preview gets the full height.
- **Export**: Standard (native size) or 4K (long edge 3840px). On a phone, **Save / Share** opens the share
  sheet (Save Image puts it in Photos). You can also download it, or press and hold the image.

At 960px and wider (tablet landscape or desktop) the app switches to the prototype's three-column layout.

## How it maps to the design

| File | Role |
|---|---|
| `src/board.html` | The template board markup, copied verbatim from the prototype (logo path is templated) |
| `src/boardTemplate.js` | Tiny compiler for the prototype's `{{ }}` / `sc-if` / `sc-for` syntax into React elements |
| `src/templates.js` | Template catalogue, defaults, sizes, safe areas and type-control options (ported) |
| `src/App.jsx` | Mobile shell: preview stage, tabs, sheets, gestures; wide three-column layout |
| `src/exporter.js` | html-to-image export; inlines images and bakes B&W + tint into pixels; embeds Playfair |
| `src/storage.js` | Edits in localStorage, imported images in IndexedDB (same keys as the prototype) |
| `src/tokens/` | Design tokens copied from `project/tokens/` |
| `vite.config.js` | Also generates `sw.js` with a precache list of the build output (offline support) |

The boards are checked pixel for pixel against the prototype. All 17 templates, at their defaults
and with customised type, logo, tint, B&W and aspect settings, render identically.

### Differences from the prototype

- **Export B&W:** the black-and-white and tint look is computed in JavaScript rather than with canvas
  `ctx.filter`, so it now matches in Safari and iOS too. The prototype noted Safari as a gap.
- **Fonts:** Playfair Display is bundled, not loaded from Google Fonts, so the serif works offline and in exports.
- **iOS rendering:** WebKit gets two warm-up render passes, a known workaround for images that are
  missing from the first html-to-image render on iOS.
- **Text inputs:** they use 16px text so iOS doesn't zoom in when a field is focused.

Regenerate the home-screen icons from `public/assets/logo.png` with `npm run icons` (needs Playwright).
