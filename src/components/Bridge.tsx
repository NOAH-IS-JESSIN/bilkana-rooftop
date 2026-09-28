import { useRef } from "react";
import { useLang } from "../lib/i18n";
import { gsap, reducedMotion, onIdle, useIsoLayoutEffect } from "../lib/motion";
import { KanaMark } from "./Mark";

/**
 * Day → night. Bilkana runs 08:00 to 01:00; the menu does the same. As you scroll
 * through this strip the marble morning fades into the slate night, the clock
 * runs from 08:00 to 01:00 and the كانا mark lights up the way the bar sign does.
 * Sticky, not pinned: the page keeps scrolling at the guest's pace.
 */
export function Bridge() {
  const { t, lang } = useLang();
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const cancel = onIdle(() => {
      ctx = gsap.context(() => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.5 } })
          // morning copy leaves first, so the two headlines never overlap
          .to(".bridge__day", { opacity: 0, y: -36, ease: "power1.in", duration: 0.14 }, 0.1)
          // afternoon: its own beat in the dusk light
          .fromTo(".bridge__noon", { opacity: 0, y: 36 }, { opacity: 1, y: 0, ease: "power1.out", duration: 0.14 }, 0.26)
          .to(".bridge__noon", { opacity: 0, y: -36, ease: "power1.in", duration: 0.12 }, 0.5)
          // marble → velvet dusk → slate night
          .to(".bridge__dusk", { opacity: 1, ease: "none", duration: 0.3 }, 0.18)
          .to(".bridge__night", { opacity: 1, ease: "none", duration: 0.32 }, 0.42)
          .to(".bridge__track i", { scaleX: 1, ease: "none", duration: 1 }, 0)
          // the sign lights up, then the night copy arrives
          .fromTo(".bridge__glow", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, ease: "power1.out", duration: 0.35 }, 0.6)
          .fromTo(".bridge__mark", { opacity: 0, y: 12 }, { opacity: 1, y: 0, ease: "power1.out", duration: 0.3 }, 0.62)
          .fromTo(".bridge__eve", { opacity: 0, y: 36 }, { opacity: 1, y: 0, ease: "power1.out", duration: 0.24 }, 0.7)
          .to(".bridge__t-day", { opacity: 0.35, duration: 0.2 }, 0.3)
          .fromTo(".bridge__t-night", { opacity: 0.35 }, { opacity: 1, duration: 0.2 }, 0.7);
      }, el);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, [lang]);

  return (
    <section className="bridge" ref={root} aria-label={`${t.dayTitle} ${t.nightTitle}`}>
      {/* the header reads the first half as day and the second as night */}
      <div className="bridge__zone" data-zone="day" />
      <div className="bridge__zone bridge__zone--night" data-zone="night" />
      <div className="bridge__stage">
        <div className="bridge__bg" aria-hidden="true" />
        <div className="bridge__dusk" aria-hidden="true" />
        <div className="bridge__night" aria-hidden="true" />
        <div className="bridge__glow" aria-hidden="true" />
        <KanaMark className="bridge__mark" />
        <div className="bridge__copy">
          <div className="bridge__day" data-surface="day">
            <p className="bridge__time">{t.dayTime}</p>
            <h2 className="bridge__title">{t.dayTitle}</h2>
            <p className="bridge__line">{t.dayLine}</p>
          </div>
          <div className="bridge__noon" data-surface="day">
            <p className="bridge__time">{t.noonTime}</p>
            <h2 className="bridge__title">{t.noonTitle}</h2>
            <p className="bridge__line">{t.noonLine}</p>
          </div>
          <div className="bridge__eve" data-surface="night">
            <p className="bridge__time">{t.nightTime}</p>
            <h2 className="bridge__title">{t.nightTitle}</h2>
            <p className="bridge__line">{t.nightLine}</p>
          </div>
        </div>
        <div className="bridge__clock" aria-hidden="true" dir="ltr">
          <span className="bridge__t-day">08:00</span>
          <span className="bridge__track">
            <i />
          </span>
          <span className="bridge__t-night">01:00</span>
        </div>
      </div>
    </section>
  );
}
