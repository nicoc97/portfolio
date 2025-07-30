import React, { Suspense } from 'react';
import { performanceMonitor } from '../../utils/performance';

/**
 * Enhanced lazy-loaded animation components for code splitting
 * These components are loaded only when needed to reduce initial bundle size
 * Includes performance monitoring and adaptive loading
 */

// Lazy load heavy animation components with error boundaries and performance tracking
const ScrollAnimations = React.lazy(() => {
  const startTime = performance.now();
  return import('../animations/ScrollAnimations').then(module => {
    const loadTime = performance.now() - startTime;
    performanceMonitor.trackAnimationPerformance('scroll-animations-load', () => {
      console.log(`ScrollAnimations loaded in ${loadTime.toFixed(2)}ms`);
    });
    return { default: module.ScrollReveal };
  }).catch(error => {
    console.warn('Failed to load ScrollAnimations:', error);
    performanceMonitor.trackAnimationPerformance('scroll-animations-error', () => {
      console.error('ScrollAnimations load failed');
    });
    return { default: () => null };
  });
});

// Lazy load Three.js components (heavy) with performance tracking
const ThreeJSComponents = React.lazy(() => {
  const startTime = performance.now();
  return import('../ui/WaveBackground').then(module => {
    const loadTime = performance.now() - startTime;
    performanceMonitor.trackAnimationPerformance('threejs-load', () => {
      console.log(`Three.js components loaded in ${loadTime.toFixed(2)}ms`);
    });
    return { default: module.WaveBackground };
  }).catch(error => {
    console.warn('Failed to load Three.js components:', error);
    performanceMonitor.trackAnimationPerformance('threejs-error', () => {
      console.error('Three.js components load failed');
    });
    return { default: () => React.createElement('div', { className: 'w-full h-full bg-primary-bg-light' }) };
  });
});

// Lazy load Swiper components with performance tracking
const SwiperComponents = React.lazy(() => {
  const startTime = performance.now();
  return import('swiper/react').then(module => {
    const loadTime = performance.now() - startTime;
    performanceMonitor.trackAnimationPerformance('swiper-load', () => {
      console.log(`Swiper components loaded in ${loadTime.toFixed(2)}ms`);
    });
    return { default: module.Swiper };
  }).catch(error => {
    console.warn('Failed to load Swiper components:', error);
    performanceMonitor.trackAnimationPerformance('swiper-error', () => {
      console.error('Swiper components load failed');
    });
    return { default: () => null };
  });
});

// Enhanced pixel-style loading fallback with performance monitoring
const AnimationFallback: React.FC<{ componentName?: string }> = ({ componentName = 'Animation' }) => {
  React.useEffect(() => {
    performanceMonitor.trackAnimationPerformance(`${componentName}-loading`, () => {
      // Track loading time
    });
  }, [componentName]);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-accent-orange animate-pulse"
            style={{
              animationDelay: `${i * 100}ms`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
      <div className="ml-4 font-tech text-text-secondary text-sm">
        [LOADING_{componentName.toUpperCase()}...]
      </div>
    </div>
  );
};

// Minimal fallback for critical components
const MinimalFallback: React.FC = () => (
  <div className="w-2 h-2 bg-accent-orange animate-pulse rounded-full" />
);

// Wrapper components with enhanced suspense and error boundaries
export const LazyScrollReveal: React.FC<React.ComponentProps<typeof ScrollAnimations>> = (props) => {
  const recommendations = performanceMonitor.getPerformanceRecommendations();

  // Skip animations on low-end devices
  if (recommendations.reduceAnimations) {
    return <div>{props.children}</div>;
  }

  return (
    <Suspense fallback={<AnimationFallback componentName="ScrollReveal" />}>
      <ScrollAnimations {...props} />
    </Suspense>
  );
};

export const LazyThreeJS: React.FC<any> = (props) => {
  const recommendations = performanceMonitor.getPerformanceRecommendations();

  // Skip Three.js on low-end devices
  if (recommendations.simplifyEffects) {
    return null;
  }

  return (
    <Suspense fallback={<MinimalFallback />}>
      <ThreeJSComponents {...props} />
    </Suspense>
  );
};

export const LazySwiper: React.FC<React.ComponentProps<typeof SwiperComponents>> = (props) => (
  <Suspense fallback={<AnimationFallback componentName="Swiper" />}>
    <SwiperComponents {...props} />
  </Suspense>
);

// Enhanced preload animations with performance monitoring
export const preloadAnimations = () => {
  const recommendations = performanceMonitor.getPerformanceRecommendations();

  // Only preload if device can handle it
  if (recommendations.reduceAnimations) {
    console.log('Skipping animation preload on low-end device');
    return;
  }

  // Preload scroll animations
  import('../animations/ScrollAnimations').catch(error => {
    console.warn('Failed to preload ScrollAnimations:', error);
  });

  // Preload Three.js components on high-end devices only
  if (!recommendations.simplifyEffects && navigator.hardwareConcurrency && navigator.hardwareConcurrency > 4) {
    import('../ui/WaveBackground').catch(error => {
      console.warn('Failed to preload Three.js components:', error);
    });
  }
};

// Enhanced hook with adaptive preloading
export const usePreloadAnimations = () => {
  React.useEffect(() => {
    const recommendations = performanceMonitor.getPerformanceRecommendations();

    // Delay preloading on low-end devices
    const delay = recommendations.reduceAnimations ? 5000 : 2000;

    // Preload on idle or after delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setTimeout(preloadAnimations, delay);
      });
    } else {
      setTimeout(preloadAnimations, delay);
    }
  }, []);
};

// Utility to preload critical components immediately
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be needed soon
  const criticalImports = [
    import('../ui/LazyImage'),
    import('../ui/PixelButton'),
    import('../ui/TechBadge')
  ];

  Promise.allSettled(criticalImports).then(results => {
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Failed to preload critical component ${index}:`, result.reason);
      }
    });
  });
};

// Hook for critical component preloading
export const useCriticalPreload = () => {
  React.useEffect(() => {
    // Preload immediately on mount
    preloadCriticalComponents();
  }, []);
};