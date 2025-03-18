import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  optimizeDeps: {
    include: ["react-pdf"],
  },
  server: {
    host: '0.0.0.0',
    cor:true // Expose to the network
  }
});
