/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: "#F6F7F9",
          tray: "#EAEEF3",
          surface: "#FFFFFF",
          subtle: "#F1F4F8",
          border: "#E2E6EC",
          "border-strong": "#CBD2DC",
          text: "#111418",
          "text-muted": "#4E5661",
          "text-dim": "#6B7280",
          monument: "#282B30",
          surfmist: "#EAE6DF",
          basalt: "#4E5258",
          woodland: "#484844",
          cedar: "#8C4828",
          "water-deep": "#0D6E8A",
          "water-surface": "#38B6D6",
          travertine: "#E3D7C5",
          bluestone: "#5C6269",
          cyan: "#0E7490",
          "cyan-dark": "#0B5E75",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};
