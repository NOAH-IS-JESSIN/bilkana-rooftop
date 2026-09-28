/**
 * Drives the real UI and asserts outcomes. Needs `npm run preview` on :4173.
 *   node scripts/interact.mjs [width] [height] [--touch]
 * Screenshots → .shots/i-*.png
 */
import { chromium } from "playwright";

// QA_URL=http://localhost:4174/bilkana-rooftop/ to test a sub-path (GitHub Pages) build
const ORIGIN = (process.env.QA_URL || "http://localhost:4173/").replace(/\/?$/, "/");
const BASE = new URL(ORIGIN).pathname;
const at = (p) => ORIGIN + p.replace(/^\//, "");
import { mkdirSync } from "node:fs";

const [w = "390", h = "844", ...flags] = process.argv.slice(2);
const touch = flags.includes("--touch");
mkdirSync(".shots", { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" }).catch(() => chromium.launch());
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, hasTouch: touch, isMobile: touch });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));

const results = [];
const check = (name, ok, extra = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);
const shot = (n) => page.screenshot({ path: `.shots/i-${w}-${n}.png` });
const tap = async (sel) => (touch ? page.tap(sel) : page.click(sel));

await page.goto(at(""), { waitUntil: "networkidle" });
await page.waitForTimeout(4200);
await shot("01-hero");
const heroOpacity = await page.$eval(".hero__line > span", (e) => getComputedStyle(e).transform);
check("hero headline settled", heroOpacity === "none" || heroOpacity.includes("1, 0, 0, 1, 0, 0"), heroOpacity);
check("loader removed", (await page.$(".loader")) === null);

// Explore → breakfast under the sticky header
await tap(".hero__actions .btn--light");
await page.waitForTimeout(1400);
const bTop = await page.$eval("#breakfast", (e) => Math.round(e.getBoundingClientRect().top));
const navH = await page.$eval(".nav", (e) => Math.round(e.getBoundingClientRect().height));
check("CTA lands on breakfast below header", bTop >= navH - 4 && bTop < navH + 40, `section top ${bTop}, nav ${navH}`);
await shot("02-breakfast");

// Rail / index tap → italian
if (+w < 1200) {
  await tap('.rail__tab[data-id="italian"]');
} else {
  await page.click('.chapter .index__btn >> text="Italian corner" >> nth=0');
}
await page.waitForTimeout(1500);
const iTop = await page.$eval("#italian", (e) => Math.round(e.getBoundingClientRect().top));
check("category tap scrolls to section", Math.abs(iTop - navH) < 40, `italian top ${iTop}`);
const active = await page.evaluate(() => document.querySelector('[aria-current="true"]')?.textContent);
check("active category updated", /Italian/.test(active ?? ""), active);
check("URL hash updated", (await page.evaluate(() => location.hash)) === "#italian");
await shot("03-italian");

// Bridge: morning → dusk → night
const bridge = await page.$eval(".bridge", (e) => ({ top: e.getBoundingClientRect().top + scrollY, h: e.offsetHeight }));
for (const f of [0.02, 0.35, 0.55, 0.85]) {
  await page.evaluate((y) => scrollTo(0, y), Math.round(bridge.top + (bridge.h - +h) * f));
  await page.waitForTimeout(900);
  await shot(`04-bridge-${Math.round(f * 100)}`);
}
const surf = await page.$eval(".nav", (e) => e.dataset.surface);
check("header turns night over the evening menu", surf === "night", surf);

// Search (EN)
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(500);
await tap(".nav .icon-btn");
await page.waitForTimeout(500);
check("search opens focused", await page.evaluate(() => document.activeElement?.tagName === "INPUT"));
await page.keyboard.type("latte");
await page.waitForTimeout(300);
const n1 = await page.$$eval(".rows--search .row", (r) => r.length);
check("search 'latte' finds lattes", n1 >= 5, `${n1} results`);
await shot("05-search");
await page.fill(".search__field input", "zzzq");
await page.waitForTimeout(300);
check("empty state shows", !!(await page.$(".search__empty")));
await shot("06-search-empty");
await page.fill(".search__field input", "حلوم");
await page.waitForTimeout(300);
const n2 = await page.$$eval(".rows--search .row", (r) => r.length);
check("Arabic query 'حلوم' works from English view", n2 >= 2, `${n2} results`);
await page.fill(".search__field input", "pizza");
await page.waitForTimeout(300);
const n3 = await page.$$eval(".rows--search .row", (r) => r.length);
check("'pizza' finds the oven", n3 >= 6, `${n3}`);
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
check("Esc closes search", !(await page.$(".search")));

// Quick view from the Selection (image morph) + My list
await page.evaluate(() => document.querySelector("#selection")?.scrollIntoView());
await page.waitForTimeout(1200);
await tap(".feature--2 .feature__media");
await page.waitForTimeout(250);
await shot("07-morph-mid");
await page.waitForTimeout(700);
check("quick view opens", !!(await page.$(".sheet--item .sheet__panel")));
check("no morph ghost left behind", (await page.$$(".morph-ghost")).length === 0);
await shot("08-quickview");
await tap(".qv__actions .btn");
await page.waitForTimeout(300);
const label = await page.$eval(".qv__actions .btn", (e) => e.textContent);
check("add to list confirms", /On your list/.test(label ?? ""), label);
await page.keyboard.press("Escape");
await page.waitForTimeout(600);
check("Esc closes quick view", !(await page.$(".sheet")));

// text-only row → sheet
await page.evaluate(() => document.querySelector("#mains")?.scrollIntoView());
await page.waitForTimeout(900);
await tap("#item-steak-fillet");
await page.waitForTimeout(800);
await shot("09-textsheet");
await page.keyboard.press("Escape");
await page.waitForTimeout(600);

// My list (dock on phones, chip on desktop)
if (+w < 1200) {
  await page.evaluate(() => scrollBy(0, -200)); // scroll up → dock visible
  await page.waitForTimeout(700);
  await tap(".dock__btn:nth-child(3)");
} else {
  await page.evaluate(() => document.querySelector(".menu__head")?.scrollIntoView());
  await page.waitForTimeout(800);
  await page.click(".chip--list");
}
await page.waitForTimeout(800);
const lines = await page.$$eval(".list__line", (l) => l.length);
check("my list shows the added dish", lines === 1, `${lines}`);
await shot("10-list");
await page.keyboard.press("Escape");
await page.waitForTimeout(600);

// Language → Arabic
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(400);
await tap(".nav__lang");
await page.waitForTimeout(900);
const doc = await page.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir, path: location.pathname }));
check("Arabic: lang/dir/url", doc.lang === "ar" && doc.dir === "rtl" && doc.path === BASE + "ar/", JSON.stringify(doc));
await shot("11-ar-hero");
await page.evaluate(() => document.querySelector("#breakfast")?.scrollIntoView());
await page.waitForTimeout(1200);
await shot("12-ar-menu");
const ow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("Arabic: no horizontal overflow", ow <= 0, `${ow}px`);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);
check("Arabic persists on reload", (await page.evaluate(() => document.documentElement.lang)) === "ar");
await page.goto(at(""), { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
check("saved Arabic re-applies when scanning / again", (await page.evaluate(() => location.pathname)) === BASE + "ar/");
await tap(".nav__lang");
await page.waitForTimeout(800);

// Deep link
await page.goto(at("#desserts"), { waitUntil: "networkidle" });
await page.waitForTimeout(2600);
const dTop = await page.$eval("#desserts", (e) => Math.round(e.getBoundingClientRect().top));
check("deep link #desserts", Math.abs(dTop - navH) < 60, `top ${dTop}`);

// Touch targets
const small = await page.$$eval("button, a", (els) =>
  els
    .filter((e) => e.offsetParent !== null && !e.closest(".rail__track"))
    .map((e) => ({ t: (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 30), r: e.getBoundingClientRect() }))
    .filter((x) => x.r.height > 0 && (x.r.height < 40 || x.r.width < 40))
    .map((x) => `${x.t} ${Math.round(x.r.width)}×${Math.round(x.r.height)}`),
);
check("touch targets ≥ 40px", small.length === 0, small.slice(0, 8).join(" | "));

console.log(results.join("\n"));
console.log(errors.length ? "CONSOLE:\n" + errors.join("\n") : "console clean");
await browser.close();
