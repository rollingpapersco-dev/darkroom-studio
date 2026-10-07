# Darkroom Studio (installable PWA)

Darkroom's in-house app: phone first, installs to the home screen and works offline. It has three sections,
switched from the nav at the top:

- **Studio**: the Social Studio from the first Claude Design handoff (`project/ui_kits/social/Social Studio.dc.html`),
  with all 17 templates and their edit controls, plus PNG and 4K export.
- **Calendar** (`#calendar`): the 28-day Archives posting calendar from `design_handoff_pitches_calendar/`.
- **Pitches** (`#pitches`): the eleven brand partnership decks from the same handoff, with PDF export.

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

### Calendar

- Tap a day to open its details: format, pillar, platforms, post time, asset and note.
- **Copy caption** copies the caption and hashtags.
- **Mark as posted** fades the card and moves the "N of 28 posted" bar. Posted days are saved on this device.
- Today's card has a red border.

### Pitches

- **Open** shows the deck as a scrolling list of slides.
- **Present ▶** shows one slide at a time, full screen. Tap the right side or press → to go forward, the left
  third or ← to go back, and Esc to exit.
- **Export PDF ↓** builds the PDF in the app and offers **Save / Share** or **Download**:
  - **Pages:** one slide per page, **1440 × 810 pt** (1920 × 1080 px at 96 dpi; 20 × 11.25 in), 16:9. That's the
    same shape as widescreen Keynote, PowerPoint and Google Slides, so the PDF fills a 16:9 screen with no bars.
  - **Rendering:** each slide is rendered at 3840 × 2160 and stored as a JPEG with photos baked to black and white,
    so images come out the same on every device. Text is part of the image, so it can't be selected in the PDF.
  - **From the index:** Export PDF opens the deck and starts the export.
  - **Browser print:** desktop printing (Cmd/Ctrl+P) still uses the one-slide-per-page print rules.
- Standard decks have a **Brand** field that replaces the brand name throughout the deck. Use it to swap
  "[Your brand]" (Drinks, Streetwear, Fintech) or to pitch Sennheiser or JBL instead of Shure, or Airtel instead
  of MTN. It's saved per deck.
- **Red Bull** has **Edit**:
  - **Text:** tap any text to change it.
  - **Images:** tap a photo or logo to replace it (camera roll or drag and drop), then set zoom and X/Y.
    All five proof boxes take a photo. The design had no still for EP.13 (Taves), so that box shows its
    outlined "13" until you add one.
  - **Reset all** clears every edit.
  - Edits are saved on this device: text in localStorage, images in IndexedDB.

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
| `src/Root.jsx` | Section nav and hash routing (`#calendar`, `#pitches`, `#pitch/<slug>[/print]`; anything else is the Studio) |
| `src/calendar/` | Posting calendar; `posting-calendar.json` is the handoff's seed data, used as is |
| `src/pitches/standard-deck.html`, `decks.json` | The ten standard decks: one template (the Apple Music deck's markup) plus each brand's copy |
| `src/pitches/redbull-deck.html`, `editor.js` | Red Bull deck markup (verbatim) and its in-place editor (ported from `pitch-editor.js`) |
| `src/pitches/Deck.jsx` | Deck viewer: slide list, Present mode, PDF export, print rules, Brand field |
| `src/pitches/pdf.js` | Minimal PDF writer: one full-page JPEG per page |
| `scripts/gen-decks.py` | Regenerates the deck files from the handoff and checks that they reproduce all ten decks exactly |

The boards are checked pixel for pixel against the prototype. All 17 templates, at their defaults
and with customised type, logo, tint, B&W and aspect settings, render identically. The calendar, the pitches
index and all 79 deck slides (in print layout, which is what the PDF uses) also match their prototypes pixel for pixel.
Slides keep the design runtime's defaults: content-box sizing, and `text-wrap: pretty` on body text and
`balance` on headings.

### Differences from the prototype

- **Export B&W:** the black-and-white and tint look is computed in JavaScript rather than with canvas
  `ctx.filter`, so it now matches in Safari and iOS too. The prototype noted Safari as a gap.
- **Fonts:** Playfair Display is bundled, not loaded from Google Fonts, so the serif works offline and in exports.
- **Reliable photos in exports:** each photo is embedded at the size it covers in the export, not its full source
  size. The snapshot is then drawn repeatedly until two draws are identical, so a draw made before the photos
  finished decoding (a common cause of missing images, especially in Safari) is never the one saved.
- **Text inputs:** they use 16px text so iOS doesn't zoom in when a field is focused.

Regenerate the home-screen icons from `public/assets/logo.png` with `npm run icons` (needs Playwright).
