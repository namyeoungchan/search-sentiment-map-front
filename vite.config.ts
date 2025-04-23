import {defineConfig} from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    open: false,
    port: 5024,
    strictPort: true,
    host: true,
  },
  plugins: [
    react(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    alias: {
      pages: path.resolve(__dirname, './src/pages'),
      assets: path.resolve(__dirname, './src/assets'),
      styles: path.resolve(__dirname, './src/styles'),
      components: path.resolve(__dirname, './src/components'),
      store: path.resolve(__dirname, './src/store'),
      utils: path.resolve(__dirname, './src/utils'),
      lottie: path.resolve(__dirname, './src/lottie'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      },
    },
  },
});