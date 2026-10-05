# Darkroom Design System

Darkroom is a musical performance series from **ROLLINGPAPERSCO (RPCO)**, shot in Lekki, Lagos: artists perform one record in a controlled dark room with no audience. Its marketing site (https://darkroom-site.vercel.app) streams episodes, previews interviews, sells studio packages (priced in ₦) and takes artist applications.

**Source:** GitHub `rollingpapersco-dev/darkroom-site` (branch `main`). It's plain static HTML pages with inline CSS, bundled by Vite. Pages: index, episodes, interviews, about (with the apply portal), pricing, admin. The episodes are loaded live from a YouTube playlist (`yt.js`).

Products covered: **one**, the marketing website → `ui_kits/website/`.

## Index
- `styles.css`: entry point (imports only)
- `tokens/`: `colors.css`, `typography.css`, `spacing.css` (radii, shadow, blur, motion), `fonts.css`
- `components/`
  - `actions/`: Button, Pill
  - `text/`: Eyebrow, Headline + Em, Badge
  - `navigation/`: NavBar, Footer
  - `cards/`: EpisodeCard, CarouselCard, InterviewCard, PriceCard, RuleCard
  - `forms/`: FieldBox, StepTracker
- `ui_kits/website/`: click-through recreation of the site (Home, Archive, Interviews, About + Portal, Pricing)
- `ui_kits/social/Social Idents.dc.html`: social idents: episode announcement, out now, coming soon, lyric card, lineup, apply, pricing, countdown, YouTube thumbnail and banner, TikTok cover, X header, plus a logo sting and ghost-type loop in motion
- `ui_kits/social/Social Studio.dc.html`: editor for the 15 static templates. You can edit copy, drop in images, set the image focus, show safe areas and export PNGs at native size or 4K (long edge 3840px). Edits are saved in the browser.
- `guidelines/`: foundation specimen cards
- `assets/`: `logo.png` (white wordmark), `portal-bg.jpg`, `episodes/ep01–ep10.jpg`
- `SKILL.md`: Agent Skill entry

Component inventory = the recurring CSS class families in the repo (`.btn-primary`, `.btn-ghost`, `.nav-apply`, `.ep-pill`, `.episode-card`, `.ep-card`, `.interview-card`, `.price-card`, `.rule`, `.apple-field-box`, `.apple-step-tracker`, nav, footer).
**Intentional additions:** `Eyebrow`, `Headline`/`Em` and `Badge` are small wrappers around type patterns the site repeats in many places (hero-eyebrow, carousel-eyebrow, pricing-badge; headline `em`; ep-card-num, featured-tag).

## CONTENT FUNDAMENTALS
- **Voice:** terse, declarative, a little severe, like a manifesto. Short sentences and fragments stacked in threes: "One room. One take. *No spectacle.*" / "No audience. No second chances. No unbranded content."
- **Structure:** plain setup lines, then a serif-italic payoff: "Your record. *This room.*", "Every frame must be *earned*."
- **Person:** addresses the artist as **you** ("Are you ready?", "Your record."). The brand refers to itself as "the Darkroom" or "we" ("you will hear from us").
- **Casing:** artist names are ALL CAPS (RANDY MORGAN, FIDO). Labels and eyebrows are uppercase and tracked. Headlines are sentence case, with some all-caps page titles (THE ARCHIVE). Buttons are Title Case ("Stream Episodes", "Apply to Feature", "Apply to Record").
- **Separators:** middle dot `·` (Lagos · Nigeria, TIER 02 · STANDARD, Afrobeats · Street), bullet `•` in interview meta, em dash — between artist and track.
- **Numbering:** EP.01 (zero-padded, with a dot), RULE 01, TIER 01. Prices are ₦200k, ₦350k, ₦1M+.
- **Local texture:** Lagos, Lekki and Benin, with Pidgin quotes ("I don dey see changes.") and track titles in Yoruba (PARIWO, Alubarika).
- **Emoji:** never. The only glyphs are ✓ ✦ ▶ ↗ → ☰ ×.

## VISUAL FOUNDATIONS
- **Color:** a pure #000 canvas. Near-black inks (#08080a, #0c0c0e) for footers and cards, #1c1c1e hairlines, #86868b grey for every secondary label, #f5f5f7 body text and #fff for headings. There is **one accent**, Darkroom red #C8362A, used only for genre tags and the active episode pill (8% red tint). Everything else is monochrome.
- **Type:** system sans (-apple-system/SF Pro) at 800 weight with tight negative tracking (-0.03 to -0.04em) for display. **Playfair Display italic 400 in grey** marks the emotional payoff inside a headline. Body text is 15px/1.47. Labels are 10–12px, uppercase, 600–700 weight, tracked 0.08–0.14em.
- **Backgrounds:** full-bleed black. The hero plays a video at 25% opacity under a black-to-transparent gradient that rises from the bottom. Behind the carousel is a huge outlined "DARKROOM" ghost strip (1px stroke at 5% white) that drifts with scroll. There are no patterns or illustrations, and no colored gradients.
- **Imagery:** low-key performance stills in warm tungsten or single-source light, with subjects emerging from black. Carousel cards desaturate them slightly (`saturate(.85) brightness(.9)`) and add a bottom shade.
- **Cards:** two kinds. **Glass** cards use rgba(18,18,20,.4) with a 1px rgba(255,255,255,.08) border. **Solid** cards use #08080a with a #1c1c1e border. Radii are 16px (archive), 18px (carousel) and 20px (price, rule, interview). There are no shadows except the floating carousel card (0 30px 80px rgba(0,0,0,.65)) and no colored left borders.
- **Borders:** 1px hairlines everywhere. Section headers sit on a bottom hairline, and sections are separated by top hairlines.
- **Buttons:** pills with radius 20–28. Primary is white fill with black text. Ghost is a #1c1c1e outline. The only featured/emphasis treatment is the color inversion to white.
- **Hover:** nav links go from 0.8 to 1 opacity. Primary buttons scale to 1.03. Cards lift by translateY(-4px) and their border brightens from .08 to .2. Ghost and pill borders brighten. On episode cards the arrow gap widens from 4 to 8px. There are no explicit press states. Mobile menu items get a 6% white background on tap.
- **Motion:** 0.2s for UI and 0.3–0.35s ease for cards and reveals. The carousel is scroll-driven 3D (perspective 1400px, rotateY ±20° per step, scale −12%, blur 2.2px per step). A muted YouTube preview crossfades in over 0.6s after a card has been centered for 700ms. The scroll cue pulses on a 2s loop. Reduced motion disables these transitions.
- **Transparency & blur:** the nav is 60% black with blur(30px), the mobile menu uses blur(24px) and episode chips use blur(8px). Blur is used for chrome, never for content.
- **Layout:** the nav is fixed at the top. Gutters are clamp(1.5rem, 5vw, 4rem) (4rem on inner pages, 1.5rem on mobile). Containers are 1200px (1400px for the archive, 720px for forms). The first section clears the nav with 8rem of top padding. Grids use a 2rem gap.

## ICONOGRAPHY
The site has no icon set, icon font or SVGs. It uses Unicode glyphs inline with text: ✓ (feature list, grey or white when featured), ✦ (faint 3% corner mark on interview cards), ▶ (9px, after "Watch"), ↗ (external "Stream Episode"), → ("Coming Soon"), ☰ (mobile menu) and × (close). Keep to these; don't introduce an icon library without a reason. The logo is `assets/logo.png`, a white DARKROOM wordmark on transparent (4043×859), shown at max-height 24px in the nav and always paired with the credit "A ROLLINGPAPERSCO PRODUCTION" after a hairline divider.

## Fonts
- Playfair Display (italic 400/600) loads from Google Fonts, the same as on the site.
- Sans is the OS system stack (SF Pro on Apple, Segoe UI/Roboto elsewhere). No font file is shipped.
