import { useEffect, useState, useRef } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AboutSection } from './components/sections/AboutSection';
import { JukeboxSection } from './components/sections/JukeboxSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ContactSection } from './components/sections/ContactSection';

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

      // Reset scrolling state after animation
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

  // Enhanced scroll hijacking
  useEffect(() => {
    let ticking = false;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastScrollTime.current;

      // Throttle scroll events to prevent too rapid firing
      if (timeDiff < 100) {
        e.preventDefault();
        return;
      }

      lastScrollTime.current = now;

      // Clear existing timeout
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Determine scroll direction
      const direction = e.deltaY > 0 ? 'down' : 'up';

      // Prevent default scrolling
      e.preventDefault();

      // Navigate to next section
      if (!ticking) {
        requestAnimationFrame(() => {
          navigateToSection(direction);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Handle keyboard navigation
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

    // Track active section based on scroll position (for manual scrolling)
    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId as typeof activeSection);
            break;
          }
        }
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial section detection
    handleScroll();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeSection, isScrolling]);

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* All sections rendered at once for scrolling */}
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <JukeboxSection onLightboxStateChange={setIsLightboxOpen} />
      <SkillsSection />
      <ContactSection />

      {/* Navigation bar - Full width on mobile, Top Left on desktop */}
      <nav className={`fixed top-4 left-8 right-8 md:left-8 md:right-auto md:translate-x-0 z-50 transition-opacity duration-300 ${isLightboxOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex gap-1 md:gap-2 justify-evenly md:justify-start overflow-x-auto">
          <button
            onClick={() => scrollToSection('hero')}
            className={`${activeSection === 'hero' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className={`${activeSection === 'projects' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            PROJECTS
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className={`${activeSection === 'about' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollToSection('jukebox')}
            className={`${activeSection === 'jukebox' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            JUKEBOX
          </button>
          <button
            onClick={() => scrollToSection('skills')}
            className={`${activeSection === 'skills' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            SKILLS
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`${activeSection === 'contact' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            CONTACT
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
