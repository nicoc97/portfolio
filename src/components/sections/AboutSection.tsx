import React from 'react';

/**
 * AboutSection Component
 * 
 * Personal introduction section with clean typography and pixel decorative elements.
 * Features scroll-triggered animations and proper content hierarchy.
 */
export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-primary-bg relative overflow-hidden min-h-screen">
      <div className="container mx-auto mobile-padding">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-accent-orange font-retro mb-4">
              ABOUT
            </h2>
            <div className="mx-auto w-16 h-px bg-accent-orange mb-6"></div>
            <p className="text-accent-orange font-tech text-lg">
              Collaborative Web Developer
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Introduction */}
            <div className="space-y-6">
              <div className="pixel-card">
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
              <div className="pixel-card-green">
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
              <div className="pixel-card">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-accent-orange font-tech">
                    WordPress Developer
                  </h4>
                  <span className="text-xs text-accent-green font-tech">
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
              <div className="pixel-card-green">
                <h4 className="text-lg font-bold text-accent-green font-tech mb-3">
                  Experience Highlights
                </h4>
                <ul className="space-y-2 text-text-secondary text-sm">
                  <li className="flex items-start">
                    <span className="text-accent-green mr-2">▸</span>
                    <span>5+ years in web development across multiple industries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-green mr-2">▸</span>
                    <span>Full-stack experience with modern frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-green mr-2">▸</span>
                    <span>Strong background in team collaboration and stakeholder communication</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-green mr-2">▸</span>
                    <span>Apprenticeship to senior developer progression</span>
                  </li>
                </ul>
              </div>

              {/* Personal Interests */}
              <div className="pixel-card">
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
          <div className="mt-16 text-center">
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
              ].map((tech) => (
                <span 
                  key={tech}
                  className="bg-accent-orange/20 border border-accent-orange/30 text-accent-orange px-3 py-1 rounded-lg font-tech text-sm hover:bg-accent-orange/30 transition-colors duration-200"
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