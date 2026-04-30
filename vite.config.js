import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/fusion-api": {
        target: "https://fusion-ai-api.medifus.dev",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/fusion-api/, ""),
      },
    },
  },
});