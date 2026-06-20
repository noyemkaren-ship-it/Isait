import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/services': 'http://46.253.132.225:3000',
      '/bid': 'http://46.253.132.225:3000',
      '/examples': 'http://46.253.132.225:3000',
      '/admin': 'http://46.253.132.225:3000',
      '/uploads': 'http://46.253.132.225:3000',   // ← добавь эту строку
    }
  }
})