import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    specPattern: "src/**/*.unit.test.tsx",
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        port: 3002
      }
    },
  },
});
