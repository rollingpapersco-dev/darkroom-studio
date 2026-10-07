# Handoff: Brand Pitches + Posting Calendar

## Overview
This package adds two sections to the existing Darkroom app:

1. **Brand Pitches**: an index of 11 partnership decks. Ten are tailored to a brand category (Apple Music, Spotify, Audiomack, Boomplay, YouTube Music, Audio Gear, Telcos, Drinks, Streetwear, Fintech). The eleventh is a featured, more visual Red Bull deck with editable text and images.
2. **Posting Calendar**: a 28-day social schedule (Tue 6 Oct – Mon 2 Nov 2026), one main post per day. Each post has a caption, platforms, asset and notes. Users can copy the caption and mark the post as posted.

Add both as new routes or tabs alongside the sections that already exist (Social Studio, Social Idents, Between Seasons Plan, Archives).

## About the Design Files
The files in this bundle are **design references built in HTML**. They are prototypes that show the intended look and behaviour, not production code to copy. The `.dc.html` files run on a small design runtime (`support.js`), and the decks use a `deck-stage.js` web component. **Recreate them inside the existing Darkroom app using its own framework, routing and components.** Do not ship the HTML as-is.

## Fidelity
**High-fidelity.** Colours, type, spacing and copy are final. Match them exactly using the app's existing tokens.

## Design Tokens (Darkroom)
- Background `#000000`; raised surface `#08080a`; selected surface `#0c0c0e`
- Hairline / border `#1c1c1e`; stronger border `#2c2c2e`; hover border `rgba(255,255,255,0.35)`
- Text: primary `#ffffff`, body `#f5f5f7`, muted `#86868b`
- Accent (sparingly: flags, "Recommended", progress, today) `#C8362A`
- Sans: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Serif accent: `"Playfair Display", Georgia, serif`, italic 400, muted colour. Always the second half of a headline, e.g. "Twenty-eight days. *Fifteen takes.*"
- Headlines: weight 800, letter-spacing −0.04 to −0.05em, line-height ~1
- Eyebrows: 12px (app) / 24px (slides), weight 600–700, uppercase, letter-spacing 0.1–0.14em, muted
- Radii: cards 16px (app) / 24–28px (slides); pills 14–22px
- Imagery: always black and white: `filter: grayscale(1) contrast(1.08–1.12) brightness(0.7–0.85)`, usually with a black gradient towards the text. Brand logos are the **only** colour.

---

## Screen 1: Brand Pitches index
**File:** `pitches/Brand Pitches.dc.html`

- Page: black, padding 48px / clamp(16px, 4vw, 56px); content max-width 1200px; column gap 32px
- Header: Darkroom logo at 22px height; eyebrow "Partnership decks · Season Two"; H1 "Brand pitches. *Eleven rooms.*" (clamp 40–72px, 800, −0.045em)
- Grid: `repeat(auto-fill, minmax(240px, 1fr))`, gap 12px
- Card: `#08080a`, 1px `#1c1c1e`, radius 16px, padding 22px. Contents: category eyebrow (11px, 700, 0.1em, muted), brand name (22px, 800, white), then a row of two pills:
  - **Open**: outline pill, 12px 600, border `#1c1c1e`, padding 6px 12px, radius 14px
  - **Export PDF ↓**: white pill, black text
- Red Bull card is featured and first: `#0c0c0e`, 2px white border, eyebrow "ENERGY · FEATURED" in `#C8362A`
- Footer notes (13px, muted) explain the "[Your brand]" placeholders and the PDF steps

**Export PDF behaviour:** open the deck with print styles and call `window.print()` once fonts have loaded (`document.fonts.ready` + ~1.2s). Print rules: one slide per page, 1920×1080 landscape, `print-color-adjust: exact`, toolbar hidden. In the real app you could generate the PDF server-side instead (e.g. Puppeteer) for a direct download.

## Screen 2: Pitch deck (shared structure, 10 decks)
**Files:** `pitches/Pitch - <Brand>.dc.html`. 1920×1080 slides, padding 96px 120px.

1. **Title**: B&W still on the right 58%, black gradient from the left; logo + "A ROLLINGPAPERSCO PRODUCTION"; eyebrow "Partnership proposal · Season Two · 2026"; "Darkroom × *Brand.*" at 150px; line "Stripped-back performances in black and white. Live from Lagos."
2. **The show**: two columns: the three-paragraph format description (verbatim, 28px) + a tall B&W still (620px column); artist list beneath
3. **Proof**: five image cards with big numbers: 15k IG (EP.04 Oluwamillar), ~15k IG (EP.13 Taves, no still, outlined "13"), 12k IG (EP.07 Cleverboy), 10k IG (EP.05 Nelly Baradi), 3k YouTube (EP.03 Purple Emoji). Callout: Nelly Baradi show placements with YKB and Active Boizz
4. **Momentum**: The Archives campaign, with targets: IG 500+ followers, 500+ YT views per episode, 200 Season Two sign-ups
5. **Why <Brand>**: three numbered cards (tailored per brand)
6. **Ways to partner**: two tailored options on top ("Recommended" with a white 2px border; "Also strong"), the remaining four of six formats below, closing with "Let's talk." No prices.
7. **Contact**: ghost "DARKROOM" type; "Let's put *Brand* in the room."; RollingPapersCo · rollingpapersco@gmail.com · 08141659162

Store per-brand content as data (brand name, "Why" headline + 3 reasons, 2 lead asks) and render one shared deck component.

## Screen 3: Red Bull deck (featured, 9 slides, editable)
**Files:** `pitches/Pitch - Red Bull.dc.html` + `pitches/pitch-editor.js`

1. Title: full-bleed still, "Darkroom × *Red Bull.*" at 200px, Red Bull lockup beside the production credit
2. The show: format text + two overlapping stills
3. The look: Close-up / Medium / Full-body stills (1.2fr 1fr 0.8fr)
4. Proof (as above)
5. What Red Bull gains: six cards, 3×2: **The only colour** (featured: the can is the only colour in a B&W room), Artist interviews (product present), Title ownership, Underground to headliners, Content library, A live finale
6. How it looks: 5-item list + a 9:16 episode card mockup with a "PRESENTED BY" + Red Bull bulls lockup
7. Wishlist: a "From the underground *to the headliners.*" grid with a 300px label column and 4 tiles per row: **Established** (Seyi Vibez, BNXN, Ruger, Zlatan) · **Rising** (Odumodublvck, Shallipopi, Qing Madi, Victony) · **Underground** (3 TBA + "Red Bull's pick" open slot)
8. Ways to partner: Title partner (recommended) / Red Bull episodes / Darkroom Live × Red Bull
9. Contact with Darkroom × Red Bull logos

**Editing (see `pitch-editor.js`):** an "Edit" toggle (top right) makes every text node `contenteditable`, with a dashed red outline. It also makes every image selectable, opening a bottom panel with: Replace image (file picker or drag-drop), Zoom 100–300%, X/Y 0–100 (object-position + transform-origin), and Reset. "Reset all" clears everything. Persistence in the prototype: text and image positions in localStorage, image data in IndexedDB. In the app, save these server-side per deck. Stills stay grayscale; logos keep their colour.

## Screen 4: Posting Calendar
**File:** `plans/Posting Calendar.dc.html` · **Data:** `data/posting-calendar.json`

- Header: logo, "The Archives · Season One"; eyebrow "Posting calendar · Tue 6 Oct – Mon 2 Nov 2026"; H1 "Twenty-eight days. *Fifteen takes.*"; progress "N of 28 posted" with a 200×4px bar (fill `#C8362A`)
- Legend row (top and bottom hairlines), one dot per post type ("pillar"): The Take (filled `#f5f5f7`), The Room (outlined muted), The Words (filled muted), The Call (filled `#C8362A`). Right side: "Every day: Stories (out-now card, poll, link sticker) + one X clip · post 6–9pm WAT"
- Four week sections: label (12px, 700, muted) + theme (22px, 800) + note (13px muted); day grid `repeat(auto-fill, minmax(190px, 1fr))`, gap 10px
- Day card: `#08080a`, 1px `#1c1c1e`, radius 16px, padding 16px, min-height 230px. Contents: day-of-week + month eyebrow, date number (30px, 800), flag at top right (TODAY / BOOST / COLLAB / BATCH…; red for today and boosts), pillar dot + format, title (15px, 700), caption clamped to 4 lines (12px muted), platforms at the bottom
  - **Today**: `#0c0c0e` background with a `#C8362A` border. **Selected**: white border. **Posted**: 50% opacity, flag "POSTED ✓"
- Click a card to open a right drawer (min(460px, 100%), `#08080a`, left hairline) over a black scrim at 60% opacity. The drawer shows: long date + title; a details grid (Format, Pillar, Platforms, Post at, Asset); a caption box with hashtags and a **Copy caption** button (shows "Copied ✓"); a note; and a **Mark as posted** toggle (red outline, which becomes muted "Posted ✓ · undo")
- State: `selectedDay`, `postedDays` (persist per user), `copied`

## Assets
- `assets/logo.png`: Darkroom wordmark
- `assets/episodes/ep01–ep09.jpg`: episode stills (always rendered B&W)
- `assets/brands/redbull-lockup.png`, `redbull-bulls.png`: supplied by the user, trimmed to transparent PNG. Brand logos are trademarks; get approved versions before sending externally.

## Files
- `pitches/Brand Pitches.dc.html`: index
- `pitches/Pitch - *.dc.html`: 11 decks
- `pitches/pitch-editor.js`: Red Bull edit/replace logic
- `pitches/deck-stage.js`, `support.js`: prototype runtime only (don't port)
- `plans/Posting Calendar.dc.html`: calendar
- `data/posting-calendar.json`: all 28 posts with captions (use directly as seed data)

## Open content items
- EP.02 artist and track are unknown; EP.03, EP.04, EP.05 and EP.07 have no track title
- "@[artist]" placeholders in collab captions
- "[Your brand]" in the Drinks, Streetwear and Fintech decks
- No prices on any deck (intentional)
