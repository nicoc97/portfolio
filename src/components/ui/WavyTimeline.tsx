import React, { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface TimelineItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  color: 'orange' | 'green' | 'blue';
}

const timelineData: TimelineItem[] = [
  {
    id: '1',
    company: 'Scoot Digital',
    role: 'WordPress Developer',
    period: 'Aug 2024 — Dec 2024',
    location: 'Glasgow',
    description: 'Developed custom WordPress themes with ACF and Timber, creating intuitive content management solutions.',
    highlights: [
      'Custom WordPress themes with high customisation',
      'Advanced Custom Fields integration',
      'Timber and Twig templating',
      'Cross-browser compatibility testing'
    ],
    color: 'orange'
  },
  {
    id: '2',
    company: 'Target Healthcare',
    role: 'Web Developer',
    period: 'Oct 2023 — Jun 2024',
    location: 'Glasgow',
    description: 'Designed high-performance websites and web applications prioritizing user experience and functionality.',
    highlights: [
      'Responsive web development with HTML, CSS, JavaScript',
      'PHP with Symfony framework',
      'WordPress custom solutions',
      'Database and API integration'
    ],
    color: 'green'
  },
  {
    id: '3',
    company: 'Arnold Clark',
    role: 'Web Developer',
    period: 'Nov 2019 — Aug 2022',
    location: 'Glasgow',
    description: 'Collaborated with cross-functional teams to deliver high-quality software solutions using C# and .NET Core.',
    highlights: [
      'C# and .NET Core development',
      'SQL Server database management',
      'Cross-functional team collaboration',
      'Stakeholder communication'
    ],
    color: 'blue'
  },
  {
    id: '4',
    company: 'Disabled Access Holidays',
    role: 'Web Designer & Digital Marketer',
    period: 'Nov 2016 — Apr 2019',
    location: 'Glasgow',
    description: 'Apprentice role focusing on web design, digital marketing, and customer interaction.',
    highlights: [
      'Web design and development',
      'Digital marketing campaigns',
      'Customer interaction and support',
      'Marketing strategy development'
    ],
    color: 'orange'
  }
];

export const WavyTimeline: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { ref: timelineRef, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: false
  });

  // Generate wavy path with multiple sine waves for more organic feel
  const generateWavyPath = (width: number, height: number) => {
    const amplitude1 = 25;
    const amplitude2 = 15;
    const frequency1 = 0.008;
    const frequency2 = 0.015;
    const points: string[] = [];
    
    for (let x = 0; x <= width; x += 8) {
      const wave1 = Math.sin(x * frequency1) * amplitude1;
      const wave2 = Math.sin(x * frequency2 + Math.PI / 4) * amplitude2;
      const y = height / 2 + wave1 + wave2;
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(' L ')}`;
  };

  // Generate vertical path for mobile
  const generateVerticalPath = (width: number, height: number) => {
    const x = width / 2;
    return `M ${x},0 L ${x},${height}`;
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const svg = svgRef.current;
    const rect = container.getBoundingClientRect();
    const path = svg.querySelector('.wavy-path') as SVGPathElement;
    const mobilePath = svg.querySelector('.mobile-path') as SVGPathElement;
    
    if (path) {
      const wavyPath = generateWavyPath(rect.width, rect.height);
      path.setAttribute('d', wavyPath);
    }
    
    if (mobilePath) {
      const verticalPath = generateVerticalPath(rect.width, rect.height);
      mobilePath.setAttribute('d', verticalPath);
    }
  }, [isVisible]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          dot: 'bg-accent-orange border-accent-orange shadow-accent-orange/30',
          text: 'text-accent-orange',
          border: 'border-accent-orange/20 hover:border-accent-orange/40',
          shadow: 'shadow-accent-orange/10',
          gradient: '#ff6b35'
        };
      case 'green':
        return {
          dot: 'bg-accent-green border-accent-green shadow-accent-green/30',
          text: 'text-accent-green',
          border: 'border-accent-green/20 hover:border-accent-green/40',
          shadow: 'shadow-accent-green/10',
          gradient: '#4ade80'
        };
      case 'blue':
        return {
          dot: 'bg-blue-400 border-blue-400 shadow-blue-400/30',
          text: 'text-blue-400',
          border: 'border-blue-400/20 hover:border-blue-400/40',
          shadow: 'shadow-blue-400/10',
          gradient: '#60a5fa'
        };
      default:
        return {
          dot: 'bg-text-primary border-text-primary shadow-text-primary/30',
          text: 'text-text-primary',
          border: 'border-text-primary/20 hover:border-text-primary/40',
          shadow: 'shadow-text-primary/10',
          gradient: '#ffffff'
        };
    }
  };

  return (
    <div 
      ref={timelineRef}
      className={`mt-32 animate-slide-up ${isVisible ? 'visible' : ''} w-full overflow-hidden`}
    >
      {/* Mobile Layout - Vertical Timeline */}
      <div className="lg:hidden">
        <div ref={containerRef} className="relative">
          {/* Vertical line for mobile */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-orange via-accent-green to-blue-400 opacity-30"></div>
          
          {/* Timeline Items - Vertical Layout */}
          <div className="relative space-y-8 py-8">
            {timelineData.map((item) => {
              const colors = getColorClasses(item.color);
              const isActive = activeItem === item.id;
              
              return (
                <div
                  key={item.id}
                  className="relative flex items-start gap-6"
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  {/* Timeline Dot */}
                  <div className={`relative flex-shrink-0 w-4 h-4 rounded-full border-2 ${colors.dot} shadow-lg transition-all duration-300 timeline-dot-pulse ${isActive ? 'scale-125' : ''} ml-6 mt-6`} />
                  
                  {/* Content Card */}
                  <div className={`flex-1 bg-primary-bg/80 backdrop-blur-sm border ${colors.border} ${colors.shadow} rounded-lg p-4 shadow-lg transition-all duration-300 ${isActive ? 'scale-105' : ''}`}>
                    <div className="mb-3">
                      <h4 className={`font-bold ${colors.text} font-tech text-xs uppercase tracking-wide mb-1`}>
                        {item.company}
                      </h4>
                      <h5 className="text-text-primary font-retro text-base font-bold mb-2">
                        {item.role}
                      </h5>
                      <p className="text-text-secondary text-xs mb-1">
                        {item.period}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {item.location}
                      </p>
                    </div>
                    
                    <p className="text-text-secondary text-xs mb-3 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="space-y-1">
                      {item.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="text-xs text-text-secondary flex items-start">
                          <span className={`${colors.text} mr-2 mt-0.5`}>•</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                      {item.highlights.length > 2 && (
                        <div className="text-xs text-text-secondary/70 mt-2">
                          +{item.highlights.length - 2} more...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Wavy Timeline */}
      <div className="hidden lg:block">
        <div ref={containerRef} className="relative">
          {/* SVG Wave Background */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ height: '400px' }}
            preserveAspectRatio="none"
          >
            <path
              className="wavy-path"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
              style={{ animationDelay: '0.5s' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="33%" stopColor="#4ade80" />
                <stop offset="66%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#ff6b35" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timeline Items - Desktop Grid Layout */}
          <div className="relative grid grid-cols-4 gap-6 lg:gap-8 py-8">
            {timelineData.map((item, index) => {
              const colors = getColorClasses(item.color);
              const isActive = activeItem === item.id;
              
              return (
                <div
                  key={item.id}
                  className={`relative ${index % 2 === 0 ? 'mt-0' : 'mt-16'}`}
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 ${colors.dot} shadow-lg transition-all duration-300 timeline-dot-pulse ${isActive ? 'scale-125' : ''}`} />
                  
                  {/* Content Card */}
                  <div className={`bg-primary-bg/80 backdrop-blur-sm border ${colors.border} ${colors.shadow} rounded-lg p-4 lg:p-6 shadow-lg transition-all duration-300 hover:scale-105 timeline-card-float ${isActive ? 'scale-105' : ''}`}>
                    <div className="mb-4">
                      <h4 className={`font-bold ${colors.text} font-tech text-xs lg:text-sm uppercase tracking-wide mb-1`}>
                        {item.company}
                      </h4>
                      <h5 className="text-text-primary font-retro text-base lg:text-lg font-bold mb-2">
                        {item.role}
                      </h5>
                      <p className="text-text-secondary text-xs lg:text-sm mb-1">
                        {item.period}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {item.location}
                      </p>
                    </div>
                    
                    <p className="text-text-secondary text-xs lg:text-sm mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="space-y-1">
                      {item.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="text-xs text-text-secondary flex items-start">
                          <span className={`${colors.text} mr-2 mt-0.5`}>•</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                      {item.highlights.length > 2 && (
                        <div className="text-xs text-text-secondary/70 mt-2">
                          +{item.highlights.length - 2} more...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};