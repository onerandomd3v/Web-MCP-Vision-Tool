import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { wasp } from "wasp/client/vite";

export default defineConfig({
  plugins: [wasp(), tailwindcss()],
  server: {
    open: false,
    // Codespaces exposes the browser client publicly, while the generated
    // Wasp server stays on its private port. Proxy operation requests through
    // the client so a forwarded preview never calls the browser's localhost.
    proxy: {
      "/operations": "http://127.0.0.1:3001",
      "/auth": "http://127.0.0.1:3001",
      "/api": "http://127.0.0.1:3001",
      "/file": "http://127.0.0.1:3001",
      "/upload": "http://127.0.0.1:3001",
    },
  },
});
