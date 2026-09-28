import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Motion tokens — mirrored in tokens.css (--motion-*, --ease-*).
 * Luxury motion is controlled: opacity + 20–40 px, never rotation or big scale.
 */
export const MOTION = {
  fast: 0.16,
  ui: 0.24,
  medium: 0.45,
  reveal: 0.7,
  easeUi: "power2.out", // ≈ cubic-bezier(.22,.61,.36,1)
  easeReveal: "expo.out", // ≈ cubic-bezier(.16,1,.3,1)
  easePanel: "power3.inOut",
} as const;

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Run `fn` when the main thread is idle (≤ 1.2 s). Returns a cancel function. */
export function onIdle(fn: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout: 1200 });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export { gsap, ScrollTrigger, SplitText };
