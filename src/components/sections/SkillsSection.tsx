import React, { useState, useMemo } from 'react';
import { TechBadge } from '../ui/TechBadge';
import { techSkills, skillCategories, getSkillsByCategory } from '../../constants/skills';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';
import type { TechSkill } from '../../types';

interface SkillsSectionProps {
  className?: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<TechSkill['category'] | 'all'>('all');
  const [selectedSkill, setSelectedSkill] = useState<TechSkill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<TechSkill | null>(null);

  // Filter skills based on selected category
  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') {
      return techSkills;
    }
    return getSkillsByCategory(selectedCategory);
  }, [selectedCategory]);

  // Animation hooks with reverse animations
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    animationType: 'slide',
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 100
  });
  const { ref: filtersRef, isVisible: filtersVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
    delay: 200,
    animationType: 'pixel',
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 150
  });
  const { triggerRef: skillsGridRef, getStaggeredClasses } = useStaggeredAnimation<HTMLDivElement>(
    filteredSkills.length,
    50,
    { 
      threshold: 0.1,
      triggerOnce: false,
      reverseOnExit: true
    }
  );
  const { triggerRef: summaryRef, getStaggeredClasses: getSummaryClasses } = useStaggeredAnimation<HTMLDivElement>(
    skillCategories.length,
    100,
    { 
      threshold: 0.2,
      triggerOnce: false,
      reverseOnExit: true
    }
  );

  // Simplified skill relationships
  const getRelatedSkills = (skill: TechSkill): string[] => {
    const relationships: Record<string, string[]> = {
      'React': ['TypeScript', 'JavaScript', 'Next.js'],
      'Next.js': ['React', 'TypeScript', 'JavaScript'],
      'TypeScript': ['React', 'JavaScript', 'Next.js'],
      'JavaScript': ['React', 'TypeScript', 'HTML', 'CSS'],
      'HTML': ['CSS', 'JavaScript'],
      'CSS': ['HTML', 'JavaScript'],
      'PHP': ['Symfony', 'WordPress', 'SQL'],
      'Symfony': ['PHP', 'SQL Server'],
      'WordPress': ['PHP', 'ACF', 'Timber'],
      'ACF': ['WordPress', 'Timber'],
      'Timber': ['WordPress', 'ACF'],
      'C#': ['.NET Core', 'SQL Server'],
      '.NET Core': ['C#', 'SQL Server'],
      'SQL': ['SQL Server'],
      'SQL Server': ['SQL', 'C#', '.NET Core'],
    };
    return relationships[skill.name] || [];
  };

  const isSkillHighlighted = (skill: TechSkill): boolean => {
    if (!hoveredSkill) return false;
    if (hoveredSkill.name === skill.name) return true;

    const relatedSkills = getRelatedSkills(hoveredSkill);
    return relatedSkills.includes(skill.name);
  };

  const handleSkillClick = (skill: TechSkill) => {
    setSelectedSkill(selectedSkill?.name === skill.name ? null : skill);
  };

  const handleSkillHover = (skill: TechSkill | null) => {
    setHoveredSkill(skill);
  };

  return (
    <section className={`section-fullscreen py-16 ${className} relative overflow-hidden`} id="skills">
      <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
        
        {/* Large background text */}
        <div className="section-bg-text">
          <span>SEC04</span>
        </div>

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`mb-16 animate-slide-up ${headerVisible ? 'visible' : ''}`}
        >
          <h2 className="section-header">SKILLS</h2>
          <div className="section-divider mb-6"></div>
          <p className="section-subtitle mb-4">Interactive Tech Stack</p>
          <p className="text-text-secondary text-left text-sm leading-relaxed max-w-2xl">
            Explore my technical skills and expertise across web development and data science
          </p>
        </div>

        {/* Main Content Grid - Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Left Column - Filters (Staggered) */}
          <div className="lg:col-span-1 space-y-6 skills-decoration">
            <div
              ref={filtersRef}
              className={`animate-pixel ${filtersVisible ? 'visible' : ''}`}
            >              
              {/* filter buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`
                    w-full px-4 py-3 rounded-lg font-tech border-2 transition-all duration-200 text-left skills-filter-button
                    ${selectedCategory === 'all'
                      ? 'bg-accent-orange text-primary-bg border-accent-orange shadow-lg transform translate-x-2'
                      : 'tech-badge-secondary hover:translate-x-1'
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span>All Skills</span>
                    <span className="text-lg opacity-70">({techSkills.length})</span>
                  </div>
                </button>
                
                {skillCategories.map((category) => {
                  const categorySkills = getSkillsByCategory(category.key);
                  return (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`
                        w-full px-4 py-3 rounded-lg font-tech text-lg border-2 transition-all duration-200 text-left skills-filter-button
                        ${selectedCategory === category.key
                          ? `bg-${category.color} text-primary-bg border-${category.color} shadow-lg transform translate-x-2`
                          : `tech-badge-secondary hover:border-${category.color} hover:text-${category.color} hover:translate-x-1`
                        }
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.label}</span>
                        <span className="text-lg opacity-70">({categorySkills.length})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden lg:block space-y-4 mt-8">
              <div className="w-16 h-1 bg-accent-green/30 rounded"></div>
              <div className="w-12 h-1 bg-accent-orange/30 rounded ml-4"></div>
              <div className="w-8 h-1 bg-accent-green/20 rounded ml-8"></div>
            </div>
          </div>

          {/* Right Column - Skills Grid (Asymmetrical) */}
          <div className="lg:col-span-3 skills-grid-lines">
            <div ref={skillsGridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
              {filteredSkills.map((skill, index) => {
                // Create asymmetrical staggered positioning
                const isEven = index % 2 === 0;
                const colIndex = index % 4;
                
                return (
                  <div
                    key={skill.name}
                    onMouseEnter={() => handleSkillHover(skill)}
                    onMouseLeave={() => handleSkillHover(null)}
                    className={`
                      transition-all duration-300 skill-card-stagger
                      ${isSkillHighlighted(skill) ? 'scale-102 z-20' : ''}
                      ${!hoveredSkill || isSkillHighlighted(skill) ? 'opacity-100' : 'opacity-50'}
                      ${getStaggeredClasses(index, 'slide')}
                    `}
                    style={{
                      marginTop: `${isEven ? 0 : 12}px`,
                      marginLeft: `${colIndex * 2}px`,
                      animationDelay: `${index * 80}ms`
                    }}
                  >
                    <TechBadge
                      skill={skill}
                      onClick={() => handleSkillClick(skill)}
                      className={`
                        w-full transition-all duration-300
                        ${selectedSkill?.name === skill.name ? 'ring-2 ring-offset-2 ring-offset-primary-bg ring-accent-orange' : ''}
                        ${isEven ? 'hover:rotate-1' : 'hover:-rotate-1'}
                      `}
                      showTooltip={!selectedSkill}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progressive Disclosure - Detailed Skill Information */}
        {selectedSkill && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1"></div>
            <div className="lg:col-span-3">
              <div className="bg-primary-bg-light border-2 border-accent-green rounded-lg p-6 transform translate-x-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent-green text-primary-bg rounded-lg flex items-center justify-center text-xl font-bold border-2 border-accent-green-soft">
                      {selectedSkill.pixelIcon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-retro text-accent-green mb-1">
                        {selectedSkill.name}
                      </h3>
                      <span className="px-2 py-1 bg-accent-green/20 border border-accent-green rounded text-xs font-tech text-accent-green">
                        {selectedSkill.category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="text-text-secondary hover:text-accent-orange transition-colors duration-200 text-xl"
                    aria-label="Close skill details"
                  >
                    ×
                  </button>
                </div>

                {selectedSkill.description && (
                  <p className="text-text-secondary font-mono text-sm leading-relaxed mb-4">
                    {selectedSkill.description}
                  </p>
                )}

                {/* Related Skills */}
                {getRelatedSkills(selectedSkill).length > 0 && (
                  <div>
                    <h4 className="text-sm font-tech text-accent-green mb-2">Related Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {getRelatedSkills(selectedSkill).map((relatedSkillName) => {
                        const relatedSkill = techSkills.find(s => s.name === relatedSkillName);
                        return relatedSkill ? (
                          <button
                            key={relatedSkillName}
                            onClick={() => setSelectedSkill(relatedSkill)}
                            className="tech-badge-secondary text-xs hover:border-accent-green hover:text-accent-green"
                          >
                            {relatedSkillName}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Skills Summary - Asymmetrical Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="text-right lg:text-left">
              <h3 className="text-lg font-tech text-accent-orange mb-2">Tech Overview</h3>
              <div className="w-16 h-1 bg-accent-orange rounded ml-auto lg:ml-0"></div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div ref={summaryRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {skillCategories.map((category, index) => {
                const categorySkills = getSkillsByCategory(category.key);
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={category.key}
                    className={`
                      bg-primary-bg-light border-2 border-text-secondary/20 rounded-lg p-4 text-center 
                      hover:border-accent-green transition-all duration-300 
                      ${getSummaryClasses(index, 'slide')}
                      ${isEven ? 'hover:rotate-1' : 'hover:-rotate-1'}
                    `}
                    style={{
                      marginTop: `${isEven ? 0 : 16}px`,
                      marginLeft: `${index * 4}px`,
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    <h3 className="font-tech text-accent-green text-sm mb-2">{category.label}</h3>
                    <div className="text-2xl font-retro text-text-primary mb-1">{categorySkills.length}</div>
                    <div className="text-xs text-text-secondary font-mono">
                      Technologies
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};