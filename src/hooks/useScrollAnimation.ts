import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  animationType?: 'fade' | 'slide' | 'scale' | 'pixel';
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
    animationType = 'fade'
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) {
                setHasTriggered(true);
              }
            }, delay);
          } else {
            setIsVisible(true);
            if (triggerOnce) {
              setHasTriggered(true);
            }
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, delay]);

  // Generate CSS classes based on animation type and visibility
  const getAnimationClasses = useCallback(() => {
    const baseClasses = 'transition-all duration-700 ease-out';

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

  useEffect(() => {
    if (isVisible) {
      // Stagger the appearance of items
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          setVisibleItems(prev => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, i * staggerDelay);
      }
    }
  }, [isVisible, count, staggerDelay]);

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