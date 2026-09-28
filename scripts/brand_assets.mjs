/**
 * og.jpg (1200×630) + favicon set, rendered from Bilkana's own mark and photo.
 *   node scripts/brand_assets.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = resolve(root, "public");
const mark = readFileSync(resolve(root, "src/components/Mark.tsx"), "utf8");
const paths = [...mark.matchAll(/d="([^"]+)"/g)].map((m) => m[1]);
const svg = (fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="298 252 474 486"><g fill="${fill}">${paths
    .map((d) => `<path fill-rule="evenodd" d="${d}"/>`)
    .join("")}</g></svg>`;
const photo = readFileSync(resolve(pub, "media/room-glass-1440.webp")).toString("base64");
const marcellus = readFileSync(resolve(root, "node_modules/@fontsource/marcellus/files/marcellus-latin-400-normal.woff2")).toString("base64");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" }).catch(() => chromium.launch());
const page = await browser.newPage();

async function shot(html, w, h, out, type = "png") {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face{font-family:M;src:url(data:font/woff2;base64,${marcellus}) format("woff2")}
    *{margin:0;box-sizing:border-box} body{width:${w}px;height:${h}px;overflow:hidden}</style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(pub, out), type, ...(type === "jpeg" ? { quality: 82 } : {}) });
  console.log("  ", out);
}

// Open Graph: the glass-roof room, slate veil, mark + wordmark
await shot(
  `<div style="position:relative;width:1200px;height:630px;background:#0f181d url(data:image/webp;base64,${photo}) 56% 50%/cover">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(15,24,29,.9) 0%,rgba(15,24,29,.55) 48%,rgba(15,24,29,.15) 100%)"></div>
    <div style="position:absolute;left:84px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;color:#ede8df">
      <div style="width:84px;filter:drop-shadow(0 0 16px rgba(237,190,106,.5))">${svg("#ede8df")}</div>
      <div style="font:400 64px/1 M;letter-spacing:.2em;margin-top:34px">BILKANA</div>
      <div style="font:400 20px/1 M;letter-spacing:.42em;margin-top:18px;color:#b8c2c6">ROOFTOP · AMMAN</div>
      <div style="width:56px;height:1px;background:#edbe6a;margin:34px 0 26px"></div>
      <div style="font:500 22px/1.4 system-ui,sans-serif;color:#ede8df">The menu — breakfast to 1 AM</div>
    </div></div>`,
  1200,
  630,
  "og.jpg",
  "jpeg",
);

// favicons: the mark on slate
const icon = (size, pad) =>
  `<div style="width:${size}px;height:${size}px;background:#0f181d;display:grid;place-items:center">
     <div style="width:${size - pad * 2}px">${svg("#ede8df")}</div></div>`;
await shot(icon(32, 5), 32, 32, "favicon-32.png");
await shot(icon(192, 36), 192, 192, "favicon-192.png");
await shot(icon(180, 34), 180, 180, "apple-touch-icon.png");
await browser.close();

writeFileSync(
  resolve(pub, "robots.txt"),
  `User-agent: *\nAllow: /\n\n# placeholder domain until Bilkana decides where the menu lives (MENU_SCOPE.md)\nSitemap: https://menu.bilkana.jo/sitemap.xml\n`,
);
writeFileSync(
  resolve(pub, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>https://menu.bilkana.jo/</loc><xhtml:link rel="alternate" hreflang="ar" href="https://menu.bilkana.jo/ar/"/></url>
  <url><loc>https://menu.bilkana.jo/ar/</loc><xhtml:link rel="alternate" hreflang="en" href="https://menu.bilkana.jo/"/></url>
</urlset>
`,
);
