import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

/** Which overlay is open. One at a time; focus returns to whatever opened it. */
type Overlay =
  | { kind: "item"; id: string; origin: DOMRect | null }
  | { kind: "search"; query: string }
  | { kind: "index" }
  | { kind: "list" }
  | null;

type Ctx = {
  overlay: Overlay;
  openItem: (id: string, originEl?: HTMLElement | null) => void;
  openSearch: (query?: string) => void;
  openIndex: () => void;
  openList: () => void;
  close: () => void;
};

const UiCtx = createContext<Ctx | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const opener = useRef<HTMLElement | null>(null);

  const remember = () => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  };

  const openItem = useCallback((id: string, originEl?: HTMLElement | null) => {
    remember();
    const img = originEl?.querySelector("img");
    setOverlay({ kind: "item", id, origin: img ? img.getBoundingClientRect() : null });
  }, []);
  const openSearch = useCallback((query = "") => {
    remember();
    setOverlay({ kind: "search", query });
  }, []);
  const openIndex = useCallback(() => {
    remember();
    setOverlay({ kind: "index" });
  }, []);
  const openList = useCallback(() => {
    remember();
    setOverlay({ kind: "list" });
  }, []);
  const close = useCallback(() => {
    setOverlay(null);
    const el = opener.current;
    opener.current = null;
    if (el && document.contains(el)) requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }, []);

  const value = useMemo(
    () => ({ overlay, openItem, openSearch, openIndex, openList, close }),
    [overlay, openItem, openSearch, openIndex, openList, close],
  );
  return <UiCtx.Provider value={value}>{children}</UiCtx.Provider>;
}

export function useUi() {
  const c = useContext(UiCtx);
  if (!c) throw new Error("useUi outside UiProvider");
  return c;
}
