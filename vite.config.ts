import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/InfraAI-DX-OS/",
  plugins: [react()],
})