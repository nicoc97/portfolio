import { useEffect, useState, useRef } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AboutSection } from './components/sections/AboutSection';
import { JukeboxSection } from './components/sections/JukeboxSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ContactSection } from './components/sections/ContactSection';
import { DotPagination } from './components/ui/DotPagination';
import { MobileMenu } from './components/ui/MobileMenu';
import { ToastProvider } from './hooks/useToast';
import { usePreloadAnimations, useCriticalPreload } from './components/lazy/LazyAnimations';

import { performanceReporter } from './utils/performanceReporter';
import { performanceMonitor } from './utils/performance';

/**
 * Main App Component
 * 
 * This is the main application component that brings together all sections.
 * Uses full scrolling with navigation that jumps to sections.
 * 
 * Current sections:
 * - HeroSection: Landing area with typing animation
 * - ProjectsSection: Filterable project showcase
 * - AboutSection: Personal introduction
 * - Skills, Contact: Placeholder sections (ready for development)
 */
function App() {
  const [activeSection, setActiveSection] = useState<'hero' | 'projects' | 'about' | 'jukebox' | 'skills' | 'contact'>('hero');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const lastScrollTime = useRef(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Preload animations and monitor performance
  usePreloadAnimations();
  useCriticalPreload();

  // Initialize performance reporting
  useEffect(() => {
    // Record app initialization time
    const initStart = performance.now();

    const recordInitTime = () => {
      const initTime = performance.now() - initStart;
      performanceReporter.recordComponentLoadTime('App', initTime);
    };

    // Record after initial render
    setTimeout(recordInitTime, 0);

    // Get service worker metrics periodically
    const metricsInterval = setInterval(async () => {
      await performanceReporter.getServiceWorkerMetrics();
    }, 30000);

    return () => clearInterval(metricsInterval);
  }, []);

  const sections = ['hero', 'projects', 'about', 'jukebox', 'skills', 'contact'];

  // Get current section index
  const getCurrentSectionIndex = () => {
    return sections.indexOf(activeSection);
  };

  // Optimized easing function for smoother scrolling
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Optimized smooth scroll to section with performance monitoring
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    setIsScrolling(true);

    // Check device capabilities for adaptive scrolling
    const recommendations = performanceMonitor.getPerformanceRecommendations();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isLowEnd = recommendations.reduceAnimations;

    if (isSafari || isLowEnd) {
      // Optimized scroll implementation for Safari and low-end devices
      const startPosition = window.scrollY; // Use scrollY instead of deprecated pageYOffset
      const targetPosition = element.offsetTop;
      const distance = targetPosition - startPosition;
      const duration = isLowEnd ? 400 : 800; // Faster on low-end devices
      let start: number | null = null;
      let rafId: number;

      const animateScroll = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);

        // Apply easing only on higher-end devices
        const easedPercentage = isLowEnd ? percentage : easeInOutCubic(percentage);

        window.scrollTo(0, startPosition + distance * easedPercentage);

        if (progress < duration) {
          rafId = requestAnimationFrame(animateScroll);
        } else {
          // Ensure we're exactly at the target position
          window.scrollTo(0, targetPosition);
          setTimeout(() => {
            setIsScrolling(false);
          }, 50); // Reduced timeout for better responsiveness
        }
      };

      rafId = requestAnimationFrame(animateScroll);

      // Cleanup function to prevent memory leaks
      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    } else {
      // Use native smooth scrolling for other browsers
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Reset scrolling state after animation
      setTimeout(() => {
        setIsScrolling(false);
      }, 600); // Reduced timeout
    }
  };

  // Detect current section based on scroll position
  const detectCurrentSection = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let closestSection = sections[0];
    let closestDistance = Infinity;

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        const sectionCenter = offsetTop + offsetHeight / 2;
        const distance = Math.abs(scrollPosition - sectionCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = sectionId;
        }
      }
    }

    return closestSection;
  };

  // Handle section click from pagination/menu - updates active section and scrolls
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId as typeof activeSection);
    scrollToSection(sectionId);
  };

  // Handle navigation from buttons (like "Get in Touch") - updates both state and scroll
  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId as typeof activeSection);
    scrollToSection(sectionId);
  };

  // Navigate to next/previous section (for wheel/keyboard navigation)
  const navigateToNextSection = (direction: 'up' | 'down') => {
    if (isScrolling) return;

    const currentIndex = getCurrentSectionIndex();
    let nextIndex;

    if (direction === 'down') {
      nextIndex = Math.min(currentIndex + 1, sections.length - 1);
    } else {
      nextIndex = Math.max(currentIndex - 1, 0);
    }

    if (nextIndex !== currentIndex) {
      const nextSection = sections[nextIndex];
      setActiveSection(nextSection as typeof activeSection);
      scrollToSection(nextSection);
    }
  };

  // Handle window resize to update scroll behavior dynamically
  useEffect(() => {
    const handleResize = () => {
      // Force re-evaluation of scroll behavior on resize
      // This will trigger the main scroll effect to re-run
      setIsScrolling(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced scroll hijacking - Only on 3xl screens (1920px+) and above
  useEffect(() => {
    let scrollAccumulator = 0;
    let lastWheelTime = 0;
    let velocityY = 0;
    let rafId: number | null = null;
    let lastDeltaY = 0;
    let consecutiveSmallDeltas = 0;

    // Performance-aware device detection
    const recommendations = performanceMonitor.getPerformanceRecommendations();
    const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth <= 768 && 'ontouchstart' in window);

    // Only enable scroll hijacking on 3xl screens (1920px+) and higher-end devices
    const isVeryLargeDesktop = window.innerWidth >= 1920;
    const shouldHijackScroll = !isMobileDevice && isVeryLargeDesktop && !recommendations.reduceAnimations;

    // Safari detection for scroll sensitivity adjustment
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Safari-specific scroll optimization
    if (isSafari && shouldHijackScroll) {
      // Disable elastic scrolling which can interfere
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.overscrollBehavior = 'none';
    }

    if (import.meta.env.DEV) {
      console.log('Device capabilities:', {
        isMobile: isMobileDevice,
        windowWidth: window.innerWidth,
        isVeryLargeDesktop,
        shouldHijackScroll,
        isSafari,
        reduceAnimations: recommendations.reduceAnimations
      });
    }

    const handleWheel = (e: WheelEvent) => {
      // Only hijack scroll on 3xl screens (1920px+) and larger
      if (!shouldHijackScroll) {
        return;
      }

      // Always prevent default on 3xl screens to ensure consistent hijacking
      e.preventDefault();
      e.stopPropagation();

      // Don't process if we're already in a scrolling animation
      if (isScrolling) {
        return;
      }

      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTime;

      // Detect if this is a trackpad or mouse wheel
      // Trackpads typically have fractional deltaY values
      const isTrackpad = Math.abs(e.deltaY) < 50 && e.deltaY % 1 !== 0;

      // Safari-specific: Detect momentum end (small consecutive deltas)
      if (isSafari && Math.abs(e.deltaY) < 2) {
        consecutiveSmallDeltas++;
        if (consecutiveSmallDeltas > 3) {
          // Reset and ignore momentum tail
          scrollAccumulator = 0;
          velocityY = 0;
          consecutiveSmallDeltas = 0;
          return;
        }
      } else {
        consecutiveSmallDeltas = 0;
      }

      // Reset accumulator if it's been too long since last wheel event (new gesture)
      if (timeSinceLastWheel > 200) {
        scrollAccumulator = 0;
        velocityY = 0;
      }

      lastWheelTime = now;

      // Safari-specific normalization
      let normalizedDelta;
      if (isSafari) {
        if (isTrackpad) {
          // Safari trackpad: use velocity-based approach
          const acceleration = Math.abs(e.deltaY) > Math.abs(lastDeltaY) ? 1.2 : 0.8;
          velocityY = velocityY * 0.8 + e.deltaY * 0.2 * acceleration;
          normalizedDelta = velocityY;
        } else {
          // Safari mouse wheel
          normalizedDelta = e.deltaY * 0.5;
        }
      } else {
        // Chrome/Firefox
        normalizedDelta = isTrackpad ? e.deltaY * 0.8 : e.deltaY;
      }

      lastDeltaY = e.deltaY;
      scrollAccumulator += normalizedDelta;

      // Dynamic threshold based on browser and input device
      let threshold;
      if (isSafari) {
        threshold = isTrackpad ? 40 : 80;
      } else {
        threshold = isTrackpad ? 30 : 50;
      }

      // Use RAF for smoother transitions in Safari
      if (Math.abs(scrollAccumulator) >= threshold) {
        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          const direction = scrollAccumulator > 0 ? 'down' : 'up';

          // Reset accumulator and velocity
          scrollAccumulator = 0;
          velocityY = 0;
          lastScrollTime.current = now;

          // Clear existing timeout
          if (scrollTimeoutRef.current !== null) {
            clearTimeout(scrollTimeoutRef.current);
          }

          // Navigate to next section
          navigateToNextSection(direction);

          rafId = null;
        });
      }
    };

    // Handle keyboard navigation - Desktop only
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          navigateToNextSection('down');
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          navigateToNextSection('up');
          break;
        case 'Home':
          e.preventDefault();
          navigateToSection('hero');
          break;
        case 'End':
          e.preventDefault();
          navigateToSection('contact');
          break;
      }
    };

    // Track active section based on scroll position (non-xl screens)
    const handleScroll = () => {
      // Only track scroll position on screens that don't use scroll hijacking
      if (shouldHijackScroll || isScrolling || !isInitialized) return;

      const currentSection = detectCurrentSection();
      if (currentSection !== activeSection) {
        console.log('Natural scroll: Updating active section from', activeSection, 'to', currentSection);
        setActiveSection(currentSection as typeof activeSection);
      }
    };

    // Add wheel listener with proper passive setting
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Add keyboard navigation only for 3xl screens with scroll hijacking
    if (shouldHijackScroll) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Add scroll tracking for screens without scroll hijacking
    if (!shouldHijackScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      setTimeout(handleScroll, 100);
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (shouldHijackScroll) {
        window.removeEventListener('keydown', handleKeyDown);
      }
      if (!shouldHijackScroll) {
        window.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [activeSection, isScrolling, sections]);

  // Initialize active section on page load based on current scroll position
  useEffect(() => {
    if (!isInitialized) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const currentSection = detectCurrentSection();
        setActiveSection(currentSection as typeof activeSection);
        setIsInitialized(true);
      }, 100);
    }
  }, [isInitialized]);

  // Simplified section detection - only use intersection observer for non-3xl screens
  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth <= 768 && 'ontouchstart' in window);

    const isVeryLargeDesktop = window.innerWidth >= 1920;
    const shouldHijackScroll = !isMobileDevice && isVeryLargeDesktop;

    if (shouldHijackScroll) return; // Skip intersection observer on 3xl screens with scroll hijacking

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.3
    };

    const sectionObserver = new IntersectionObserver(() => {
      if (isScrolling || !isInitialized) return;

      // Use the same detection logic for consistency
      const currentSection = detectCurrentSection();
      if (currentSection !== activeSection) {
        console.log('Intersection Observer: Updating active section to', currentSection);
        setActiveSection(currentSection as typeof activeSection);
      }
    }, observerOptions);

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        sectionObserver.observe(element);
      }
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, [activeSection, isScrolling, sections, isInitialized]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-primary-bg">
        {/* All sections rendered at once for scrolling */}
        <HeroSection onNavigateToSection={navigateToSection} />
        <ProjectsSection />
        <AboutSection />
        <JukeboxSection onLightboxStateChange={setIsLightboxOpen} />
        <SkillsSection />
        <ContactSection />

        {/* Desktop Dot Pagination - Right side */}
        <DotPagination
          sections={sections}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          isLightboxOpen={isLightboxOpen}
        />

        {/* Mobile Menu Overlay - Mobile/Tablet only */}
        <MobileMenu
          sections={sections}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          isLightboxOpen={isLightboxOpen}
        />
      </div>
    </ToastProvider>
  );
}

export default App;