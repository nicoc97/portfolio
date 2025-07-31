import React from 'react';
import { PixelButton } from '../ui/PixelButton';
import { WaveBackground } from '../ui/WaveBackground';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import { HERO_CONSTANTS } from '../../constants/hero';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface HeroSectionProps {
  onNavigateToSection?: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToSection }) => {
  const displayedText = useTypingAnimation({
    strings: HERO_CONSTANTS.TYPING_STRINGS,
  });

  // Animation hooks for staggered content appearance
  const { ref: nameTagRef, isVisible: nameTagVisible } = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.3, 
    delay: 200,
    animationType: 'pixel'
  });
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation<HTMLHeadingElement>({ 
    threshold: 0.3, 
    delay: 400,
    animationType: 'slide'
  });
  const { ref: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.3, 
    delay: 600,
    animationType: 'fade'
  });
  const { ref: buttonsRef, isVisible: buttonsVisible } = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.3, 
    delay: 800,
    animationType: 'scale'
  });

  // Handle navigation - use parent's navigation function if available
  const handleNavigation = (sectionId: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
    } else {
      // Fallback to direct scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <section id="hero" className="section-fullscreen relative bg-primary-bg overflow-hidden">
      {/* Wave background */}
      <WaveBackground />

      <div className="relative z-10 pt-20 md:pt-8 mobile-padding">
        <div className="flex flex-col justify-center min-h-[80vh] md:min-h-[85vh] lg:min-h-[85vh] xl:min-h-[90vh] 2xl:min-h-[95vh]">
          {/* All content centered vertically */}
          <div>
            {/* Main heading container - centered on md+ screens */}
            <div className="w-full md:w-5/6 lg:w-4/5 mx-auto">
              {/* Name tag with typing animation */}
              <div 
                ref={nameTagRef}
                className={`flex justify-center mb-2 animate-pixel ${nameTagVisible ? 'visible' : ''}`}
              >
                <span className="inline-block bg-accent-orange-dark px-3 py-1.5 rounded-full font-tech text-xs md:text-xs lg:text-sm xl:text-base 2xl:text-lg uppercase tracking-wider border border-accent-orange hover:scale-102 transition-all duration-200">
                  Nico Cruickshank ✦ {displayedText}
                  <span className="text-accent-green inline-block">|</span>
                </span>
              </div>

              <h1 
                ref={headingRef}
                className={`text-4xl md:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl 3xl:text-[10rem] font-bold font-retro tracking-tight text-center animate-slide-up ${headingVisible ? 'visible' : ''}`}
              >
                <span>{HERO_CONSTANTS.MAIN_HEADING}</span>
              </h1>
            </div>

            {/* Subtitle and buttons container - centered and responsive width */}
            <div className="w-full md:w-4/5 lg:w-3/5 xl:w-1/2 mx-auto mt-8 lg:mt-12">
              {/* Subtitle - centered */}
              <div 
                ref={subtitleRef}
                className={`text-center mb-8 animate-fade ${subtitleVisible ? 'visible' : ''}`}
              >
                <p className="text-sm md:text-sm lg:text-base xl:text-xl 2xl:text-2xl text-text-secondary">
                  {HERO_CONSTANTS.SUBTITLE}
                </p>
                <div className="mt-4">
                  <span className="font-tech text-xs md:text-sm lg:text-sm xl:text-base">
                    <span className="text-accent-green">{HERO_CONSTANTS.TECH_STACK}</span>
                  </span>
                </div>
              </div>

              {/* Buttons - centered */}
              <div 
                ref={buttonsRef}
                className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale ${buttonsVisible ? 'visible' : ''}`}
              >
                <PixelButton
                  variant="primary"
                  size="lg"
                  onClick={() => handleNavigation('projects')}
                  className="min-w-44 text-base"
                >
                  {HERO_CONSTANTS.BUTTONS.PRIMARY}
                </PixelButton>

                <PixelButton
                  variant="secondary"
                  size="lg"
                  onClick={() => handleNavigation('contact')}
                  className="min-w-44 text-base"
                >
                  {HERO_CONSTANTS.BUTTONS.SECONDARY}
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};