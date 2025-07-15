import React, { useState } from 'react';
import type { PixelButtonProps } from '../../types';

/**
 * PixelButton Component
 * 
 * A reusable button component with pixel-style aesthetics and hover effects.
 * Used throughout the portfolio for CTAs, navigation, and interactive elements.
 * 
 * @param variant - Button style variant: 'primary' | 'secondary' | 'ghost'
 * @param size - Button size: 'sm' | 'md' | 'lg'
 * @param onClick - Click handler function
 * @param children - Button content (text, icons, etc.)
 * @param disabled - Whether button is disabled
 * @param className - Additional CSS classes
 * 
 * Styling:
 * - Uses 'font-tech' (Share Tech Mono) for text
 * - Pixel-style border and hover effects
 * - Green accent colors from design system
 * - Scale animation on press
 */
export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  disabled = false,
  className = ''
}) => {
  // Track pressed state for visual feedback
  const [isPressed, setIsPressed] = useState(false);

  // Base classes for all button variants (defined in index.css)
  const baseClasses = 'pixel-button relative overflow-hidden transition-all duration-200';
  
  // Variant-specific styling - Apple-style translucent
  const variantClasses = {
    primary: 'bg-accent-orange/20 backdrop-blur-md border-accent-orange/30 hover:bg-accent-orange/30 hover:border-accent-orange/50',
    secondary: 'bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 hover:border-white/30',
    ghost: 'bg-transparent backdrop-blur-md border-accent-orange/20 hover:bg-accent-orange/10 hover:border-accent-orange/40',
    success: 'bg-accent-green/20 backdrop-blur-md border-accent-green/30 hover:bg-accent-green/30 hover:border-accent-green/50'
  };

  // Size-specific padding and text sizing
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',    // Small buttons (badges, secondary actions)
    md: 'px-4 py-2 text-sm',    // Default size (most common)
    lg: 'px-6 py-3 text-base'   // Large buttons (primary CTAs)
  };

  // Disabled state styling
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed hover:bg-primary-bg-light hover:text-text-primary'
    : 'cursor-pointer';

  // Mouse event handlers for press effect
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${isPressed ? 'scale-95 shadow-inner' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Button text with tech font */}
      <span className="relative z-10 font-tech">
        {children}
      </span>
      
      {/* Pixel-style glow effect on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className={`absolute inset-0 border-2 animate-pixel-glow ${
          variant === 'success' ? 'border-accent-green' : 'border-accent-orange'
        }`}></div>
      </div>
    </button>
  );
};