import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { register, showUpdateAvailable, showOfflineNotification } from './utils/serviceWorker'
import { ImageOptimizer } from './utils/performance'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for caching and offline functionality
register({
  onSuccess: () => {
    console.log('Service worker registered successfully');
  },
  onUpdate: (registration) => {
    console.log('New version available');
    showUpdateAvailable(registration);
  }
});

// Show offline notification when connection is lost
window.addEventListener('offline', showOfflineNotification);

// Initialize image format support detection early
ImageOptimizer.checkWebPSupport();
ImageOptimizer.checkAVIFSupport();
