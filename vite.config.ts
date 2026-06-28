import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    sortImports: {
      newlinesBetween: true,
      customGroups: [
        {
          groupName: "react",
          elementNamePattern: ["react", "react-*", "react-dom", "react-dom/*"],
        },
        {
          groupName: "astro",
          elementNamePattern: ["astro", "astro:*", "astro/*", "@astrojs/*"],
        },
      ],
      groups: [
        "type-import",
        "react",
        "astro",
        ["value-builtin", "value-external"],
        ["type-internal", "value-internal"],
        ["type-parent", "type-sibling", "type-index"],
        ["value-parent", "value-sibling", "value-index"],
        "unknown",
      ],
    },
    sortTailwindcss: {
      stylesheet: "./src/styles/global.css",
      functions: ["clsx", "cn"],
      preserveWhitespace: true,
    },
  },
  staged: {
    "*.{js,ts,jsx,tsx}": "vp check --fix",
    "*.astro": "vp run astro:check",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
