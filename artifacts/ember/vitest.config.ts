import { defineConfig } from "vitest/config";
import path from "path";

// Dedicated test config. We deliberately do NOT reuse vite.config.ts because
// it throws unless PORT/BASE_PATH are set — irrelevant for unit tests.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
