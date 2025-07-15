import React, { useState } from 'react';
import type { TechBadgeProps } from '../../types';

export const TechBadge: React.FC<TechBadgeProps> = ({ skill, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const proficiencyStars = '★'.repeat(skill.proficiency) + '☆'.repeat(5 - skill.proficiency);

  const categoryColors = {
    frontend: 'border-accent-orange bg-accent-orange-dark',
    backend: 'border-accent-green bg-accent-green-dark',
    data: 'border-accent-green bg-accent-green-dark',
    tools: 'border-accent-green-soft bg-accent-green-dark'
  };

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200 px-4 py-2 rounded-full border-2
        ${categoryColors[skill.category]}
        ${isHovered ? 'scale-105 shadow-lg ' + (skill.category === 'backend' || skill.category === 'data' || skill.category === 'tools' ? 'shadow-accent-green/20' : 'shadow-accent-orange/20') : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Tech icon placeholder */}
      <div className="flex items-center space-x-2">
        <div className={`w-6 h-6 text-primary-bg flex items-center justify-center font-tech text-xs rounded-full ${
          skill.category === 'backend' || skill.category === 'data' || skill.category === 'tools' 
            ? 'bg-accent-green' 
            : 'bg-accent-orange'
        }`}>
          {skill.pixelIcon}
        </div>
        <span className="font-tech text-sm">{skill.name}</span>
      </div>

      {/* Hover tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
          <div className={`bg-primary-bg-light border-2 px-3 py-2 text-xs font-tech whitespace-nowrap rounded-lg ${
            skill.category === 'backend' || skill.category === 'data' || skill.category === 'tools' 
              ? 'border-accent-green' 
              : 'border-accent-orange'
          }`}>
            <div className={`mb-1 ${
              skill.category === 'backend' || skill.category === 'data' || skill.category === 'tools' 
                ? 'text-accent-green' 
                : 'text-accent-orange'
            }`}>{skill.name}</div>
            <div className={`text-xs ${
              skill.category === 'backend' || skill.category === 'data' || skill.category === 'tools' 
                ? 'text-accent-green' 
                : 'text-accent-orange'
            }`}>{proficiencyStars}</div>
            {skill.description && (
              <div className="text-text-secondary mt-1 max-w-32 text-wrap">
                {skill.description}
              </div>
            )}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className={`w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
              skill.category === 'backend' || skill.category === 'data' || skill.category === 'tools' 
                ? 'border-t-accent-green' 
                : 'border-t-accent-orange'
            }`}></div>
          </div>
        </div>
      )}
    </div>
  );
};