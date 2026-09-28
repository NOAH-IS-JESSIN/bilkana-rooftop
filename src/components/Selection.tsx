import { useRef } from "react";
import { categoryById, featuredItems, formatPrice } from "../data/menu";
import { pick, useLang } from "../lib/i18n";
import { useUi } from "../lib/ui";
import { finePointer, gsap, MOTION, reducedMotion, SplitText, onIdle, useIsoLayoutEffect } from "../lib/motion";
import { Img } from "./Img";
import { Tags } from "./Tags";
import { IconArrow } from "./Icons";

/**
 * Bilkana Selection — four dishes from Bilkana's own photography, set as an
 * editorial spread (alternating edges on phones, an offset grid on desktop).
 * Morning to evening: Turkish breakfast → nachos → sliders → mojito.
 */
export function Selection() {
  const { t, lang } = useLang();
  const { openItem } = useUi();
  const root = useRef<HTMLElement>(null);
  const items = featuredItems();

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;
    let ctx: gsap.Context | undefined;
    const cancel = onIdle(() => {
      ctx = gsap.context(() => {
        const split = SplitText.create(".selection__title", { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.from(split.lines, {
          yPercent: 105,
          duration: 1,
          ease: MOTION.easeReveal,
          stagger: 0.1,
          scrollTrigger: { trigger: ".selection__head", start: "top 82%", once: true },
        });

        gsap.utils.toArray<HTMLElement>(".feature").forEach((f) => {
          const media = f.querySelector(".feature__frame");
          const img = f.querySelector(".feature__frame img");
          const text = f.querySelectorAll(".feature__text > *");
          gsap
            .timeline({ scrollTrigger: { trigger: f, start: "top 80%", once: true } })
            .fromTo(
              media,
              { clipPath: "inset(12% 0% 0% 0%)", opacity: 0.001 },
              { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.1, ease: MOTION.easeReveal },
            )
            .fromTo(img, { scale: 1.14 }, { scale: 1.04, duration: 1.4, ease: MOTION.easeReveal }, 0)
            .fromTo(text, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, ease: MOTION.easeReveal, stagger: 0.055 }, 0.25);
          // very subtle drift while it crosses the viewport
          gsap.fromTo(
            img,
            { yPercent: -2 },
            { yPercent: 2, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: 0.6 } },
          );
        });
      }, el);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, [lang]);

  // Desktop only: the photo follows the pointer by a few pixels.
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse" || !finePointer() || reducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
    e.currentTarget.style.setProperty("--px", `${x.toFixed(2)}px`);
    e.currentTarget.style.setProperty("--py", `${y.toFixed(2)}px`);
  };
  const onLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--px", "0px");
    e.currentTarget.style.setProperty("--py", "0px");
  };

  return (
    <section id="selection" className="selection" ref={root} data-zone="day" aria-labelledby="selection-title">
      <div className="selection__grid">
        <div className="selection__head">
          <p className="eyebrow eyebrow--accent">{t.selectionEyebrow}</p>
          <h2 id="selection-title" className="selection__title" key={lang}>
            <span className="t-line">{t.selectionTitle[0]}</span> <span className="t-line">{t.selectionTitle[1]}</span>
          </h2>
          <p className="selection__lede">{t.selectionLede}</p>
        </div>

        {items.map((it, i) => {
          const cat = categoryById(it.category);
          return (
            <article className={`feature feature--${i + 1}`} key={it.id}>
              <button
                type="button"
                className="feature__media"
                onClick={(e) => openItem(it.id, e.currentTarget)}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                aria-label={`${pick(lang, it.name, it.nameAr)} — ${t.view}`}
              >
                <span className="feature__frame">
                  <Img k={it.image!} ratio={4 / 5} sizes="(min-width: 1200px) 34vw, (min-width: 768px) 46vw, 78vw" decorative />
                </span>
                <span className="feature__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
              <div className="feature__text">
                <p className="eyebrow">{pick(lang, cat.label, cat.labelAr)}</p>
                <h3 className="feature__name">{pick(lang, it.name, it.nameAr)}</h3>
                <p className="feature__alt" lang={lang === "ar" ? "en" : "ar"}>
                  {lang === "ar" ? it.name : it.nameAr}
                </p>
                <p className="feature__desc">{pick(lang, it.description, it.descriptionAr)}</p>
                <div className="feature__foot">
                  <p className="price price--lg">
                    {formatPrice(it.price)} <small>{t.currency}</small>
                  </p>
                  <Tags item={it} />
                </div>
                <button
                  type="button"
                  className="link-btn"
                  onClick={(e) => openItem(it.id, e.currentTarget.closest("article")?.querySelector(".feature__media"))}
                >
                  {t.view}
                  <IconArrow />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
