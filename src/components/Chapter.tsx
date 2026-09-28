import { CATEGORIES, itemsIn, type Category } from "../data/menu";
import { MEDIA } from "../data/media";
import { pick, useLang } from "../lib/i18n";
import { goToCategory, useScroll } from "../lib/scroll";
import { CategorySection } from "./CategorySection";
import { Img } from "./Img";

/**
 * A run of categories on one surface (day or night). Phones/tablets: a single
 * column. Desktop ≥1200: sticky index · the menu · a sticky photo that crossfades
 * to the category you are reading.
 */
export function Chapter({ cats, surface }: { cats: Category[]; surface: "day" | "night" }) {
  const { lang } = useLang();
  const active = useScroll((s) => s.active);
  const inChapter = cats.find((c) => c.id === active) ?? cats[0];
  // unique visuals in this chapter, in order
  const visuals = cats.filter((c, i) => cats.findIndex((d) => d.visual === c.visual) === i);

  return (
    <div className="chapter" data-zone={surface} data-surface={surface}>
      <nav className="index" aria-label={lang === "ar" ? "فهرس المنيو" : "Menu index"}>
        <ol className="index__list">
          {CATEGORIES.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                className="index__btn"
                aria-current={active === c.id ? "true" : undefined}
                onClick={() => goToCategory(c.id)}
              >
                <span className="index__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="index__label">{pick(lang, c.label, c.labelAr)}</span>
                <span className="index__count">{itemsIn(c.id).length}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="chapter__body">
        {cats.map((c) => (
          <CategorySection key={c.id} cat={c} />
        ))}
      </div>

      <aside className="visual" aria-hidden="true">
        <div className="visual__frame">
          {visuals.map((c) => (
            <div key={c.id} className="visual__layer" data-on={inChapter.visual === c.visual ? "" : undefined}>
              <Img k={c.visual} ratio={4 / 5} sizes="(min-width: 1200px) 30vw, 1px" decorative />
            </div>
          ))}
          <p className="visual__caption">
            <span>{pick(lang, inChapter.label, inChapter.labelAr)}</span>
            <span>{lang === "ar" ? MEDIA[inChapter.visual].altAr : MEDIA[inChapter.visual].alt}</span>
          </p>
        </div>
      </aside>
    </div>
  );
}
