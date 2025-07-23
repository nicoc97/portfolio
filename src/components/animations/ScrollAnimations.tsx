import React from 'react';
import { useScrollAnimation, useStaggeredAnimation, useSectionTransition } from '../../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  sectionId?: string;
  animationType?: 'fade' | 'slide' | 'scale' | 'pixel';
  delay?: number;
}

/**
 * Wrapper component for animated sections
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  sectionId,
  animationType = 'slide',
  delay = 0
}) => {
  const { ref, animationClasses } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    animationType,
    delay
  });

  const { ref: transitionRef, transitionStyle } = useSectionTransition<HTMLDivElement>();

  return (
    <div
      ref={sectionId ? transitionRef : ref}
      className={`${animationClasses} ${className}`}
      style={sectionId ? transitionStyle : undefined}
    >
      {children}
    </div>
  );
};

interface StaggeredListProps {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  animationType?: 'fade' | 'slide' | 'scale' | 'pixel';
}

/**
 * Component for staggered list animations
 */
export const StaggeredList: React.FC<StaggeredListProps> = ({
  items,
  className = '',
  itemClassName = '',
  staggerDelay = 100,
  animationType = 'slide'
}) => {
  const { triggerRef, getStaggeredClasses } = useStaggeredAnimation<HTMLDivElement>(
    items.length,
    staggerDelay,
    { threshold: 0.2 }
  );

  return (
    <div ref={triggerRef} className={className}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${getStaggeredClasses(index, animationType)} ${itemClassName}`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  effect?: 'materialize' | 'glitch' | 'fade';
  delay?: number;
}

/**
 * Simple scroll reveal component with pixel effects
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  effect = 'materialize',
  delay = 0
}) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold,
    rootMargin,
    delay
  });

  const getEffectClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';

    switch (effect) {
      case 'glitch':
        return `${baseClasses} ${isVisible
          ? 'opacity-100 translate-x-0 scale-100'
          : 'opacity-0 translate-x-1 scale-98'
          }`;
      case 'fade':
        return `${baseClasses} ${isVisible
          ? 'opacity-100'
          : 'opacity-0'
          }`;
      default: // materialize
        return `${baseClasses} ${isVisible
          ? 'opacity-100 translate-y-0 scale-100 blur-none'
          : 'opacity-0 translate-y-4 scale-95 blur-sm'
          }`;
    }
  };

  return (
    <div ref={ref} className={className}>
      <div className={getEffectClasses()}>
        {children}
      </div>
    </div>
  );
};

interface SectionTransitionProps {
  children: React.ReactNode;
  sectionId: string;
  className?: string;
  showDivider?: boolean;
}

/**
 * Section with smooth transitions and optional dividers
 */
export const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  sectionId,
  className = '',
  showDivider = false
}) => {
  const { ref, transitionStyle } = useSectionTransition<HTMLElement>();

  return (
    <>
      {showDivider && (
        <div className="flex justify-center items-center py-8">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent-orange to-transparent" />
        </div>
      )}
      <section
        ref={ref}
        id={sectionId}
        className={className}
        style={transitionStyle}
      >
        {children}
      </section>
    </>
  );
};