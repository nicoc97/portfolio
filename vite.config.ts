import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Enhanced code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - separate large libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('three')) {
              return 'three-vendor';
            }
            if (id.includes('swiper')) {
              return 'swiper-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Other node_modules go to vendor chunk
            return 'vendor';
          }

          // Feature-based chunks
          if (id.includes('components/animations') || id.includes('hooks/useScrollAnimation') || id.includes('hooks/useTypingAnimation')) {
            return 'animations';
          }
          if (id.includes('components/ui')) {
            return 'ui-components';
          }
          if (id.includes('components/sections')) {
            return 'sections';
          }
          if (id.includes('utils/performance')) {
            return 'performance';
          }
        },
        // Optimize chunk naming
        chunkFileNames: () => {
          return `assets/[name]-[hash].js`;
        },
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Optimize chunk size and performance
    chunkSizeWarningLimit: 800, // Reduced for better performance
    // Enable source maps for production debugging
    sourcemap: true,
    // Enhanced minification
    minify: true,
    // Asset optimization
    assetsInlineLimit: 4096, // Inline small assets
    // CSS code splitting
    cssCodeSplit: true
  },
  // Enhanced dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react'
    ],
    exclude: [
      // Exclude heavy dependencies from pre-bundling
      'three',
      'swiper'
    ]
  },
  // Performance optimizations
  server: {
    fs: {
      strict: false
    },
    // Optimize HMR
    hmr: {
      overlay: false
    }
  },
  // CSS optimization
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // Add any CSS preprocessor options here
    }
  },
  // Define global constants for performance
  define: {
    __DEV__: 'false',
    __PROD__: 'true'
  }
})
