# Bilkana Rooftop — brand research

*Internal · Mawqeijo · 28 Sep 2026. What is verified about Bilkana, where it came from, and what it means for the design. Nothing here appears on the client page except through `src/content/site.ts` and `src/data/menu.ts`.*

---

## 1 · Sources actually reached

| Source | How | What it gave |
| :-- | :-- | :-- |
| **thousandnights.com/bilkana/** (EN) + **/ar/bilkana/** — the hotel's own Bilkana page | Direct fetch, 28 Sep 2026 | Positioning copy, **hours 8 AM – 1 AM daily**, **reservations & delivery +962 7 9788 8832**, address, dine-in / takeaway / delivery, live music & karaoke nights, sports on screens, 16 photos (uploaded Sep 2026), 9 Instagram reels mirrored as MP4, links to both menu PDFs, Google Maps link. **First-party.** |
| **Official menus** `bilkana-menu-en_compressed.pdf` / `-ar_compressed.pdf` (14 pp each, uploaded Apr 2026) | Linked from the page above | Every category, item, description and price in `src/data/menu.ts`. Tax 8 % + service 7 % note. **First-party.** |
| thousandnights.com/dining/ | Direct fetch | "an evening on the Bilkana Rooftop under Amman's skyline"; reservations also via hotel +962 6 556 2778 |
| Google Maps link on the hotel page | Redirect resolved | Pins **Thousand Nights Hotel Amman**, 31.98804 N · 35.86647 E (Bilkana's own GBP listing not reached) |
| Instagram **@bilkanarooftop** | Search snippets only — HTTP 429 / login wall from this environment | Display name **"BilKana Rooftop \| بالكانا"** |
| Facebook **/bilkanarooftop** | Login wall | Page name "Bilkana Rooftop بالكانا" (snippet) |
| TripAdvisor, Wow Jordan, Snapchat place | Search snippets (TripAdvisor 403 direct) | 5.0 from 3 reviews (TripAdvisor, small sample — **not used**); "Kana Rooftop" appears as an alternate name |
| Google Business Profile | **Not reachable** from here | No rating, review count or GBP hours used anywhere |

## 2 · Verified facts (and the conflicts)

| Fact | Value used | Source | Note |
| :-- | :-- | :-- | :-- |
| Name | Bilkana Rooftop · بالكانا | Sign, IG name | ⚠ Three Arabic spellings in circulation: **بالكانا** (entrance sign, IG), **بلكانا** (Arabic menu), **بلكانة** (hotel's Arabic page). The sign wins. |
| Sub-mark | **KANA \| كانا** | Bar sign (photo `bilkana-rooftop-bar-and-sign`) | "Bil-Kana" = "at Kana". The menu uses it too: *Kana's Special Sauce*, *Kana Wonka*. |
| Location | Rooftop of Thousand Nights Hotel, 191 Al Madina Al Monawara St., Amman | Hotel page | |
| Hours | Daily 8:00 AM – 1:00 AM | Hotel page (EN + AR) | |
| Reservations / delivery | +962 7 9788 8832 | Hotel page | Hotel switchboard +962 6 556 2778 also takes bookings |
| WhatsApp | — | Not published | No WhatsApp button built |
| Service modes | Dine-in, takeaway, delivery | Hotel page | |
| Prices | JD, + 8 % tax + 7 % service | Menu PDFs | ⚠ **The EN and AR PDFs disagree on 19 prices**, one item is missing from the Arabic menu, and Honey Nut Latte is printed twice in English at two prices (list in `MENU_SCOPE.md §D`). The demo shows the English price. |

## 3 · Brand extraction

**What the room actually looks like** (16 hotel photos + 9 reels, all daytime): a glass-roofed rooftop room with a **retractable roof on steel mullions**, climbing vines on the beams, palms and cherry-blossom stems. **Powder-blue velvet** banquettes and tub chairs, **white Carrara marble** tabletops, greige travertine-look walls, light oak-look floor, brass pendant lamps. Tableware: **blue reactive-glaze plates**, **blue-and-white Turkish ceramics** on dark wood boards, **houndstooth placemats**. The logo is built into the wall in **slate-blue letters with a warm brass back-light**.

**01 · Primary** — **Slate** `#2B3A44` (sampled `#474D4E` off the lit sign, deepened for text). It is the sign, the plate glaze at night, the steel mullions. Text colour on light; canvas colour at night.

**02 · Secondary** — **Velvet** `#86ADB7` (sampled `#84ACB6`, the banquettes and chairs) and its shadow **Velvet deep** `#3E6470`. This is the colour a guest remembers. It carries active states, labels and the day-to-night gradient.

**03 · Accent** — **Brass** `#B38D52` (sampled `#B18D52`, the sign halo and lamp fittings) with **Glow** `#EDBE6A` for the back-light moment only (loader, night bridge). Used sparingly — never as a gold gradient.

**04 · Backgrounds** — **Marble** `#F3F0EB` (sampled `#E4E0DC`, lifted), **Marble shade** `#E6E1D9`, **Travertine** `#CBBDA7` (the wall), **Night** `#0F181D` / `#16222A` (the room after dark: slate with the lights down).

**05 · Text** — Ink `#1E2A32` on marble; Mist `#EDE8DF` on night; muted `#5E6B72` / `#9AA7AD`.

**06 · Typography** — The Latin sign is a **bracketed wedge serif** in the Friz Quadrata family: upright caps, flared terminals, calm contrast. **Marcellus** (OFL) is the nearest open face → display and wordmark, always caps, tracked. UI/body: **Manrope** — hotel-clean, excellent numerals for prices. Arabic: the sign's Arabic is a **geometric, square-dotted kufic cut** → **Noto Kufi Arabic** for Arabic display, **IBM Plex Sans Arabic** for Arabic body. No script fonts (the current PDF's lime script is the one element *not* carried over).

**07 · Photography** — Hotel set: bright, high-key daylight, slightly warm, overhead flat-lays and 45° table shots with shallow depth; reels add a warm cinematic grade (ds1_rpmikow, dtfma6xlpew). Food is shared — boards, spreads, many small bowls. Treatment on the site: one light grade, no filters, crops that keep the marble and blue plates in frame.

**08 · Spacing & shape** — Generous, hotel-lobby calm. Corners **square (2 px)** like marble slabs and mullions; the only round forms are the tub chairs and plates → circles are allowed for small controls (dock buttons, dots). Thin **1 px mullion lines** divide things, echoing the glass roof grid.

**09 · Motifs** — (1) the **glass-roof grid** (panes + mullions) → loader curtain opens like the retractable roof, hairline rules; (2) the **back-lit sign halo** → brass glow rising behind the mark; (3) the **bilingual lockup** "LATIN \| عربي" with a thin vertical rule → used for section titles; (4) **blue-and-white** as the food-photo signature.

**10 · Motion character** — Smooth and architectural: things *slide* like roof panels and *light up* like the sign. Short, eased, never bouncy.

**11 · Personality** — Contemporary hotel rooftop, warm and social, daytime-bright and family-friendly with a late-night second life (matches, music, karaoke). Not ornamental-Arabian (despite the hotel name), not nightclub, not beige-luxury. **"A bright room above the city that stays open until 1 AM."**

**Voice** — The venue's own lines, from its reels and page: *"Amman from above"*, *"Breakfast with a view"*, *"Good plates, great views"*, *"Your table is waiting"*, *"From breakfast to late night, every day of the week."* The site reuses these rather than inventing slogans.

## 4 · What the customer experiences (from their own media)

Breakfast is the lead product (four of nine reels): Turkish and Baladi spreads for two on wooden boards, manaqish, avocado toast, croissants, tea poured at the table. Midday: pizza, pasta, burgers and sliders shared across the table with mocktails. Evening: shisha and matches on screens (shisha deliberately **not** promoted in this demo), live music and karaoke nights (announced on the page, no dates published).

## 5 · Current digital problems (the pitch)

1. **The menu is two 14-page PDFs** (465 KB / 506 KB) — pinch-zoom on a phone, no search, no photos next to items, tiny Century Gothic text on turquoise.
2. **The two PDFs disagree on 19 prices** and several descriptions (e.g. Bilkana Salad 4 JD vs 7 JD, Brisket Sliders 10 vs 8, Croissant Mushroom 2.5 vs 5). A guest reading Arabic is quoted different prices.
3. **Typos in the menu that a guest sees**: "Crossiont", "French Tost", "Ceaser", "Deserts", "Mocktal's", "Louts", Honey Nut Latte listed twice at two prices.
4. **Three Arabic spellings** of the name (بالكانا / بلكانا / بلكانة).
5. **No Bilkana address of its own on the web** — its only page lives inside the hotel site; Google Maps link points at the hotel.
6. **Instagram carries the brand** but is login-walled for many visitors and invisible to Google.
7. **Google Business Profile not verified from here** — check whether Bilkana has its own listing, who controls it, and whether hours match 8 AM – 1 AM.
