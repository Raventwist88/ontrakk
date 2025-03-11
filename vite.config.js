import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// Get the repository name from package.json or environment variable
const getBase = () => {
  // Use environment variable in production (GitHub Pages)
  if (process.env.NODE_ENV === 'production') {
    return '/ontrakk/' // Replace 'ontrakk' with your actual repository name
  }
  // Use root path for development
  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  base: getBase(),
  root: path.resolve(__dirname, ''),
  server: {
    port: 5173,
    hot: true,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*'],
      manifest: {
        name: 'OnTrakk',
        short_name: 'OnTrakk',
        description: 'Track your fitness journey',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: getBase(), // Dynamic start_url
        icons: [
          {
            src: `${getBase()}icons/icon-192.png`, // Dynamic path
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: `${getBase()}icons/icon-512.png`, // Dynamic path
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: new RegExp('^https://api\\..*'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure assets are properly hashed and cached
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
