import React, { useState, useRef, useEffect } from 'react';
import { performanceMonitor } from '../../utils/performance';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage Component
 * 
 * Implements lazy loading with pixel-style placeholders and WebP optimization
 * Features:
 * - Intersection Observer for lazy loading
 * - WebP format with fallback
 * - Pixel-style loading animation
 * - Blur-up effect
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder: _placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced WebP optimization with multiple formats and sizes
  const getOptimizedSrc = (originalSrc: string, width?: number): string => {
    if (!originalSrc) return '';
    
    // Check if it's already WebP
    if (originalSrc.includes('.webp')) return originalSrc;
    
    // For local images, try to use WebP version with size optimization
    if (originalSrc.startsWith('/') || originalSrc.startsWith('./')) {
      let webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Add responsive sizing if width is provided
      if (width) {
        const separator = webpSrc.includes('?') ? '&' : '?';
        webpSrc += `${separator}w=${width}&q=80&f=webp`;
      }
      
      return webpSrc;
    }
    
    // For external images, try to add WebP format parameter
    if (originalSrc.includes('unsplash.com') || originalSrc.includes('cloudinary.com')) {
      const separator = originalSrc.includes('?') ? '&' : '?';
      return `${originalSrc}${separator}fm=webp&q=80${width ? `&w=${width}` : ''}`;
    }
    
    // For other external images, try to append WebP parameters
    if (originalSrc.startsWith('http')) {
      const separator = originalSrc.includes('?') ? '&' : '?';
      return `${originalSrc}${separator}format=webp&quality=80${width ? `&width=${width}` : ''}`;
    }
    
    return originalSrc;
  };

  // Generate responsive srcSet for different screen densities
  const generateSrcSet = (originalSrc: string): string => {
    if (!originalSrc || originalSrc.includes('data:')) return '';
    
    const sizes = [400, 800, 1200, 1600];
    const srcSet = sizes.map(size => {
      const optimizedSrc = getOptimizedSrc(originalSrc, size);
      return `${optimizedSrc} ${size}w`;
    }).join(', ');
    
    return srcSet;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    
    // Track image loading performance
    performanceMonitor.trackAnimationPerformance('image-load', () => {
      console.log(`Image loaded: ${src}`);
    });
    
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    console.warn(`Failed to load image: ${src}`);
    onError?.();
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Enhanced pixel-style placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-primary-bg-light flex items-center justify-center overflow-hidden">
          {/* Animated pixel grid background */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-16 gap-px h-full w-full">
              {Array.from({ length: 256 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-accent-orange animate-pulse"
                  style={{
                    animationDelay: `${(i % 16) * 50 + Math.floor(i / 16) * 25}ms`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Central loading indicator */}
          <div className="relative z-10">
            {/* Pixel loading animation */}
            <div className="grid grid-cols-8 gap-1 opacity-80 mb-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-accent-orange animate-pulse"
                  style={{
                    animationDelay: `${(i % 8) * 100 + Math.floor(i / 8) * 50}ms`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
            </div>
            
            {/* Loading text with typewriter effect */}
            <div className="text-center">
              <span className="font-tech text-text-secondary text-sm animate-pulse">
                [LOADING_IMAGE...]
              </span>
              <div className="mt-2 flex justify-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-accent-green animate-bounce"
                    style={{
                      animationDelay: `${i * 200}ms`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Scanning line effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-accent-orange to-transparent opacity-60 animate-scan"
              style={{
                animation: 'scan 3s linear infinite'
              }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-primary-bg-light flex items-center justify-center">
          <div className="text-center">
            <div className="font-tech text-red-400 text-sm mb-2">
              [IMAGE_ERROR]
            </div>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-red-400/30"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced responsive image with multiple formats */}
      {isInView && (
        <picture>
          {/* WebP format with responsive sizes */}
          <source 
            srcSet={generateSrcSet(src)} 
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            type="image/webp" 
          />
          {/* AVIF format for modern browsers (even better compression) */}
          <source 
            srcSet={generateSrcSet(src.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif'))} 
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            type="image/avif" 
          />
          {/* Fallback to original format */}
          <img
            ref={imgRef}
            src={getOptimizedSrc(src)}
            srcSet={generateSrcSet(src)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={alt}
            className={`
              w-full h-full object-cover transition-all duration-700
              ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105 blur-sm'}
            `}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};