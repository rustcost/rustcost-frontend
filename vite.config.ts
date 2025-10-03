/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // your backend
        changeOrigin: true,
        rewrite: (path) => path, // keep /api prefix
      },
    },
  },
  test: {
    globals: true,
    environment: "node", // no DOM needed for Api.ts
  },
});
