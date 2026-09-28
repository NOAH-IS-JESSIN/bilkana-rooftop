# Menu scope — what this demo may and may not promise

*Internal · Mawqeijo · 28 Sep 2026. Nothing in this file appears on the client page.*

---

## Sources read

| Source | Where | Status |
| :-- | :-- | :-- |
| `00_START_HERE.md` (20 Aug 2026) | `Mawqeijo-hq` `main` | Read. Names `02_CATALOGUE.md` as the single price authority |
| `01_CATALOGUE.md` — every product and price | `Mawqeijo-hq` `main` | Read in full. Marked superseded, but its numbers match the ratified list |
| `MAWQEIJO_IDENTITY.md` §7 — prices ratified 27 Aug 2026 | `Mawqeijo-hq` `main` | Read. **This is the newest price statement found** |
| `src/lib/offer.ts` | `Mawqeijo-hq` branch `v2-standalone` | Read. Same ladder, same systems |
| `04_BUILD_STANDARD.md` | `Mawqeijo-hq` `main` | Read in full; applied below |
| `SINA-COFFEE/STARTER_SCOPE.md` (26 Sep 2026) | sibling client repo | House format for this file; same menu-product finding |
| **"System and Service Manual V3 / V3.1"** | searched both repos, the synced Mawqeijo skills and Google Drive (title + full text) | ⚠ **Not found anywhere reachable.** Nor is `02_CATALOGUE.md` (`D:\MAWQEIJO\BUSINESS\`, local only). If a V3 manual exists, it overrides everything in this file — re-check before quoting |

## ⚠ There is still no "digital menu" product in the catalogue

Every Mawqeijo document above was searched for *menu / QR / منيو / restaurant*. The only QR product is the **printed QR review stand** inside Google optimisation. Sina Coffee's scope (two days ago) reached the same conclusion. **A digital menu has no name, no price and no scope yet.** This build is a sales demo; nobody quotes it until Noah decides what it is:

| Option | Fit for Bilkana | Price today |
| :-- | :-- | :-- |
| **STARTER** — one page | This *is* one page (two language routes of the same page). Honest fit for "menu only". | 349 + 25/mo |
| **CATALOG** — catalogue + orders | A menu is a catalogue. "Orders" would mean a real ordering backend — **not built**; "My list" is only a waiter-facing shortlist | 949 + 100/mo |
| **Standalone system** (like CRM template) | Needs a build price + a yearly, and a line for "menu updates" | **[NEEDS INPUT]** |

The monthly plan is where menu *updates* live (prices, seasonal items, new dishes) — that is the recurring value for a venue whose menu changes.

**[NEEDS INPUT]** Name, price and scope of the digital menu. Until then the page is labelled a prototype and nobody quotes it.

## The ladder (ratified 27 Aug 2026 — `MAWQEIJO_IDENTITY.md` §7)

| Tier | Scope | Build | Monthly | Year 1 |
| :-- | :-- | --: | --: | --: |
| STARTER | One page | 349 | 25 | 649 |
| GROWTH | 5 pages + SEO | 599 | 50 | 1,199 |
| CATALOG | Catalogue + orders | 949 | 100 | 2,149 |
| ENTERPRISE | Catalogue + all systems + one integration | 1,500 | 300 | 5,100 |

Google optimisation 50 once (+5/yr), QR review stand included. Domain separate (10 / 18 / 24). Systems: CRM 70/140, POS 300, Inventory 300.

---

## A · Build-standard deliverables in this demo

| Deliverable | In the demo |
| :-- | :-- |
| Prerendered HTML (the 5-second test) | ✅ `scripts/prerender.mjs` writes `dist/index.html` (EN) and `dist/ar/index.html` (AR). All 128 items are in the HTML with JS off |
| Per-language title, description, canonical, hreflang, `og:*`, `twitter:card`, `lang` + `dir` | ✅ `src/entry-server.tsx`, `src/content/meta.ts` |
| og-image that exists | ✅ `public/og.jpg` 1200×630 — Bilkana's room + the كانا mark |
| Favicons 32 / 192 / apple-touch, ≤ 10 KB | ✅ the كانا mark on slate (0.8 / 3.9 / 3.8 KB) |
| Nothing over 300 KB | ✅ largest photo 224 KB; every photo ships in 2–4 widths |
| sitemap.xml + robots.txt | ✅ — **placeholder domain** `menu.bilkana.jo` (not registered, not checked) |
| Restaurant + Menu JSON-LD | ✅ emitted in the HTML — *not submitted anywhere* |
| Arabic: mirrored layout, Latin numerals, Arabic line-height | ✅ full RTL (rail, index, sheets, arrows, desktop columns) |
| Phone as `tel:` | ✅ +962 7 9788 8832 (Bilkana page: "Reservations & delivery") |
| WhatsApp reachable without scrolling | ❌ **deliberately not built** — Bilkana publishes no WhatsApp number |
| GA4 / key-click tracking | ❌ not installed (no client property). Hooks are trivial at launch |

## B · Demonstration only — shown, not sold as working systems

| What the owner sees | What it really is |
| :-- | :-- |
| The full bilingual menu with search, categories, quick view | Static data in `src/data/menu.ts`, transcribed from Bilkana's own PDFs. No CMS |
| **My list** (add, quantities, estimate) | Stored on the guest's phone only. Labelled in both languages: *"A list to show your waiter. Nothing is sent or ordered — prototype feature."* No checkout, no order, no payment |
| **Reserve a table** | A `tel:` link to Bilkana's published reservations number. No booking form, no fake confirmation |
| Open now / Closed | Computed in the browser from the published hours (8 AM – 1 AM, Asia/Amman) |
| Directions / Instagram | The exact links on Bilkana's own page |

## C · Not included — and not implied anywhere on the page

Ordering, cart, checkout, payments, delivery tracking · reservations system / availability · accounts, loyalty, reviews widget · CMS / admin · WhatsApp automation · POS / inventory integration · live Google data · analytics · photography or video production (every image is Bilkana's own) · **shisha and Red Bull** (on Bilkana's menu, deliberately not promoted in this demo; they can return as plain rows if Bilkana wants them).

## D · Open items before this becomes a real delivery

1. **Digital menu product** — name, price, scope (above).
2. **Which prices are right?** The official English and Arabic PDFs disagree. The demo shows English everywhere; `arPdfPrice` in `src/data/menu.ts` keeps the Arabic figure (never rendered):

   | Item | Category | EN PDF | AR PDF |
   | :-- | :-- | --: | --: |
   | Mushroom Croissant | Breakfast | 2.50 | 5.00 |
   | Arabic Tacos | Breakfast | 5.00 | 5.50 |
   | Manqooshet Za'atar | Breakfast | 3.00 | 2.75 |
   | Manqooshet Turkey with Cheese | Breakfast | 3.25 | 3.75 |
   | Edamame | Appetizers | 5.00 | 4.00 |
   | Spinach Dip | Appetizers | 6.00 | 6.50 |
   | French Fries | Appetizers | 2.50 | 2.25 |
   | Bilkana Salad *(different recipe too)* | Salads | 4.00 | 7.00 |
   | Brisket Sliders | Burgers | 10.00 | 8.00 |
   | Shrimp Scampi Pizza | Italian corner | 9.50 | 9.00 |
   | Pumpkin Spice Latte | Hot drinks | 4.50 | not listed |
   | Black Tea | Hot drinks | 3.00 | 4.00 |
   | Iced American Coffee | Cold drinks | 3.00 | 4.00 |
   | Iced Tiramisu Latte | Cold drinks | 4.00 | 4.50 |
   | Caramel Frappuccino | Cold drinks | 4.00 | 4.50 |
   | Chocolate Frappuccino | Cold drinks | 3.00 | 4.50 |
   | Vanilla Frappuccino | Cold drinks | 4.00 | 4.50 |
   | Iced Chocolate | Cold drinks | 4.00 | 5.00 |
   | Iced Tea | Cold drinks | 3.00 | 4.00 |
   | Milkshakes | Cold drinks | 4.00 | 4.50 |

   Also: Honey Nut Latte appears twice in the English menu (5.00 and 3.50; the demo uses 5.00 — the Arabic menu's figure). Grilled Salmon and Edamame have different descriptions in the two languages (each language shows its own).
3. **Arabic name** — pick one spelling. Sign + Instagram: بالكانا (used here). Arabic menu: بلكانا. Hotel's Arabic page: بلكانة.
4. **Where does the table QR point today?** The PDFs live at `thousandnights.com/QR/...`. If the printed QRs encode that path, the new menu can go live behind the same URL (redirect) — **no reprinting**. Check a physical table card.
5. **Logo files** — the كانا mark is redrawn from a photo of the bar sign; "BILKANA" is set in Marcellus (closest open face to the sign). Ask for the vector originals.
6. **Photo permission & originals** — every image is from the hotel's own Bilkana gallery or Bilkana's reels. Get an OK, and the originals: the wide venue shots have the photographer's light stand in frame, so only clean crops are used; reel frames are 720 px.
7. **Night photography** — none exists in Bilkana's public media; the evening chapter uses graphics, not a faked night photo. A 30-minute evening shoot would lift the demo most.
8. **Vegetarian / allergens** — the menu marks only 🌶. The UI supports a vegetarian flag; Bilkana must confirm dishes before any flag is shown.
9. **Who decides** — Bilkana sits inside Thousand Nights Hotel, whose site was just rebuilt (Sep 2026 uploads). Find out who owns the hotel's web/QR and whether that is a competitor relationship.
10. **Google Business Profile** — not verified from here. Does Bilkana have its own listing, who controls it, do its hours say 8 AM – 1 AM?
11. **Domain** — the menu needs a home (subdomain of the hotel, or Bilkana's own). Decide before launch.

## E · Sales opportunities this demo exposes (products Mawqeijo actually sells)

| Evidence | Product |
| :-- | :-- |
| Menu = two 14-page PDFs that disagree on 19 prices; no search; typos | **Digital menu** — [NEEDS INPUT] (above) · menu updates under the monthly plan |
| No Bilkana page of its own outside the hotel site; Instagram carries the brand | **Starter / Growth** — a Bilkana site (menu · breakfast · events · visit) |
| GBP not verified; hours/phone must match 8 AM – 1 AM / 079 788 8832 | **Google optimisation** (50) + QR review stand |
| Live music, karaoke and match nights announced only on Instagram | **CRM** (70 / 140) — broadcasts to past guests (Meta bills messages) |
| Dine-in + takeaway + delivery on one phone number | **CATALOG** later — if they want real ordering, it is a real build, quoted as such |
