import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import type { Lang } from "./lib/i18n";
import { META } from "./content/meta";
import { CONTACT, PLACE, SITE_URL } from "./content/site";
import { CATEGORIES, itemsIn } from "./data/menu";

export function render(lang: Lang) {
  return renderToString(
    <StrictMode>
      <App lang={lang} />
    </StrictMode>,
  );
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Per-language head: title, description, canonical + hreflang, Open Graph, Twitter,
 * JSON-LD (Restaurant + Menu). SITE_URL is a placeholder until the domain is decided;
 * nothing is submitted anywhere.
 */
export function head(lang: Lang) {
  const m = META[lang];
  const url = `${SITE_URL}${m.path}`;
  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: PLACE.name,
    alternateName: PLACE.nameAr,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og.jpg`,
    telephone: CONTACT.phoneE164,
    servesCuisine: ["Breakfast", "International", "Italian", "Levantine"],
    priceRange: "JD 2.5–40",
    acceptsReservations: "True",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${PLACE.street} (rooftop, ${PLACE.hotel})`,
      addressLocality: PLACE.city,
      addressCountry: "JO",
    },
    geo: { "@type": "GeoCoordinates", latitude: PLACE.lat, longitude: PLACE.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "01:00",
      },
    ],
    sameAs: [CONTACT.instagramUrl],
    hasMenu: `${SITE_URL}/`,
  };
  const menu = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: lang === "ar" ? "منيو بالكانا" : "Bilkana menu",
    inLanguage: lang,
    hasMenuSection: CATEGORIES.map((c) => ({
      "@type": "MenuSection",
      name: lang === "ar" ? c.labelAr : c.label,
      hasMenuItem: itemsIn(c.id).map((i) => ({
        "@type": "MenuItem",
        name: lang === "ar" ? i.nameAr : i.name,
        ...(i.description ? { description: lang === "ar" ? i.descriptionAr ?? i.description : i.description } : {}),
        offers: { "@type": "Offer", price: i.price.toFixed(2), priceCurrency: "JOD" },
      })),
    })),
  };
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE_URL}/" />`,
    `<link rel="alternate" hreflang="ar" href="${SITE_URL}/ar/" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Bilkana Rooftop" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/og.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="${lang === "ar" ? "ar_JO" : "en_US"}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${SITE_URL}/og.jpg" />`,
    ...[restaurant, menu].map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`),
  ].join("\n    ");
}
