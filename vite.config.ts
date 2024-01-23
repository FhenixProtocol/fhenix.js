/// <reference types="vitest" />

import { defineConfig } from "vite";

import { setup, teardown } from "./test/test-setup";

export default defineConfig({
  test: {
    watch: false,
    include: [
      "test/**/*.test.ts",
      "test/**/*.test.js",
      "src/**/*.test.ts",
      "src/**/*.test.js",
    ],
    watchExclude: ["**/node_modules/**", "**/dist/**"],
    globalSetup: ["./test/test-setup.ts"],
    reporters: [
      "default",
      {
        async onWatcherRerun() {
          await teardown();
          await setup();
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "json-summary"],
    },
  },
});
