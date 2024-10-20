import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/components': path.resolve(__dirname, './src/components'),
      '~/utils': path.resolve(__dirname, './src/utils'),
    },
  },
  plugins: [react()],
});
