import React from 'react';
import { PixelButton } from '../ui/PixelButton';
import { WaveBackground } from '../ui/WaveBackground';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import { HERO_CONSTANTS } from '../../constants/hero';

interface HeroSectionProps {
  onNavigate: (section: 'hero' | 'projects' | 'about' | 'skills' | 'contact') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const displayedText = useTypingAnimation({
    strings: HERO_CONSTANTS.TYPING_STRINGS,
  });

  return (
    <section className="min-h-screen relative bg-primary-bg-light overflow-hidden">
      {/* Wave background */}
      <WaveBackground />

      <div className="relative z-10 px-6 py-8 pt-20 md:pt-8">
        <div className="w-full lg:w-4/5 mx-auto">
          <div className="flex flex-col min-h-[80vh] lg:min-h-[90vh] justify-center xl:justify-end">
            {/* Main heading*/}
            <div className="w-full mb-8 xl:mb-[18rem]">
              {/* Name tag with typing animation */}
              <div className="flex justify-center lg:justify-start mb-4">
                <span className="inline-block bg-accent-orange-dark px-4 py-2 rounded-full font-tech text-sm lg:text-lg uppercase tracking-wider border border-accent-green hover:scale-105 transition-all duration-200">
                  Nico Cruickshank ✦ {displayedText}
                  <span className="text-accent-green inline-block animate-pulse">|</span>
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-[11rem] font-bold font-retro tracking-tight text-center lg:text-left transition-all duration-300">
                <span>{HERO_CONSTANTS.MAIN_HEADING}</span>
              </h1>
            </div>

            {/* Subtitle and buttons side by side */}
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-center">
              {/* Subtitle - positioned asymmetrically */}
              <div className="col-span-12 lg:col-span-6 lg:col-start-1 transition-opacity duration-1000 opacity-100">
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
              <div className="col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center lg:justify-start transition-opacity duration-1000 delay-300 opacity-100">
                <PixelButton
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('projects')}
                  className="min-w-44 text-base"
                >
                  {HERO_CONSTANTS.BUTTONS.PRIMARY}
                </PixelButton>
                
                <PixelButton
                  variant="secondary"
                  size="lg"
                  onClick={() => onNavigate('contact')}
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