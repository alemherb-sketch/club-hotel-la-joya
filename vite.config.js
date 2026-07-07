import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-peru': {
        target: 'https://api.apis.net.pe',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-peru/, '')
      }
    }
  }
})
