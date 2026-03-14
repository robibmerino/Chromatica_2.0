import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";
import { viteSingleFile } from "vite-plugin-singlefile";
import { visualizer } from "rollup-plugin-visualizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Chromatica | Palette Studio",
        short_name: "Chromatica",
        description: "Creador guiado de paletas de color",
        theme_color: "#0a0a0f",
        background_color: "#0a0a0f",
        display: "standalone",
        start_url: "/",
        icons:
          fs.existsSync(path.join(__dirname, "public", "icon-192.png")) &&
          fs.existsSync(path.join(__dirname, "public", "icon-512.png"))
            ? [
                {
                  src: "/icon-192.png",
                  sizes: "192x192",
                  type: "image/png",
                  purpose: "any maskable",
                },
                {
                  src: "/icon-512.png",
                  sizes: "512x512",
                  type: "image/png",
                  purpose: "any maskable",
                },
              ]
            : [],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MB (build singlefile genera un HTML grande)
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
    viteSingleFile(),
    mode === "analyze" &&
      visualizer({
        filename: "dist/stats.html",
        open: false,
        gzipSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
}));
