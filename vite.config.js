import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import NodeModulesPolyfillPlugin from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      base: '/EVA-libre/',
      // Enable esbuild polyfill plugins
      plugins: [
        NodeModulesPolyfillPlugin()
      ],
    },
  },
});