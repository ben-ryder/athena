import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  optimizeDeps: {
    include: ["@ben-ryder/athena-js-lib"]
  },
  build: {
    commonjsOptions: {
      include: [/athena-js-lib/, /node_modules/],
    }
  }
});
