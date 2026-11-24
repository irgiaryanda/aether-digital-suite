/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        chronos: {
          canvas: "#0B0D12",
          tray: "#11141C",
          surface: "#11141C",
          card: "#161A24",
          elevated: "#1D2330",
          recessed: "#0E1118",
          ink: "#F8FAFC",
          muted: "#94A3B8",
          dim: "#64748B",
          border: "rgba(255, 255, 255, 0.08)",
          "border-subtle": "rgba(255, 255, 255, 0.04)",
          green: "#10B981",
          "green-hover": "#34D399",
          amber: "#F59E0B",
          coral: "#F43F5E",
          warning: "#FB923C",
        },
      },
      fontFamily: {
        display: ['"Outfit"', "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};
