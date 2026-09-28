import { useSyncExternalStore } from "react";
import type { CategoryId } from "../data/menu";
import { reducedMotion } from "./motion";

/**
 * ONE scroll listener for the whole page (rAF-throttled). Header, rail, dock and
 * desktop index all read from here instead of adding listeners of their own.
 * Section offsets are cached and only re-measured on resize / layout change.
 */
type State = {
  y: number;
  dir: "up" | "down";
  pastHero: boolean;
  active: CategoryId | null;
  theme: "day" | "night";
  inMenu: boolean;
};

let state: State = { y: 0, dir: "down", pastHero: false, active: null, theme: "day", inMenu: false };
const subs = new Set<() => void>();
let started = false;
let ticking = false;
let lastY = 0;
let dirAnchor = 0;
let lock: { id: CategoryId; until: number } | null = null;

type Mark = { id: CategoryId; top: number };
let marks: Mark[] = [];
let zones: { top: number; bottom: number; theme: "day" | "night" }[] = [];
let heroBottom = 0;
let menuTop = 0;
let menuBottom = Infinity;

/** header + rail height, kept in sync with CSS (--nav-h) */
export const navOffset = () => {
  if (typeof window === "undefined") return 0;
  // --nav-h is a calc(); read its two px parts instead
  const cs = getComputedStyle(document.documentElement);
  const bar = parseFloat(cs.getPropertyValue("--bar-h")) || 56;
  const rail = parseFloat(cs.getPropertyValue("--rail-h")) || 0;
  return bar + rail + 12; // a little air between the header and the heading
};

function measure() {
  const sy = window.scrollY;
  marks = Array.from(document.querySelectorAll<HTMLElement>("[data-cat]")).map((el) => ({
    id: el.dataset.cat as CategoryId,
    top: el.getBoundingClientRect().top + sy,
  }));
  zones = Array.from(document.querySelectorAll<HTMLElement>("[data-zone]")).map((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + sy, bottom: r.bottom + sy, theme: el.dataset.zone as "day" | "night" };
  });
  const hero = document.getElementById("hero");
  heroBottom = hero ? hero.getBoundingClientRect().bottom + sy : 0;
  const menu = document.getElementById("menu");
  menuTop = menu ? menu.getBoundingClientRect().top + sy : 0;
  const end = document.getElementById("visit");
  menuBottom = end ? end.getBoundingClientRect().top + sy : Infinity;
}

function compute() {
  ticking = false;
  const y = window.scrollY;
  const nav = navOffset();
  let dir = state.dir;
  // hysteresis so tiny jitters don't flip the header back and forth
  if (y > dirAnchor + 12) {
    dir = "down";
    dirAnchor = y;
  } else if (y < dirAnchor - 12) {
    dir = "up";
    dirAnchor = y;
  }
  if (y <= 4) dir = "up";

  let active: CategoryId | null = null;
  const probe = y + nav + 24;
  for (const m of marks) if (m.top <= probe) active = m.id;
  if (lock) {
    if (performance.now() < lock.until) active = lock.id;
    else lock = null;
  }

  const mid = y + nav * 0.5;
  let theme: "day" | "night" = "day";
  for (const z of zones) if (mid >= z.top && mid < z.bottom) theme = z.theme;

  const next: State = {
    y,
    dir,
    pastHero: y > heroBottom - nav - 8,
    active,
    theme,
    inMenu: y + window.innerHeight * 0.5 > menuTop && y < menuBottom,
  };
  lastY = y;
  const changed = (Object.keys(next) as (keyof State)[]).some((k) => k !== "y" && next[k] !== state[k]);
  state = next;
  if (changed) subs.forEach((f) => f());
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(compute);
  }
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  measure();
  compute();
  lastY = window.scrollY;
  dirAnchor = lastY;
  window.addEventListener("scroll", onScroll, { passive: true });
  const remeasure = () => {
    measure();
    compute();
  };
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);
  window.addEventListener("bilkana:lang", () => requestAnimationFrame(remeasure));
  new ResizeObserver(() => requestAnimationFrame(remeasure)).observe(document.body);
}

function subscribe(f: () => void) {
  start();
  subs.add(f);
  return () => subs.delete(f);
}

const server: State = state;

/** Select a slice; components re-render only when that slice changes. */
export function useScroll<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => sel(state),
    () => sel(server),
  );
}

/** Scroll to a category, keeping the rail/index on the target during the glide. */
export function goToCategory(id: CategoryId) {
  const el = document.querySelector<HTMLElement>(`[data-cat="${id}"]`);
  if (!el) return;
  const target = () => el.getBoundingClientRect().top + window.scrollY - navOffset() + 1;
  const smooth = !reducedMotion();
  lock = { id, until: performance.now() + (smooth ? 1300 : 400) };
  window.scrollTo({ top: target(), behavior: smooth ? "smooth" : "auto" });
  history.replaceState(history.state, "", `#${id}`);
  onScroll();
  // Sections above may have rendered at their real height during the glide
  // (content-visibility) — settle exactly on the heading once motion stops.
  let last = -1;
  let tries = 0;
  const settle = () => {
    const y = window.scrollY;
    if (y !== last && tries++ < 40) {
      last = y;
      return window.setTimeout(settle, 120);
    }
    const off = target() - window.scrollY;
    if (Math.abs(off) > 6) window.scrollTo({ top: target(), behavior: "auto" });
  };
  window.setTimeout(settle, smooth ? 250 : 60);
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
}

export function remeasureScroll() {
  if (!started) return;
  measure();
  compute();
}
