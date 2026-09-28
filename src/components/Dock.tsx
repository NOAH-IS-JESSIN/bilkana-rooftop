import { useLang } from "../lib/i18n";
import { useList } from "../lib/list";
import { useUi } from "../lib/ui";
import { scrollToTop, useScroll } from "../lib/scroll";
import { IconList, IconMenu, IconSearch, IconUp } from "./Icons";

/**
 * Phone/tablet utility dock — appears once you are in the menu, tucks its labels
 * away while you scroll down, opens back up when you scroll up. Sits above the
 * home indicator (safe-area) and the page reserves room for it.
 */
export function Dock() {
  const { t } = useLang();
  const { openIndex, openSearch, openList, overlay } = useUi();
  const { count } = useList();
  const show = useScroll((s) => s.pastHero);
  const compact = useScroll((s) => s.dir === "down");
  const surface = useScroll((s) => s.theme);

  return (
    <nav
      className="dock"
      aria-label={t.indexTitle}
      data-show={show && !overlay ? "" : undefined}
      data-compact={compact ? "" : undefined}
      data-surface={surface === "night" ? "day" : "night"}
      inert={!show || !!overlay ? true : undefined}
    >
      <button type="button" className="dock__btn" onClick={openIndex}>
        <IconMenu />
        <span className="dock__label">
          <span>{t.dockMenu}</span>
        </span>
      </button>
      <button type="button" className="dock__btn" onClick={() => openSearch()}>
        <IconSearch />
        <span className="dock__label">
          <span>{t.dockSearch}</span>
        </span>
      </button>
      <button type="button" className="dock__btn" onClick={openList}>
        <span className="dock__icon">
          <IconList />
          {count > 0 && <span className="dock__badge">{count}</span>}
        </span>
        <span className="dock__label">
          <span>{t.dockList}</span>
        </span>
      </button>
      <button type="button" className="dock__btn" onClick={scrollToTop}>
        <IconUp />
        <span className="dock__label">
          <span>{t.dockTop}</span>
        </span>
      </button>
    </nav>
  );
}
