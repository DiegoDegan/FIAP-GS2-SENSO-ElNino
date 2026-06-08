import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        agricultor: resolve(__dirname, 'agricultor.html'),
        gestor: resolve(__dirname, 'gestor.html'),
      },
    },
  },
});
