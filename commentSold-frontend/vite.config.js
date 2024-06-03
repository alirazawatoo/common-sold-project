import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const fromSrc = (dir) => fileURLToPath(new URL(`./src/${dir}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Keeps the absolute imports (components/..., utils/...) the code was written with.
    alias: {
      api: fromSrc('api'),
      components: fromSrc('components'),
      container: fromSrc('container'),
      utils: fromSrc('utils'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: { loadPaths: [fileURLToPath(new URL('./src', import.meta.url))] },
    },
  },
  server: { port: 3000, host: true },
  preview: { port: 3000, host: true },
  build: { outDir: 'build' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    css: false,
  },
})
