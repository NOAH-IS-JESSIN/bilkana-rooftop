import { CATEGORIES, itemsIn, type Category, type MenuItem } from "../data/menu";
import { pick, useLang } from "../lib/i18n";
import { Img } from "./Img";
import { ItemCard, ItemRow } from "./MenuItems";

/**
 * One category. Same system, different rhythm per `layout`:
 *   lead   — big editorial photo, then the groups
 *   split  — photo beside the list (tablet), photo above (phone)
 *   dense  — text-first, two columns when there is room
 *   ledger — text-first, larger names, one column
 * On desktop (≥1200) the section photo moves to the sticky side panel instead.
 */
export function CategorySection({ cat }: { cat: Category }) {
  const { t, lang } = useLang();
  const items = itemsIn(cat.id);
  const n = CATEGORIES.findIndex((c) => c.id === cat.id) + 1;
  const groups = cat.groups
    ? cat.groups.map((g) => ({ g, items: items.filter((i) => i.group === g.id) })).filter((x) => x.items.length)
    : [{ g: null, items }];

  const other = lang === "ar" ? cat.label : cat.labelAr;

  return (
    <section className={`cat cat--${cat.layout}`} id={cat.id} data-cat={cat.id} aria-labelledby={`cat-${cat.id}`}>
      <header className="cat__head" data-reveal>
        <span className="cat__num" aria-hidden="true">
          {String(n).padStart(2, "0")}
        </span>
        <div className="cat__titles">
          <h2 id={`cat-${cat.id}`} className="cat__title">
            {pick(lang, cat.label, cat.labelAr)}
          </h2>
          <span className="cat__rule" aria-hidden="true" />
          <span className="cat__other" lang={lang === "ar" ? "en" : "ar"} aria-hidden="true">
            {other}
          </span>
        </div>
        <p className="cat__intro">{pick(lang, cat.intro, cat.introAr)}</p>
        <p className="cat__count">{t.items(items.length)}</p>
      </header>

      {(cat.layout === "lead" || cat.layout === "split") && (
        <figure className="cat__visual" data-reveal>
          <Img
            k={cat.visual}
            ratio={cat.layout === "lead" ? 4 / 3 : 16 / 10}
            sizes="(min-width: 1200px) 1px, (min-width: 768px) 42vw, 100vw"
          />
        </figure>
      )}

      <div className="cat__groups">
        {groups.map(({ g, items: gi }) => (
          <Group key={g?.id ?? "all"} title={g ? pick(lang, g.label, g.labelAr) : null} items={gi} dense={cat.layout === "dense"} />
        ))}
      </div>
    </section>
  );
}

function Group({ title, items, dense }: { title: string | null; items: MenuItem[]; dense: boolean }) {
  const photographed = items.filter((i) => i.image);
  const text = items.filter((i) => !i.image);
  return (
    <div className="grp">
      {title && (
        <h3 className="grp__title" data-reveal>
          {title}
        </h3>
      )}
      {photographed.length > 0 && (
        <ul className={`cards ${photographed.length === 1 ? "cards--one" : ""}`}>
          {photographed.map((it, i) => (
            <ItemCard key={it.id} item={it} wide={photographed.length === 1} index={i} />
          ))}
        </ul>
      )}
      {text.length > 0 && (
        <ul className={`rows ${dense ? "rows--dense" : ""}`}>
          {text.map((it, i) => (
            <ItemRow key={it.id} item={it} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}
