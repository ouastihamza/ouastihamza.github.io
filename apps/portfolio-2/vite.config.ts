import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/portfolio-2-assets/',
  build: { outDir: '../../public/portfolio-2-assets', emptyOutDir: true },
});
