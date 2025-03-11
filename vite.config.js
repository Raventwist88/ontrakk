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
  base: '/ontrakk/',
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
        start_url: '/ontrakk/',
        scope: '/ontrakk/',
        icons: [
          {
            src: '/ontrakk/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/ontrakk/icons/icon-512.png',
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
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          }
        ],
        navigateFallback: '/ontrakk/index.html',
        navigateFallbackAllowlist: [/^\/ontrakk\//],
        swDest: 'sw.js',
        sourcemap: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure clean build
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Ensure assets use the correct base path
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  }
})
