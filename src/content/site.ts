/**
 * Facts about Bilkana — every value from a first-party source, dated.
 * Source: thousandnights.com/bilkana/ (EN + AR), fetched 28 Sep 2026.
 */

/**
 * Absolute URL of the deployment (canonical, og:image, JSON-LD). Placeholder until
 * Bilkana decides where the menu lives (MENU_SCOPE.md §D); preview builds pass
 * VITE_SITE_URL so link previews (WhatsApp) resolve.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://menu.bilkana.jo";
/** Sales-preview builds stay out of search engines (VITE_NOINDEX=1). */
export const NOINDEX = import.meta.env.VITE_NOINDEX === "1";

export const PLACE = {
  name: "Bilkana Rooftop",
  /** the entrance sign & Instagram spelling (see BRAND_RESEARCH.md §2) */
  nameAr: "بالكانا روف توب",
  hotel: "Thousand Nights Hotel",
  hotelAr: "فندق ألف ليلة وليلة",
  street: "191 Al Madina Al Monawara Street",
  streetAr: "191 شارع المدينة المنورة",
  city: "Amman",
  cityAr: "عمّان",
  // Google Maps pin the hotel page links to (Thousand Nights Hotel Amman)
  lat: 31.9880449,
  lng: 35.8664745,
} as const;

export const CONTACT = {
  /** "Reservations & delivery" on the Bilkana page */
  phoneDisplay: "+962 7 9788 8832",
  phoneE164: "+962797888832",
  instagram: "bilkanarooftop",
  instagramUrl: "https://www.instagram.com/bilkanarooftop/",
  /** the exact link on thousandnights.com/bilkana/ ("Get directions") */
  mapsUrl: "https://maps.app.goo.gl/efxnKaPahYbQQ44c6",
} as const;

/** Open daily 8:00 AM – 1:00 AM (crosses midnight). Minutes after local midnight. */
export const HOURS = { open: 8 * 60, close: 25 * 60 } as const;

/** Printed at the foot of every menu page. */
export const CHARGES = { taxPct: 8, servicePct: 7 } as const;
