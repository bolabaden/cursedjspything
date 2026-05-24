import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    globals: true,
    // Tests must not rely on fresh module graphs or vi.mock reset across files.
    isolate: false,
  },
  // Prebundle deps to cut transform/collect time on repeat runs.
  server: {
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
      },
    },
  },
});
