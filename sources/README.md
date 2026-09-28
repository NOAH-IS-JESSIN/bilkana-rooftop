# Sources

The media and documents the site is built from. Photos, reels, PDFs and page snapshots are **not committed** (first-party media fetched for the demo only); the extracted menu text is.

## Bilkana's page — `https://thousandnights.com/bilkana/` (+ `/ar/bilkana/`), fetched 28 Sep 2026

Re-fetch into `sources/web/`:

```bash
curl -sSL -o sources/web/bilkana.html    https://thousandnights.com/bilkana/
curl -sSL -o sources/web/bilkana-ar.html https://thousandnights.com/ar/bilkana/
curl -sSL -o sources/web/tn-dining.html  https://thousandnights.com/dining/
```

## Menus — `sources/menus/`

| File | URL |
| :-- | :-- |
| `bilkana-menu-en.pdf` | `https://thousandnights.com/QR/wp-content/uploads/2026/04/bilkana-menu-en_compressed.pdf` |
| `bilkana-menu-ar.pdf` | `https://thousandnights.com/QR/wp-content/uploads/2026/04/bilkana-menu-ar_compressed.pdf` |
| `bilkana-menu-en.txt`, `bilkana-menu-ar.txt` | Text extracted with pypdf (Arabic re-ordered from visual order) — **committed**, the transcription source for `src/data/menu.ts` |

## Photos — `sources/photos/bilkana-<name>.webp`

`https://thousandnights.com/wp-content/uploads/2026/09/bilkana-<name>.webp` for: `arabic-breakfast`, `breakfast-board`, `breakfast-flat-lay`, `burger-and-fries`, `drinks-and-pastries`, `mojito`, `nachos`, `pizza-flat-lay`, `pizza-with-basil`, `rooftop-bar-and-sign`, `rooftop-dining-room`, `rooftop-interior`, `rooftop-seating`, `rooftop-tables`, `sliders`, `table-spread` (2560 px originals).

## Reels — `sources/reels/<id>.mp4`

Bilkana's Instagram reels as mirrored on its page: `https://thousandnights.com/wp-content/uploads/2026/09/bilkana-rooftop-<id>.mp4` (and `-cover.webp`).

| id | Page caption | Used |
| :-- | :-- | :-- |
| `ditudo2onoz` | Breakfast with a view | `room-banquette` @ 0.3 s |
| `dnibnfqtl0t` | Good plates, great views | voice only (the bridge's 16:00 line) |
| `dptop6ojtz_` | Breakfast is back | — |
| `drg5wtwgtyg` | Your table is waiting | voice only (the Reserve headline) |
| `ds1_rpmikow` | New breakfast menu | — |
| `dtfma6xlpew` | Pure flavour | — |
| `dx3104aoebj` | Just eat it all | `room-roof-open` @ 3.4 s, avocado toast @ 12.4, croissant @ 15.4, manaqish @ 8.5 |
| `dyckvr0cqd1` | Memorable experiences | Turkish breakfast @ 0.3 s |
| `dymxopqsb2g` | Enjoyment in every bite | entrance sign "BILKANA \| بالكانا" @ 3.8 s (reference for the wordmark) |

*(Captions are paired with ids in page order; the page doesn't label them individually — treat the pairing as approximate.)*
