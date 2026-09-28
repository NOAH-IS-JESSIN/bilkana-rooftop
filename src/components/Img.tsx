import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MEDIA, srcset, src, type MediaKey } from "../data/media";
import { useLang } from "../lib/i18n";

type Props = {
  k: MediaKey;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** frame aspect (w/h). Defaults to the photo's own. */
  ratio?: number;
  /** decorative (alt="") when the surrounding text already names the dish */
  decorative?: boolean;
  style?: CSSProperties;
};

/**
 * Responsive photo in a frame that reserves its space (no layout shift).
 * Loads soft → crisp: blur + fade clears once the file has decoded.
 */
export function Img({ k, sizes, className = "", priority, ratio, decorative, style }: Props) {
  const m = MEDIA[k];
  const { lang } = useLang();
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [k]);

  return (
    <span className={`img ${loaded ? "is-loaded" : ""} ${className}`} style={{ aspectRatio: String(ratio ?? m.w / m.h), ...style }}>
      <img
        ref={ref}
        src={src(k)}
        srcSet={srcset(k)}
        sizes={sizes}
        alt={decorative ? "" : lang === "ar" ? m.altAr : m.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // React 19 passes this through as the fetchpriority attribute
        fetchPriority={priority ? "high" : undefined}
        style={"pos" in m && m.pos ? { objectPosition: m.pos } : undefined}
        onLoad={() => setLoaded(true)}
      />
    </span>
  );
}
