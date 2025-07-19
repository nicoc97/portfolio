import React, { useState, useMemo } from 'react';
import { TechBadge } from '../ui/TechBadge';
import { techSkills, skillCategories, getSkillsByCategory } from '../../constants/skills';
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

  // Simplified skill relationships
  const getRelatedSkills = (skill: TechSkill): string[] => {
    const relationships: Record<string, string[]> = {
      'React': ['TypeScript', 'JavaScript', 'Tailwind'],
      'TypeScript': ['React', 'JavaScript', 'Node.js'],
      'JavaScript': ['React', 'TypeScript', 'Node.js'],
      'Node.js': ['JavaScript', 'TypeScript', 'MongoDB'],
      'Python': ['Pandas', 'NumPy', 'Scikit-learn'],
      'Docker': ['Linux', 'AWS'],
      'Tailwind': ['CSS3', 'React'],
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
    <section className={`py-16 px-4 ${className} relative overflow-hidden`} id="skills">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-start pt-[2rem] pr-[2rem] justify-end opacity-5 pointer-events-none">
        <span className="text-[12rem] md:text-[15rem] lg:text-[18rem] font-bold text-accent-green font-retro leading-none">03</span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-accent-orange font-retro mb-4">
            SKILLS
          </h2>
          <div className="mx-auto w-16 h-px bg-accent-orange mb-6"></div>
          <p className="text-accent-orange font-tech text-lg mb-4">
            Interactive Tech Stack
          </p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">
            Explore my technical skills and expertise across web development and data science
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`
              px-4 py-2 rounded-lg font-tech text-sm border-2 transition-all duration-200
              ${selectedCategory === 'all'
                ? 'bg-accent-orange text-primary-bg border-accent-orange shadow-lg'
                : 'bg-transparent text-text-secondary border-text-secondary/30 hover:border-accent-orange hover:text-accent-orange'
              }
            `}
          >
            All Skills ({techSkills.length})
          </button>
          {skillCategories.map((category) => {
            const categorySkills = getSkillsByCategory(category.key);
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`
                  px-4 py-2 rounded-lg font-tech text-sm border-2 transition-all duration-200
                  ${selectedCategory === category.key
                    ? `bg-${category.color} text-primary-bg border-${category.color} shadow-lg`
                    : `bg-transparent text-text-secondary border-text-secondary/30 hover:border-${category.color} hover:text-${category.color}`
                  }
                `}
              >
                {category.label} ({categorySkills.length})
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              onMouseEnter={() => handleSkillHover(skill)}
              onMouseLeave={() => handleSkillHover(null)}
              className={`
                transition-all duration-300
                ${isSkillHighlighted(skill) ? 'scale-105 z-10' : ''}
                ${!hoveredSkill || isSkillHighlighted(skill) ? 'opacity-100' : 'opacity-50'}
              `}
            >
              <TechBadge
                skill={skill}
                onClick={() => handleSkillClick(skill)}
                className={`
                  w-full transition-all duration-300
                  ${selectedSkill?.name === skill.name ? 'ring-2 ring-offset-2 ring-offset-primary-bg ring-accent-orange' : ''}
                `}
                showTooltip={!selectedSkill}
              />
            </div>
          ))}
        </div>

        {/* Progressive Disclosure - Detailed Skill Information */}
        {selectedSkill && (
          <div className="bg-primary-bg-light border-2 border-accent-green rounded-lg p-6 animate-pixel-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-green text-primary-bg rounded-lg flex items-center justify-center text-xl font-bold border-2 border-accent-green-soft">
                  {selectedSkill.pixelIcon}
                </div>
                <div>
                  <h3 className="text-2xl font-retro text-accent-green mb-1">
                    {selectedSkill.name}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-accent-green text-lg">
                      {'★'.repeat(selectedSkill.proficiency)}{'☆'.repeat(5 - selectedSkill.proficiency)}
                    </span>
                    <span className="px-2 py-1 bg-accent-green/20 border border-accent-green rounded text-xs font-tech text-accent-green">
                      {selectedSkill.category.toUpperCase()}
                    </span>
                  </div>
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
                        className="px-3 py-1 bg-transparent border border-text-secondary/30 rounded text-xs font-tech text-text-secondary hover:border-accent-green hover:text-accent-green transition-colors duration-200"
                      >
                        {relatedSkillName}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Skills Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          {skillCategories.map((category) => {
            const categorySkills = getSkillsByCategory(category.key);
            const avgProficiency = categorySkills.reduce((sum, skill) => sum + skill.proficiency, 0) / categorySkills.length;
            
            return (
              <div
                key={category.key}
                className="bg-primary-bg-light border-2 border-text-secondary/20 rounded-lg p-4 text-center hover:border-accent-green transition-colors duration-300"
              >
                <h3 className="font-tech text-accent-green text-sm mb-2">{category.label}</h3>
                <div className="text-2xl font-retro text-text-primary mb-1">{categorySkills.length}</div>
                <div className="text-xs text-text-secondary font-mono">
                  Avg: {avgProficiency.toFixed(1)}/5.0
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};