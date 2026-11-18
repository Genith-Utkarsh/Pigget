import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#2563eb",
          electric: "#3b82f6",
          glow: "#1d4ed8",
        },
        surface: {
          card: "rgba(18,19,24,0.88)",
          subcard: "rgba(26,27,34,0.82)",
          dock: "rgba(22,23,29,0.92)",
        },
      },
      boxShadow: {
        "super-glow":
          "0 0 20px rgba(37,99,235,0.4), 0 0 60px rgba(37,99,235,0.15), 0 2px 8px rgba(0,0,0,0.3)",
        "subtle-inner": "0 1px 4px rgba(0,0,0,0.2) inset",
        "card-specular":
          "0 0 0 1px rgba(255,255,255,0.04) inset, 0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.06) inset",
        "pill-inner": "0 1px 3px rgba(0,0,0,0.2) inset",
      },
      borderRadius: {
        glass: "30px",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
    },
  },
  plugins: [],
};

export default config;
