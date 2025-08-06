import React, { useEffect, useState } from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';
import { WavyTimeline } from '../ui/WavyTimeline';

/**
 * Counter Hook for animated numbers
 */
const useCounter = (end: number, duration: number = 2000, isVisible: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const startCount = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * (end - startCount) + startCount));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return count;
};

/**
 * AboutSection Component
 * 
 * Minimal, contemporary about section with animated counters and concise content.
 * Inspired by modern portfolio designs with focus on impact over text.
 */
export const AboutSection: React.FC = () => {
  // Animation hooks with reverse animations
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 100
  });
  const { triggerRef: contentTriggerRef, visibleItems: contentVisible } = useStaggeredAnimation<HTMLDivElement>(5, 200, {
    triggerOnce: false,
    reverseOnExit: true
  });

  // Counter animations
  const yearsCount = useCounter(5, 2000, contentVisible[1]);
  const teamsCount = useCounter(15, 2500, contentVisible[1]);
  const techCount = useCounter(10, 2200, contentVisible[1]);

  return (
    <section id="about" className="section-fullscreen py-20 bg-primary-bg relative overflow-hidden">
      <div className="w-full md:w-4/5 mx-auto mobile-padding relative z-10">
        {/* Large background text */}
        <div className="section-bg-text">
          <span>SEC02</span>
        </div>

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`mb-20 animate-slide-up ${headerVisible ? 'visible' : ''}`}
        >
          <h2 className="section-header">ABOUT</h2>
          <div className="section-divider mb-6"></div>
          <p className="section-subtitle mb-4">Collaborative Web Developer</p>
          <p className="text-text-secondary text-left text-sm leading-relaxed max-w-2xl">
            Building digital solutions through teamwork, innovation, and modern development practices
          </p>
        </div>

        {/* Main Content */}
        <div ref={contentTriggerRef} className="space-y-20">



          {/* Mobile Layout - Traditional Stacked */}
          <div className="lg:hidden">
            {/* Stats Counters - Mobile */}
            <div className={`animate-slide-up ${contentVisible[1] ? 'visible' : ''}`}>
              <div className="space-y-12 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8 mb-16">
                <div className="text-center sm:text-left">
                  <div className="text-4xl md:text-5xl font-bold font-retro text-accent-orange mb-2">
                    {yearsCount}+
                  </div>
                  <p className="text-text-secondary text-base font-tech uppercase tracking-wide">
                    Years Experience
                  </p>
                </div>

                <div className="text-center sm:text-left ml-16 sm:ml-4">
                  <div className="text-4xl md:text-5xl font-bold font-retro text-accent-green mb-2">
                    {teamsCount}+
                  </div>
                  <p className="text-text-secondary text-base font-tech uppercase tracking-wide">
                    Team COLLABORATIONS
                  </p>
                </div>

                <div className="text-center sm:text-left mr-8 sm:mr-8">
                  <div className="text-4xl md:text-5xl font-bold font-retro text-text-primary mb-2">
                    {techCount}+
                  </div>
                  <p className="text-text-secondary text-base font-tech uppercase tracking-wide">
                    Technologies Mastered
                  </p>
                </div>
              </div>
            </div>

            {/* Currently Section - Mobile */}
            <div className={`animate-slide-up ${contentVisible[2] ? 'visible' : ''}`}>
              <div className="mb-16">
                <h3 className="text-lg md:text-xl font-bold text-accent-green font-tech mb-6 uppercase tracking-wide">
                  Currently
                </h3>
                <h4 className="text-xl md:text-2xl lg:text-3xl xl:text-2xl 2xl:text-3xl font-bold text-text-primary font-retro mb-4">
                  Freelance Developer
                </h4>
                <p className="text-text-secondary text-lg mb-6">
                  Independent • Glasgow, UK
                </p>
                <span className="text-sm text-accent-green font-tech bg-accent-green/20 px-4 py-2 rounded-full border border-accent-green/30">
                  AVAILABLE FOR PROJECTS
                </span>
              </div>
            </div>

            {/* Core Stack Section - Mobile */}
            <div className={`animate-slide-up ${contentVisible[3] ? 'visible' : ''}`}>
              <div className="mb-16">
                <h3 className="text-lg md:text-xl font-bold text-accent-orange font-tech mb-6 uppercase tracking-wide">
                  Core Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['React', 'WordPress', 'PHP', 'JavaScript', 'C#', '.NET'].map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 text-base font-tech border border-text-secondary/20 text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all duration-200 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* This Site Section - Mobile */}
            <div className={`animate-slide-up ${contentVisible[4] ? 'visible' : ''}`}>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-accent-green font-tech mb-6 uppercase tracking-wide">
                  This Site
                </h3>

                {/* Built With glass box */}
                <div className="bg-primary-bg/50 backdrop-blur-sm border border-accent-orange/20 rounded-lg p-6 shadow-lg shadow-accent-orange/10 hover:border-accent-orange/30 transition-all duration-300 w-fit">
                  <h4 className="text-base font-bold text-accent-orange font-tech mb-4 uppercase tracking-wide">
                    Built With
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• React & TypeScript</div>
                    <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Vite Build Tool</div>
                    <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Tailwind CSS</div>
                    <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Responsive Design</div>
                    <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Performance Optimized</div>
                    <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Accessibility Focused</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Three Column Layout */}
          <div className="hidden lg:block">
            <div className={`animate-slide-up ${contentVisible[1] ? 'visible' : ''}`}>
              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 items-start">

                {/* Left Column - Stats Counters */}
                <div className="space-y-12 lg:space-y-16 xl:space-y-20 lg:col-span-1">
                  <div className="flex items-center gap-8">
                    <div className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold font-retro">
                      {yearsCount}+
                    </div>
                    <div>
                      <p className="text-text-secondary text-lg font-tech uppercase tracking-wide">
                        Years Experience
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 lg:ml-12 xl:ml-16">
                    <div className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold font-retro">
                      {teamsCount}+
                    </div>
                    <div>
                      <p className="text-text-secondary text-lg font-tech uppercase tracking-wide">
                        Team COLLABORATIONS
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 lg:ml-6 xl:ml-8">
                    <div className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold font-retro">
                      {techCount}+
                    </div>
                    <div>
                      <p className="text-text-secondary text-lg font-tech uppercase tracking-wide">
                        Technologies Mastered
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Content Sections */}
                <div className="space-y-16 lg:space-y-20 xl:space-y-24 lg:mt-6 xl:mt-8 lg:col-span-1">

                  {/* Currently */}
                  <div className="max-w-md">
                    <h3 className="text-lg md:text-xl font-bold text-accent-green font-tech mb-6 uppercase tracking-wide">
                      Currently
                    </h3>
                    <h4 className="text-xl md:text-2xl lg:text-3xl xl:text-2xl 2xl:text-3xl font-bold text-text-primary font-retro mb-4">
                      Freelance Developer
                    </h4>
                    <p className="text-text-secondary text-lg mb-6">
                      Independent • Glasgow, UK
                    </p>
                    <span className="text-sm text-accent-green font-tech bg-accent-green/20 px-4 py-2 rounded-full border border-accent-green/30">
                      AVAILABLE FOR PROJECTS
                    </span>
                  </div>

                  {/* Core Stack */}
                  <div className="max-w-md lg:ml-6 xl:ml-8">
                    <h3 className="text-lg md:text-xl font-bold text-accent-orange font-tech mb-6 uppercase tracking-wide">
                      Core Stack
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {['React', 'WordPress', 'PHP', 'JavaScript', 'C#', '.NET'].map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 text-base font-tech border border-text-secondary/20 text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all duration-200 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Third Column - Site Details */}
                <div className="space-y-16 lg:space-y-20 xl:space-y-24 lg:mt-6 xl:mt-8 lg:col-span-1">
                  <div className="w-full">
                    <h3 className="text-lg md:text-xl font-bold text-accent-green font-tech mb-6 uppercase tracking-wide">
                      This Site
                    </h3>

                    {/* Built With glass box */}
                    <div className="bg-primary-bg/50 backdrop-blur-sm border border-accent-orange/20 rounded-lg p-6 shadow-lg shadow-accent-orange/10 hover:border-accent-orange/30 transition-all duration-300 w-fit">
                      <h4 className="text-base font-bold text-accent-orange font-tech mb-4 uppercase tracking-wide">
                        Built With
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• React & TypeScript</div>
                        <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Vite Build Tool</div>
                        <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Tailwind CSS</div>
                        <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Responsive Design</div>
                        <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Performance Optimized</div>
                        <div className="text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-default">• Accessibility Focused</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Wavy Timeline */}
          <WavyTimeline />
        </div>
      </div>
    </section>
  );
};