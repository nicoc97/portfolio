/**
 * Performance Utilities
 * 
 * Collection of utilities for performance monitoring and optimization
 */

import React from 'react';

// Extend Navigator interface for device memory
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track animation frame rates
  trackAnimationPerformance(name: string, callback: () => void): void {
    const start = performance.now();

    requestAnimationFrame(() => {
      callback();
      const end = performance.now();
      const duration = end - start;

      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }

      const measurements = this.metrics.get(name)!;
      measurements.push(duration);

      // Keep only last 100 measurements
      if (measurements.length > 100) {
        measurements.shift();
      }

      // Log warning if performance is poor
      if (duration > 16.67) { // 60fps threshold
        console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms`);
      }
    });
  }

  // Get average performance for an animation
  getAveragePerformance(name: string): number {
    const measurements = this.metrics.get(name);
    if (!measurements || measurements.length === 0) return 0;

    return measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
  }

  // Check if device has limited processing power
  isLowEndDevice(): boolean {
    // Check various indicators of device performance
    const checks = [
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2,
      navigator.deviceMemory && navigator.deviceMemory <= 2,
      /Android.*Chrome\/[.0-9]*\s(Mobile|$)/.test(navigator.userAgent),
      window.screen.width <= 768 && window.devicePixelRatio <= 1
    ];

    return checks.filter(Boolean).length >= 2;
  }

  // Get performance recommendations
  getPerformanceRecommendations(): {
    reduceAnimations: boolean;
    disableParallax: boolean;
    simplifyEffects: boolean;
  } {
    const isLowEnd = this.isLowEndDevice();
    const hasSlowAnimations = Array.from(this.metrics.values())
      .some(measurements => {
        const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
        return avg > 16.67;
      });

    return {
      reduceAnimations: isLowEnd || hasSlowAnimations,
      disableParallax: isLowEnd,
      simplifyEffects: isLowEnd || hasSlowAnimations
    };
  }
}

// Enhanced image optimization utilities
export const ImageOptimizer = {
  // WebP support detection with caching
  _webpSupport: null as boolean | null,

  async checkWebPSupport(): Promise<boolean> {
    if (this._webpSupport !== null) return this._webpSupport;

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this._webpSupport = webP.height === 2;
        resolve(this._webpSupport);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  },

  // AVIF support detection
  _avifSupport: null as boolean | null,

  async checkAVIFSupport(): Promise<boolean> {
    if (this._avifSupport !== null) return this._avifSupport;

    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        this._avifSupport = avif.height === 2;
        resolve(this._avifSupport);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  },

  // Convert image to optimized format with fallbacks
  async getOptimizedImageUrl(url: string, width?: number, quality = 80): Promise<string> {
    if (!url) return '';

    const supportsAVIF = await this.checkAVIFSupport();
    const supportsWebP = await this.checkWebPSupport();

    // For local images, try optimized versions
    if (url.startsWith('/') || url.startsWith('./')) {
      let optimizedUrl = url;

      // Try AVIF first (best compression)
      if (supportsAVIF) {
        optimizedUrl = url.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
      } else if (supportsWebP) {
        optimizedUrl = url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }

      // Add size parameters if specified
      if (width) {
        const separator = optimizedUrl.includes('?') ? '&' : '?';
        optimizedUrl += `${separator}w=${width}&q=${quality}`;
      }

      return optimizedUrl;
    }

    // For external images, try to add format parameters
    if (url.includes('unsplash.com') || url.includes('cloudinary.com')) {
      const separator = url.includes('?') ? '&' : '?';
      const format = supportsAVIF ? 'avif' : supportsWebP ? 'webp' : 'auto';
      return `${url}${separator}fm=${format}&q=${quality}${width ? `&w=${width}` : ''}`;
    }

    // For other external images, try to append format parameters
    if (url.startsWith('http')) {
      const separator = url.includes('?') ? '&' : '?';
      const format = supportsAVIF ? 'avif' : supportsWebP ? 'webp' : 'auto';
      return `${url}${separator}format=${format}&quality=${quality}${width ? `&width=${width}` : ''}`;
    }

    return url;
  },

  // Synchronous version for immediate use (uses cached support detection)
  getOptimizedImageUrlSync(url: string, width?: number, quality = 80): string {
    if (!url) return '';

    const supportsAVIF = this._avifSupport === true;
    const supportsWebP = this._webpSupport === true;

    // For local images, try optimized versions
    if (url.startsWith('/') || url.startsWith('./')) {
      let optimizedUrl = url;

      // Try AVIF first (best compression)
      if (supportsAVIF) {
        optimizedUrl = url.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
      } else if (supportsWebP) {
        optimizedUrl = url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }

      // Add size parameters if specified
      if (width) {
        const separator = optimizedUrl.includes('?') ? '&' : '?';
        optimizedUrl += `${separator}w=${width}&q=${quality}`;
      }

      return optimizedUrl;
    }

    // For external images, try to add format parameters
    if (url.includes('unsplash.com') || url.includes('cloudinary.com')) {
      const separator = url.includes('?') ? '&' : '?';
      const format = supportsAVIF ? 'avif' : supportsWebP ? 'webp' : 'auto';
      return `${url}${separator}fm=${format}&q=${quality}${width ? `&w=${width}` : ''}`;
    }

    return url;
  },

  // Generate responsive srcSet with multiple formats
  generateResponsiveSrcSet(url: string, sizes: number[] = [400, 800, 1200, 1600]): string {
    if (!url || url.includes('data:')) return '';


    return sizes.map(size => {
      const optimizedUrl = this.getOptimizedImageUrlSync(url, size);
      return `${optimizedUrl} ${size}w`;
    }).join(', ');
  },

  // Preload critical images
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },

  // Batch preload images
  async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => this.preloadImage(url));
    await Promise.allSettled(promises);
  }
};

// Code splitting utilities
export const CodeSplitter = {
  // Lazy load component with error boundary
  lazyLoadComponent<T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ): React.LazyExoticComponent<T> {
    const LazyComponent = React.lazy(importFn);

    if (fallback) {
      return React.lazy(async () => {
        try {
          return await importFn();
        } catch (error) {
          console.error('Failed to load component:', error);
          return { default: fallback as T };
        }
      });
    }

    return LazyComponent;
  },

  // Preload component for better UX
  preloadComponent<T>(importFn: () => Promise<{ default: T }>): void {
    // Preload on idle or after a delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 2000);
    }
  }
};

// Bundle analysis utilities
export const BundleAnalyzer = {
  // Log bundle information in development
  logBundleInfo(): void {
    if (import.meta.env.DEV) {
      console.group('Bundle Information');
      console.log('React version:', React.version);
      console.log('Build mode:', import.meta.env.MODE);
      console.log('Base URL:', import.meta.env.BASE_URL);
      console.groupEnd();
    }
  },

  // Measure component render time
  measureRenderTime<P extends object>(
    Component: React.ComponentType<P>,
    name: string
  ): React.ComponentType<P> {
    return (props: P) => {
      const renderStart = performance.now();

      React.useEffect(() => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;

        if (renderTime > 16) {
          console.warn(`Slow render: ${name} took ${renderTime.toFixed(2)}ms`);
        }
      });

      return React.createElement(Component, props);
    };
  }
};

// Lazy loading utilities
export const LazyLoader = {
  // Create intersection observer for lazy loading
  createIntersectionObserver(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver {
    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    };

    return new IntersectionObserver(callback, defaultOptions);
  },

  // Lazy load images with pixel placeholder
  lazyLoadImage(
    img: HTMLImageElement,
    src: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const observer = this.createIntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          img.src = src;
          img.onload = () => {
            img.classList.add('loaded');
            observer.disconnect();
            resolve();
          };
          img.onerror = () => {
            observer.disconnect();
            reject(new Error(`Failed to load image: ${src}`));
          };
        }
      });

      observer.observe(img);
    });
  }
};

// Export performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance();