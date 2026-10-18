import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F1EA",
        stone: "#EAE5D9",
        ink: "#111110",
        signal: "#FF4F00",
        cobalt: "#0047FF",
        ledger: "#0F766E",
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        tactile: "4px 4px 0px #111110",
        "tactile-sm": "2px 2px 0px #111110",
        "tactile-orange": "4px 4px 0px #FF4F00",
      },
    },
  },
  plugins: [],
};

export default config;
