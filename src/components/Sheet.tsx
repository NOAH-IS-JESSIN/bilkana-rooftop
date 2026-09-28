import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { gsap, reducedMotion } from "../lib/motion";
import { useLang } from "../lib/i18n";

const SheetCtx = createContext<{ dismiss: (after?: () => void) => void }>({ dismiss: () => {} });
export const useSheet = () => useContext(SheetCtx);

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/** Lock page scroll while an overlay is open (keeps the scroll position). */
export function useScrollLock() {
  useEffect(() => {
    const h = document.documentElement;
    const prev = h.style.overflow;
    h.style.overflow = "hidden";
    h.classList.add("has-overlay");
    return () => {
      h.style.overflow = prev;
      h.classList.remove("has-overlay");
    };
  }, []);
}

/** Tab stays inside `root`; Esc dismisses. */
export function useFocusTrap(root: React.RefObject<HTMLElement | null>, onEscape: () => void) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-autofocus]") ?? el.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const f = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!f.length) return;
      const a = f[0];
      const z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [root, onEscape]);
}

const isPanel = () => window.matchMedia("(min-width: 900px)").matches;

/**
 * Phones: a bottom sheet (drag the handle down to close). ≥900 px: a side panel
 * on the reading-end edge (right in English, left in Arabic).
 */
export function Sheet({
  label,
  onClose,
  children,
  className = "",
  onOpened,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** called once the panel is in its final position (e.g. to run an image morph) */
  onOpened?: () => void;
}) {
  const { dir } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  useScrollLock();

  const hiddenFrom = useCallback(() => {
    if (isPanel()) return { xPercent: dir === "rtl" ? -100 : 100, yPercent: 0 };
    return { xPercent: 0, yPercent: 100 };
  }, [dir]);

  useEffect(() => {
    const p = panel.current;
    const bd = root.current?.querySelector(".sheet__backdrop");
    if (!p || !bd) return;
    if (reducedMotion()) {
      onOpened?.();
      return;
    }
    gsap.fromTo(bd, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
    gsap.fromTo(p, hiddenFrom(), { xPercent: 0, yPercent: 0, duration: 0.5, ease: "expo.out" });
    onOpened?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = useCallback(
    (after?: () => void) => {
      if (closing.current) return;
      closing.current = true;
      const p = panel.current;
      const bd = root.current?.querySelector(".sheet__backdrop");
      const done = () => {
        onClose();
        after?.();
      };
      if (!p || !bd || reducedMotion()) return done();
      gsap.to(bd, { opacity: 0, duration: 0.25 });
      gsap.to(p, { ...hiddenFrom(), duration: 0.32, ease: "power2.in", onComplete: done });
    },
    [onClose, hiddenFrom],
  );

  useFocusTrap(panel, dismiss as () => void);

  // drag-to-close on phones (handle + header area)
  const drag = useRef<{ y0: number; t0: number; dy: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if (isPanel() || e.button !== 0) return;
    drag.current = { y0: e.clientY, t0: performance.now(), dy: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !panel.current) return;
    d.dy = Math.max(0, e.clientY - d.y0);
    panel.current.style.transform = `translate3d(0, ${d.dy}px, 0)`;
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    const p = panel.current;
    if (!d || !p) return;
    const v = d.dy / Math.max(1, performance.now() - d.t0);
    p.style.transform = "";
    if (d.dy > 110 || v > 0.6) {
      closing.current = true;
      gsap.set(p, { y: d.dy });
      const bd = root.current?.querySelector(".sheet__backdrop");
      if (bd) gsap.to(bd, { opacity: 0, duration: 0.25 });
      gsap.to(p, { y: p.offsetHeight + 40, duration: 0.25, ease: "power2.in", onComplete: onClose });
    } else {
      gsap.fromTo(p, { y: d.dy }, { y: 0, duration: 0.35, ease: "expo.out" });
    }
  };

  return createPortal(
    <SheetCtx.Provider value={{ dismiss }}>
      <div className={`sheet ${className}`} ref={root}>
        <div className="sheet__backdrop" onClick={() => dismiss()} />
        <div className="sheet__panel" ref={panel} role="dialog" aria-modal="true" aria-label={label}>
          <div className="sheet__grab" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            <span className="sheet__handle" aria-hidden="true" />
          </div>
          {children}
        </div>
      </div>
    </SheetCtx.Provider>,
    document.body,
  );
}
