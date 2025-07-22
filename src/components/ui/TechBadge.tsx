import React, { useState, useRef, useEffect } from 'react';
import type { TechBadgeProps } from '../../types';

export const TechBadge: React.FC<TechBadgeProps> = ({ 
  skill, 
  onClick, 
  className = '',
  animated = true,
  showTooltip = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(!animated);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    if (!animated || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (badgeRef.current) {
      observer.observe(badgeRef.current);
    }

    return () => observer.disconnect();
  }, [animated, isVisible]);

  const proficiencyStars = '★'.repeat(skill.proficiency) + '☆'.repeat(5 - skill.proficiency);
  const showTooltipState = showTooltip && (isHovered || isFocused);

  // Category-based styling with pixel aesthetic
  const getCategoryStyles = () => {
    switch (skill.category) {
      case 'frontend':
        return {
          border: 'border-accent-orange',
          bg: 'bg-accent-orange-dark/20',
          text: 'text-accent-orange',
          iconBg: 'bg-accent-orange',
          iconText: 'text-primary-bg',
          glow: 'shadow-accent-orange/30',
          tooltipBorder: 'border-accent-green',
          tooltipText: 'text-accent-orange'
        };
      case 'backend':
      case 'data':
      case 'tools':
      default:
        return {
          border: 'border-accent-green',
          bg: 'bg-accent-green-dark/20',
          text: 'text-accent-green',
          iconBg: 'bg-accent-green',
          iconText: 'text-primary-bg',
          glow: 'shadow-accent-green/30',
          tooltipBorder: 'border-accent-green',
          tooltipText: 'text-accent-green'
        };
    }
  };

  const styles = getCategoryStyles();

  // Pixel-style hover and focus effects
  const getInteractionClasses = () => {
    const isActive = isHovered || isFocused;
    return isActive 
      ? `scale-105 ${styles.glow} shadow-lg` 
      : '';
  };

  // Animation classes for scroll-triggered appearance
  const getAnimationClasses = () => {
    if (!animated) return '';
    return isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-4';
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      ref={badgeRef}
      className={`
        relative cursor-pointer font-tech select-none
        px-4 py-2 rounded-lg
        ${styles.border} ${styles.bg}
        ${getInteractionClasses()}
        ${getAnimationClasses()}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg
        ${skill.category === 'frontend' ? 'focus:ring-accent-orange' : 'focus:ring-accent-green'}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : 'presentation'}
      aria-label={`${skill.name} - ${skill.category} skill, proficiency ${skill.proficiency} out of 5`}
      aria-describedby={showTooltipState ? `tooltip-${skill.name.replace(/\s+/g, '-').toLowerCase()}` : undefined}
    >
      {/* Pixel art icon and skill name */}
      <div className="flex items-center space-x-3">
        {/* Pixel icon with enhanced styling */}
        <div 
          className={`
            w-8 h-8 flex items-center justify-center text-sm font-bold
            rounded border-2 ${styles.iconBg} ${styles.iconText}
            ${skill.category === 'frontend' ? 'border-accent-orange-soft' : 'border-accent-green-soft'}
            transition-transform duration-200
            ${isHovered || isFocused ? 'scale-110' : ''}
          `}
          aria-hidden="true"
        >
          {skill.pixelIcon}
        </div>
        
        {/* Skill name with pixel styling */}
        <span className={`text-sm font-medium ${styles.text} tracking-wide`}>
          {skill.name}
        </span>
      </div>

      {/* Enhanced tooltip with pixel styling */}
      {showTooltipState && (
        <div 
          id={`tooltip-${skill.name.replace(/\s+/g, '-').toLowerCase()}`}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-30"
          role="tooltip"
        >
          <div 
            className={`
              bg-primary-bg-light border-2 px-4 py-3 text-xs font-tech
              rounded-lg shadow-xl backdrop-blur-sm
              ${styles.tooltipBorder}
            `}
            style={{ minWidth: '200px', maxWidth: '280px' }}
          >
            {/* Skill name header */}
            <div className={`font-bold mb-2 ${styles.tooltipText} text-sm`}>
              {skill.name}
            </div>
            
            {/* Proficiency stars with pixel styling */}
            <div className={`mb-2 ${styles.tooltipText} text-lg tracking-wider`}>
              {proficiencyStars}
            </div>
            
            {/* Category badge */}
            <div className="mb-2">
              <span className={`
                inline-block px-2 py-1 text-xs rounded border
                ${styles.border} ${styles.bg} ${styles.text}
              `}>
                {skill.category.toUpperCase()}
              </span>
            </div>
            
            {/* Description */}
            {skill.description && (
              <div className="text-text-secondary text-xs leading-relaxed">
                {skill.description}
              </div>
            )}
          </div>
          
          {/* Pixel-styled tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div 
              className={`
                w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent
                ${skill.category === 'frontend' ? 'border-t-accent-orange' : 'border-t-accent-green'}
              `}
            />
          </div>
        </div>
      )}
    </div>
  );
};