# Site architecture

## Routes

| Route | What | Prerendered to |
| :-- | :-- | :-- |
| `/` | The digital menu, English | `dist/index.html` (`lang="en" dir="ltr"`) |
| `/ar/` | The same page, Arabic — true RTL | `dist/ar/index.html` (`lang="ar" dir="rtl"`) |

One page, two languages. Switching language on the client crossfades the copy (~240 ms, 5 px toward the reading direction), swaps `lang`/`dir`, replaces the URL (`/` ↔ `/ar/`) and remembers the choice — a guest who picked Arabic lands in Arabic next time they scan `/`. Deep links: `/#italian`, `/ar/#desserts` land under the sticky header.

## The page — arriving → entering → discovering → browsing → wanting to go

| # | Section | File | Surface | Motion |
| :-- | :-- | :-- | :-- | :-- |
| — | Loader | `components/Loader.tsx` + `.loader` CSS | night | **CSS only, plays from first paint.** كانا mark sharpens from blur with a brass halo (the bar sign's back-light), BILKANA / ROOFTOP tracking tightens, hairline fills; at 1.3 s three slate "roof panes" lift in a stagger (the retractable glass roof). Returning guests 0.45 s (`html.seen`); none with reduced motion or without JS |
| 01 | Hero | `components/Hero.tsx` | night veil on photo | Bilkana's glass-roof dining room (portrait crop on phones). CSS entrance: image 1.08 → 1.04, eyebrow, headline lines through masks (120 ms apart), lede, CTAs, live open/closed. Scroll (GSAP scrub): image settles, copy lifts and dims, veil deepens. A slow warm light band sweeps the photo (paused once you leave) |
| — | Header + rail | `components/Header.tsx` | transparent → surface of the section beneath | Over the hero: logo · عربي/EN · search. In the menu: solid marble by day, slate by night; category rail with a sliding ink line, active tab kept centred, scroll-spy. Compresses on the way down, opens on the way up. Desktop: bar only (the index lives in the page) |
| 02 | Bilkana Selection | `components/Selection.tsx` | marble | 4 dishes, morning → night. Phones: alternating edges. Desktop: title beside a large Feature 01, then three staggered portraits. Clip-mask reveal + image settle, text staggers after, ±2 % drift, pointer parallax ±3 px (mouse only), 0.98 press |
| 03 | Menu head | `App.tsx` | marble | "Breakfast to one A.M." · prices note · open/closed · My list |
| 04 | Day chapter | `components/Chapter.tsx` | marble | Breakfast · Appetizers · Salads · Burgers · Sandwiches · Mains |
| 05 | Rooftop break | `components/Rooftop.tsx` | photo | Phones: the terrace with the roof open. ≥900 px: diptych (open roof · city through the windows), panes drift in opposite directions. "Amman, from above." + coordinates |
| 06 | Day chapter (cont.) | `Chapter.tsx` | marble | Italian corner |
| 07 | Day → night bridge | `components/Bridge.tsx` | marble → dusk → slate | Sticky stage, **not pinned** (the page keeps scrolling). 08:00 "Morning above Amman." → 16:00 "Good plates, great views." (Bilkana's own reel line) in a velvet-to-gold dusk → 01:00 "Late nights at Bilkana." while the كانا mark lights up; a clock line fills 08:00 → 01:00. The header flips to night when the scene does. Reduced motion / no JS: three calm stacked panels |
| 08 | Night chapter | `Chapter.tsx` | slate | Desserts · Hot drinks · Cold drinks |
| 09 | Visit | `components/Visit.tsx` | slate | Open status, hours, address, dine-in/takeaway/delivery, **Call · Directions · Instagram** |
| 10 | Reserve | `components/Visit.tsx` | photo | "Your table is waiting." (Bilkana's reel title) — `tel:` to the reservations number. Background settles, headline mask reveal, CTA last |
| — | Footer | `components/Footer.tsx` | slate | BILKANA \| بالكانا lockup, Instagram, directions, phone, charges note, "Digital menu prototype by Mawqeijo" |
| — | Dock | `components/Dock.tsx` | inverse of section | Phones/tablets once past the hero: Menu (category sheet) · Search · My list (count) · Top. Labels tuck away on scroll down; safe-area aware; hidden while an overlay is open |

## The menu

**Data:** everything renders from `src/data/menu.ts` (`CATEGORIES`, `ITEMS`) and `src/data/media.ts`. Item fields: `name/nameAr`, `description/descriptionAr`, `price` (JD), `tags` (`spicy` · `signature` · `seasonal` · `for-two`), `vegetarian` (supported, unset), `image`, `featured`, `keywords`, `group`, `src` (PDF page). `arPdfPrice` records where the Arabic PDF disagrees — never rendered. Updating the menu = editing that file only.

**Rhythm — one system, four layouts** (`Category.layout`):

| Layout | Used by | Phone | Tablet | Desktop ≥1200 |
| :-- | :-- | :-- | :-- | :-- |
| `lead` | Breakfast | full-bleed photo, sets as photo pair, then rows | framed photo | photo moves to the sticky side panel |
| `split` | Appetizers, Burgers, Italian, Cold drinks | photo above list | photo sticky beside list (5/7) | side panel |
| `dense` | Salads, Sandwiches, Desserts, Hot drinks | text rows | two columns (container query) | two columns |
| `ledger` | Main courses | larger display names and prices, one column | same | same |

Every category opens with a large numeral (01–10), the title, a hairline and the **other language's** title — the sign's "LATIN \| عربي" lockup. Photographed dishes (8, all Bilkana's own) appear as cards: a pair side by side, or one wide card beside its text. Everything else is a row: **NAME · · · PRICE / description**, name ~75 % width, tabular prices on the reading-end edge.

**Desktop ≥1200:** three columns per chapter — sticky numbered index (scroll-spy, dot on the active) · the menu · a sticky 4:5 photo that crossfades (800 ms) to the category you are reading, with a caption.

**Quick view** (`components/Overlays.tsx`, `Sheet.tsx`): every row and card opens it. Phones: bottom sheet (88 svh, drag the handle down to close). ≥900 px: side panel on the reading-end edge. The tapped photo morphs into the sheet photo (FLIP with a floating copy). Photo · category/group · name · other-language name · description · price · badges · charges note · **Add to my list** (clearly labelled a prototype: nothing is sent or ordered). Text-only dishes get a numeral plate instead of a photo. Esc / backdrop / × close; focus is trapped and returned.

**My list**: a shortlist to show the waiter — quantities, estimate before tax & service, clear. Stored on the device only.

**Search**: full-screen, instant, static. Matches the start of words across EN + AR names, descriptions, categories, groups and keywords, with Arabic normalisation (hamza/alef forms, ة/ه, ى/ي, diacritics, optional "ال"). Result count, category label per result, suggestions when empty, "Nothing matched that search." + category shortcuts. Esc (desktop) or swipe down on the header (phones) closes.

## Design system

Tokens in `src/styles/tokens.css` (derivation in `BRAND_RESEARCH.md §3`): marble / velvet / slate / brass / glow / night — all sampled from Bilkana's room. Type: Marcellus (display, caps — nearest open face to the sign), Manrope (UI, tabular prices), Noto Kufi Arabic (Arabic display — the sign's geometric Arabic), IBM Plex Sans Arabic (Arabic text). Square 2 px corners (marble slabs, mullions); circles only for small controls (the tub chairs). Surfaces switch through `[data-surface="day|night"]`.

## Motion system

Tokens: `--motion-fast 160ms · --motion-ui 240ms · --motion-medium 450ms · --motion-reveal 700ms`; easings `--ease-ui cubic-bezier(.22,.61,.36,1)`, `--ease-reveal cubic-bezier(.16,1,.3,1)`, `--ease-panel`. Mirrored in `src/lib/motion.ts`.

| Layer | Tool |
| :-- | :-- |
| Loader + hero entrance | CSS keyframes (no JS dependency; `backwards` fill hands elements to GSAP afterwards) |
| Scroll scenes (hero, selection, rooftop, bridge, reserve) | GSAP ScrollTrigger, set up at idle time (`onIdle`) so hydration stays light; contexts reverted on unmount |
| Editorial titles (Selection, Reserve) | GSAP SplitText, lines + masks only |
| Rows, heads, cards | one IntersectionObserver + CSS transitions (opacity, 24 px), 50 ms stagger |
| Header, rail, dock, index | one rAF-throttled scroll listener (`src/lib/scroll.ts`) with cached offsets |
| Presses | 0.97–0.98 scale, 120–140 ms |

`prefers-reduced-motion`: no loader, no entrance, no scroll scenes, bridge as stacked panels, all transitions ~0. No JS: the prerendered page, fully visible.

## Performance

Photos: WebP, 2–4 widths each, nothing over 300 KB, explicit aspect ratios (CLS ≈ 0), lazy below the fold, soft → crisp on load. The stylesheet is inlined into the prerendered HTML. Off-screen categories use `content-visibility: auto`; category jumps settle exactly after the glide. Fonts load by unicode-range; the Arabic page ships three Arabic faces, the English page one.

## QA performed (28 Sep 2026, Chromium via Playwright, `npm run preview`)

- `scripts/interact.mjs` at 390×844 (touch), 768×1024 (touch), 1440×900 — **24/24 pass each**: hero settles · loader removed · CTA lands on Breakfast under the header · rail/index tap → exact section, active state, URL hash · header turns night over the evening menu · search (EN "latte" 6, "pizza" 6, AR "حلوم" from the English view, empty state, Esc) · quick view from the Selection with image morph, no ghost left · add to list · text-only sheet · My list · Arabic lang/dir/URL, no overflow, persists on reload and on a fresh scan of `/` · deep link `#desserts` · touch targets ≥ 40 px. Console clean.
- Long jumps (top → Cold drinks → Breakfast → Mains → Hot drinks) land pixel-exact at 390 and 1440.
- `scripts/widths.mjs` — 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920 × `/` and `/ar/`, normal and reduced motion: **36/36** — no horizontal overflow, no clipped text, no console errors, no failed requests.
- `scripts/shots.mjs` scroll screenshots reviewed at 390, 768, 1440 (EN) and 1440 (AR).
- JS disabled: all 128 items, the headline and the reservation line are in the raw HTML of both routes (5-second test).
- Lighthouse 12, mobile preset (simulated slow 4G, 4× CPU), local preview:

  | Route | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
  | :-- | --: | --: | --: | --: | --: | --: | --: |
  | `/` | **87** | 100 | 100 | 100 | 3.5 s | 70 ms | 0.02 |
  | `/ar/` | **81** | 100 | 100 | 100 | 4.1 s | 80 ms | 0.00 |

  Below the build standard's 90 (Sina's shipped menu: 87). What is left is first layout of a 128-item bilingual document on a throttled CPU and the Arabic faces. Next steps if ≥ 90 is required at launch: serve with Brotli (preview serves uncompressed), split the night chapter into a lazily hydrated island, or subset the Arabic fonts to the glyphs the menu uses.
