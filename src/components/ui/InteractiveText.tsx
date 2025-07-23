import React, { useRef, useEffect, useState } from 'react';

interface InteractiveTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  magnetStrength?: number;
  returnSpeed?: number;
  fluidness?: number;
}

interface LetterState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
}

export const InteractiveText = ({
  text,
  className = '',
  style = {},
  magnetStrength = 30,
  returnSpeed = 0.08,
  fluidness = 0.92
}: InteractiveTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const letterStatesRef = useRef<LetterState[]>([]);
  const animationFrameRef = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isMouseInsideRef = useRef(false);

  // Initialize letter states
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      letterStatesRef.current = lettersRef.current.map((letter) => {
        if (!letter || !containerRef.current) {
          return { x: 0, y: 0, vx: 0, vy: 0, originalX: 0, originalY: 0 };
        }
        
        const rect = letter.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const originalX = rect.left - containerRect.left + rect.width / 2;
        const originalY = rect.top - containerRect.top + rect.height / 2;
        
        return {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          originalX,
          originalY
        };
      });
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    if (!isInitialized) return;
    
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      isMouseInsideRef.current = true;
    };

    const handleMouseLeave = () => {
      isMouseInsideRef.current = false;
    };

    const animate = () => {
      letterStatesRef.current.forEach((state, index) => {
        const letter = lettersRef.current[index];
        if (!letter || !state) return;

        if (isMouseInsideRef.current) {
          // Calculate distance from mouse
          const deltaX = mousePositionRef.current.x - state.originalX;
          const deltaY = mousePositionRef.current.y - state.originalY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          
          // Create ripple effect - letters are pushed away from cursor
          if (distance < magnetStrength * 2.5) {
            const force = Math.pow(1 - distance / (magnetStrength * 2.5), 2);
            const angle = Math.atan2(deltaY, deltaX);
            
            // Add force in opposite direction (push away)
            const pushX = -Math.cos(angle) * force * magnetStrength;
            const pushY = -Math.sin(angle) * force * magnetStrength;
            
            // Apply acceleration (creates more natural movement)
            state.vx += (pushX - state.x) * 0.1;
            state.vy += (pushY - state.y) * 0.1;
          }
        }
        
        // Always apply return force (stronger when mouse is outside)
        const returnForce = isMouseInsideRef.current ? returnSpeed * 0.5 : returnSpeed * 2;
        state.vx += -state.x * returnForce;
        state.vy += -state.y * returnForce;
        
        // Apply velocity with damping (creates fluid motion)
        state.vx *= fluidness;
        state.vy *= fluidness;
        
        // Update position
        state.x += state.vx;
        state.y += state.vy;
        
        // Apply transform with rotation
        const rotation = (state.vx * 0.5) + (state.vy * 0.1);
        letter.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${rotation}deg)`;
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [magnetStrength, returnSpeed, fluidness, isInitialized]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex justify-between items-center ${className}`}
      style={style}
    >
      {text.split('').map((letter, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) lettersRef.current[index] = el;
          }}
          className="inline-block will-change-transform"
          style={{
            transformOrigin: 'center center',
            transition: 'none',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </div>
  );
};