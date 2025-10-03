/// <reference types="vitest" />
/// <reference types="vite/client" /> // Add this line
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000", // Fallback to default if not set
        changeOrigin: true,
        rewrite: (path) => path, // Keep /api prefix
      },
    },
  },
  test: {
    globals: true,
    environment: "node", // No DOM needed for Api.ts
  },
});
