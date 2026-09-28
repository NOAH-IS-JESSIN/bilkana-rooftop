/**
 * Build standard §"the site must exist in the HTML": both languages are rendered
 * to real HTML at build time, each with its own head, lang and dir.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
// Inline the stylesheet (≈12 KB gz): removes a render-blocking round trip on
// mobile networks. Font URLs inside are absolute (/assets/…), so they still resolve.
let template = readFileSync(resolve(dist, "index.html"), "utf8");
template = template.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve(dist, "." + href), "utf8");
  return `<style>${css}</style>`;
});
const { render, head } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);

const pages = [
  { lang: "en", out: "index.html" },
  { lang: "ar", out: "ar/index.html" },
];

const preload = `<link rel="preload" as="image" href="/media/room-glass-1440.webp" imagesrcset="/media/room-glass-960.webp 960w, /media/room-glass-1440.webp 1440w, /media/room-glass-1920.webp 1920w" imagesizes="100vw" media="(min-aspect-ratio: 4/5)" fetchpriority="high" />
    <link rel="preload" as="image" href="/media/room-glass-portrait-960.webp" imagesrcset="/media/room-glass-portrait-540.webp 540w, /media/room-glass-portrait-760.webp 760w, /media/room-glass-portrait-960.webp 960w" imagesizes="100vw" media="(max-aspect-ratio: 4/5)" fetchpriority="high" />`;

for (const p of pages) {
  const html = template
    .replace('<html lang="en" dir="ltr">', `<html lang="${p.lang}" dir="${p.lang === "ar" ? "rtl" : "ltr"}">`)
    .replace("<!--head-->", head(p.lang))
    .replace("<!--preload-->", preload)
    .replace('<div id="root"><!--app-->', `<div id="root" data-lang="${p.lang}">${render(p.lang)}`);
  const file = resolve(dist, p.out);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`prerendered /${p.lang === "ar" ? "ar/" : ""}  → dist/${p.out}  ${(html.length / 1024).toFixed(1)} KB`);
}
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
