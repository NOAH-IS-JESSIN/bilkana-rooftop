import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { COPY, type Copy } from "../content/copy";
import { reducedMotion } from "./motion";

export type Lang = "en" | "ar";

export const LANG_KEY = "bilkana.lang";
const BASE = import.meta.env.BASE_URL; // "/" or e.g. "/bilkana-rooftop/"
export const pathFor = (l: Lang) => (l === "ar" ? `${BASE}ar/` : BASE);
export const langFromPath = (p: string): Lang => {
  const rest = p.startsWith(BASE) ? p.slice(BASE.length - 1) : p;
  return /^\/ar(\/|$)/.test(rest) ? "ar" : "en";
};

type Ctx = { lang: Lang; t: Copy; dir: "ltr" | "rtl"; setLang: (l: Lang) => void };
const LangCtx = createContext<Ctx | null>(null);

function applyDocument(l: Lang) {
  const h = document.documentElement;
  h.lang = l;
  h.dir = l === "ar" ? "rtl" : "ltr";
}

/**
 * Language is a real route (/ and /ar/) so both are prerendered with the right
 * lang/dir. Switching on the client crossfades the copy (~240 ms) and swaps the
 * URL without a reload; the choice is remembered for the next scan.
 */
export function LangProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setState] = useState<Lang>(initial);

  const setLang = useCallback(
    (l: Lang) => {
      if (l === lang) return;
      try {
        localStorage.setItem(LANG_KEY, l);
      } catch {
        /* private mode */
      }
      const swap = () => {
        setState(l);
        applyDocument(l);
        history.replaceState(history.state, "", pathFor(l) + location.search + location.hash);
        document.title = l === "ar" ? "منيو بالكانا روف توب · عمّان" : "Bilkana Rooftop · Menu · Amman";
        window.dispatchEvent(new Event("bilkana:lang"));
      };
      const h = document.documentElement;
      if (reducedMotion()) return swap();
      h.classList.add("lang-out");
      window.setTimeout(() => {
        swap();
        requestAnimationFrame(() => requestAnimationFrame(() => h.classList.remove("lang-out")));
      }, 150);
    },
    [lang],
  );

  // A returning guest who chose Arabic last time lands on / from a printed QR.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANG_KEY);
    } catch {
      /* ignore */
    }
    if ((saved === "ar" || saved === "en") && saved !== initial && !location.search.includes("lang=")) {
      setState(saved);
      applyDocument(saved);
      history.replaceState(history.state, "", pathFor(saved) + location.search + location.hash);
      window.dispatchEvent(new Event("bilkana:lang"));
    }
  }, [initial]);

  const value = useMemo<Ctx>(() => ({ lang, t: COPY[lang], dir: lang === "ar" ? "rtl" : "ltr", setLang }), [lang, setLang]);
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}

/** pick the EN or AR variant of a bilingual field */
export const pick = (lang: Lang, en?: string, ar?: string) => (lang === "ar" ? ar ?? en : en) ?? "";
