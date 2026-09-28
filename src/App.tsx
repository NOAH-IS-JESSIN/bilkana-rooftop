import { useEffect } from "react";
import { CATEGORIES } from "./data/menu";
import { LangProvider, useLang, type Lang } from "./lib/i18n";
import { ListProvider } from "./lib/list";
import { UiProvider, useUi } from "./lib/ui";
import { goToCategory, remeasureScroll } from "./lib/scroll";
import { registerGsap, reducedMotion, ScrollTrigger } from "./lib/motion";
import { Loader } from "./components/Loader";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Selection } from "./components/Selection";
import { Chapter } from "./components/Chapter";
import { Rooftop } from "./components/Rooftop";
import { Bridge } from "./components/Bridge";
import { Reserve, Visit } from "./components/Visit";
import { Footer } from "./components/Footer";
import { Dock } from "./components/Dock";
import { Overlays } from "./components/Overlays";
import { OpenStatus } from "./components/OpenStatus";
import { IconList } from "./components/Icons";
import { useList } from "./lib/list";

registerGsap();

const DAY_A = CATEGORIES.filter((c) => ["breakfast", "appetizers", "salads", "burgers", "sandwiches", "mains"].includes(c.id));
const DAY_B = CATEGORIES.filter((c) => c.id === "italian");
const NIGHT = CATEGORIES.filter((c) => c.theme === "night");

export default function App({ lang }: { lang: Lang }) {
  return (
    <LangProvider initial={lang}>
      <ListProvider>
        <UiProvider>
          <Page />
        </UiProvider>
      </ListProvider>
    </LangProvider>
  );
}

function Page() {
  const { t, lang } = useLang();
  useReveals(lang);
  useDeepLink();

  return (
    <>
      <Loader />
      <a className="skip" href="#menu">
        {t.skip}
      </a>
      <Header />
      <main id="top" className="page">
        <Hero />
        <Selection />
        <section id="menu" className="menu" aria-labelledby="menu-title" data-zone="day">
          <div className="menu__head" data-reveal>
            <p className="eyebrow eyebrow--accent">{t.menuEyebrow}</p>
            <h2 id="menu-title" className="menu__title">
              {lang === "ar" ? "من الفطور حتى الواحدة." : "Breakfast to one A.M."}
            </h2>
            <p className="menu__note">{t.menuNote}</p>
            <div className="menu__meta">
              <OpenStatus />
              <ListButton />
            </div>
          </div>
          <Chapter cats={DAY_A} surface="day" />
          <Rooftop />
          <Chapter cats={DAY_B} surface="day" />
          <Bridge />
          <Chapter cats={NIGHT} surface="night" />
        </section>
        <Visit />
        <Reserve />
      </main>
      <Footer />
      <Dock />
      <Overlays />
    </>
  );
}

function ListButton() {
  const { t } = useLang();
  const { count } = useList();
  const { openList } = useUi();
  return (
    <button type="button" className="chip chip--list" onClick={openList}>
      <IconList width={16} height={16} />
      <span>{t.listTitle}</span>
      {count > 0 && <span className="chip__n">{count}</span>}
    </button>
  );
}

/** One IntersectionObserver reveals every [data-reveal] (rows, heads, cards). */
function useReveals(lang: Lang) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    els.forEach((e) => io.observe(e));
    // layout changed (fonts, language) → keep ScrollTrigger + offsets honest
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      remeasureScroll();
    }, 400);
    return () => {
      io.disconnect();
      window.clearTimeout(id);
    };
  }, [lang]);

  useEffect(() => {
    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      remeasureScroll();
    });
  }, []);
}

/** /#italian (or a tab tap that updated the hash) lands under the sticky header. */
function useDeepLink() {
  useEffect(() => {
    const id = location.hash.slice(1);
    if (CATEGORIES.some((c) => c.id === id)) {
      const go = () => goToCategory(id as (typeof CATEGORIES)[number]["id"]);
      if (window.__bilkanaEntered) window.setTimeout(go, 50);
      else window.addEventListener("bilkana:enter", () => window.setTimeout(go, 350), { once: true });
    }
  }, []);
}
