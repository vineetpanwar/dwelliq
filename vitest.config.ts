import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    exclude: ["node_modules/**", "tests/e2e/**"],
    coverage: { reporter: ["text", "html"], include: ["src/lib/engine/**", "src/app/api/**"] },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
