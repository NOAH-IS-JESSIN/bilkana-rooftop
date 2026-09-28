import type { MenuItem } from "../data/menu";
import { categoryById, formatPrice } from "../data/menu";
import { pick, useLang } from "../lib/i18n";
import { useList } from "../lib/list";
import { useUi } from "../lib/ui";
import { Img } from "./Img";
import { Tags } from "./Tags";
import { IconCheck } from "./Icons";

/** Text row: NAME ········ PRICE / description. The whole row opens the item sheet. */
export function ItemRow({ item, index = 0, showCategory = false }: { item: MenuItem; index?: number; showCategory?: boolean }) {
  const { lang } = useLang();
  const { openItem } = useUi();
  const { lines } = useList();
  const desc = pick(lang, item.description, item.descriptionAr);
  const inList = !!lines[item.id];
  return (
    <li className="row-li" data-reveal style={{ "--i": index % 8 } as React.CSSProperties}>
      <button type="button" className="row" onClick={(e) => openItem(item.id, e.currentTarget)} id={`item-${item.id}`}>
        <span className="row__main">
          {showCategory && (
            <span className="row__cat">{pick(lang, categoryById(item.category).label, categoryById(item.category).labelAr)}</span>
          )}
          <span className="row__name">
            {pick(lang, item.name, item.nameAr)}
            {inList && (
              <span className="row__in" aria-label={lang === "ar" ? "في قائمتك" : "On your list"}>
                <IconCheck width={14} height={14} />
              </span>
            )}
          </span>
          {desc && <span className="row__desc">{desc}</span>}
          <Tags item={item} compact />
        </span>
        <span className="row__price price">{formatPrice(item.price)}</span>
      </button>
    </li>
  );
}

/**
 * Photo card. `wide` = image beside text (one photographed dish in a group);
 * otherwise a compact portrait card for pairs.
 */
export function ItemCard({ item, wide, index = 0 }: { item: MenuItem; wide?: boolean; index?: number }) {
  const { t, lang } = useLang();
  const { openItem } = useUi();
  const desc = pick(lang, item.description, item.descriptionAr);
  const cat = categoryById(item.category);
  return (
    <li className={`card-li ${wide ? "card-li--wide" : ""}`} data-reveal style={{ "--i": index } as React.CSSProperties}>
      <button type="button" className={`card ${wide ? "card--wide" : ""}`} onClick={(e) => openItem(item.id, e.currentTarget)}>
        <span className="card__media">
          <Img
            k={item.image!}
            ratio={4 / 5}
            sizes={wide ? "(min-width: 768px) 240px, 40vw" : "(min-width: 768px) 280px, 46vw"}
            decorative
          />
        </span>
        <span className="card__body">
          <span className="card__cat">{pick(lang, cat.label, cat.labelAr)}</span>
          <span className="card__name">{pick(lang, item.name, item.nameAr)}</span>
          {wide && desc && <span className="card__desc">{desc}</span>}
          <span className="card__foot">
            <span className="price">
              {formatPrice(item.price)} <small>{t.currency}</small>
            </span>
            <Tags item={item} compact />
          </span>
        </span>
      </button>
    </li>
  );
}
