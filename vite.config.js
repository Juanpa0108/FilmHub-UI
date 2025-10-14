import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configure Vite to use FilmHub as the project root so index.html and public assets resolve correctly
export default defineConfig({
  plugins: [react()],
  root: 'FilmHub',
  publicDir: 'public',
  server: {
    port: 5174, // match the port you were using; Vite will auto-pick if busy
    open: false,
  },
  preview: {
    port: 5174,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
