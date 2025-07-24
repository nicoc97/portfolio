import React, { useEffect, useState } from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';

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
  const { triggerRef: contentTriggerRef, visibleItems: contentVisible } = useStaggeredAnimation<HTMLDivElement>(4, 200, {
    triggerOnce: false,
    reverseOnExit: true
  });

  // Counter animations
  const yearsCount = useCounter(5, 2000, contentVisible[1]);
  const projectsCount = useCounter(25, 2500, contentVisible[1]);
  const clientsCount = useCounter(15, 2200, contentVisible[1]);

  return (
    <section id="about" className="section-fullscreen py-20 bg-primary-bg relative overflow-hidden">
      <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
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
          <p className="section-subtitle">Collaborative Web Developer</p>
        </div>

        {/* Main Content */}
        <div ref={contentTriggerRef} className="space-y-20">

          {/* Brief Introduction */}
          <div className={`animate-slide-up ${contentVisible[0] ? 'visible' : ''}`}>
            <div className="max-w-4xl">
              <p className="text-2xl lg:text-3xl text-text-primary leading-relaxed font-light">
                Collaborative web developer focused on delivering results through
                <span className="text-accent-orange font-medium"> teamwork</span> and
                <span className="text-accent-green font-medium"> innovation</span>.
              </p>
            </div>
          </div>

          {/* Combined Layout - Counters and Content Side by Side */}
          <div className={`animate-slide-up ${contentVisible[1] ? 'visible' : ''}`}>
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

              {/* Left Column - Stats Counters */}
              <div className="space-y-16 lg:space-y-20">
                <div className="flex items-center gap-8">
                  <div className="text-6xl lg:text-8xl font-bold font-retro">
                    {yearsCount}+
                  </div>
                  <div>
                    <p className="text-text-secondary text-lg font-tech uppercase tracking-wide">
                      Years Experience
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 lg:ml-16">
                  <div className="text-6xl lg:text-8xl font-bold font-retro">
                    {projectsCount}+
                  </div>
                  <div>
                    <p className="text-text-secondary text-lg font-tech uppercase tracking-wide">
                      Projects Delivered
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 lg:ml-8">
                  <div className="text-6xl lg:text-8xl font-bold font-retro">
                    {clientsCount}+
                  </div>
                  <div>
                    <p className="text-text-secondary text-lg font-tech uppercase tracking-wide">
                      Happy Clients
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Content Sections */}
              <div className="space-y-20 lg:space-y-24 lg:mt-8">

                {/* Currently */}
                <div className="max-w-md">
                  <h3 className="text-xl font-bold text-accent-green font-tech mb-6 uppercase tracking-wide">
                    Currently
                  </h3>
                  <h4 className="text-3xl font-bold text-text-primary font-retro mb-4">
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
                <div className="max-w-md lg:ml-8">
                  <h3 className="text-xl font-bold text-accent-orange font-tech mb-6 uppercase tracking-wide">
                    Core Stack
                  </h3>
                  <div className="flex gap-3">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};