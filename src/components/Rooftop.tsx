import { useRef } from "react";
import { PLACE } from "../content/site";
import { useLang } from "../lib/i18n";
import { gsap, reducedMotion, onIdle, useIsoLayoutEffect } from "../lib/motion";
import { Img } from "./Img";

/**
 * A breath halfway down the menu. Phones: the terrace with the glass roof open.
 * Wider screens: a diptych — the open roof beside the city through the windows.
 * Both panes drift slowly (in opposite directions) as you pass.
 * Words are Bilkana's own ("Amman from above").
 */
export function Rooftop() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const cancel = onIdle(() => {
      ctx = gsap.context(() => {
        const st = { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 };
        gsap.fromTo(".roof__pane--a img", { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: st });
        gsap.fromTo(".roof__pane--b img", { yPercent: 5 }, { yPercent: -5, ease: "none", scrollTrigger: { ...st } });
        gsap.fromTo(
          ".roof__copy > *",
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 60%", once: true },
          },
        );
      }, el);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <section className="roof" ref={root} data-zone="day" data-surface="night" aria-label={t.breakTitle}>
      <div className="roof__media">
        <div className="roof__pane roof__pane--a">
          <Img k="room-roof-open" sizes="(min-width: 900px) 50vw, 100vw" className="img--fill" />
        </div>
        <div className="roof__pane roof__pane--b">
          <Img k="room-city" sizes="(min-width: 900px) 50vw, 1px" className="img--fill" />
        </div>
      </div>
      <div className="roof__copy">
        <p className="roof__coords" dir="ltr">
          <span>{PLACE.lat.toFixed(4)}° N</span>
          <span aria-hidden="true">·</span>
          <span>{PLACE.lng.toFixed(4)}° E</span>
        </p>
        <h2 className="roof__title">{t.breakTitle}</h2>
        <p className="roof__line">{t.breakLine}</p>
      </div>
    </section>
  );
}
