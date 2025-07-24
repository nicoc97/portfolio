import React from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';

/**
 * AboutSection Component
 * 
 * Clean, modern about section with sophisticated typography and layout.
 * Inspired by contemporary portfolio designs with better content hierarchy.
 */
export const AboutSection: React.FC = () => {
  // Animation hooks
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
  const { triggerRef: contentTriggerRef, visibleItems: contentVisible } = useStaggeredAnimation<HTMLDivElement>(6, 150);
  
  return (
    <section id="about" className="section-fullscreen py-20 bg-primary-bg relative overflow-hidden">
      <div className="w-full lg:w-4/5 mx-auto mobile-padding relative z-10">
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

        {/* Main Content - Full Width Layout */}
        <div ref={contentTriggerRef} className="space-y-16">
          
          {/* Introduction */}
          <div className={`animate-slide-up ${contentVisible[0] ? 'visible' : ''}`}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-start">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-accent-orange font-tech mb-2 uppercase tracking-wide">
                  Introduction
                </h3>
              </div>
              <div className="lg:col-span-10 space-y-6">
                <p className="text-text-primary text-xl leading-relaxed max-w-4xl">
                  I'm a collaborative web developer with a passion for fostering teamwork and delivering results.
                  With experience in both custom code and CMS solutions, I thrive in dynamic environments where
                  I can leverage my strong communication skills to bridge the gap between technical and
                  non-technical stakeholders.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed max-w-4xl">
                  I have a keen interest in tech and enjoy staying current with industry trends to deliver
                  innovative solutions. My diverse background enables me to adapt quickly and contribute
                  across different areas of tech and digital innovation.
                </p>
              </div>
            </div>
          </div>

          {/* Current Role */}
          <div className={`animate-slide-up ${contentVisible[1] ? 'visible' : ''}`}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-start">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-accent-green font-tech mb-2 uppercase tracking-wide">
                  Current Role
                </h3>
              </div>
              <div className="lg:col-span-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 max-w-5xl">
                  <div>
                    <h4 className="text-3xl font-bold text-text-primary font-retro mb-2">
                      WordPress Developer
                    </h4>
                    <p className="text-text-secondary text-lg">
                      Scoot Digital • Aug 2024 - Dec 2024
                    </p>
                  </div>
                  <span className="text-sm text-accent-green font-tech bg-accent-green/20 px-4 py-2 rounded-full border border-accent-green/30 mt-3 lg:mt-0 self-start">
                    CURRENT
                  </span>
                </div>
                <p className="text-text-secondary text-lg leading-relaxed max-w-4xl">
                  Developing custom WordPress themes with ACF and Timber, creating intuitive
                  content management solutions for diverse clients.
                </p>
              </div>
            </div>
          </div>

          {/* Experience Highlights */}
          <div className={`animate-slide-up ${contentVisible[2] ? 'visible' : ''}`}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-start">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-accent-orange font-tech mb-2 uppercase tracking-wide">
                  Experience
                </h3>
              </div>
              <div className="lg:col-span-10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-accent-orange rounded-full"></div>
                      <span className="text-text-primary text-lg">5+ years in web development</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-accent-orange rounded-full"></div>
                      <span className="text-text-primary text-lg">Full-stack experience</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-accent-green rounded-full"></div>
                      <span className="text-text-primary text-lg">Team collaboration focus</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-accent-green rounded-full"></div>
                      <span className="text-text-primary text-lg">Apprentice to senior progression</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className={`animate-slide-up ${contentVisible[3] ? 'visible' : ''}`}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-start">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-accent-green font-tech mb-2 uppercase tracking-wide">
                  Location
                </h3>
              </div>
              <div className="lg:col-span-10">
                <h4 className="text-3xl font-bold text-text-primary font-retro mb-3">
                  Glasgow, UK
                </h4>
                <p className="text-text-secondary text-lg max-w-3xl">
                  Available for remote work and local collaborations
                </p>
              </div>
            </div>
          </div>

          {/* Personal Interests */}
          <div className={`animate-slide-up ${contentVisible[4] ? 'visible' : ''}`}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-start">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-accent-orange font-tech mb-2 uppercase tracking-wide">
                  Beyond Code
                </h3>
              </div>
              <div className="lg:col-span-10">
                <p className="text-text-secondary text-lg leading-relaxed max-w-5xl">
                  I'm passionate about retro technology - tinkering with analogue gadgets like record players
                  and CRT TVs. I enjoy reading political philosophy and horror books (big fan of Alasdair Grey),
                  and I'm currently learning 3D modeling with Blender.
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className={`animate-slide-up ${contentVisible[5] ? 'visible' : ''}`}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-start">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-accent-green font-tech mb-2 uppercase tracking-wide">
                  Core Tech
                </h3>
              </div>
              <div className="lg:col-span-10">
                <div className="flex flex-wrap gap-4 max-w-6xl">
                  {[
                    'HTML/CSS/JavaScript',
                    'React & Next.js',
                    'PHP & Symfony',
                    'WordPress & ACF',
                    'C# & .NET Core',
                    'SQL Databases'
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-5 py-3 text-base font-tech border border-text-secondary/20 text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all duration-200 rounded-full"
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
    </section>
  );
};