/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        volt: {
          base: "#0B0F19",
          surface: "#111827",
          elevated: "#1F2937",
          border: "#374151",
          focus: "#F59E0B",
          amber: "#F59E0B",
          blue: "#0284C7",
          emerald: "#10B981",
          ruby: "#EF4444",
          tier: {
            bronze: "#CD7F32",
            silver: "#C0C0C0",
            gold: "#FFD700",
            platinum: "#E5E4E2",
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
