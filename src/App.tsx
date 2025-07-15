import { useState } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { ProjectsSection } from './components/sections/ProjectsSection';

/**
 * Main App Component
 * 
 * This is the main application component that brings together all sections.
 * Now uses section switching instead of scrolling.
 * 
 * Current sections:
 * - HeroSection: Landing area with typing animation (always visible)
 * - ProjectsSection: Filterable project showcase
 * - About, Skills, Contact: Placeholder sections (ready for development)
 */
function App() {
  const [activeSection, setActiveSection] = useState<'hero' | 'projects' | 'about' | 'skills' | 'contact'>('hero');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroSection onNavigate={setActiveSection} />;
      case 'projects':
        return <ProjectsSection />;
      case 'about':
        return (
          <section className="py-20 bg-primary-bg relative overflow-hidden min-h-screen">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-6">
                <h2 className="text-5xl md:text-6xl font-bold text-accent-orange font-retro">
                  ABOUT
                </h2>
                <div className="mx-auto w-16 h-px bg-accent-orange"></div>
                <p className="text-accent-orange font-tech text-lg">
                  [ABOUT_SECTION_PLACEHOLDER]
                </p>
                <div className="mt-8 text-text-secondary text-sm">
                  More detailed content coming soon...
                </div>
              </div>
            </div>
          </section>
        );
      case 'skills':
        return (
          <section className="py-20 bg-primary-bg relative overflow-hidden min-h-screen">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-6">
                <h2 className="text-5xl md:text-6xl font-bold text-accent-orange font-retro">
                  SKILLS
                </h2>
                <div className="mx-auto w-16 h-px bg-accent-orange"></div>
                <p className="text-accent-orange font-tech text-lg">
                  [SKILLS_SECTION_PLACEHOLDER]
                </p>
                <div className="mt-8 text-text-secondary text-sm">
                  Interactive skill badges and proficiency levels coming soon...
                </div>
              </div>
            </div>
          </section>
        );
      case 'contact':
        return (
          <section className="py-20 bg-primary-bg relative overflow-hidden min-h-screen">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-6">
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
        );
      default:
        return <HeroSection onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      {renderActiveSection()}
      
      {/* Navigation bar - Full width on mobile, Top Left on desktop */}
      <nav className="fixed top-4 left-2 right-2 md:left-8 md:right-auto md:translate-x-0 z-50">
        <div className="flex gap-1 md:gap-2 justify-evenly md:justify-start overflow-x-auto">
          <button
            onClick={() => setActiveSection('hero')}
            className={`${activeSection === 'hero' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            HOME
          </button>
          <button
            onClick={() => setActiveSection('projects')}
            className={`${activeSection === 'projects' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            PROJECTS
          </button>
          <button
            onClick={() => setActiveSection('about')}
            className={`${activeSection === 'about' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            ABOUT
          </button>
          <button
            onClick={() => setActiveSection('skills')}
            className={`${activeSection === 'skills' ? 'bg-accent-orange/30 border-accent-orange/50' : 'bg-white/10 border-white/20 hover:bg-accent-green/20 hover:border-accent-green/30'} backdrop-blur-md text-text-primary px-2 py-1.5 md:px-4 md:py-2 border-2 font-tech text-sm md:text-xl rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0`}
          >
            SKILLS
          </button>
          <button
            onClick={() => setActiveSection('contact')}
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
