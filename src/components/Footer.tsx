import { CONTACT } from "../content/site";
import { useLang } from "../lib/i18n";
import { Wordmark } from "./Mark";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer" data-zone="night" data-surface="night">
      <Wordmark className="footer__mark" />
      <p className="footer__name">
        Bilkana Rooftop <span aria-hidden="true">·</span> <span>{t.footerCity}</span>
      </p>
      <p className="footer__links">
        <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer">
          @{CONTACT.instagram}
        </a>
        <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">
          {t.directions}
        </a>
        <a href={`tel:${CONTACT.phoneE164}`} dir="ltr">
          {CONTACT.phoneDisplay}
        </a>
      </p>
      <p className="footer__small">{t.menuNote}</p>
      <p className="footer__small footer__credit">
        {t.footerCredit}{" "}
        <a href="https://mawqeijo.com" target="_blank" rel="noopener noreferrer">
          {t.footerCreditName}
        </a>
      </p>
    </footer>
  );
}
