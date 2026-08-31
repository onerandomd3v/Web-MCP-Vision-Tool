// Standalone Vitest configuration for the React/Vite client and Express API.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["apps/web/src/**/*.test.ts", "apps/backend/server/**/*.test.ts"],
    environment: "node",
  },
});
