import { useEffect, useState, useRef } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AboutSection } from './components/sections/AboutSection';
import { JukeboxSection } from './components/sections/JukeboxSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ContactSection } from './components/sections/ContactSection';
import { DotPagination } from './components/ui/DotPagination';
import { MobileMenu } from './components/ui/MobileMenu';

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

  const sections = ['hero', 'projects', 'about', 'jukebox', 'skills', 'contact'];

  // Get current section index
  const getCurrentSectionIndex = () => {
    return sections.indexOf(activeSection);
  };

  // Smooth scroll to section with enhanced easing
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setIsScrolling(true);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Reset scrolling state after animation - optimized timeout for smooth hijacking
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  // Navigate to next/previous section
  const navigateToSection = (direction: 'up' | 'down') => {
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

  // Enhanced scroll hijacking - Desktop only, but always track scroll position
  useEffect(() => {
    let scrollAccumulator = 0;
    let lastWheelTime = 0;

    // More precise mobile detection - exclude tablets from scroll hijacking
    const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                          (window.innerWidth <= 768 && 'ontouchstart' in window);

    console.log('Mobile device detected:', isMobileDevice, 'Window width:', window.innerWidth);

    const handleWheel = (e: WheelEvent) => {
      // Don't hijack if it's a mobile device - let natural scrolling happen
      if (isMobileDevice) {
        return;
      }

      // Always prevent default on desktop to ensure consistent hijacking
      e.preventDefault();
      e.stopPropagation();

      // Don't process if we're already in a scrolling animation
      if (isScrolling) {
        return;
      }

      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTime;

      // Reset accumulator if it's been too long since last wheel event (new gesture)
      if (timeSinceLastWheel > 150) {
        scrollAccumulator = 0;
      }

      lastWheelTime = now;
      scrollAccumulator += e.deltaY;

      // Only trigger navigation when we have enough accumulated scroll
      const threshold = 50; // Balanced threshold for reliable hijacking
      
      if (Math.abs(scrollAccumulator) >= threshold) {
        const direction = scrollAccumulator > 0 ? 'down' : 'up';
        
        // Reset accumulator
        scrollAccumulator = 0;
        lastScrollTime.current = now;

        // Clear existing timeout
        if (scrollTimeoutRef.current !== null) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Navigate to next section
        navigateToSection(direction);
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
          navigateToSection('down');
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          navigateToSection('up');
          break;
        case 'Home':
          e.preventDefault();
          setActiveSection('hero');
          scrollToSection('hero');
          break;
        case 'End':
          e.preventDefault();
          setActiveSection('contact');
          scrollToSection('contact');
          break;
      }
    };

    // Track active section based on scroll position (mobile only)
    const handleScroll = () => {
      // Only track scroll position on mobile devices
      if (!isMobileDevice || isScrolling) return;

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

      if (closestSection !== activeSection) {
        console.log('Mobile scroll: Updating active section from', activeSection, 'to', closestSection);
        setActiveSection(closestSection as typeof activeSection);
      }
    };

    // Add wheel listener with proper passive setting
    window.addEventListener('wheel', handleWheel, { passive: isMobileDevice });
    
    // Add keyboard navigation only for desktop
    if (!isMobileDevice) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    // Add scroll tracking only for mobile
    if (isMobileDevice) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      setTimeout(handleScroll, 100);
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (!isMobileDevice) {
        window.removeEventListener('keydown', handleKeyDown);
      }
      if (isMobileDevice) {
        window.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeSection, isScrolling]);

  // Simplified section detection - only use intersection observer for mobile
  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                          (window.innerWidth <= 768 && 'ontouchstart' in window);

    if (!isMobileDevice) return; // Skip intersection observer on desktop

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.3
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      if (isScrolling) return;

      let mostVisible = entries[0];
      for (const entry of entries) {
        if (entry.intersectionRatio > mostVisible.intersectionRatio) {
          mostVisible = entry;
        }
      }

      if (mostVisible && mostVisible.isIntersecting) {
        const sectionId = mostVisible.target.id;
        if (sections.includes(sectionId) && sectionId !== activeSection) {
          console.log('Mobile Intersection Observer: Updating active section to', sectionId);
          setActiveSection(sectionId as typeof activeSection);
        }
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
  }, [activeSection, isScrolling, sections]);

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* All sections rendered at once for scrolling */}
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <JukeboxSection onLightboxStateChange={setIsLightboxOpen} />
      <SkillsSection />
      <ContactSection />

      {/* Desktop Dot Pagination - Right side */}
      <DotPagination
        sections={sections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        isLightboxOpen={isLightboxOpen}
      />

      {/* Mobile Menu Overlay - Mobile/Tablet only */}
      <MobileMenu
        sections={sections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        isLightboxOpen={isLightboxOpen}
      />
    </div>
  );
}

export default App;
