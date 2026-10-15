# Kitakits DVO – Landing Page

A lightweight, static promotional page for **Kitakits DVO**, an event discovery and planning application for Davao City. It is informational only: no login, sign-up, accounts, or backend.

## Project structure

```
index.html        Page markup (all sections)
style.css         Styles and brand variables (colors at the top)
script.js         Mobile menu, footer year, screenshot/QR detection
motion.js         Animation layer (see below)
assets/
  kitakits-submark.png  Wordmark (nav)   kitakits-icon.png  Orchid icon (favicon, footer, hero)
  logo-mark.svg   Old placeholder mark   orchid.svg   Waling-Waling motif
  favicon.svg     Favicon
  screens/        Put Figma screenshot exports here
  qr-code.png     (add after deployment, see below)
tools/make_qr.py  Optional QR generator
```

## Run locally

No build step. Either:

- open `index.html` in your browser, or
- from this folder run `python3 -m http.server 8000` and visit `http://localhost:8000`.

Fonts (Fredoka, Nunito) load from Google Fonts, so an internet connection is needed to see them.

## Add your Figma screenshots

Export the screens from Figma as PNG (2x, ideally under ~300 KB each; compress with squoosh.app) and save them as:

- `assets/screens/event-discovery.png`
- `assets/screens/event-details.png`
- `assets/screens/itinerary.png`
- `assets/screens/budget-dashboard.png`

The striped "Screenshot placeholder" disappears automatically for each file that exists. The hero illustration is a simplified concept graphic with sample values, not a screenshot.

## Edit content

- Footer social/contact placeholders: search `index.html` for `class="edit"`.
- Brand colors: `:root` at the top of `style.css`.

## Deploy to Vercel

**Dashboard:** push this folder to a GitHub repository, then in Vercel choose *Add New → Project*, import the repo, set Framework Preset to **Other**, leave build command and output directory empty, and deploy.

**CLI:** `npm i -g vercel`, then run `vercel --prod` in this folder.

Pick a permanent project name or attach a custom domain before printing anything.

## QR code for the printed brochure

1. Deploy first and note the **permanent production URL** (for example `https://kitakits-dvo.vercel.app` or your custom domain). Do not use `localhost`, a preview URL (ones with a random hash or branch name), or a temporary address.
2. Generate the code, either:
   - **Script:** `pip install "qrcode[pil]"` then `python tools/make_qr.py https://your-permanent-url`. This writes a 1600×1600 px `assets/qr-code.png` (black on white, high error correction, quiet zone included).
   - **Any QR generator** that exports SVG or a large PNG. Use the plain URL, no tracking shortener you don't control.
3. Save it as `assets/qr-code.png` (the page shows it automatically in place of the placeholder), commit, and redeploy.
4. For the A4 tri-fold, use the high-resolution file (or SVG), print at least about 2.5 × 2.5 cm, keep black on white, and leave a clear white margin of at least 4 modules around it. Don't place it over images or fold lines.
5. **Test before printing:** scan a printed proof with at least two phones (iOS and Android) from normal reading distance and confirm it opens the live site.

## Accessibility notes

Semantic landmarks, skip link, keyboard-friendly menu (Esc closes), visible focus states, descriptive alt text, and `prefers-reduced-motion` support.

## Animations (motion.js + the "MOTION LAYER" block at the end of style.css)

Vanilla JS/CSS, no libraries. Inspired by effect types on skiper-ui.com (image cursor trail, hover/tilt cards, drag-and-parallax, reveal), but written from scratch so the page stays static and needs no React/Next.js build.

- Scroll progress bar, header shadow, active nav link
- Hero: headline words rise in, floating mock cards with mouse parallax, orchid icon blooms, orchid petals trail the cursor (desktop only)
- Category marquee between hero and About (pauses on hover)
- Feature cards: cursor spotlight, 3D tilt, icon wiggle
- How It Works: connector line draws as you scroll, numbers pop in
- Preview phones: scroll parallax and hover lift
- Magnetic buttons, pulsing QR halo, slow-turning orchids

Disabled automatically for visitors with "reduce motion" on; touch devices skip the cursor effects.
