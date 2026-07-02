import { defineConfig } from 'vite';
import { resolve } from 'path';

// Library build config — produces a single bundled module + types entry.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LuminaUI',
      fileName: 'lumina-ui',
      formats: ['es', 'umd'],
    },
    outDir: 'dist-lib',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2020',
    minify: 'esbuild',
  },
});
