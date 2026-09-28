import { useRef } from "react";
import { srcset } from "../data/media";
import { useLang } from "../lib/i18n";
import { useUi } from "../lib/ui";
import { goToCategory } from "../lib/scroll";
import { gsap, reducedMotion, onIdle, useIsoLayoutEffect } from "../lib/motion";
import { IconArrow, IconSearch } from "./Icons";
import { OpenStatus } from "./OpenStatus";
import { MEDIA } from "../data/media";

/**
 * Arrival. Bilkana's own glass-roof dining room, full-bleed; a slate veil from the
 * sign's colour; the headline opens line by line through masks.
 */
export function Hero() {
  const { t, lang } = useLang();
  const { openSearch } = useUi();
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const cancel = onIdle(() => {
      ctx = gsap.context(() => {
        // The entrance is CSS (app.css "Entrance") so it runs before JS arrives.
        // Scroll: image settles toward 1, copy lifts, veil deepens. Transform/opacity only.
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.4 } })
          .to(".hero__media", { scale: 0.985, yPercent: 8, ease: "none" }, 0)
          .to(".hero__img", { scale: 1, ease: "none" }, 0)
          .to(".hero__content", { yPercent: -14, opacity: 0.2, ease: "none" }, 0)
          .to(".hero__veil--scroll", { opacity: 1, ease: "none" }, 0);
      }, el);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <section id="hero" className="hero" ref={root} aria-labelledby="hero-title" data-surface="night">
      <div className="hero__media">
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet={srcset("room-glass-portrait")} sizes="100vw" />
          <img
            className="hero__img"
            src="/media/room-glass-1440.webp"
            srcSet={srcset("room-glass")}
            sizes="100vw"
            alt={lang === "ar" ? MEDIA["room-glass"].altAr : MEDIA["room-glass"].alt}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero__veil" />
        <div className="hero__veil hero__veil--scroll" />
        <div className="hero__light" aria-hidden="true" />
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow eyebrow">{t.heroEyebrow}</p>
        <h1 id="hero-title" className="hero__title">
          {t.heroTitle.map((l) => (
            <span className="hero__line" key={l}>
              <span>{l}</span>
            </span>
          ))}
        </h1>
        <p className="hero__lede">{t.heroLede}</p>
        <div className="hero__actions">
          <a
            className="btn btn--light"
            href="#menu"
            onClick={(e) => {
              e.preventDefault();
              goToCategory("breakfast");
            }}
          >
            <span>{t.heroCta}</span>
            <IconArrow />
          </a>
          <button type="button" className="btn btn--ghost-light" onClick={() => openSearch()}>
            <IconSearch />
            <span>{t.heroSearch}</span>
          </button>
        </div>
        <OpenStatus className="hero__meta" />
      </div>

      <a className="hero__cue" href="#selection">
        <span>{t.scrollCue}</span>
        <span className="hero__cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}
