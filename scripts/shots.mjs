/**
 * Scroll screenshots + console / failed-request / overflow report.
 * Needs `npm run preview` running on :4173.
 *
 *   node scripts/shots.mjs <width> <height> <path> <prefix> [--touch] [--reduced] [--steps=N]
 *   node scripts/shots.mjs 390 844 / m- --touch
 *   node scripts/shots.mjs 1440 900 /ar/ dar-
 */
import { chromium } from "playwright";

// QA_URL=http://localhost:4174/bilkana-rooftop/ to test a sub-path (GitHub Pages) build
const ORIGIN = (process.env.QA_URL || "http://localhost:4173/").replace(/\/?$/, "/");
const BASE = new URL(ORIGIN).pathname;
const at = (p) => ORIGIN + p.replace(/^\//, "");
import { mkdirSync } from "node:fs";

const [w = "390", h = "844", path = "/", prefix = "s-", ...flags] = process.argv.slice(2);
const touch = flags.includes("--touch");
const reduced = flags.includes("--reduced");
const stepsArg = flags.find((f) => f.startsWith("--steps="));
const out = ".shots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" }).catch(() => chromium.launch());
const ctx = await browser.newContext({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 1,
  hasTouch: touch,
  isMobile: touch,
  reducedMotion: reduced ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
const errors = [];
const failed = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("requestfailed", (r) => failed.push(r.url()));
page.on("response", (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));

await page.goto(at(path), { waitUntil: "networkidle" });
await page.waitForTimeout(2600);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const steps = stepsArg ? +stepsArg.split("=")[1] : Math.ceil(total / (+h * 0.9));
for (let i = 0; i <= steps; i++) {
  const y = Math.min(total - +h, Math.round(i * +h * 0.9));
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/${prefix}${String(i).padStart(2, "0")}.png` });
  if (y >= total - +h) break;
}
const overflow = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const bad = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width && (r.right > vw + 1 || r.left < -1)) {
      const s = getComputedStyle(el);
      if (s.position === "fixed" || el.closest(".rail__track, .loader, .dock, [aria-hidden=true]")) continue;
      bad.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ${Math.round(r.left)}→${Math.round(r.right)}`);
    }
  }
  return { scrollW: document.documentElement.scrollWidth, vw, bad: bad.slice(0, 12) };
});
console.log(JSON.stringify({ path, w, h, height: total, errors, failed, overflow }, null, 1));
await browser.close();
