# Asset register

*Every image, mark and font on the site — where it came from and what was done to it.*

**Rule applied:** Bilkana's own public media only; nothing stock; nothing generated; no photo presented as an item it isn't; no daytime photo re-graded to pass as night. Regenerate everything with `python3 scripts/build_assets.py` (sources in `sources/README.md`).

**Treatment, all photos:** crop · resize · one light grade (+4 % contrast, −3 % saturation) · WebP q76 (lower only if > 290 KB).

**Rights status:** Bilkana's / Thousand Nights Hotel's own public media, used for a private sales demo shown to Bilkana. ⚠ Get their OK — and the originals — before anything is published.

## Photographs — `public/media/`

Source A = thousandnights.com/bilkana/ gallery (hotel's own photographs of Bilkana, uploaded Sep 2026, 2560 px). Source B = Bilkana's Instagram reels, mirrored as MP4 on the same page (720 × 1280).

| File(s) | Source | What it shows | Used for |
| :-- | :-- | :-- | :-- |
| `room-glass-{960,1440,1920}` | A `bilkana-rooftop-dining-room` | Dining room under the glass roof, vines, velvet chairs | Hero (landscape), og.jpg |
| `room-glass-portrait-{540,760,960}` | A, same | 9:16 crop at 56 % | Hero on phones |
| `room-city-{540,850}` | A `bilkana-rooftop-interior`, **right third only** | Banquette under the glass roof, city through the windows | Main courses (desktop panel), rooftop diptych |
| `room-banquette-{540,720}` | B `ditudo2onoz` @ 0.3 s | Velvet banquettes, tub chairs, windows | Sandwiches (desktop panel) |
| `room-roof-open-{540,720}` | B `dx3104aoebj` @ 3.4 s | Terrace with the glass roof open | Rooftop break |
| `room-sign-{800,1200,1600}` | A `bilkana-rooftop-bar-and-sign` | The back-lit KANA \| كانا sign over the bar | Desserts / Hot drinks (desktop panel) |
| `food-arabic-breakfast-*` | A `bilkana-arabic-breakfast` | Arabic breakfast spread from above | Breakfast section visual |
| `food-burger-and-fries-*` | A | Burger + fries, BILKANA sign behind | Burgers visual — *not* tied to a named burger |
| `food-drinks-and-pastries-*` | A | Brass tray of iced drinks among palms | Cold drinks visual |
| `food-pizza-with-basil-*` | A | Pizza, basil, cherry tomatoes | Italian corner visual — *not* tied to a named pizza (toppings don't match one item exactly) |
| `food-table-spread-*` | A | Sharing table: pizzas, salads, mocktails | Appetizers & Salads visual, Reserve background |
| `pick-baladi-*` (4:5) | A breakfast-board | Falafel, hummus, labneh, eggs, vegetables | **Baladi Breakfast** — components match the menu listing; ⚠ confirm with Bilkana |
| `pick-nachos-*` | A nachos | | **Nachos** |
| `pick-sliders-*` | A sliders (hotel caption "Sliders and fries") | | **Sliders · 3 pieces** |
| `pick-mojito-*` | A mojito | | **Mojito** |
| `item-turkish-breakfast-*` | B `dyckvr0cqd1` @ 0.3 s, cropped below the reel's caption | Eggs in skillets, cheeses, labneh, jam, blue-and-white bowls | **Turkish Breakfast** — components match; ⚠ confirm |
| `item-avocado-toast-*` | B `dx3104aoebj` @ 12.4 s | Avocado toast on brown bread | **Avocado Toast** |
| `item-croissant-tomato-*` | B `dx3104aoebj` @ 15.4 s | Croissant, tomato, mozzarella, basil | **Croissant Tomato & Mozzarella** |
| `item-manaqish-zaatar-*` | B `dx3104aoebj` @ 8.5 s | Za'atar manaqish in strips | **Manqooshet Za'atar** |

**Frames reviewed and deliberately not used:** every wide venue shot's left/centre (the photographer's light stand, laptop and bag are in frame — `rooftop-seating`, `rooftop-tables`, most of `rooftop-interior`) · reel frames with people's faces (influencer content) · frames with burned-in captions · the hotel's `cappuccino-and-pastry` (not clearly Bilkana) · the current PDF menu artwork (turquoise + monstera clip-art + lime script — the one thing *not* carried over).

**No night photography exists** in Bilkana's public media. The evening chapter uses the slate palette and the back-lit كانا mark as graphics, not a darkened daytime photo.

## Marks — `src/components/Mark.tsx`, `public/`

| Asset | Source | Treatment |
| :-- | :-- | :-- |
| **كانا mark** | The bar sign ("KANA \| كانا") in A `bilkana-rooftop-bar-and-sign` | Perspective-corrected (OpenCV homography), then **redrawn as clean geometry** (four paths) and compared side by side with the photo. ⚠ A redraw, not Bilkana's file — ask for the vector original |
| **BILKANA** wordmark | The entrance sign "BILKANA \| بالكانا" (reel `dymxopqsb2g` @ 3.8 s) | Set in Marcellus as the nearest open face to the sign's Friz Quadrata–style serif; the Arabic بالكانا set in Noto Kufi Arabic. Not a trace |
| `og.jpg` 1200×630 (114 KB) | room-glass + mark + wordmark | `scripts/brand_assets.mjs` |
| `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` (0.8 / 3.9 / 3.8 KB) | the كانا mark on slate | `scripts/brand_assets.mjs` |

## Fonts (OFL, self-hosted via Fontsource)

Marcellus 400 (Latin display) · Manrope variable (UI) · Noto Kufi Arabic 500 (Arabic display) · IBM Plex Sans Arabic 400 / 600 (Arabic text). Unicode-range subsets: an English visit downloads the Latin faces plus one Arabic face for the Arabic accents.
