import React from 'react';

interface DotPaginationProps {
  sections: string[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  isLightboxOpen?: boolean;
}

/**
 * DotPagination Component
 * 
 * Orange dot navigation that appears on the right side of the screen (desktop only).
 * Each dot represents a section and shows the current position on the site.
 * Hidden on mobile and tablet devices.
 */
export const DotPagination: React.FC<DotPaginationProps> = ({
  sections,
  activeSection,
  onSectionClick,
  isLightboxOpen = false
}) => {
  return (
    <nav
      className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 transition-opacity duration-300 ${isLightboxOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      {sections.map((section) => {
        const isActive = activeSection === section;

        return (
          <button
            key={section}
            onClick={() => onSectionClick(section)}
            className={`group relative w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${isActive
              ? 'bg-accent-orange shadow-lg shadow-accent-orange/30'
              : 'bg-white/20 hover:bg-accent-orange/50 border border-white/30'
              }`}
            aria-label={`Go to ${section} section`}
          >
            {/* Tooltip */}
            <div className={`absolute right-8 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-bg/90 backdrop-blur-sm border border-white/20 rounded-lg font-tech text-sm text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${isActive ? 'opacity-100' : ''
              }`}>
              {section.toUpperCase()}
            </div>

            {/* Active indicator ring */}
            {isActive && (
              <div className="absolute inset-0 rounded-full border-2 border-accent-orange animate-pulse"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};