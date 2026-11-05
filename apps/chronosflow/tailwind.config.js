/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        chronos: {
          canvas: "#090A0F",
          surface: "#12141E",
          card: "#181B2A",
          border: "rgba(255, 255, 255, 0.08)",
          "border-subtle": "rgba(255, 255, 255, 0.04)",
          green: "#10B981",
          amber: "#F59E0B",
          coral: "#F43F5E",
          warning: "#FB923C",
          indigo: "#6366F1",
        },
      },
      fontFamily: {
        display: ['"Outfit"', "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
