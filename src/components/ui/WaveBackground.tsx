import React from 'react';
import { motion } from 'framer-motion';

/**
 * WaveBackground Component
 * 
 * Creates an animated wave background effect using Framer Motion and SVG
 * with smooth, organic wave animations and orange-brown gradient theme.
 */
export const WaveBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Wave layers with different gradients and animations */}
      <div className="absolute inset-0">
        {/* Wave 1 - Primary gradient */}
        <div className="absolute inset-0 opacity-40">
          <motion.svg
            className="absolute bottom-0 left-0 w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b85c00" />
                <stop offset="50%" stopColor="#ff8c42" />
                <stop offset="100%" stopColor="#ffb380" />
              </linearGradient>
            </defs>
            <motion.path
              fill="url(#wave1)"
              animate={{
                d: [
                  "M0,160 C240,200,480,120,720,140 C960,160,1200,180,1440,160 L1440,320 L0,320 Z",
                  "M0,180 C240,140,480,220,720,180 C960,140,1200,160,1440,180 L1440,320 L0,320 Z",
                  "M0,140 C240,180,480,100,720,160 C960,220,1200,140,1440,140 L1440,320 L0,320 Z",
                  "M0,160 C240,200,480,120,720,140 C960,160,1200,180,1440,160 L1440,320 L0,320 Z"
                ]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.svg>
        </div>

        {/* Wave 2 - Secondary gradient */}
        <div className="absolute inset-0 opacity-30">
          <motion.svg
            className="absolute bottom-0 left-0 w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8c42" />
                <stop offset="50%" stopColor="#ffb380" />
                <stop offset="100%" stopColor="#b85c00" />
              </linearGradient>
            </defs>
            <motion.path
              fill="url(#wave2)"
              animate={{
                d: [
                  "M0,200 C360,160,720,240,1080,200 C1260,180,1350,190,1440,200 L1440,320 L0,320 Z",
                  "M0,220 C360,260,720,180,1080,220 C1260,240,1350,230,1440,220 L1440,320 L0,320 Z",
                  "M0,180 C360,140,720,220,1080,180 C1260,160,1350,170,1440,180 L1440,320 L0,320 Z",
                  "M0,200 C360,160,720,240,1080,200 C1260,180,1350,190,1440,200 L1440,320 L0,320 Z"
                ]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.svg>
        </div>

        {/* Wave 3 - Tertiary gradient */}
        <div className="absolute inset-0 opacity-20">
          <motion.svg
            className="absolute bottom-0 left-0 w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffb380" />
                <stop offset="50%" stopColor="#b85c00" />
                <stop offset="100%" stopColor="#ff8c42" />
              </linearGradient>
            </defs>
            <motion.path
              fill="url(#wave3)"
              animate={{
                d: [
                  "M0,240 C480,280,960,200,1440,240 L1440,320 L0,320 Z",
                  "M0,260 C480,220,960,300,1440,260 L1440,320 L0,320 Z",
                  "M0,220 C480,260,960,180,1440,220 L1440,320 L0,320 Z",
                  "M0,240 C480,280,960,200,1440,240 L1440,320 L0,320 Z"
                ]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.svg>
        </div>

      </div>
    </div>
  );
};

// Example usage component
export default function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <WaveBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">Smooth Wave Background</h1>
          <p className="text-orange-600">Watch the organic wave animations flow naturally</p>
        </div>
      </div>
    </div>
  );
}