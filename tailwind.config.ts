import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Syne", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-hi": "var(--color-surface-hi)",
        line: "var(--color-line)",
        txt: "var(--color-txt)",
        "txt-muted": "var(--color-txt-muted)",
        "txt-dim": "var(--color-txt-dim)",
        "txt-ghost": "var(--color-txt-ghost)",
        accent: "var(--color-accent)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
