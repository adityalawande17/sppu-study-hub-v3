import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://sppustudyhub.in',
      dynamicRoutes: [
        '/tools',
        '/news',
        '/first-year',
        '/branches',
        '/branches/cs',
        '/branches/it',
        '/branches/aids',
        '/branches/me',
        '/branches/ce',
        '/branches/ee',
        '/branches/etc',
        '/contribute',
        '/saved',
        '/about',
        '/contact',
      ]
    })
  ]
})
