import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Enhanced code splitting configuration for better performance
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - separate large libraries for better caching
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

          // Feature-based chunks for lazy loading
          if (id.includes('components/animations') || id.includes('hooks/useScrollAnimation') || id.includes('hooks/useTypingAnimation')) {
            return 'animations';
          }
          if (id.includes('components/ui') && !id.includes('LazyImage')) {
            return 'ui-components';
          }
          if (id.includes('components/sections')) {
            return 'sections';
          }
          if (id.includes('utils/performance') || id.includes('utils/serviceWorker')) {
            return 'performance';
          }
          // Keep LazyImage in main bundle for critical loading
          if (id.includes('LazyImage')) {
            return undefined;
          }
        },
        // Optimize chunk naming for better caching
        chunkFileNames: () => {
          return `assets/js/[name]-[hash].js`;
        },
        // Optimize asset naming for better organization
        assetFileNames: (assetInfo) => {
          const info = assetInfo.source?.toString() || assetInfo.names?.[0] || 'asset';
          const ext = info.split('.').pop() || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      },
      treeshake: {
        moduleSideEffects: false,
      },
    },
    // Optimize chunk size for better loading performance
    chunkSizeWarningLimit: 500, // Smaller chunks for better loading
    // Enable source maps only in development
    sourcemap: false,
    // Enhanced minification for production
    minify: true,
    // Optimize asset inlining for performance
    assetsInlineLimit: 2048, // Smaller inline limit to reduce bundle size
    // CSS code splitting for better caching
    cssCodeSplit: true,
    // Optimize for modern browsers
    target: 'es2020',
  },
  // Enhanced dependency optimization for better performance
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react'
    ],
    exclude: [
      // Exclude heavy dependencies from pre-bundling to reduce initial load
      'three',
      'swiper',
      'framer-motion' // Lazy load animations
    ],
    // Force optimization of critical dependencies
    force: true,
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
