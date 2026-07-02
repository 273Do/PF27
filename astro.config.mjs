import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    assetsInclude: ["**/*.glb"],
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
