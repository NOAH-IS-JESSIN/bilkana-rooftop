import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CATEGORIES } from "../data/menu";
import { pick, useLang } from "../lib/i18n";
import { useUi } from "../lib/ui";
import { goToCategory, scrollToTop, useScroll } from "../lib/scroll";
import { reducedMotion } from "../lib/motion";
import { Wordmark } from "./Mark";
import { IconSearch } from "./Icons";

const useIsoLayout = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * One header, two states. Over the hero: transparent, logo + ع + search only.
 * In the menu: a solid surface in the colour of the section beneath (marble by
 * day, slate by night) with the category rail. Compresses on the way down,
 * opens up on the way back.
 */
export function Header() {
  const { t, lang, setLang } = useLang();
  const { openSearch } = useUi();
  const pastHero = useScroll((s) => s.pastHero);
  const compact = useScroll((s) => s.dir === "down" && s.pastHero);
  const theme = useScroll((s) => s.theme);

  return (
    <header
      className="nav"
      data-state={pastHero ? "menu" : "hero"}
      data-compact={compact ? "" : undefined}
      data-surface={pastHero ? theme : "night"}
    >
      <div className="nav__bar">
        <a
          className="nav__brand"
          href="#top"
          aria-label={lang === "ar" ? "بالكانا روف توب — إلى الأعلى" : "Bilkana Rooftop — back to top"}
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
        >
          <Wordmark compact arabic={lang === "ar"} />
          <span className="nav__sub">{t.brandSub}</span>
        </a>
        <div className="nav__tools">
          <button
            type="button"
            className="nav__lang"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            aria-label={t.langSwitchLabel}
            lang={lang === "ar" ? "en" : "ar"}
          >
            {t.langSwitch}
          </button>
          <button type="button" className="icon-btn" onClick={() => openSearch()} aria-label={t.searchOpen}>
            <IconSearch />
          </button>
        </div>
      </div>
      <Rail visible={pastHero} />
    </header>
  );
}

function Rail({ visible }: { visible: boolean }) {
  const { lang } = useLang();
  const active = useScroll((s) => s.active);
  const rail = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<{ x: number; w: number } | null>(null);

  // Ink line under the active tab + keep the active tab centred in the rail.
  useIsoLayout(() => {
    const r = rail.current;
    if (!r) return;
    const btn = r.querySelector<HTMLButtonElement>(`[data-id="${active ?? "breakfast"}"]`);
    if (!btn) return;
    const rr = r.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    // position relative to the track's scroll origin — same formula in LTR and RTL
    setInk({ x: br.left - rr.left + r.scrollLeft, w: br.width });
    if (!visible) return;
    const delta = br.left + br.width / 2 - (rr.left + rr.width / 2);
    if (Math.abs(delta) > 4) r.scrollBy({ left: delta, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [active, lang, visible]);

  return (
    <nav className="rail" aria-label={lang === "ar" ? "أقسام المنيو" : "Menu categories"} data-visible={visible ? "" : undefined}>
      <div className="rail__track" ref={rail}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            data-id={c.id}
            className="rail__tab"
            aria-current={active === c.id ? "true" : undefined}
            tabIndex={visible ? 0 : -1}
            onClick={() => goToCategory(c.id)}
          >
            {pick(lang, c.label, c.labelAr)}
          </button>
        ))}
        {ink && <span className="rail__ink" style={{ transform: `translateX(${ink.x}px)`, width: ink.w }} aria-hidden="true" />}
      </div>
    </nav>
  );
}
