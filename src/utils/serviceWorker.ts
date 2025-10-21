/**
 * Service Worker Registration Utilities
 * 
 * Handles service worker registration and lifecycle management
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}sw.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          if (import.meta.env.DEV) {
            console.log(
              'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
            );
          }
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              if (import.meta.env.DEV) {
                console.log(
                  'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
                );
              }

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              if (import.meta.env.DEV) {
                console.log('Content is cached for offline use.');
              }

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        console.error('Error during service worker registration:', error);
      }
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      if (import.meta.env.DEV) {
        console.log(
          'No internet connection found. App is running in offline mode.'
        );
      }
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error(error.message);
        }
      });
  }
}

// Utility to check if app is running offline
export function isOffline(): boolean {
  return !navigator.onLine;
}

// Utility to show update available notification
export function showUpdateAvailable(registration: ServiceWorkerRegistration) {
  // Create a pixel-style notification
  const notification = document.createElement('div');
  notification.className = `
    fixed top-4 right-4 z-50 bg-primary-bg border-2 border-accent-orange 
    rounded-lg p-4 font-tech text-sm text-text-primary shadow-lg
    transform translate-x-full transition-transform duration-300
  `;
  
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="flex-1">
        <div class="font-bold text-accent-orange">[UPDATE_AVAILABLE]</div>
        <div class="text-text-secondary">New version ready to install</div>
      </div>
      <button id="update-btn" class="bg-accent-orange text-primary-bg px-3 py-1 rounded hover:bg-opacity-80">
        UPDATE
      </button>
      <button id="dismiss-btn" class="text-text-secondary hover:text-text-primary">
        ✕
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Handle update button
  const updateBtn = notification.querySelector('#update-btn');
  updateBtn?.addEventListener('click', () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  });
  
  // Handle dismiss button
  const dismissBtn = notification.querySelector('#dismiss-btn');
  dismissBtn?.addEventListener('click', () => {
    notification.style.transform = 'translateX(full)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  });
  
  // Auto dismiss after 10 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.transform = 'translateX(full)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }
  }, 10000);
}

// Utility to show offline notification
export function showOfflineNotification() {
  const notification = document.createElement('div');
  notification.className = `
    fixed bottom-4 left-4 z-50 bg-red-900 border-2 border-red-500 
    rounded-lg p-3 font-tech text-sm text-white shadow-lg
    transform -translate-y-full transition-transform duration-300
  `;
  
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span>[OFFLINE_MODE]</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
  }, 100);
  
  // Listen for online event to remove notification
  const handleOnline = () => {
    notification.style.transform = 'translateY(full)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
    window.removeEventListener('online', handleOnline);
  };
  
  window.addEventListener('online', handleOnline);
}

// Service Worker Performance Utilities
export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  
  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  // Get performance metrics from service worker
  async getPerformanceMetrics(): Promise<any> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'PERFORMANCE_METRICS') {
          resolve(event.data.data);
        }
      };

      const controller = navigator.serviceWorker.controller;
      if (controller) {
        controller.postMessage(
          { type: 'GET_PERFORMANCE_METRICS' },
          [messageChannel.port2]
        );
      } else {
        resolve(null);
      }

      // Timeout after 5 seconds
      setTimeout(() => resolve(null), 5000);
    });
  }

  // Preload critical assets through service worker
  async preloadCriticalAssets(assets: string[]): Promise<void> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return;
    }

    const controller = navigator.serviceWorker.controller;
    if (controller) {
      controller.postMessage({
        type: 'PRELOAD_CRITICAL_ASSETS',
        assets
      });
    }
  }

  // Trigger cache optimization
  async optimizeCache(): Promise<void> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return;
    }

    const controller = navigator.serviceWorker.controller;
    if (controller) {
      controller.postMessage({
        type: 'OPTIMIZE_CACHE'
      });
    }
  }

  // Clear old caches
  async clearCache(): Promise<void> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return;
    }

    const controller = navigator.serviceWorker.controller;
    if (controller) {
      controller.postMessage({
        type: 'CLEAR_CACHE'
      });
    }
  }

  // Monitor cache performance
  async monitorCachePerformance(): Promise<void> {
    const metrics = await this.getPerformanceMetrics();

    if (metrics && import.meta.env.DEV) {
      // Service Worker performance metrics available for debugging
      // Uncomment to view detailed metrics

      // Trigger optimization if cache hit rate is low
      if (metrics.cacheHitRate < 0.7) {
        await this.optimizeCache();
      }

      // Trigger optimization if cache usage is high
      if (metrics.cacheSize && metrics.cacheSize.percentage > 80) {
        await this.optimizeCache();
      }
    }
  }
}

// Export singleton instance
export const serviceWorkerManager = ServiceWorkerManager.getInstance();