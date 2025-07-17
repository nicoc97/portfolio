import React from 'react';
import type { PixelButtonProps } from '../../types';

/**
 * Simple PixelButton Component
 * 
 * A clean button component with pixel-style aesthetics.
 */
export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  disabled = false,
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-accent-orange/20 border-accent-orange/30 text-accent-orange hover:bg-accent-orange/30',
    secondary: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
    ghost: 'bg-transparent border-accent-orange/20 text-accent-orange hover:bg-accent-orange/10',
    success: 'bg-accent-green/20 border-accent-green/30 text-accent-green hover:bg-accent-green/30'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`
        pixel-button
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};