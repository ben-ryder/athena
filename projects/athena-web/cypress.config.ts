import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    specPattern: "src/**/*.unit.test.tsx",
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        port: 3002,
      },
    },
  },

  e2e: {
    specPattern: "src/**/*.e2e.test.tsx",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
