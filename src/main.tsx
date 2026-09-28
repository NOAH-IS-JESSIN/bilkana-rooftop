import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { langFromPath } from "./lib/i18n";
import "@fontsource/marcellus/latin-400.css";
import "@fontsource-variable/manrope/index.css";
import "@fontsource/noto-kufi-arabic/arabic-500.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-600.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/app.css";

const lang = langFromPath(location.pathname);
document.documentElement.lang = lang;
document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App lang={lang} />
  </StrictMode>
);

// Hydrate only markup prerendered for this language; otherwise render fresh (dev server).
if (root.firstElementChild && root.dataset.lang === lang) hydrateRoot(root, app);
else {
  root.textContent = "";
  createRoot(root).render(app);
}
