import { defineConfig } from 'vite';
import { resolve } from 'path';

// Vite config for the demo site (GitHub Pages).
// The base path MUST match the repo name so assets resolve on Pages.
export default defineConfig({
  base: '/lumina-ui/',
  root: '.',
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
