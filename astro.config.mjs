import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite-plus";

const { LOCAL_URL } = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: process.env.URL || LOCAL_URL,
  adapter: cloudflare({ cacheOnDemandPages: true, imageCDN: false }),
  integrations: [
    sitemap({
      filter: (page) => !/\/(404|500)(\/|$)/.test(new URL(page).pathname),
    }),
    react(),
  ],
  vite: {
    server: {
      // TODO: 検証時のみ
      allowedHosts: true,
    },
    plugins: [
      tailwindcss(),
      {
        name: "glsl-frag-loader",
        transform(code, id) {
          if (id.endsWith(".frag")) {
            return `export default ${JSON.stringify(code)}`;
          }
        },
      },
    ],
    assetsInclude: ["src/assets/**/*.glb", "src/assets/**/*.hdr"],
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Zen Old Mincho",
      cssVariable: "--font-zen-old-mincho",
      display: "block",
    },
  ],
});
