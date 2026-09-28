import { useRef } from "react";
import { CONTACT } from "../content/site";
import { useLang } from "../lib/i18n";
import { gsap, MOTION, reducedMotion, SplitText, onIdle, useIsoLayoutEffect } from "../lib/motion";
import { OpenStatus } from "./OpenStatus";
import { Img } from "./Img";
import { IconArrow, IconInstagram, IconPhone, IconPin } from "./Icons";

/** From browsing to doing: hours, where, and three real actions. */
export function Visit() {
  const { t } = useLang();
  return (
    <section id="visit" className="visit" data-zone="night" data-surface="night" aria-labelledby="visit-title">
      <div className="visit__panel" data-reveal>
        <div className="visit__head">
          <h2 id="visit-title" className="visit__title">
            {t.utilTitle}
          </h2>
          <OpenStatus />
        </div>
        <dl className="visit__facts">
          <div>
            <dt>{t.utilOpenToday}</dt>
            <dd>{t.utilHours}</dd>
          </div>
          <div>
            <dt className="sr-only">{t.directions}</dt>
            <dd>
              {t.utilAddress[0]}
              <br />
              <span className="muted">{t.utilAddress[1]}</span>
            </dd>
          </div>
          <div>
            <dd className="muted">{t.utilModes}</dd>
          </div>
        </dl>
        <div className="visit__actions">
          <a className="action" href={`tel:${CONTACT.phoneE164}`}>
            <IconPhone />
            <span>{t.call}</span>
          </a>
          <a className="action" href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">
            <IconPin />
            <span>{t.directions}</span>
          </a>
          <a className="action" href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
            <IconInstagram />
            <span>{t.instagram}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** The last frame: Bilkana's own line from its reels — "Your table is waiting". */
export function Reserve() {
  const { t, lang } = useLang();
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const cancel = onIdle(() => {
      ctx = gsap.context(() => {
        const split = SplitText.create(".reserve__title", { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.fromTo(
          ".reserve__bg img",
          { scale: 1.12 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.6 } },
        );
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 60%", once: true } })
          .from(split.lines, { yPercent: 105, duration: 1.05, ease: MOTION.easeReveal, stagger: 0.12 })
          .from(".reserve__line", { opacity: 0, y: 18, duration: 0.7, ease: MOTION.easeReveal }, 0.35)
          .from(".reserve__cta", { opacity: 0, y: 22, duration: 0.8, ease: MOTION.easeReveal }, 0.6);
      }, el);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, [lang]);

  return (
    <section className="reserve" ref={root} data-zone="night" data-surface="night" aria-labelledby="reserve-title">
      <div className="reserve__bg">
        <Img k="food-table-spread" sizes="100vw" ratio={undefined} className="img--fill" decorative />
      </div>
      <div className="reserve__inner">
        <h2 id="reserve-title" className="reserve__title" key={lang}>
          {t.reserveTitle[0]}
          <br />
          {t.reserveTitle[1]}
        </h2>
        <p className="reserve__line">{t.reserveLine}</p>
        <a className="btn btn--light reserve__cta" href={`tel:${CONTACT.phoneE164}`}>
          <IconPhone />
          <span>{t.reserveCta}</span>
          <IconArrow />
        </a>
        <p className="reserve__phone" dir="ltr">
          {CONTACT.phoneDisplay}
        </p>
      </div>
    </section>
  );
}
