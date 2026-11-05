/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: "#F8F9FA",
          surface: "#FFFFFF",
          subtle: "#F1F3F5",
          border: "#E9ECEF",
          "border-strong": "#CED4DA",
          text: "#1A1D20",
          "text-muted": "#495057",
          "text-dim": "#868E96",
          monument: "#282B30",
          surfmist: "#EAE6DF",
          basalt: "#4E5258",
          woodland: "#484844",
          cedar: "#8C4828",
          "water-deep": "#0D6E8A",
          "water-surface": "#38B6D6",
          travertine: "#E3D7C5",
          bluestone: "#5C6269",
          terracotta: "#C85A32",
          cyan: "#0E7490",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};
