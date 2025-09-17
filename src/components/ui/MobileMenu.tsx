import React, { useState } from 'react';

interface MobileMenuProps {
  sections: string[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  isLightboxOpen?: boolean;
}

/**
 * MobileMenu Component
 * 
 * Mobile and tablet navigation overlay with hamburger menu.
 * Shows only on mobile and tablet devices (hidden on desktop).
 * Features a full-screen overlay with section navigation.
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  sections,
  activeSection,
  onSectionClick,
  isLightboxOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Lock scroll when open
  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Basic focus trap
  React.useEffect(() => {
    if (!isOpen) return;
    const container = document.getElementById('mobile-menu');
    if (!container) return;
    const selector = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(container.querySelectorAll<HTMLElement>(selector));
    focusables[0]?.focus();

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Menu Button - Mobile/Tablet Only */}
      <button
        onClick={toggleMenu}
        className={`fixed top-6 right-6 z-50 lg:hidden w-12 h-12 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl transition-all duration-300 ${
          isLightboxOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${isOpen ? 'bg-accent-orange/30 border-accent-orange/50' : 'hover:bg-accent-green/20 hover:border-accent-green/30'}`}
        aria-label="Toggle navigation menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-text-primary mt-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-text-primary mt-1 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-primary-bg/95 backdrop-blur-lg"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Menu Content */}
        <div className={`relative z-10 flex flex-col items-center justify-center h-full transition-all duration-500 ${
          isOpen ? 'translate-y-0' : 'translate-y-8'
        }`}>
          <nav className="space-y-6" aria-label="Mobile navigation">
            {sections.map((section, index) => {
              const isActive = activeSection === section;
              
              return (
                <button
                  key={section}
                  onClick={() => handleSectionClick(section)}
                  className={`block w-full text-center px-8 py-4 font-tech text-2xl transition-all duration-300 rounded-xl ${
                    isActive 
                      ? 'bg-accent-orange/30 border-2 border-accent-orange/50 text-text-primary' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/10 border-2 border-transparent hover:border-white/20'
                  } ${isOpen ? 'animate-slideInUp' : ''}`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {section.toUpperCase()}
                </button>
              );
            })}
          </nav>

          {/* Close instruction */}
          <p className="mt-12 text-text-secondary font-tech text-sm opacity-70">
            Tap anywhere to close
          </p>
        </div>
      </div>


    </>
  );
};