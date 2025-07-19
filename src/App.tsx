import { useEffect, useState } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AboutSection } from './components/sections/AboutSection';
import { JukeboxSection } from './components/sections/JukeboxSection';
import { SkillsSection } from './components/sections/SkillsSection';

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

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'about', 'jukebox', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for better detection

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

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* All sections rendered at once for scrolling */}
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <JukeboxSection onLightboxStateChange={setIsLightboxOpen} />
      <SkillsSection />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary-bg relative overflow-hidden min-h-screen">
        <div className="container mx-auto lg:w-4/5 mobile-padding">
          <div className="text-left space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-accent-orange font-retro">
              CONTACT
            </h2>
            <div className="mx-auto w-16 h-px bg-accent-orange"></div>
            <p className="text-accent-orange font-tech text-lg">
              [CONTACT_SECTION_PLACEHOLDER]
            </p>
            <div className="mt-8 text-text-secondary text-sm">
              Contact form and social links coming soon...
            </div>
          </div>
        </div>
      </section>

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
