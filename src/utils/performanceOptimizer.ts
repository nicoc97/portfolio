/**
 * Performance Optimizer Utility
 * 
 * Provides adaptive performance optimizations based on device capabilities
 * and user preferences for better experience on low-end hardware
 */

import { performanceMonitor } from './performance';

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private deviceCapabilities: DeviceCapabilities | null = null;
  private optimizationSettings: OptimizationSettings | null = null;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  constructor() {
    this.detectDeviceCapabilities();
    this.generateOptimizationSettings();
  }

  // Detect comprehensive device capabilities
  private detectDeviceCapabilities(): void {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    this.deviceCapabilities = {
      // CPU
      cores: navigator.hardwareConcurrency || 2,
      
      // Memory
      memory: (navigator as any).deviceMemory || 2,
      
      // Network
      connectionType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 1,
      rtt: connection?.rtt || 1000,
      
      // Display
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio || 1,
      
      // Browser capabilities
      supportsWebP: false, // Will be updated asynchronously
      supportsAVIF: false, // Will be updated asynchronously
      supportsIntersectionObserver: 'IntersectionObserver' in window,
      supportsRequestIdleCallback: 'requestIdleCallback' in window,
      supportsServiceWorker: 'serviceWorker' in navigator,
      
      // User preferences
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersReducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
      
      // Battery (if available)
      batteryLevel: 1, // Will be updated if battery API is available
      isCharging: true,
      
      // Performance indicators
      isLowEnd: false, // Will be calculated
      performanceScore: 0 // Will be calculated
    };

    // Calculate performance score and low-end status
    this.calculatePerformanceMetrics();
    
    // Update async capabilities
    this.updateAsyncCapabilities();
  }

  // Calculate performance score based on various factors
  private calculatePerformanceMetrics(): void {
    if (!this.deviceCapabilities) return;

    let score = 100; // Start with perfect score

    // CPU penalty
    if (this.deviceCapabilities.cores <= 2) score -= 30;
    else if (this.deviceCapabilities.cores <= 4) score -= 15;

    // Memory penalty
    if (this.deviceCapabilities.memory <= 2) score -= 25;
    else if (this.deviceCapabilities.memory <= 4) score -= 10;

    // Network penalty
    if (this.deviceCapabilities.connectionType === 'slow-2g') score -= 40;
    else if (this.deviceCapabilities.connectionType === '2g') score -= 30;
    else if (this.deviceCapabilities.connectionType === '3g') score -= 15;

    // Display penalty only for very low-resolution devices (reduce penalty for modern mobile)
    if (this.deviceCapabilities.screenWidth <= 480 && this.deviceCapabilities.pixelRatio <= 1) {
      score -= 15; // Reduced penalty for mobile devices
    }

    // User preference penalties
    if (this.deviceCapabilities.prefersReducedMotion) score -= 10;
    if (this.deviceCapabilities.prefersReducedData) score -= 15;

    // Battery penalty
    if (this.deviceCapabilities.batteryLevel < 0.2 && !this.deviceCapabilities.isCharging) {
      score -= 20;
    }

    this.deviceCapabilities.performanceScore = Math.max(0, score);
    this.deviceCapabilities.isLowEnd = score < 50;
  }

  // Update capabilities that require async detection
  private async updateAsyncCapabilities(): Promise<void> {
    if (!this.deviceCapabilities) return;

    // Check WebP support
    try {
      const webpSupport = await this.checkImageFormatSupport('webp');
      this.deviceCapabilities.supportsWebP = webpSupport;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to detect WebP support:', error);
      }
    }

    // Check AVIF support
    try {
      const avifSupport = await this.checkImageFormatSupport('avif');
      this.deviceCapabilities.supportsAVIF = avifSupport;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to detect AVIF support:', error);
      }
    }

    // Check battery status
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.deviceCapabilities.batteryLevel = battery.level;
        this.deviceCapabilities.isCharging = battery.charging;
        
        // Recalculate performance metrics with battery info
        this.calculatePerformanceMetrics();
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Failed to get battery status:', error);
        }
      }
    }

    // Regenerate optimization settings with updated capabilities
    this.generateOptimizationSettings();
  }

  // Check image format support
  private checkImageFormatSupport(format: 'webp' | 'avif'): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        resolve(img.height === 2);
      };
      
      if (format === 'webp') {
        img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      } else if (format === 'avif') {
        img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      }
    });
  }

  // Generate optimization settings based on device capabilities
  private generateOptimizationSettings(): void {
    if (!this.deviceCapabilities) return;

    const { isLowEnd, performanceScore, prefersReducedMotion, prefersReducedData } = this.deviceCapabilities;

    this.optimizationSettings = {
      // Animation settings - more lenient for better visual experience
      enableAnimations: !prefersReducedMotion && performanceScore > 20, // Lowered threshold
      animationDuration: isLowEnd ? 300 : 400, // Slightly longer for smoother feel
      enableComplexAnimations: performanceScore > 40, // Lowered threshold for complex animations
      enableParallax: performanceScore > 30 && !prefersReducedMotion, // Much more lenient for parallax
      
      // Image settings
      useWebP: this.deviceCapabilities.supportsWebP && performanceScore > 40,
      useAVIF: this.deviceCapabilities.supportsAVIF && performanceScore > 60,
      imageQuality: isLowEnd ? 60 : 80,
      enableLazyLoading: true,
      preloadImages: performanceScore > 50 && !prefersReducedData,
      
      // Loading settings
      enablePreloading: performanceScore > 40,
      preloadDelay: isLowEnd ? 3000 : 1000,
      enableServiceWorker: this.deviceCapabilities.supportsServiceWorker,
      
      // UI settings
      enableBlurEffects: performanceScore > 50,
      enableShadows: performanceScore > 40,
      enableGradients: performanceScore > 30,
      simplifyUI: isLowEnd,
      
      // Performance settings
      enableVirtualization: isLowEnd,
      chunkSize: isLowEnd ? 5 : 10,
      debounceDelay: isLowEnd ? 300 : 150,
      throttleDelay: isLowEnd ? 100 : 50,
      
      // Memory management
      enableMemoryOptimization: isLowEnd,
      maxCacheSize: isLowEnd ? 50 : 100,
      enableGarbageCollection: isLowEnd,
      
      // Network settings
      enableDataSaving: prefersReducedData || this.deviceCapabilities.connectionType === '2g' || this.deviceCapabilities.connectionType === 'slow-2g',
      requestTimeout: isLowEnd ? 5000 : 10000,
      maxConcurrentRequests: isLowEnd ? 2 : 6
    };
  }

  // Public getters
  getDeviceCapabilities(): DeviceCapabilities | null {
    return this.deviceCapabilities;
  }

  getOptimizationSettings(): OptimizationSettings | null {
    return this.optimizationSettings;
  }

  // Utility methods for components
  shouldUseAnimation(animationType: 'simple' | 'complex' = 'simple'): boolean {
    if (!this.optimizationSettings) return true;
    
    if (animationType === 'complex') {
      return this.optimizationSettings.enableComplexAnimations;
    }
    
    return this.optimizationSettings.enableAnimations;
  }

  getAnimationDuration(): number {
    return this.optimizationSettings?.animationDuration || 400;
  }

  shouldPreloadImages(): boolean {
    return this.optimizationSettings?.preloadImages || false;
  }

  getImageQuality(): number {
    return this.optimizationSettings?.imageQuality || 80;
  }

  shouldUseWebP(): boolean {
    return this.optimizationSettings?.useWebP || false;
  }

  shouldSimplifyUI(): boolean {
    return this.optimizationSettings?.simplifyUI || false;
  }

  getDebounceDelay(): number {
    return this.optimizationSettings?.debounceDelay || 150;
  }

  // Performance monitoring integration
  reportPerformanceMetrics(): void {
    if (!this.deviceCapabilities || !this.optimizationSettings) return;

    const metrics = {
      deviceScore: this.deviceCapabilities.performanceScore,
      isLowEnd: this.deviceCapabilities.isLowEnd,
      cores: this.deviceCapabilities.cores,
      memory: this.deviceCapabilities.memory,
      connectionType: this.deviceCapabilities.connectionType,
      optimizationsEnabled: {
        animations: this.optimizationSettings.enableAnimations,
        webp: this.optimizationSettings.useWebP,
        preloading: this.optimizationSettings.enablePreloading,
        simplifiedUI: this.optimizationSettings.simplifyUI
      }
    };

    if (import.meta.env.DEV) {
      // Performance metrics available for debugging
      // Uncomment to view: console.table(metrics);
    }

    // Report to performance monitor
    performanceMonitor.trackAnimationPerformance('device-capabilities', () => {
      // This will be tracked in performance metrics
    });
  }
}

// Type definitions
interface DeviceCapabilities {
  cores: number;
  memory: number;
  connectionType: string;
  downlink: number;
  rtt: number;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  supportsWebP: boolean;
  supportsAVIF: boolean;
  supportsIntersectionObserver: boolean;
  supportsRequestIdleCallback: boolean;
  supportsServiceWorker: boolean;
  prefersReducedMotion: boolean;
  prefersReducedData: boolean;
  batteryLevel: number;
  isCharging: boolean;
  isLowEnd: boolean;
  performanceScore: number;
}

interface OptimizationSettings {
  enableAnimations: boolean;
  animationDuration: number;
  enableComplexAnimations: boolean;
  enableParallax: boolean;
  useWebP: boolean;
  useAVIF: boolean;
  imageQuality: number;
  enableLazyLoading: boolean;
  preloadImages: boolean;
  enablePreloading: boolean;
  preloadDelay: number;
  enableServiceWorker: boolean;
  enableBlurEffects: boolean;
  enableShadows: boolean;
  enableGradients: boolean;
  simplifyUI: boolean;
  enableVirtualization: boolean;
  chunkSize: number;
  debounceDelay: number;
  throttleDelay: number;
  enableMemoryOptimization: boolean;
  maxCacheSize: number;
  enableGarbageCollection: boolean;
  enableDataSaving: boolean;
  requestTimeout: number;
  maxConcurrentRequests: number;
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Export utility functions
export const usePerformanceOptimization = () => {
  const optimizer = PerformanceOptimizer.getInstance();
  
  return {
    shouldUseAnimation: optimizer.shouldUseAnimation.bind(optimizer),
    getAnimationDuration: optimizer.getAnimationDuration.bind(optimizer),
    shouldPreloadImages: optimizer.shouldPreloadImages.bind(optimizer),
    getImageQuality: optimizer.getImageQuality.bind(optimizer),
    shouldUseWebP: optimizer.shouldUseWebP.bind(optimizer),
    shouldSimplifyUI: optimizer.shouldSimplifyUI.bind(optimizer),
    getDebounceDelay: optimizer.getDebounceDelay.bind(optimizer),
    getDeviceCapabilities: optimizer.getDeviceCapabilities.bind(optimizer),
    getOptimizationSettings: optimizer.getOptimizationSettings.bind(optimizer)
  };
};