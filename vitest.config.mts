import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      // __dirname doesn't exist in ES modules; resolve relative to this file.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
