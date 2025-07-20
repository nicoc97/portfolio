import React from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';

/**
 * AboutSection Component
 * 
 * Personal introduction section with clean typography and pixel decorative elements.
 * Features scroll-triggered animations and proper content hierarchy.
 */
export const AboutSection: React.FC = () => {
  // Animation hooks
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
  const { triggerRef: contentTriggerRef, visibleItems: contentVisible } = useStaggeredAnimation(5, 150);
  const { ref: techStackRef, isVisible: techStackVisible } = useScrollAnimation({ threshold: 0.2 });
  return (
    <section id="about" className="py-20 bg-primary-bg relative overflow-hidden min-h-screen">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-start pt-[2rem] pl-[2rem] justify-start opacity-5 pointer-events-none">
        <span className="text-[12rem] md:text-[15rem] lg:text-[18rem] font-bold text-accent-orange font-retro leading-none">01</span>
      </div>

      <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
        <div className="max-w-4xl">
          {/* Section Header */}
          <div
            ref={headerRef}
            className={`text-center mb-16 transition-all duration-700 ${headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}
          >
            <h2 className="text-5xl md:text-[8rem] font-bold text-accent-orange tracking-wide font-retro text-left">
              ABOUT
            </h2>
            <div className="w-16 h-px bg-accent-orange mb-6"></div>
            <p className="text-accent-orange text-left font-tech text-lg">
              Collaborative Web Developer
            </p>
          </div>

          {/* Main Content Grid */}
          <div ref={contentTriggerRef} className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Introduction */}
            <div className="space-y-6">
              <div className={`pixel-card transition-all duration-700 ${contentVisible[0]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}>
                <h3 className="text-2xl font-bold text-accent-orange font-retro mb-4">
                  Hello, I'm Nico
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  I'm a collaborative web developer with a passion for fostering teamwork and delivering results.
                  With experience in both custom code and CMS solutions, I thrive in dynamic environments where
                  I can leverage my strong communication skills to bridge the gap between technical and
                  non-technical stakeholders.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  I have a keen interest in tech and enjoy staying current with industry trends to deliver
                  innovative solutions. My diverse background enables me to adapt quickly and contribute
                  across different areas of tech and digital innovation.
                </p>
              </div>

              {/* Location & Contact */}
              <div className={`pixel-card-green transition-all duration-700 ${contentVisible[1]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}>
                <h4 className="text-lg font-bold text-accent-green font-tech mb-3">
                  Based in Glasgow, UK
                </h4>
                <p className="text-text-secondary text-sm">
                  Available for remote work and local collaborations
                </p>
              </div>
            </div>

            {/* Right Column - Experience Highlights */}
            <div className="space-y-6">
              {/* Current Role */}
              <div className={`pixel-card transition-all duration-700 ${contentVisible[2]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-accent-orange font-tech">
                    WordPress Developer
                  </h4>
                  <span className="text-xs text-accent-green font-tech bg-accent-green/20 px-2 py-1 rounded border border-accent-green/30">
                    CURRENT
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-2">
                  Scoot Digital • Aug 2024 - Dec 2024
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Developing custom WordPress themes with ACF and Timber, creating intuitive
                  content management solutions for diverse clients.
                </p>
              </div>

              {/* Key Experience */}
              <div className={`pixel-card-green transition-all duration-700 ${contentVisible[3]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}>
                <h4 className="text-lg font-bold text-accent-green font-tech mb-3">
                  Experience Highlights
                </h4>
                <ul className="space-y-2 text-text-secondary text-sm">
                  <li className="flex items-start">
                    <span className="text-accent-green mr-2 font-tech">▸</span>
                    <span>5+ years in web development across multiple industries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-green mr-2 font-tech">▸</span>
                    <span>Full-stack experience with modern frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-green mr-2 font-tech">▸</span>
                    <span>Strong background in team collaboration and stakeholder communication</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-green mr-2 font-tech">▸</span>
                    <span>Apprenticeship to senior developer progression</span>
                  </li>
                </ul>
              </div>

              {/* Personal Interests */}
              <div className={`pixel-card transition-all duration-700 ${contentVisible[4]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}>
                <h4 className="text-lg font-bold text-accent-orange font-tech mb-3">
                  Beyond Code
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  I'm passionate about retro technology - tinkering with analogue gadgets like record players
                  and CRT TVs. I enjoy reading political philosophy and horror books (big fan of Alasdair Grey),
                  and I'm currently learning 3D modeling with Blender.
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack Preview */}
          <div
            ref={techStackRef}
            className={`mt-16 text-center transition-all duration-700 ${techStackVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}
          >
            <h3 className="text-2xl font-bold text-accent-orange font-retro mb-6">
              Core Technologies
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'HTML/CSS/JavaScript',
                'React & Next.js',
                'PHP & Symfony',
                'WordPress & ACF',
                'C# & .NET Core',
                'SQL Databases'
              ].map((tech, index) => (
                <span
                  key={tech}
                  className={`bg-accent-orange/20 border border-accent-orange/30 text-accent-orange px-3 py-1 rounded-lg font-tech text-sm hover:bg-accent-orange/30 transition-all duration-300 relative ${techStackVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                    }`}
                  style={{
                    transitionDelay: techStackVisible ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};