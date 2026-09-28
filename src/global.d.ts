/// <reference types="vite/client" />
declare module "*.css";

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_NOINDEX?: string;
}
