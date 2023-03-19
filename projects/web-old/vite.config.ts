import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"

/**
 * `@automerge/automerge` uses wasm so vite must be configured to support it.
 * See https://github.com/automerge/automerge-rs/tree/main/javascript/examples/vite
 */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    topLevelAwait(),
    wasm()
  ],
  optimizeDeps: {
    exclude: ["@automerge/automerge-wasm"]
  },
  worker: {
    format: "es",
    plugins: [topLevelAwait(), wasm()]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    }
  },
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  }
});
