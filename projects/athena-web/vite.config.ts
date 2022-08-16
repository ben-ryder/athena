import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic' // todo: review https://github.com/tailwindlabs/headlessui/issues/1693 & https://github.com/vitejs/vite/issues/9371
    })
  ],
  optimizeDeps: {
    include: ["@ben-ryder/athena-js-lib", "@ben-ryder/athena-testing"]
  },
  build: {
    commonjsOptions: {
      include: [/athena-js-lib/, /athena-testing/, /node_modules/],
    }
  },
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  }
});
