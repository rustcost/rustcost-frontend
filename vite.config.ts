/// <reference types="vitest" />
/// <reference types="vite/client" /> // Add this line
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:5000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: backendUrl, // Fallback to default if not set
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
