import React, { useState, useEffect } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { WaveBackground } from '../ui/WaveBackground';

interface HeroSectionProps {
  onNavigate: (section: 'hero' | 'projects' | 'about' | 'skills' | 'contact') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  // Typing animation state
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = 'Building bridges between code and people';
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Reset on mount to ensure animation plays
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTypingComplete(false);
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); 
      return () => clearTimeout(timeout);
    } else if (currentIndex === fullText.length && displayedText) {
      setIsTypingComplete(true);
    }
  }, [currentIndex, fullText, displayedText]);

  // Navigation functions
  const navigateToProjects = () => {
    onNavigate('projects');
  };

  const navigateToContact = () => {
    onNavigate('contact');
  };

  return (
    <section className="min-h-screen relative bg-primary-bg-light overflow-hidden">
      {/* Wave background */}
      <WaveBackground />

      <div className="relative z-10 px-6 py-8 pt-20 md:pt-8">
        <div className="w-full lg:w-4/5 mx-auto">
          <div className="flex flex-col min-h-[80vh] lg:min-h-[90vh] justify-center xl:justify-end">
            {/* Main heading - close to content below */}
            <div className="w-full mb-8 xl:mb-[18rem]">
              {/* NAMe tag */}
              <div className="flex justify-center lg:justify-start mb-4">
                <span className="inline-block bg-accent-orange-dark px-4 py-2 rounded-full font-tech text-sm lg:text-base uppercase tracking-wider border border-accent-green hover:scale-105 transition-all duration-200">
                  Nico Cruickshank ✦ Portfolio 
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-[11rem] font-bold font-retro tracking-tight text-center lg:text-left transition-all duration-300">
                <span>{displayedText}.</span>
                {!isTypingComplete && (
                  <span className="text-accent-orange font-tech text-3xl inline-block animate-pulse">|</span>
                )}
              </h1>
            </div>

            {/* Subtitle and buttons side by side */}
            <div className="grid grid-cols-12 gap-4 md:gap-8 items-center">
              {/* Subtitle - positioned asymmetrically */}
              <div className={`col-span-12 lg:col-span-6 lg:col-start-1 transition-opacity duration-1000 ${
                isTypingComplete ? 'opacity-100' : 'opacity-0'
              }`}>
                <p className="text-md md:text-xl lg:text-2xl text-text-secondary text-center lg:text-left">
                Web developer, retro tech enthusiast, and firm believer that good communication beats clever code every time. Based in Glasgow, I'm always up for a challenge – especially if it involves making the web a little more human-friendly.
                </p>
                <div className="mt-4 text-center lg:text-left">
                  <span className="font-tech text-sm md:text-base">
                    <span className="text-accent-orange"> React • TypeScript •  Python • Machine Learning</span>
                  </span>
                </div>
              </div>

              {/* Buttons - positioned on the right */}
              <div className={`col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center lg:justify-start transition-opacity duration-1000 delay-300 ${
                isTypingComplete ? 'opacity-100' : 'opacity-0'
              }`}>
                <PixelButton
                  variant="primary"
                  size="lg"
                  onClick={navigateToProjects}
                  className="min-w-44 text-base"
                >
                  VIEW PROJECTS
                </PixelButton>
                
                <PixelButton
                  variant="secondary"
                  size="lg"
                  onClick={navigateToContact}
                  className="min-w-44 text-base"
                >
                  GET IN TOUCH
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};