import React from 'react';
import { motion } from 'framer-motion';

/**
 * WaveBackground Component
 * 
 * Creates an animated wave background effect using Framer Motion and SVG
 * with smooth, organic wave animations with matching patterns on top and bottom edges.
 * Features narrower waves with more undulation in the middle layer and smooth curves throughout.
 */
export const WaveBackground = () => {
  // Generate unique IDs to avoid conflicts when component remounts
  const uniqueId = React.useId();
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Wave layers with different gradients and animations */}
      <div className="absolute inset-0">
        {/* Wave 1 - Primary gradient */}
        <div className="absolute inset-0 opacity-40">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`wave1-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b85c00" />
                <stop offset="50%" stopColor="#ff8c42" />
                <stop offset="100%" stopColor="#ffb380" />
              </linearGradient>
            </defs>
            <motion.path
              fill={`url(#wave1-${uniqueId})`}
              initial={{
                d: "M0,160 C240,180,480,140,720,150 C960,160,1200,170,1440,160 L1440,210 C1200,200,960,190,720,200 C480,210,240,220,0,210 Z"
              }}
              animate={{
                d: [
                  "M0,160 C240,180,480,140,720,150 C960,160,1200,170,1440,160 L1440,210 C1200,200,960,190,720,200 C480,210,240,220,0,210 Z",
                  "M0,170 C240,150,480,190,720,170 C960,150,1200,160,1440,170 L1440,200 C1200,220,960,180,720,200 C480,220,240,210,0,200 Z",
                  "M0,150 C240,170,480,130,720,160 C960,190,1200,150,1440,150 L1440,220 C1200,200,960,240,720,210 C480,180,240,220,0,220 Z",
                  "M0,160 C240,180,480,140,720,150 C960,160,1200,170,1440,160 L1440,210 C1200,200,960,190,720,200 C480,210,240,220,0,210 Z"
                ]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "loop"
              }}
            />
          </svg>
        </div>

        {/* Wave 2 - Secondary gradient - More wavy! */}
        <div className="absolute inset-0 opacity-30">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`wave2-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8c42" />
                <stop offset="50%" stopColor="#ffb380" />
                <stop offset="100%" stopColor="#b85c00" />
              </linearGradient>
            </defs>
            <motion.path
              fill={`url(#wave2-${uniqueId})`}
              initial={{
                d: "M0,140 C180,170,360,110,540,150 C720,190,900,120,1080,140 C1260,160,1350,130,1440,140 L1440,220 C1350,190,1260,250,1080,210 C900,170,720,240,540,200 C360,160,180,230,0,220 Z"
              }}
              animate={{
                d: [
                  "M0,140 C180,170,360,110,540,150 C720,190,900,120,1080,140 C1260,160,1350,130,1440,140 L1440,220 C1350,190,1260,250,1080,210 C900,170,720,240,540,200 C360,160,180,230,0,220 Z",
                  "M0,150 C180,120,360,180,540,140 C720,100,900,170,1080,150 C1260,130,1350,160,1440,150 L1440,210 C1350,240,1260,180,1080,220 C900,260,720,190,540,230 C360,270,180,200,0,210 Z",
                  "M0,130 C180,160,360,100,540,130 C720,160,900,110,1080,130 C1260,150,1350,120,1440,130 L1440,230 C1350,200,1260,260,1080,230 C900,200,720,250,540,220 C360,190,180,240,0,230 Z",
                  "M0,140 C180,170,360,110,540,150 C720,190,900,120,1080,140 C1260,160,1350,130,1440,140 L1440,220 C1350,190,1260,250,1080,210 C900,170,720,240,540,200 C360,160,180,230,0,220 Z"
                ]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
                repeatType: "loop"
              }}
            />
          </svg>
        </div>

        {/* Wave 3 - Tertiary gradient - Smooth curves only */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`wave3-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffb380" />
                <stop offset="50%" stopColor="#b85c00" />
                <stop offset="100%" stopColor="#ff8c42" />
              </linearGradient>
            </defs>
            <motion.path
              fill={`url(#wave3-${uniqueId})`}
              initial={{
                d: "M0,170 C240,185,480,165,720,175 C960,185,1200,165,1440,170 L1440,190 C1200,175,960,195,720,185 C480,175,240,195,0,190 Z"
              }}
              animate={{
                d: [
                  "M0,170 C240,185,480,165,720,175 C960,185,1200,165,1440,170 L1440,190 C1200,175,960,195,720,185 C480,175,240,195,0,190 Z",
                  "M0,175 C240,165,480,185,720,180 C960,175,1200,185,1440,175 L1440,195 C1200,205,960,185,720,190 C480,195,240,185,0,195 Z",
                  "M0,165 C240,180,480,160,720,170 C960,180,1200,160,1440,165 L1440,185 C1200,170,960,190,720,180 C480,170,240,190,0,185 Z",
                  "M0,170 C240,185,480,165,720,175 C960,185,1200,165,1440,170 L1440,190 C1200,175,960,195,720,185 C480,175,240,195,0,190 Z"
                ]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
                repeatType: "loop"
              }}
            />
          </svg>
        </div>

      </div>
    </div>
  );
};