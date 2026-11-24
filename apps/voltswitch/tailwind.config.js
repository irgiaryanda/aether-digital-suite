/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        volt: {
          base: "#0D1015",
          tray: "#131720",
          surface: "#181D27",
          elevated: "#1E2533",
          recessed: "#0F131A",
          border: "#262E3F",
          focus: "#E59A1A",
          amber: "#E59A1A",
          "amber-hover": "#F0AA32",
          ink: "#F3F5F8",
          muted: "#94A3B8",
          dim: "#64748B",
          emerald: "#10B981",
          ruby: "#EF4444",
          tier: {
            bronze: "#CD7F32",
            silver: "#C0C0C0",
            gold: "#E59A1A",
            platinum: "#E5E4E2",
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};
