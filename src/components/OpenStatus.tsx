import { useEffect, useState } from "react";
import { isOpenNow } from "../lib/hours";
import { useLang } from "../lib/i18n";

/** Live open/closed in Amman time. Client-only (time-dependent → no SSR mismatch). */
export function OpenStatus({ className = "" }: { className?: string }) {
  const { t } = useLang();
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOpen(isOpenNow());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <p className={`status ${open === null ? "status--pending" : open ? "status--open" : "status--closed"} ${className}`}>
      <span className="status__dot" aria-hidden="true" />
      {open === null ? (
        <span>&nbsp;</span>
      ) : (
        <span>
          <strong>{open ? t.openNow : t.closedNow}</strong> · {open ? t.until : t.opensAt}
        </span>
      )}
    </p>
  );
}
