import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'icon.svg'],
      manifest: {
        id: 'com.adziusmaster.meetingbingo',
        name: 'Meeting Bingo',
        short_name: 'MtgBingo',
        description: 'Real-time multiplayer bingo for your next meeting. Mark off buzzwords as you hear them — first to bingo wins.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        scope: '/',
        start_url: '/?source=pwa',
        lang: 'en',
        dir: 'ltr',
        categories: ['games', 'entertainment', 'social'],
        icons: [
          { src: 'pwa-64x64.png',            sizes: '64x64',   type: 'image/png' },
          { src: 'pwa-192x192.png',           sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png',           sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcuts: [
          {
            name: 'Create a room',
            short_name: 'New room',
            description: 'Start a new Meeting Bingo room',
            url: '/?action=create',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Join a room',
            short_name: 'Join',
            description: 'Join an existing Meeting Bingo room',
            url: '/?action=join',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        screenshots: [
          {
            src: 'screenshots/game.png',
            sizes: '392x795',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Bingo card during a meeting',
          },
          {
            src: 'screenshots/lobby.png',
            sizes: '392x795',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Game lobby — create or join a room',
          },
          {
            src: 'screenshots/desktop.png',
            sizes: '1280x800',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Meeting Bingo — lobby and game side by side',
          },
        ],
        // Get this code from Play Console → Content Rating, or https://www.globalratings.com
        iarc_rating_id: 'YOUR_IARC_CODE_HERE',
        prefer_related_applications: false,
        related_applications: [
          {
            platform: 'play',
            url: 'https://play.google.com/store/apps/details?id=com.adziusmaster.meetingbingo',
            id: 'com.adziusmaster.meetingbingo',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
