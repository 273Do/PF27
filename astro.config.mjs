import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
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
