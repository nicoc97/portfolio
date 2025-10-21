import React, { Suspense } from 'react';
import { performanceMonitor } from '../../utils/performance';

/**
 * Lazy-loaded UI components for code splitting
 * These components are loaded only when needed to reduce initial bundle size
 */

// Lazy load VinylRecord component (heavy with animations)
const VinylRecordComponent = React.lazy(() => {
  const startTime = performance.now();
  return import('../ui/VinylRecord').then(module => {
    const loadTime = performance.now() - startTime;
    performanceMonitor.trackAnimationPerformance('vinyl-record-load', () => {
      if (import.meta.env.DEV) {
        console.log(`VinylRecord loaded in ${loadTime.toFixed(2)}ms`);
      }
    });
    return { default: module.VinylRecord };
  }).catch(error => {
    if (import.meta.env.DEV) {
      console.warn('Failed to load VinylRecord:', error);
    }
    return { 
      default: () => (
        <div className="w-32 h-32 bg-primary-bg-light rounded-full border-2 border-accent-orange/30 flex items-center justify-center">
          <span className="font-tech text-xs text-text-secondary">[VINYL_ERROR]</span>
        </div>
      )
    };
  });
});

// Lazy load VintageTVDial component
const VintageTVDialComponent = React.lazy(() => {
  const startTime = performance.now();
  return import('../ui/VintageTVDial').then(module => {
    const loadTime = performance.now() - startTime;
    performanceMonitor.trackAnimationPerformance('tv-dial-load', () => {
      if (import.meta.env.DEV) {
        console.log(`VintageTVDial loaded in ${loadTime.toFixed(2)}ms`);
      }
    });
    return { default: module.VintageTVDial };
  }).catch(error => {
    if (import.meta.env.DEV) {
      console.warn('Failed to load VintageTVDial:', error);
    }
    return { 
      default: () => (
        <div className="w-16 h-16 bg-primary-bg-light rounded-full border-2 border-accent-green/30 flex items-center justify-center">
          <span className="font-tech text-xs text-text-secondary">[TV_ERROR]</span>
        </div>
      )
    };
  });
});

// Lazy load VinylLightbox component (heavy modal)
const VinylLightboxComponent = React.lazy(() => {
  const startTime = performance.now();
  return import('../ui/VinylLightbox').then(module => {
    const loadTime = performance.now() - startTime;
    performanceMonitor.trackAnimationPerformance('vinyl-lightbox-load', () => {
      if (import.meta.env.DEV) {
        console.log(`VinylLightbox loaded in ${loadTime.toFixed(2)}ms`);
      }
    });
    return { default: module.VinylLightbox };
  }).catch(error => {
    if (import.meta.env.DEV) {
      console.warn('Failed to load VinylLightbox:', error);
    }
    return { default: () => null };
  });
});

// Loading fallback for UI components
const UIComponentFallback: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} bg-primary-bg-light rounded-lg border border-accent-orange/30 flex items-center justify-center animate-pulse`}>
      <div className="grid grid-cols-2 gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 bg-accent-orange animate-pulse"
            style={{
              animationDelay: `${i * 200}ms`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Wrapper components with enhanced suspense
export const LazyVinylRecord: React.FC<React.ComponentProps<typeof VinylRecordComponent>> = (props) => {
  const recommendations = performanceMonitor.getPerformanceRecommendations();

  // Skip heavy animations on low-end devices
  if (recommendations.simplifyEffects) {
    return (
      <div className="w-32 h-32 bg-primary-bg-light rounded-full border-2 border-accent-orange/50 flex items-center justify-center">
        <span className="font-tech text-xs text-accent-orange">[VINYL_SIMPLIFIED]</span>
      </div>
    );
  }

  return (
    <Suspense fallback={<UIComponentFallback size="lg" />}>
      <VinylRecordComponent {...props} />
    </Suspense>
  );
};

export const LazyVintageTVDial: React.FC<React.ComponentProps<typeof VintageTVDialComponent>> = (props) => {
  const recommendations = performanceMonitor.getPerformanceRecommendations();

  // Simplify on low-end devices
  if (recommendations.simplifyEffects) {
    return (
      <div className="w-16 h-16 bg-primary-bg-light rounded-full border-2 border-accent-green/50 flex items-center justify-center">
        <span className="font-tech text-xs text-accent-green">[TV_SIMPLE]</span>
      </div>
    );
  }

  return (
    <Suspense fallback={<UIComponentFallback size="md" />}>
      <VintageTVDialComponent {...props} />
    </Suspense>
  );
};

export const LazyVinylLightbox: React.FC<React.ComponentProps<typeof VinylLightboxComponent>> = (props) => (
  <Suspense fallback={null}>
    <VinylLightboxComponent {...props} />
  </Suspense>
);

// Preload UI components
export const preloadUIComponents = () => {
  const recommendations = performanceMonitor.getPerformanceRecommendations();

  // Only preload if device can handle it
  if (recommendations.simplifyEffects) {
    return;
  }

  // Preload vinyl components
  import('../ui/VinylRecord').catch(error => {
    if (import.meta.env.DEV) {
      console.warn('Failed to preload VinylRecord:', error);
    }
  });

  import('../ui/VintageTVDial').catch(error => {
    if (import.meta.env.DEV) {
      console.warn('Failed to preload VintageTVDial:', error);
    }
  });

  // Preload lightbox only on high-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency > 4) {
    import('../ui/VinylLightbox').catch(error => {
      if (import.meta.env.DEV) {
        console.warn('Failed to preload VinylLightbox:', error);
      }
    });
  }
};

// Hook for UI component preloading
export const useUIComponentPreload = () => {
  React.useEffect(() => {
    const recommendations = performanceMonitor.getPerformanceRecommendations();

    // Delay preloading based on device performance
    const delay = recommendations.simplifyEffects ? 10000 : 3000;

    // Preload on idle or after delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setTimeout(preloadUIComponents, delay);
      });
    } else {
      setTimeout(preloadUIComponents, delay);
    }
  }, []);
};