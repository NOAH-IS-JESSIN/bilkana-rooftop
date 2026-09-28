# Bilkana Rooftop — digital menu (sales demo)

A frontend-only digital menu for **Bilkana Rooftop** (بالكانا), on the roof of Thousand Nights Hotel, 191 Al Madina Al Monawara St., Amman — built by Mawqeijo to show Bilkana what its menu could be. **Not deployed, not approved by the client, not a delivered product.** No backend, CMS, ordering, payments, bookings or live integrations.

| Read | For |
| :-- | :-- |
| [`BRAND_RESEARCH.md`](BRAND_RESEARCH.md) | The brand audit — what's verified about Bilkana, from where; palette, type, motifs, voice; current digital problems |
| [`MENU_SCOPE.md`](MENU_SCOPE.md) | What this demo may and may not promise; ⚠ no digital-menu product in the catalogue yet; **the 19 EN/AR price conflicts**; open items; sales opportunities |
| [`SITE_ARCHITECTURE.md`](SITE_ARCHITECTURE.md) | Page structure, menu layouts, design + motion system, QA performed, Lighthouse |
| [`ASSET_REGISTER.md`](ASSET_REGISTER.md) | Every image, mark and font: source, crop, treatment, status |

## What's in it

Loader (the كانا sign lights up, the glass roof opens) → hero → **Bilkana Selection** → the full menu (10 categories, 128 items, real prices from Bilkana's official menu) with a rooftop break and a **day-to-night** bridge → visit panel (call · directions · Instagram) → "Your table is waiting." → footer. Sticky category rail + scroll-spy, desktop three-column menu with a crossfading photo, quick-view sheets with image morph, instant EN/AR search, **true RTL Arabic** at `/ar/`, a prototype "My list", mobile dock, reduced-motion and no-JS versions.

## Run

```bash
npm install
npm run dev        # http://localhost:5173   (Arabic: /ar/)
npm run build      # typecheck → client build → SSR build → prerender dist/index.html + dist/ar/index.html
npm run preview    # serves dist on :4173
```

## Change content

- **Menu** — items, prices, categories, Arabic, photos, featured dishes: `src/data/menu.ts` (the only file to edit). Photos: `src/data/media.ts`.
- **Facts** — phone, hours, address, links: `src/content/site.ts` (each value sourced and dated).
- **Interface copy** (EN + AR): `src/content/copy.ts`. Per-language titles/descriptions: `src/content/meta.ts`.

## QA scripts (need `npm run preview` running)

```bash
node scripts/interact.mjs 390 844 --touch   # 24 assertions: nav, rail, bridge, search EN/AR, quick view, list, Arabic, deep link, targets
node scripts/interact.mjs 1440 900
node scripts/widths.mjs                     # 360 → 1920 × EN/AR: overflow, clipped text, console, failed requests
node scripts/widths.mjs --reduced
node scripts/shots.mjs 390 844 / m- --touch # scroll screenshots → .shots/
python3 scripts/sheet.py m- .shots/sheet.jpg
```

## Rebuild assets

```bash
python3 scripts/build_assets.py   # photos from sources/photos + frames from sources/reels (see sources/README.md)
node scripts/brand_assets.mjs     # og.jpg, favicons, robots.txt, sitemap.xml
```

Stack (Mawqeijo client convention, as SINA-COFFEE): Vite · React 19 · TypeScript · GSAP 3 (ScrollTrigger, SplitText) · plain CSS tokens · prerendered HTML.
