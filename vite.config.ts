import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Sub-path hosting (e.g. GitHub Pages project site): BASE_PATH=/bilkana-rooftop/
  base: process.env.BASE_PATH || "/",
  build: {
    target: "es2020",
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap")) return "motion";
          if (id.includes("node_modules/react")) return "react";
          return undefined;
        },
      },
    },
  },
});
