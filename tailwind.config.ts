import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        monroe: ["var(--font-monroe)", "serif"],
        jetbrains: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        base: "#050505",
        baseSoft: "#0a0a0a",
        warm: "#f5f0e8",
        accent: "var(--accent)",
      },
      backdropBlur: {
        glass: "80px",
      },
    },
  },
  plugins: [],
};

export default config;
