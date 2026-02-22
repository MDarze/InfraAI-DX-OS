import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/InfraAI-DX-OS/',
  server: { port: 3000 },
  build: { chunkSizeWarningLimit: 2000 },
});
