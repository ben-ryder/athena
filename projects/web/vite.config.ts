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
    include: ["@ben-ryder/lfb-toolkit"],
    // This is necessary because otherwise `vite dev` includes two separate
    // versions of the JS wrapper. This causes problems because the JS
    // wrapper has a module level variable to track JS side heap
    // allocations, initializing this twice causes horrible breakage
    exclude: ["@automerge/automerge-wasm"]
  },
  // This is only necessary if you are using `SharedWorker` or `WebWorker`, as
  // documented in https://vitejs.dev/guide/features.html#import-with-constructors
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
