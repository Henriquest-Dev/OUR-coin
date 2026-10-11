import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

declare const process: { env: Record<string, string | undefined> };

// GitHub Pages serves the site from /<repo>/; the deploy workflow sets BASE_PATH.
// Locally and on a custom domain it stays "/".
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
  build: { target: "es2020", cssMinify: true },
});
