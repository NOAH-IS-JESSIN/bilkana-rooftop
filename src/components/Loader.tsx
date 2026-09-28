import { useEffect, useState } from "react";
import { KanaMark } from "./Mark";
import { reducedMotion } from "../lib/motion";
import { useLang } from "../lib/i18n";

declare global {
  interface Window {
    __bilkanaEntered?: boolean;
  }
}

/**
 * The first second: the كانا mark lights up like the back-lit bar sign, then the
 * slate "roof panes" slide away like Bilkana's retractable glass roof.
 *
 * The whole sequence is CSS (see .loader in app.css) so it plays from first paint
 * and never waits for JavaScript on a slow connection: ≈1.3 s on a first visit,
 * ≈0.45 s for returning guests (html.seen, set in index.html), none with reduced
 * motion or without JS. This component only announces the hand-off to the hero
 * and removes the overlay afterwards.
 */
export const ENTER_MS = { first: 1300, seen: 450 };

export function Loader() {
  const { t } = useLang();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const seen = document.documentElement.classList.contains("seen");
    try {
      localStorage.setItem("bilkana.seen", "1");
    } catch {
      /* ignore */
    }
    const at = reducedMotion() ? 0 : Math.max(0, (seen ? ENTER_MS.seen : ENTER_MS.first) - performance.now());
    const a = window.setTimeout(() => {
      window.__bilkanaEntered = true;
      window.dispatchEvent(new Event("bilkana:enter"));
    }, at);
    const b = window.setTimeout(() => setGone(true), at + 1100);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  if (gone) return null;
  return (
    <div className="loader" aria-hidden="true">
      <div className="loader__panes">
        <span className="loader__pane" />
        <span className="loader__pane" />
        <span className="loader__pane" />
      </div>
      <div className="loader__glow" />
      <div className="loader__center">
        <KanaMark className="loader__mark" />
        <p className="loader__name" lang="en">
          Bilkana
          <br />
          Rooftop
        </p>
        <span className="loader__bar">
          <i />
        </span>
        <span className="sr-only">{t.loading}</span>
      </div>
    </div>
  );
}
