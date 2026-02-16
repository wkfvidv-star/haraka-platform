import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __STAGING_BUILD__: true,
    __BUILD_VERSION__: JSON.stringify('2.0.0-staging'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    port: 5174,
    host: true,
    proxy: {
      '/api/v2': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/upload/staging': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/analysis/staging': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist-staging',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs']
        }
      }
    }
  },
  envPrefix: 'VITE_',
  mode: 'staging'
})