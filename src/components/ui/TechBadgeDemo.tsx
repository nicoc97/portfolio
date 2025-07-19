import React from 'react';
import { TechBadge } from './TechBadge';
import { techSkills, skillCategories } from '../../constants/skills';

/**
 * Demo component to showcase TechBadge functionality
 * This component demonstrates all the features of the TechBadge component
 */
export const TechBadgeDemo: React.FC = () => {
  const handleBadgeClick = (skillName: string) => {
    console.log(`Clicked on ${skillName} skill badge`);
  };

  return (
    <div className="p-8 bg-primary-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-retro text-accent-orange mb-8 text-center">
          TechBadge Component Demo
        </h1>
        
        {/* Skills by Category */}
        {skillCategories.map((category) => {
          const categorySkills = techSkills.filter(skill => skill.category === category.key);
          
          return (
            <div key={category.key} className="mb-12">
              <h2 className="text-2xl font-tech text-text-primary mb-6 border-b-2 border-accent-green pb-2">
                {category.label} ({categorySkills.length} skills)
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categorySkills.map((skill) => (
                  <TechBadge
                    key={skill.name}
                    skill={skill}
                    onClick={() => handleBadgeClick(skill.name)}
                    animated={true}
                    showTooltip={true}
                    className="justify-self-start"
                  />
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Demo Section: Different States */}
        <div className="mt-16 p-6 bg-primary-bg-light rounded-lg border-2 border-accent-green">
          <h2 className="text-xl font-tech text-accent-green mb-4">
            Component States Demo
          </h2>
          
          <div className="space-y-4">
            {/* Without tooltip */}
            <div>
              <h3 className="text-sm font-tech text-text-secondary mb-2">Without Tooltip:</h3>
              <TechBadge
                skill={techSkills[0]}
                showTooltip={false}
                animated={false}
              />
            </div>
            
            {/* Without animation */}
            <div>
              <h3 className="text-sm font-tech text-text-secondary mb-2">Without Animation:</h3>
              <TechBadge
                skill={techSkills[1]}
                animated={false}
                showTooltip={true}
              />
            </div>
            
            {/* Clickable */}
            <div>
              <h3 className="text-sm font-tech text-text-secondary mb-2">Clickable (check console):</h3>
              <TechBadge
                skill={techSkills[2]}
                onClick={() => handleBadgeClick(techSkills[2].name)}
                animated={false}
                showTooltip={true}
              />
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 p-4 bg-accent-orange-dark/20 border-2 border-accent-orange rounded-lg">
          <h3 className="text-lg font-tech text-accent-orange mb-2">
            How to Test:
          </h3>
          <ul className="text-sm font-mono text-text-secondary space-y-1">
            <li>• Hover over badges to see tooltips with proficiency and descriptions</li>
            <li>• Use Tab key to navigate between clickable badges</li>
            <li>• Press Enter or Space on focused badges to trigger click events</li>
            <li>• Notice the pixel-style animations and category-based colors</li>
            <li>• Scroll to see animation effects on badges</li>
          </ul>
        </div>
      </div>
    </div>
  );
};