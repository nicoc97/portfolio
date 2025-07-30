import React, { useEffect, useRef, useState } from 'react';
import { performanceMonitor } from '../../utils/performance';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface CursorTrailProps {
  trailLength?: number;
  fadeSpeed?: number;
  pixelSize?: number;
  color?: string;
  disabled?: boolean;
}

/**
 * CursorTrail Component
 * 
 * Creates a pixel-style trail that follows the mouse cursor
 * Optimized for performance with requestAnimationFrame
 */
export const CursorTrail: React.FC<CursorTrailProps> = ({
  trailLength = 20,
  fadeSpeed = 0.95,
  pixelSize = 4,
  color = '#ff8c42',
  disabled = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPoints = useRef<TrailPoint[]>([]);
  const animationId = useRef<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize canvas and event listeners
  useEffect(() => {
    if (disabled || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      trailPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: now
      });

      // Limit trail length
      if (trailPoints.current.length > trailLength) {
        trailPoints.current.shift();
      }
    };

    // Animation loop
    const animate = () => {
      performanceMonitor.trackAnimationPerformance('cursor-trail', () => {
        if (!ctx || !canvas) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = Date.now();
        
        // Filter out old points
        trailPoints.current = trailPoints.current.filter(
          point => now - point.timestamp < 1000
        );

        // Draw trail points
        trailPoints.current.forEach((point, index) => {
          const age = now - point.timestamp;
          const maxAge = 1000;
          const opacity = Math.max(0, 1 - (age / maxAge));
          
          // Calculate size based on position in trail
          const sizeMultiplier = (index + 1) / trailPoints.current.length;
          const currentSize = pixelSize * sizeMultiplier;

          // Set pixel style
          ctx.fillStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
          
          // Draw pixel
          ctx.fillRect(
            Math.floor(point.x / pixelSize) * pixelSize,
            Math.floor(point.y / pixelSize) * pixelSize,
            currentSize,
            currentSize
          );
        });
      });

      animationId.current = requestAnimationFrame(animate);
    };

    // Start animation
    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCanvasSize);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [disabled, isMobile, trailLength, fadeSpeed, pixelSize, color]);

  // Don't render on mobile or when disabled
  if (disabled || isMobile) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};