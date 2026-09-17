import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Snoeks Wonen Measurements',
        short_name: 'Snoeks Meten',
        description: 'On-site measurement app for window treatments, flooring, insect screens and sun shading',
        theme_color: '#93173d',
        background_color: '#f7f4ef',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Cache the app shell so it opens even with no signal; API calls are
        // handled separately by the IndexedDB offline queue, not by the SW cache.
        globPatterns: ['**/*.{js,css,html,svg}'],
      },
    }),
  ],
})
