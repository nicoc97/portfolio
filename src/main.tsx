import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { register, showUpdateAvailable, showOfflineNotification } from './utils/serviceWorker'
import { ImageOptimizer, performanceMonitor } from './utils/performance'

// Performance-aware initialization
const initializeApp = async () => {
  const recommendations = performanceMonitor.getPerformanceRecommendations();
  
  // Create root and render app
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // Initialize service worker only on capable devices
  if (recommendations.enableServiceWorker) {
    register({
      onSuccess: () => {
        if (import.meta.env.DEV) {
          console.log('Service worker registered successfully');
        }
      },
      onUpdate: (registration) => {
        if (import.meta.env.DEV) {
          console.log('New version available');
        }
        showUpdateAvailable(registration);
      }
    });

    // Show offline notification when connection is lost
    window.addEventListener('offline', showOfflineNotification);
  }

  // Initialize image format support detection on capable devices
  if (recommendations.useWebP) {
    // Use requestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        ImageOptimizer.checkWebPSupport();
        ImageOptimizer.checkAVIFSupport();
      });
    } else {
      setTimeout(() => {
        ImageOptimizer.checkWebPSupport();
        ImageOptimizer.checkAVIFSupport();
      }, 1000);
    }
  }

  // Preload critical assets on capable devices
  if (recommendations.preloadImages && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload critical images that are likely to be needed
      const criticalImages = [
        '/vite.svg',
        // Add other critical images here
      ];
      ImageOptimizer.preloadImages(criticalImages);
    });
  }
};

// Initialize app
initializeApp();
