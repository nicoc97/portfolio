import React from 'react';
import { PixelButton } from '../ui/PixelButton';
import { WaveBackground } from '../ui/WaveBackground';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import { HERO_CONSTANTS } from '../../constants/hero';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export const HeroSection: React.FC = () => {
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

  return (
    <section id="hero" className="min-h-screen relative bg-primary-bg overflow-hidden">
      {/* Wave background */}
      <WaveBackground />

      <div className="relative z-10 pt-20 md:pt-0 mobile-padding">
        <div className="w-full lg:w-4/5 mx-auto">
          <div className="flex flex-col min-h-[80vh] lg:min-h-[100vh]">
            {/* Main heading - truly centered */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Name tag with typing animation */}
              <div 
                ref={nameTagRef}
                className={`flex justify-center lg:justify-start mb-2 transition-all duration-700 ${nameTagVisible 
                  ? 'opacity-100 translate-y-0 scale-100 blur-none' 
                  : 'opacity-0 translate-y-4 scale-95 blur-sm'
                }`}
              >
                <span className="inline-block bg-accent-orange-dark px-4 py-2 rounded-full font-tech text-sm lg:text-lg uppercase tracking-wider border border-accent-orange hover:scale-102 transition-all duration-200">
                  Nico Cruickshank ✦ {displayedText}
                  <span className="text-accent-green inline-block">|</span>
                </span>
              </div>

              <h1 
                ref={headingRef}
                className={`text-5xl md:text-6xl lg:text-7xl xl:text-[11rem] font-bold font-retro tracking-tight text-center lg:text-left transition-all duration-700 ${headingVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
                }`}
              >
                <span>{HERO_CONSTANTS.MAIN_HEADING}</span>
              </h1>
            </div>

            {/* Subtitle and buttons - aligned at bottom */}
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-center pb-8">
              {/* Subtitle - positioned asymmetrically */}
              <div 
                ref={subtitleRef}
                className={`col-span-12 lg:col-span-6 lg:col-start-1 transition-all duration-700 ${subtitleVisible 
                  ? 'opacity-100' 
                  : 'opacity-0'
                }`}
              >
                <p className="text-md md:text-xl lg:text-2xl text-text-secondary text-center lg:text-left">
                  {HERO_CONSTANTS.SUBTITLE}
                </p>
                <div className="mt-4 text-center lg:text-left">
                  <span className="font-tech text-sm md:text-base">
                    <span className="text-accent-orange">{HERO_CONSTANTS.TECH_STACK}</span>
                  </span>
                </div>
              </div>

              {/* Buttons - positioned on the right */}
              <div 
                ref={buttonsRef}
                className={`col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center lg:justify-start transition-all duration-700 ${buttonsVisible 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95'
                }`}
              >
                <PixelButton
                  variant="primary"
                  size="lg"
                  onClick={() => scrollToSection('projects')}
                  className="min-w-44 text-base"
                >
                  {HERO_CONSTANTS.BUTTONS.PRIMARY}
                </PixelButton>

                <PixelButton
                  variant="secondary"
                  size="lg"
                  onClick={() => scrollToSection('contact')}
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