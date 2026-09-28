/**
 * Every width × both languages: console errors, failed requests, horizontal
 * overflow, clipped text (scrollWidth > clientWidth on text elements).
 * Needs `npm run preview` on :4173.   node scripts/widths.mjs [--reduced]
 */
import { chromium } from "playwright";

const reduced = process.argv.includes("--reduced");
const sizes = [
  [360, 740, true],
  [375, 812, true],
  [390, 844, true],
  [430, 932, true],
  [768, 1024, true],
  [1024, 768, false],
  [1280, 800, false],
  [1440, 900, false],
  [1920, 1080, false],
];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" }).catch(() => chromium.launch());
let bad = 0;
for (const path of ["/", "/ar/"]) {
  for (const [w, h, touch] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch, reducedMotion: reduced ? "reduce" : "no-preference" });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errs.push(m.text()));
    page.on("pageerror", (e) => errs.push(e.message));
    page.on("response", (r) => r.status() >= 400 && errs.push(`${r.status()} ${r.url()}`));
    await page.goto(`http://localhost:4173${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    // walk the page so lazy images and reveals run
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += h) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = document.documentElement.scrollWidth - vw;
      const clipped = [];
      for (const el of document.querySelectorAll("h1,h2,h3,p,.row__name,.card__name,.rail__tab,.btn,.price,.chip,.index__label,.action")) {
        if (el.closest(".loader, .rail__track") && !el.classList.contains("rail__tab")) continue;
        if (el.classList.contains("rail__tab")) continue; // the rail scrolls by design
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        if (el.scrollWidth > el.clientWidth + 1 && cs.overflow !== "visible") clipped.push(el.className || el.tagName);
        const b = el.getBoundingClientRect();
        if (b.width && (b.right > vw + 1 || b.left < -1)) clipped.push("offscreen:" + (el.className || el.tagName));
      }
      return { over, clipped: [...new Set(clipped)].slice(0, 6) };
    });
    const ok = !errs.length && r.over <= 0 && !r.clipped.length;
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "BAD "} ${path.padEnd(4)} ${String(w).padStart(4)}×${h}  overflow ${r.over}px  ${r.clipped.join(", ")} ${errs.join(" | ")}`);
    await ctx.close();
  }
}
await browser.close();
process.exit(bad ? 1 : 0);
