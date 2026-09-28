/**
 * كانا — Bilkana's own Arabic lettering from the back-lit bar sign ("KANA | كانا"),
 * redrawn as clean geometry from a perspective-corrected photo
 * (sources/photos/bilkana-rooftop-bar-and-sign.webp). See ASSET_REGISTER.md.
 * ⚠ Replace with Bilkana's vector original when supplied.
 */
export function KanaMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="298 252 474 486"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <g fill="currentColor">
        <path d="M305 258 L355 273 L355 640 L462 574 L494 558 C490 640 466 700 424 722 C402 731 380 733 352 733 L336 733 C318 733 305 720 305 702 Z" />
        <path d="M430 388 L478 438 L430 488 L382 438 Z" />
        <path
          fillRule="evenodd"
          d="M520 260 L572 275 L572 444 L736 258 L766 302 L692 372 C706 414 712 472 710 542 C706 652 660 728 590 733 L520 733 Z M578 530 L654 550 C670 572 660 604 584 616 L578 616 Z"
        />
      </g>
    </svg>
  );
}

/** The sign's lockup: BILKANA | بالكانا — Latin set in Marcellus, Arabic as text. */
export function Wordmark({
  compact = false,
  arabic = false,
  className = "",
}: {
  compact?: boolean;
  /** compact only: set the name in Arabic (the Arabic view) */
  arabic?: boolean;
  className?: string;
}) {
  if (compact && arabic)
    return (
      <span className={`wordmark wordmark--compact wordmark--ar ${className}`} lang="ar">
        <KanaMark className="wordmark__mark" />
        <span className="wordmark__arabic">بالكانا</span>
      </span>
    );
  return (
    <span className={`wordmark ${compact ? "wordmark--compact" : ""} ${className}`} lang="en" dir="ltr">
      <KanaMark className="wordmark__mark" />
      <span className="wordmark__latin">Bilkana</span>
      {!compact && (
        <>
          <span className="wordmark__rule" aria-hidden="true" />
          <span className="wordmark__arabic" lang="ar">
            بالكانا
          </span>
        </>
      )}
    </span>
  );
}
