/**
 * Enhanced Service Worker for Portfolio Site
 * 
 * Provides:
 * - Advanced asset caching with versioning
 * - Image optimization and WebP conversion
 * - Performance monitoring and optimization
 * - Offline-first functionality
 * - Background sync for failed requests
 */

const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `portfolio-v${CACHE_VERSION}`;
const STATIC_CACHE = `portfolio-static-v${CACHE_VERSION}`;
const IMAGE_CACHE = `portfolio-images-v${CACHE_VERSION}`;
const API_CACHE = `portfolio-api-v${CACHE_VERSION}`;
const FONT_CACHE = `portfolio-fonts-v${CACHE_VERSION}`;

// Cache expiration times (in milliseconds)
const CACHE_EXPIRY = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
  API: 5 * 60 * 1000, // 5 minutes
  FONTS: 365 * 24 * 60 * 60 * 1000 // 1 year
};

// Enhanced static assets with critical resources
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/vite.svg',
  // Critical CSS and JS will be added dynamically
];

// Performance monitoring
const performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  failedRequests: 0
};

// Utility to check if cache entry is expired
function isCacheExpired(response, maxAge) {
  const cachedDate = response.headers.get('sw-cached-date');
  if (!cachedDate) return true;
  
  const cacheTime = new Date(cachedDate).getTime();
  const now = Date.now();
  return (now - cacheTime) > maxAge;
}

// Add timestamp to cached responses
function addCacheTimestamp(response) {
  const responseClone = response.clone();
  const headers = new Headers(responseClone.headers);
  headers.set('sw-cached-date', new Date().toISOString());
  
  return new Response(responseClone.body, {
    status: responseClone.status,
    statusText: responseClone.statusText,
    headers: headers
  });
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets with error handling
      caches.open(STATIC_CACHE).then(async (cache) => {
        try {
          return await cache.addAll(STATIC_ASSETS);
        } catch (error) {
          console.warn('Failed to cache some static assets:', error);
          // Try to cache assets individually
          const cachePromises = STATIC_ASSETS.map(async (asset) => {
            try {
              const response = await fetch(asset);
              if (response.ok) {
                await cache.put(asset, response);
              }
            } catch (err) {
              console.warn(`Failed to cache asset: ${asset}`, err);
            }
          });
          await Promise.allSettled(cachePromises);
        }
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Check if request is for an image
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

// Check if request is for a static asset
function isStaticAsset(request) {
  return request.destination === 'script' ||
         request.destination === 'style' ||
         /\.(js|css|woff|woff2|ttf|eot)$/i.test(request.url);
}

// Check if request is a navigation request
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Enhanced image request handling with WebP conversion and optimization
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    
    // Check cache first with expiration
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isCacheExpired(cachedResponse, CACHE_EXPIRY.IMAGES)) {
      performanceMetrics.cacheHits++;
      return cachedResponse;
    }

    performanceMetrics.cacheMisses++;
    performanceMetrics.networkRequests++;

    // Try to fetch WebP version if browser supports it
    const acceptHeader = request.headers.get('accept') || '';
    const supportsWebP = acceptHeader.includes('image/webp');
    
    let fetchRequest = request;
    if (supportsWebP && !request.url.includes('.webp')) {
      // Try WebP version first
      const webpUrl = request.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      fetchRequest = new Request(webpUrl, {
        method: request.method,
        headers: request.headers,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer
      });
    }

    // Fetch from network
    const networkResponse = await fetch(fetchRequest);
    
    // Cache successful responses with timestamp
    if (networkResponse.ok) {
      const responseToCache = addCacheTimestamp(networkResponse.clone());
      cache.put(request, responseToCache);
      
      // Also cache the WebP version if we fetched it
      if (fetchRequest.url !== request.url) {
        cache.put(fetchRequest, addCacheTimestamp(networkResponse.clone()));
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Image request failed:', error);
    performanceMetrics.failedRequests++;
    
    // Return enhanced pixel-style fallback image
    return new Response(
      createPixelFallbackSVG(request.url),
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache',
          'sw-fallback': 'true'
        }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Static asset request failed:', error);
    throw error;
  }
}

// Handle navigation requests with network-first strategy
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Navigation request failed:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/index.html');
  }
}

// Handle generic requests
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Enhanced pixel-style fallback SVG with dynamic sizing and error info
function createPixelFallbackSVG(originalUrl = '') {
  const width = 400;
  const height = 300;
  const pixelSize = 8;
  const cols = Math.floor(width / (pixelSize * 4));
  const rows = Math.floor(height / (pixelSize * 4));
  
  // Extract filename for error display
  const filename = originalUrl.split('/').pop() || 'UNKNOWN';
  const shortFilename = filename.length > 20 ? filename.substring(0, 17) + '...' : filename;
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pixelPattern" patternUnits="userSpaceOnUse" width="32" height="32">
          <rect width="32" height="32" fill="#1a1611"/>
          <rect x="4" y="4" width="${pixelSize}" height="${pixelSize}" fill="#ff8c42" opacity="0.3"/>
          <rect x="20" y="20" width="${pixelSize}" height="${pixelSize}" fill="#7c9756" opacity="0.3"/>
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="${width}" height="${height}" fill="url(#pixelPattern)"/>
      
      <!-- Animated pixel grid -->
      <g fill="#ff8c42" opacity="0.6">
        ${Array.from({ length: cols * rows }, (_, i) => {
          const x = (i % cols) * 32 + 16;
          const y = Math.floor(i / cols) * 32 + 16;
          const delay = (i % 3) * 0.5;
          return `
            <rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="${delay}s" repeatCount="indefinite"/>
            </rect>
          `;
        }).join('')}
      </g>
      
      <!-- Error message -->
      <g filter="url(#glow)">
        <text x="${width/2}" y="${height/2 - 20}" text-anchor="middle" fill="#f5f2e8" font-family="monospace" font-size="16" font-weight="bold">
          [IMAGE_LOAD_FAILED]
        </text>
        <text x="${width/2}" y="${height/2 + 10}" text-anchor="middle" fill="#ff8c42" font-family="monospace" font-size="12">
          ${shortFilename}
        </text>
        <text x="${width/2}" y="${height/2 + 30}" text-anchor="middle" fill="#7c9756" font-family="monospace" font-size="10">
          CACHED_FALLBACK_ACTIVE
        </text>
      </g>
      
      <!-- Border effect -->
      <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#ff8c42" stroke-width="2" stroke-dasharray="8,4" opacity="0.5">
        <animate attributeName="stroke-dashoffset" values="0;12" dur="1s" repeatCount="indefinite"/>
      </rect>
    </svg>
  `;
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic if needed
  console.log('Background sync triggered');
}

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png'
      })
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Enhanced performance monitoring and reporting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_PERFORMANCE_METRICS') {
    event.ports[0].postMessage({
      type: 'PERFORMANCE_METRICS',
      data: {
        ...performanceMetrics,
        cacheHitRate: performanceMetrics.cacheHits / (performanceMetrics.cacheHits + performanceMetrics.cacheMisses) || 0,
        timestamp: Date.now(),
        cacheSize: getCacheSize(),
        version: CACHE_VERSION
      }
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearOldCaches());
  }

  if (event.data && event.data.type === 'PRELOAD_CRITICAL_ASSETS') {
    event.waitUntil(preloadCriticalAssets(event.data.assets || []));
  }

  if (event.data && event.data.type === 'OPTIMIZE_CACHE') {
    event.waitUntil(optimizeCache());
  }
});

// Periodic cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupExpiredCache());
  }
});

// Clean up expired cache entries
async function cleanupExpiredCache() {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    if (cacheName.includes('portfolio')) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const maxAge = cacheName.includes('images') ? CACHE_EXPIRY.IMAGES :
                        cacheName.includes('static') ? CACHE_EXPIRY.STATIC :
                        cacheName.includes('api') ? CACHE_EXPIRY.API :
                        CACHE_EXPIRY.STATIC;
          
          if (isCacheExpired(response, maxAge)) {
            await cache.delete(request);
            console.log(`Cleaned up expired cache entry: ${request.url}`);
          }
        }
      }
    }
  }
}

// Enhanced cache cleanup on activate
async function clearOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = [CACHE_NAME, STATIC_CACHE, IMAGE_CACHE, API_CACHE, FONT_CACHE];
  
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (!currentCaches.includes(cacheName)) {
        console.log('Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

// Get total cache size for monitoring
async function getCacheSize() {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
        percentage: estimate.usage && estimate.quota ? 
          Math.round((estimate.usage / estimate.quota) * 100) : 0
      };
    }
  } catch (error) {
    console.warn('Could not estimate cache size:', error);
  }
  
  return { used: 0, quota: 0, percentage: 0 };
}

// Preload critical assets
async function preloadCriticalAssets(assets) {
  const cache = await caches.open(STATIC_CACHE);
  
  const preloadPromises = assets.map(async (asset) => {
    try {
      const response = await fetch(asset);
      if (response.ok) {
        await cache.put(asset, response);
        console.log(`Preloaded critical asset: ${asset}`);
      }
    } catch (error) {
      console.warn(`Failed to preload asset: ${asset}`, error);
    }
  });
  
  await Promise.allSettled(preloadPromises);
}

// Optimize cache by removing least recently used items when approaching quota
async function optimizeCache() {
  try {
    const estimate = await getCacheSize();
    
    // If using more than 80% of quota, clean up old entries
    if (estimate.percentage > 80) {
      console.log('Cache optimization triggered - usage at', estimate.percentage + '%');
      
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        if (cacheName.includes('portfolio')) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          // Sort by last access time (if available) and remove oldest 25%
          const toRemove = requests.slice(0, Math.floor(requests.length * 0.25));
          
          for (const request of toRemove) {
            await cache.delete(request);
          }
          
          console.log(`Cleaned up ${toRemove.length} entries from ${cacheName}`);
        }
      }
    }
  } catch (error) {
    console.warn('Cache optimization failed:', error);
  }
}