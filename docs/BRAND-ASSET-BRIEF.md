# Ember — Brand Asset Brief (prompt for Manus)

Paste the block below into Manus. It specifies the full brand package **and** the
format/color rules that let the results drop into this React + Vite + TypeScript
codebase (which enforces a single color source in `tokens.ts` and uses no
animation dependencies).

---

You are designing the complete visual brand package for **Ember**, a mobile-first
emotional-accountability app. Deliver production-ready, developer-drop-in assets.

## About Ember
Ember helps people keep daily commitments ("journeys"). The user checks in each
day; a living **ember/flame** represents the vitality of their commitment. Miss
days and the flame weakens; keep the streak and it thrives. The app is
**dark-mode-first**, **mobile-first** (≤430px), minimal, warm, and symbolic (the
current UI uses spare geometric glyphs like ◈ ◉ ○). Tone: intimate, encouraging,
a little poetic — not corporate, not loudly gamified.

## The core symbol: a living ember
The centerpiece is a single **ember/flame mark** rendered at **5 vitality states**
driven by the app's engine. Design ONE cohesive mark, then 5 variations with the
same DNA but different life:
1. **Thriving** — strongest: full, bright flame, radiant glow.
2. **Stable** — healthy: steady flame, gentle glow.
3. **Struggling** — dimmed: smaller, flickering, less glow.
4. **Critical** — nearly out: faint, thin, barely holding.
5. **Dormant** — extinguished: cold grey ash, no glow.

The mark must read clearly at **16px** (favicon) up to hero size. Geometric and
minimal to match the glyph aesthetic — avoid photorealism or heavy detail.

Also design a **"scar"** treatment: a subtle permanent crack that can overlay the
ember to show healed breaks (broken-then-recovered streaks). It should accumulate
(design for 0–3 visible) and read as a healed seam, not damage-in-progress.

## Deliverables (the full package)
1. **Primary logo lockups**: (a) horizontal mark + wordmark, (b) stacked,
   (c) mark-only. Wordmark "Ember" — pick a clean, warm typeface (lowercase feels
   right); give the font name/source AND supply the wordmark as outlined paths.
2. **The ember mark, 5 state variants** (above) as individual SVGs.
3. **Companion mark** (secondary entity): a small distinct symbol with its own 5
   emotional states — present, hopeful, worried, grieving, dormant — that reacts
   alongside the ember. Simpler/more abstract than the ember.
4. **App icon / favicon**: maskable icon (safe-area aware) + `favicon.svg`; plus
   512, 192, 180 (apple-touch), 32, 16 exports.
5. **Open Graph / social image** (1200×630).
6. **Monochrome + inverse** variants of the mark and logo.

## Brand palette (match exactly — this is the app's design-token source of truth)
- Ember (primary) `#E8613A` · Ember-dim `#B84B2A` · Ember-glow `#FF8A5B` · On-ember text `#FFF8F4`
- Warm darks: coal `#1A1208` · ash `#2E2416` · smoke `#3D3020`
- App background `#080808` · Foreground text `#F0E8E0`
- State accent tints (surrounding UI, for reference): thriving green `#A8D5AA` ·
  stable blue `#A0B8D4` · struggling amber `#D4B48A` · critical red `#D48A8A`/`#C84A4A` ·
  dormant grey `#666666`

The ember stays warm/orange across the living states (vitality shown via
brightness, size, and glow), desaturating to grey only when **dormant**;
**critical** may shift slightly toward red.

## Technical requirements (critical for drop-in — React + Vite + TS)
- **Format: optimized SVG** (run through SVGO). No embedded raster, no `<image>`,
  no external font references (convert all text to outlined paths).
- **Color must be tokenizable.** The app enforces a single color source
  (`tokens.ts`) with a lint that bans raw hex in components — so for the mark and
  logo SVGs, **do not bake final hex into fills**. Use `fill="currentColor"` for
  single-color marks, and for multi-tone marks use a small, documented set of CSS
  custom properties referenced as `fill="var(--ember-flame)"`:
  `--ember-flame`, `--ember-flame-bright`, `--ember-core`, `--ember-glow`, `--ember-scar`.
  Include a README mapping each variable to its palette hex. Fixed-color assets
  (favicon, OG image) may bake color.
- **No animation in the files** — no SMIL, no embedded JS, no Lottie. Deliver the
  static shapes/states; motion is implemented in-app with CSS. Optionally include
  a one-page motion spec (suggested easing + feel per state).
- **Clean structure**: sensible square `viewBox` for the mark, centered, minimal
  node count, and **named groups** (`flame`, `core`, `glow`, `scar`) so parts can
  be targeted in code.

## Package delivery
```
/ember-brand/
  /mark/       ember-thriving.svg  ember-stable.svg  ember-struggling.svg
               ember-critical.svg  ember-dormant.svg  ember-scar.svg
  /logo/       logo-horizontal.svg  logo-stacked.svg  logo-mark.svg
               logo-mono.svg  logo-inverse.svg
  /companion/  companion-present.svg … companion-dormant.svg
  /icon/       favicon.svg  icon-512.png  icon-192.png  apple-touch-180.png
               favicon-32.png  favicon-16.png  icon-maskable.svg
  /social/     opengraph-1200x630.png
  README.md    (CSS-variable → hex mapping · font name/license · motion spec)
```
Prioritize **/mark (5 states)** and **/logo** — those wire into the app first.
