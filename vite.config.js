import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'sources',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [glsl()]
});
