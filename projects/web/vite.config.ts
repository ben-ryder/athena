import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";


// https://vitejs.dev/config/
// Config for automerge is described at https://automerge.org/docs/quickstart/.
export default defineConfig({
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  plugins: [
    react(),
    topLevelAwait(),
    wasm(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Athena',
        short_name: 'Athena',
        description: 'A local-first web app for notes, tasks, journaling, habit tracking and reminders.',
        theme_color: '#0c857a',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  worker: {
    format: "es",
    plugins: [topLevelAwait(), wasm()]
  },
  optimizeDeps: {
    exclude: ["@automerge/automerge-wasm"]
  }
})
