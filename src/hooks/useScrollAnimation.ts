import { useEffect, useRef, useState, useCallback } from 'react';
import { performanceMonitor } from '../utils/performance';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  animationType?: 'fade' | 'slide' | 'scale' | 'pixel';
  reverseOnExit?: boolean;
  exitDelay?: number;
}

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * Returns a ref to attach to the element and a boolean indicating if it's visible
 */
export const useScrollAnimation = <T extends HTMLElement = HTMLElement>(options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    animationType = 'fade',
    reverseOnExit = false,
    exitDelay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<T>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const recommendations = performanceMonitor.getPerformanceRecommendations();
    
    // Skip animations entirely on low-end devices with reduced motion preference
    if (recommendations.reducedMotion) {
      setIsVisible(true);
      if (triggerOnce) {
        setHasTriggered(true);
      }
      return;
    }

    // Use simpler threshold for low-end devices
    const optimizedThreshold = recommendations.reduceAnimations ? 0.2 : threshold;
    const optimizedRootMargin = recommendations.reduceAnimations ? '0px' : rootMargin;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (entry.isIntersecting) {
          // Reduce delay on low-end devices
          const optimizedDelay = recommendations.reduceAnimations ? Math.min(delay, 100) : delay;
          
          if (optimizedDelay > 0) {
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) {
                setHasTriggered(true);
              }
            }, optimizedDelay);
          } else {
            setIsVisible(true);
            if (triggerOnce) {
              setHasTriggered(true);
            }
          }
        } else if (!triggerOnce && !hasTriggered) {
          // Handle exit animation (skip on low-end devices)
          if (reverseOnExit && !recommendations.reduceAnimations) {
            const optimizedExitDelay = recommendations.reduceAnimations ? 0 : exitDelay;
            
            if (optimizedExitDelay > 0) {
              timeoutRef.current = setTimeout(() => {
                setIsVisible(false);
              }, optimizedExitDelay);
            } else {
              setIsVisible(false);
            }
          }
        }
      },
      {
        threshold: optimizedThreshold,
        rootMargin: optimizedRootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, delay, reverseOnExit, exitDelay]);

  // Generate performance-aware CSS classes based on animation type and visibility
  const getAnimationClasses = useCallback(() => {
    const recommendations = performanceMonitor.getPerformanceRecommendations();
    
    // Skip animations entirely for reduced motion
    if (recommendations.reducedMotion) {
      return isVisible ? 'opacity-100' : 'opacity-50';
    }

    // Use faster transitions on low-end devices
    const duration = recommendations.reduceAnimations ? 'duration-300' : 'duration-700';
    const baseClasses = `transition-all ${duration} ease-out`;

    // Simplify animations on low-end devices
    if (recommendations.reduceAnimations) {
      return `${baseClasses} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
    }

    switch (animationType) {
      case 'slide':
        return `${baseClasses} ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
          }`;
      case 'scale':
        return `${baseClasses} ${isVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95'
          }`;
      case 'pixel':
        return `${baseClasses} ${isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-98'
          }`;
      default: // fade
        return `${baseClasses} ${isVisible
          ? 'opacity-100'
          : 'opacity-0'
          }`;
    }
  }, [isVisible, animationType]);

  return {
    ref: elementRef,
    isVisible,
    animationClasses: getAnimationClasses()
  };
};

/**
 * Hook for staggered animations - returns multiple refs with delayed visibility
 */
export const useStaggeredAnimation = <T extends HTMLElement = HTMLElement>(
  count: number,
  staggerDelay: number = 100,
  options: UseScrollAnimationOptions = {}
) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));
  const { ref: triggerRef, isVisible } = useScrollAnimation<T>(options);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];

    if (isVisible) {
      // Stagger the appearance of items
      for (let i = 0; i < count; i++) {
        const timeout = setTimeout(() => {
          setVisibleItems(prev => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, i * staggerDelay);
        timeoutsRef.current.push(timeout);
      }
    } else if (options.reverseOnExit) {
      // Reverse stagger - hide items in reverse order for "unbuilding" effect
      for (let i = count - 1; i >= 0; i--) {
        const timeout = setTimeout(() => {
          setVisibleItems(prev => {
            const newState = [...prev];
            newState[i] = false;
            return newState;
          });
        }, (count - 1 - i) * (staggerDelay / 2)); // Faster reverse animation
        timeoutsRef.current.push(timeout);
      }
    }

    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [isVisible, count, staggerDelay, options.reverseOnExit]);

  // Generate staggered animation classes
  const getStaggeredClasses = useCallback((index: number, animationType: 'fade' | 'slide' | 'scale' | 'pixel' = 'slide') => {
    const baseClasses = 'transition-all duration-500 ease-out';
    const isItemVisible = visibleItems[index];

    switch (animationType) {
      case 'slide':
        return `${baseClasses} ${isItemVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'
          }`;
      case 'scale':
        return `${baseClasses} ${isItemVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-90'
          }`;
      case 'pixel':
        return `${baseClasses} ${isItemVisible
          ? 'opacity-100 translate-y-0 scale-100 filter-none'
          : 'opacity-0 translate-y-3 scale-95 blur-sm'
          }`;
      default: // fade
        return `${baseClasses} ${isItemVisible
          ? 'opacity-100'
          : 'opacity-0'
          }`;
    }
  }, [visibleItems]);

  return { triggerRef, visibleItems, getStaggeredClasses };
};

/**
 * Hook for parallax scroll effects
 */
export const useParallaxScroll = <T extends HTMLElement = HTMLElement>(speed: number = 0.5, offset: number = 0) => {
  const [scrollY, setScrollY] = useState(0);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxStyle = {
    transform: `translateY(${(scrollY + offset) * speed}px)`,
  };

  return { ref: elementRef, parallaxStyle, scrollY };
};

/**
 * Hook for section transitions with pixel effects
 */
export const useSectionTransition = <T extends HTMLElement = HTMLElement>() => {
  const [isInView, setIsInView] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const sectionRef = useRef<T>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        // Calculate transition progress based on intersection ratio
        setTransitionProgress(entry.intersectionRatio);
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0 to 1 in 0.01 increments
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, []);

  // Generate pixel transition effects
  const getTransitionClasses = useCallback(() => {
    const opacity = Math.min(transitionProgress * 1.2, 1);
    const scale = 0.95 + (transitionProgress * 0.05);

    return {
      opacity,
      transform: `scale(${scale})`,
      filter: transitionProgress < 0.3 ? `blur(${(1 - transitionProgress * 3) * 2}px)` : 'none',
    };
  }, [transitionProgress]);

  return {
    ref: sectionRef,
    isInView,
    transitionProgress,
    transitionStyle: getTransitionClasses()
  };
};