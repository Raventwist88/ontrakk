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
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false, // We'll use our existing manifest.json
      workbox: {
        globDirectory: 'dist',
        globPatterns: [
          '**/*.{html,js,css,ico,png,svg,webp,jpg,jpeg,json,woff2}'
        ],
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
        cleanupOutdatedCaches: true
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
