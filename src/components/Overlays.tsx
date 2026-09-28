import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORIES, categoryById, formatPrice, itemById, itemsIn } from "../data/menu";
import { src as mediaSrc } from "../data/media";
import { pick, useLang } from "../lib/i18n";
import { useList } from "../lib/list";
import { useUi } from "../lib/ui";
import { goToCategory } from "../lib/scroll";
import { search } from "../lib/search";
import { gsap, reducedMotion } from "../lib/motion";
import { Sheet, useFocusTrap, useScrollLock, useSheet } from "./Sheet";
import { Img } from "./Img";
import { Tags } from "./Tags";
import { ItemRow } from "./MenuItems";
import { IconBack, IconCheck, IconClose, IconMinus, IconPlus, IconSearch } from "./Icons";

export function Overlays() {
  const { overlay, close } = useUi();
  if (!overlay) return null;
  switch (overlay.kind) {
    case "item":
      return <ItemSheet key={overlay.id} id={overlay.id} origin={overlay.origin} onClose={close} />;
    case "search":
      return <Search initial={overlay.query} onClose={close} />;
    case "index":
      return <IndexSheet onClose={close} />;
    case "list":
      return <ListSheet onClose={close} />;
  }
}

function CloseBtn() {
  const { t } = useLang();
  const { dismiss } = useSheet();
  return (
    <button type="button" className="icon-btn sheet__close" onClick={() => dismiss()} aria-label={t.sheetClose} data-autofocus>
      <IconClose />
    </button>
  );
}

/* ─────────────── Item quick view ─────────────── */

function ItemSheet({ id, origin, onClose }: { id: string; origin: DOMRect | null; onClose: () => void }) {
  const { t, lang } = useLang();
  const { lines, add } = useList();
  const item = itemById(id);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [justAdded, setJustAdded] = useState(false);

  // The photo you tapped grows into the sheet's photo (FLIP with a floating copy).
  const morph = useCallback(() => {
    const target = mediaRef.current;
    if (!origin || !target || !item?.image || reducedMotion()) return;
    const panel = target.closest<HTMLElement>(".sheet__panel");
    if (!panel) return;
    const prev = panel.style.transform;
    panel.style.transform = "none"; // measure the final resting place
    const to = target.getBoundingClientRect();
    panel.style.transform = prev;
    const ghost = document.createElement("img");
    ghost.src = mediaSrc(item.image);
    ghost.alt = "";
    ghost.className = "morph-ghost";
    Object.assign(ghost.style, {
      left: `${origin.left}px`,
      top: `${origin.top}px`,
      width: `${origin.width}px`,
      height: `${origin.height}px`,
    });
    document.body.appendChild(ghost);
    gsap.set(target, { opacity: 0 });
    gsap.to(ghost, {
      left: to.left,
      top: to.top,
      width: to.width,
      height: to.height,
      duration: 0.55,
      ease: "expo.out",
      onComplete: () => {
        gsap.to(target, { opacity: 1, duration: 0.12, onComplete: () => ghost.remove() });
      },
    });
  }, [origin, item]);

  if (!item) return null;
  const cat = categoryById(item.category);
  const inList = lines[item.id] ?? 0;
  const desc = pick(lang, item.description, item.descriptionAr);
  const grp = cat.groups?.find((g) => g.id === item.group);

  return (
    <Sheet
      label={pick(lang, item.name, item.nameAr)}
      onClose={onClose}
      className={`sheet--item ${item.image ? "" : "sheet--text"}`}
      onOpened={morph}
    >
      <CloseBtn />
      <div className="sheet__scroll">
        {item.image ? (
          <div className="qv__media" ref={mediaRef}>
            <Img k={item.image} ratio={1} sizes="(min-width: 900px) 520px, 100vw" priority />
          </div>
        ) : (
          <div className="qv__plate" aria-hidden="true">
            <span>{String(CATEGORIES.indexOf(cat) + 1).padStart(2, "0")}</span>
          </div>
        )}
        <div className="qv__body">
          <p className="eyebrow eyebrow--accent">
            {pick(lang, cat.label, cat.labelAr)}
            {grp && <span className="qv__grp"> · {pick(lang, grp.label, grp.labelAr)}</span>}
          </p>
          <h2 className="qv__name">{pick(lang, item.name, item.nameAr)}</h2>
          <p className="qv__alt" lang={lang === "ar" ? "en" : "ar"}>
            {lang === "ar" ? item.name : item.nameAr}
          </p>
          {desc && <p className="qv__desc">{desc}</p>}
          <div className="qv__price-row">
            <p className="price price--xl">
              {formatPrice(item.price)} <small>{t.currency}</small>
            </p>
            <Tags item={item} />
          </div>
          <p className="qv__note">{t.menuNote}</p>

          <div className="qv__actions">
            <button
              type="button"
              className={`btn btn--dark btn--block ${inList ? "is-on" : ""}`}
              onClick={() => {
                add(item.id);
                setJustAdded(true);
                window.setTimeout(() => setJustAdded(false), 1400);
              }}
              aria-live="polite"
            >
              {inList ? <IconCheck /> : <IconPlus />}
              <span>{inList ? `${t.inList} · ${inList}` : t.addToList}</span>
              {justAdded && <span className="sr-only">{t.inList}</span>}
            </button>
            <p className="qv__proto">{t.listNote}</p>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ─────────────── My list ─────────────── */

function ListSheet({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLang();
  const { lines, total, change, clear } = useList();
  const entries = Object.entries(lines);
  return (
    <Sheet label={t.listTitle} onClose={onClose} className="sheet--list">
      <CloseBtn />
      <div className="sheet__scroll">
        <div className="list">
          <p className="eyebrow eyebrow--accent">{t.brand}</p>
          <h2 className="list__title">{t.listTitle}</h2>
          <p className="list__note">{t.listNote}</p>
          {entries.length === 0 ? (
            <p className="list__empty">{t.listEmpty}</p>
          ) : (
            <>
              <ul className="list__lines">
                {entries.map(([id, q]) => {
                  const it = itemById(id)!;
                  return (
                    <li key={id} className="list__line">
                      <span className="list__name">
                        {pick(lang, it.name, it.nameAr)}
                        <span className="list__unit">{formatPrice(it.price)}</span>
                      </span>
                      <span className="stepper">
                        <button
                          type="button"
                          onClick={() => change(id, -1)}
                          aria-label={`${t.listLess}: ${pick(lang, it.name, it.nameAr)}`}
                        >
                          <IconMinus />
                        </button>
                        <span aria-live="polite">{q}</span>
                        <button type="button" onClick={() => change(id, 1)} aria-label={`${t.listMore}: ${pick(lang, it.name, it.nameAr)}`}>
                          <IconPlus />
                        </button>
                      </span>
                      <span className="price">{formatPrice(it.price * q)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="list__total">
                <span>{t.listTotal}</span>
                <span className="price price--lg">
                  {formatPrice(total)} <small>{t.currency}</small>
                </span>
              </div>
              <button type="button" className="link-btn list__clear" onClick={clear}>
                {t.listClear}
              </button>
            </>
          )}
        </div>
      </div>
    </Sheet>
  );
}

/* ─────────────── Category index (dock "Menu") ─────────────── */

function IndexSheet({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLang();
  return (
    <Sheet label={t.indexTitle} onClose={onClose} className="sheet--index">
      <CloseBtn />
      <div className="sheet__scroll">
        <IndexList lang={lang} title={t.indexTitle} />
      </div>
    </Sheet>
  );
}

function IndexList({ lang, title }: { lang: "en" | "ar"; title: string }) {
  const { dismiss } = useSheet();
  return (
    <div className="ix">
      <h2 className="ix__title">{title}</h2>
      <ol className="ix__list">
        {CATEGORIES.map((c, i) => (
          <li key={c.id}>
            <button type="button" className="ix__btn" onClick={() => dismiss(() => goToCategory(c.id))}>
              <span className="ix__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ix__label">{pick(lang, c.label, c.labelAr)}</span>
              <span className="ix__count">{itemsIn(c.id).length}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─────────────── Search ─────────────── */

function Search({ initial, onClose }: { initial: string; onClose: () => void }) {
  const { t, lang } = useLang();
  const [q, setQ] = useState(initial);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const closing = useRef(false);
  useScrollLock();

  const results = useMemo(() => search(q), [q]);

  const dismiss = useCallback(
    (after?: () => void) => {
      if (closing.current) return;
      closing.current = true;
      const el = root.current;
      const done = () => {
        onClose();
        after?.();
      };
      if (!el || reducedMotion()) return done();
      gsap.to(el, { opacity: 0, y: 12, duration: 0.22, ease: "power2.in", onComplete: done });
    },
    [onClose],
  );
  const esc = useCallback(() => dismiss(), [dismiss]);
  useFocusTrap(root, esc);

  useEffect(() => {
    const el = root.current;
    if (el && !reducedMotion()) gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.36, ease: "expo.out" });
    input.current?.focus({ preventScroll: true });
  }, []);

  // swipe down on the header closes it on phones
  const sw = useRef<number | null>(null);

  return createPortal(
    <div className="search" ref={root} role="dialog" aria-modal="true" aria-label={t.searchTitle}>
      <div
        className="search__head"
        onPointerDown={(e) => {
          if (e.pointerType === "touch") sw.current = e.clientY;
        }}
        onPointerUp={(e) => {
          if (sw.current != null && e.clientY - sw.current > 70) dismiss();
          sw.current = null;
        }}
      >
        <button type="button" className="icon-btn" onClick={() => dismiss()} aria-label={t.searchClose}>
          <IconBack />
        </button>
        <p className="search__title">{t.searchTitle}</p>
        <span className="search__kbd" aria-hidden="true">
          Esc
        </span>
      </div>
      <div className="search__field">
        <IconSearch className="search__icon" width={22} height={22} />
        <input
          ref={input}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchTitle}
          aria-describedby="search-count"
        />
        {q && (
          <button
            type="button"
            className="search__clear"
            onClick={() => {
              setQ("");
              input.current?.focus();
            }}
            aria-label={t.searchClear}
          >
            <IconClose width={16} height={16} />
          </button>
        )}
      </div>
      <p id="search-count" className="search__count" aria-live="polite">
        {q.trim() ? t.results(results.length) : " "}
      </p>

      <div className="search__body">
        {!q.trim() && (
          <div className="search__suggest">
            <p className="eyebrow">{t.searchSuggest}</p>
            <div className="chips">
              {t.searchSuggestions.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => setQ(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {q.trim() && results.length > 0 && (
          <ul className="rows rows--search" key={q}>
            {results.map((it, i) => (
              <ItemRow key={it.id} item={it} index={i} showCategory />
            ))}
          </ul>
        )}

        {q.trim() && results.length === 0 && (
          <div className="search__empty">
            <p className="search__empty-title">{t.searchEmpty}</p>
            <p className="eyebrow">{t.searchBrowse}</p>
            <div className="chips">
              {CATEGORIES.map((c) => (
                <button key={c.id} type="button" className="chip" onClick={() => dismiss(() => goToCategory(c.id))}>
                  {pick(lang, c.label, c.labelAr)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
