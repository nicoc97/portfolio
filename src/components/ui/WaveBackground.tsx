import React from 'react';
import { motion } from 'framer-motion';
import { useParallaxScroll } from '../../hooks/useScrollAnimation';

/**
 * WaveBackground Component
 * 
 * Creates a smooth, groovy wave background with a 70s soul/funk vibe
 * featuring deep, symmetrical waves that flow horizontally across the screen
 */
export const WaveBackground = () => {
  // Generate unique IDs to avoid conflicts when component remounts
  const uniqueId = React.useId();
  
  // Parallax effects for each wave layer with intense speeds (negative for reverse effect)
  const wave1Parallax = useParallaxScroll(-0.6); // Background layer - dramatic movement
  const wave2Parallax = useParallaxScroll(-0.8); // Middle layer - more intense
  const wave3Parallax = useParallaxScroll(-1.2); // Foreground layer - most dramatic movement
  
  // Detect if we're on mobile/tablet
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // Tablets and below
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Wave paths for mobile (2 peaks) vs desktop (multiple peaks)
  const getWavePaths = (waveNumber: number): { initial: string; animate: string[] } => {
    if (isMobile) {
      // Simplified waves for mobile - only 2 peaks
      switch(waveNumber) {
        case 1:
          return {
            initial: "M0,130 Q360,90 720,130 T1440,130 L1440,320 Q1080,350 720,320 T0,320 Z",
            animate: [
              "M0,130 Q360,90 720,130 T1440,130 L1440,320 Q1080,350 720,320 T0,320 Z",
              "M0,160 Q360,120 720,160 T1440,160 L1440,300 Q1080,330 720,300 T0,300 Z",
              "M0,130 Q360,170 720,130 T1440,130 L1440,320 Q1080,290 720,320 T0,320 Z",
              "M0,110 Q360,150 720,110 T1440,110 L1440,340 Q1080,310 720,340 T0,340 Z",
              "M0,130 Q360,90 720,130 T1440,130 L1440,320 Q1080,350 720,320 T0,320 Z"
            ]
          };
        case 2:
          return {
            initial: "M0,140 Q480,100 960,140 T1440,140 L1440,350 Q960,380 480,350 T0,350 Z",
            animate: [
              "M0,140 Q480,100 960,140 T1440,140 L1440,350 Q960,380 480,350 T0,350 Z",
              "M0,120 Q480,160 960,120 T1440,120 L1440,330 Q960,300 480,330 T0,330 Z",
              "M0,160 Q480,120 960,160 T1440,160 L1440,370 Q960,340 480,370 T0,370 Z",
              "M0,130 Q480,170 960,130 T1440,130 L1440,340 Q960,310 480,340 T0,340 Z",
              "M0,140 Q480,100 960,140 T1440,140 L1440,350 Q960,380 480,350 T0,350 Z"
            ]
          };
        case 3:
          return {
            initial: "M0,170 Q720,140 1440,170 L1440,370 Q720,400 0,370 Z",
            animate: [
              "M0,170 Q720,140 1440,170 L1440,370 Q720,400 0,370 Z",
              "M0,185 Q720,155 1440,185 L1440,355 Q720,385 0,355 Z",
              "M0,160 Q720,190 1440,160 L1440,380 Q720,350 0,380 Z",
              "M0,175 Q720,205 1440,175 L1440,365 Q720,335 0,365 Z",
              "M0,170 Q720,140 1440,170 L1440,370 Q720,400 0,370 Z"
            ]
          };
      }
    } else {
      // Desktop waves - multiple peaks as before
      switch(waveNumber) {
        case 1:
          return {
            initial: "M0,100 Q120,50 240,100 T480,100 T720,100 T960,100 T1200,100 T1440,100 L1440,320 Q1320,350 1200,320 T960,320 T720,320 T480,320 T240,320 T0,320 Z",
            animate: [
              "M0,100 Q120,50 240,100 T480,100 T720,100 T960,100 T1200,100 T1440,100 L1440,320 Q1320,350 1200,320 T960,320 T720,320 T480,320 T240,320 T0,320 Z",
              "M0,140 Q120,90 240,140 T480,140 T720,140 T960,140 T1200,140 T1440,140 L1440,300 Q1320,330 1200,300 T960,300 T720,300 T480,300 T240,300 T0,300 Z",
              "M0,100 Q120,150 240,100 T480,100 T720,100 T960,100 T1200,100 T1440,100 L1440,320 Q1320,290 1200,320 T960,320 T720,320 T480,320 T240,320 T0,320 Z",
              "M0,80 Q120,130 240,80 T480,80 T720,80 T960,80 T1200,80 T1440,80 L1440,340 Q1320,310 1200,340 T960,340 T720,340 T480,340 T240,340 T0,340 Z",
              "M0,100 Q120,50 240,100 T480,100 T720,100 T960,100 T1200,100 T1440,100 L1440,320 Q1320,350 1200,320 T960,320 T720,320 T480,320 T240,320 T0,320 Z"
            ]
          };
        case 2:
          return {
            initial: "M0,120 Q180,70 360,120 T720,120 T1080,120 T1440,120 L1440,350 Q1260,380 1080,350 T720,350 T360,350 T0,350 Z",
            animate: [
              "M0,120 Q180,70 360,120 T720,120 T1080,120 T1440,120 L1440,350 Q1260,380 1080,350 T720,350 T360,350 T0,350 Z",
              "M0,100 Q180,150 360,100 T720,100 T1080,100 T1440,100 L1440,330 Q1260,300 1080,330 T720,330 T360,330 T0,330 Z",
              "M0,140 Q180,90 360,140 T720,140 T1080,140 T1440,140 L1440,370 Q1260,340 1080,370 T720,370 T360,370 T0,370 Z",
              "M0,110 Q180,160 360,110 T720,110 T1080,110 T1440,110 L1440,340 Q1260,310 1080,340 T720,340 T360,340 T0,340 Z",
              "M0,120 Q180,70 360,120 T720,120 T1080,120 T1440,120 L1440,350 Q1260,380 1080,350 T720,350 T360,350 T0,350 Z"
            ]
          };
        case 3:
          return {
            initial: "M0,160 Q360,110 720,160 T1440,160 L1440,380 Q1080,410 720,380 T0,380 Z",
            animate: [
              "M0,160 Q360,110 720,160 T1440,160 L1440,380 Q1080,410 720,380 T0,380 Z",
              "M0,180 Q360,130 720,180 T1440,180 L1440,360 Q1080,390 720,360 T0,360 Z",
              "M0,140 Q360,190 720,140 T1440,140 L1440,400 Q1080,370 720,400 T0,400 Z",
              "M0,160 Q360,210 720,160 T1440,160 L1440,380 Q1080,350 720,380 T0,380 Z",
              "M0,160 Q360,110 720,160 T1440,160 L1440,380 Q1080,410 720,380 T0,380 Z"
            ]
          };
      }
    }
    
    // Fallback to ensure function always returns a valid object
    return {
      initial: "M0,100 Q720,50 1440,100 L1440,320 Q720,350 0,320 Z",
      animate: [
        "M0,100 Q720,50 1440,100 L1440,320 Q720,350 0,320 Z",
        "M0,100 Q720,50 1440,100 L1440,320 Q720,350 0,320 Z",
        "M0,100 Q720,50 1440,100 L1440,320 Q720,350 0,320 Z",
        "M0,100 Q720,50 1440,100 L1440,320 Q720,350 0,320 Z",
        "M0,100 Q720,50 1440,100 L1440,320 Q720,350 0,320 Z"
      ]
    };
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Wave layers with different gradients and animations */}
      <div className="absolute inset-0">
        {/* Wave 1 - Bottom layer, deepest grooves */}
        <div 
          className={`absolute inset-x-0 opacity-60 ${isMobile ? 'h-64 bottom-10' : 'h-96 bottom-20'}`}
          style={wave1Parallax.parallaxStyle}
        >
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1440 400"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`wave1-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b85c00" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ff8c42" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffb380" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <motion.path
              fill={`url(#wave1-${uniqueId})`}
              initial={{ d: getWavePaths(1).initial }}
              animate={{ d: getWavePaths(1).animate }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "loop"
              }}
            />
          </svg>
        </div>

        {/* Wave 2 - Middle layer, flowing rhythm */}
        <div 
          className={`absolute inset-x-0 opacity-50 ${isMobile ? 'h-56 bottom-10' : 'h-80 bottom-20'}`}
          style={wave2Parallax.parallaxStyle}
        >
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1440 400"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`wave2-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8c42" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#ffb380" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#b85c00" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <motion.path
              fill={`url(#wave2-${uniqueId})`}
              initial={{ d: getWavePaths(2).initial }}
              animate={{ d: getWavePaths(2).animate }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
                repeatType: "loop"
              }}
            />
          </svg>
        </div>

        {/* Wave 3 - Top layer, smooth groove */}
        <div 
          className={`absolute inset-x-0 opacity-30 ${isMobile ? 'h-44 bottom-10' : 'h-64 bottom-20'}`}
          style={wave3Parallax.parallaxStyle}
        >
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1440 400"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`wave3-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffb380" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#b85c00" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff8c42" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <motion.path
              fill={`url(#wave3-${uniqueId})`}
              initial={{ d: getWavePaths(3).initial }}
              animate={{ d: getWavePaths(3).animate }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
                repeatType: "loop"
              }}
            />
          </svg>
        </div>

        {/* Gradient overlay to blend waves with background */}
        <div className={`absolute inset-x-0 h-32 bg-gradient-to-t from-primary-bg/50 to-transparent pointer-events-none ${isMobile ? 'bottom-10' : 'bottom-20'}`} />
      </div>
    </div>
  );
};