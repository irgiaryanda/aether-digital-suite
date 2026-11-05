import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
  },
  resolve: {
    alias: {
      "@aether/core-engine": path.resolve(__dirname, "../../packages/core-engine/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
