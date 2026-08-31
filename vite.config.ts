import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: false,
    // Keep the development API same-origin. Codespaces forwards the browser
    // client publicly while the local Express server stays on port 3001.
    proxy: {
      "/operations": "http://127.0.0.1:3001",
      "/auth": "http://127.0.0.1:3001",
      "/api": "http://127.0.0.1:3001",
      "/file": "http://127.0.0.1:3001",
      "/upload": "http://127.0.0.1:3001",
    },
  },
});
