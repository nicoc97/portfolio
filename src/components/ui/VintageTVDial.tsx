// VintageTVDial.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';

interface VintageTVDialProps {
  totalSlides: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
  swiperInstance?: SwiperType | null;
}

export const VintageTVDial: React.FC<VintageTVDialProps> = ({
  totalSlides,
  currentSlide,
  onSlideChange,
  swiperInstance
}) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isChangingChannel, setIsChangingChannel] = useState(false);

  // Calculate angle from center
  const getAngle = (e: MouseEvent | TouchEvent, rect: DOMRect): number => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  // Normalize angle to 0-360 range
  const normalizeAngle = (angle: number): number => {
    const normalized = angle % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  };

  // Get slide index from rotation angle
  const getSlideFromRotation = (angle: number): number => {
    // The dial rotates counter-clockwise to bring numbers to the top
    // So we need to negate the angle
    const normalizedAngle = normalizeAngle(angle);
    const degreesPerSlide = 360 / totalSlides;
    const slideIndex = Math.round(normalizedAngle / degreesPerSlide) % totalSlides;
    return slideIndex;
  };

  // Snap to nearest slide position
  const snapToSlide = (currentRotation: number) => {
    const slideIndex = getSlideFromRotation(currentRotation);
    const degreesPerSlide = 360 / totalSlides;
    // Negative because we rotate counter-clockwise
    const targetRotation = slideIndex * degreesPerSlide;
    
    // Find shortest rotation path
    let rotationDiff = targetRotation - currentRotation;
    if (Math.abs(rotationDiff) > 180) {
      rotationDiff = rotationDiff > 0 ? rotationDiff - 360 : rotationDiff + 360;
    }
    const finalRotation = currentRotation + rotationDiff;
    
    setIsAnimating(true);
    setIsChangingChannel(true);
    setRotation(finalRotation);
    
    // Change slide after a brief delay for visual effect
    setTimeout(() => {
      if (swiperInstance && swiperInstance.slideTo) {
        swiperInstance.slideTo(slideIndex);
      }
      onSlideChange(slideIndex);
      setIsChangingChannel(false);
    }, 150);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Handle mouse/touch start
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimating || !dialRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    const rect = dialRef.current.getBoundingClientRect();
    const angle = getAngle(e.nativeEvent as any, rect);
    setStartAngle(angle);
    setStartRotation(rotation);
  };

  // Handle mouse/touch move
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || isAnimating || !dialRef.current) return;
    e.preventDefault();
    const rect = dialRef.current.getBoundingClientRect();
    const currentAngle = getAngle(e, rect);
    let angleDiff = currentAngle - startAngle;
    
    // Handle angle wrap-around
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    const newRotation = startRotation + angleDiff;
    setRotation(newRotation);
  };

  // Handle mouse/touch end
  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToSlide(rotation);
  };


  // Update dial when slide changes externally
  useEffect(() => {
    if (!isDragging && !isAnimating) {
      const degreesPerSlide = 360 / totalSlides;
      // Negative because we rotate counter-clockwise
      const targetRotation = currentSlide * degreesPerSlide;
      setRotation(targetRotation);
    }
  }, [currentSlide, totalSlides, isDragging, isAnimating]);

  // Add global listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMove = (e: MouseEvent | TouchEvent) => handleMove(e);
      const handleGlobalEnd = () => handleEnd();
      
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalMove, { passive: false });
      window.addEventListener('touchend', handleGlobalEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMove);
        window.removeEventListener('mouseup', handleGlobalEnd);
        window.removeEventListener('touchmove', handleGlobalMove);
        window.removeEventListener('touchend', handleGlobalEnd);
      };
    }
  }, [isDragging, startAngle, startRotation, rotation]);

  // Calculate active channel for display
  const activeChannel = getSlideFromRotation(rotation);

  return (
    <div className="vintage-tv-dial-container">
      <div 
        ref={dialRef}
        className={`vintage-tv-dial ${isDragging ? 'dragging' : ''} ${isChangingChannel ? 'changing-channel' : ''}`}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isAnimating ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
      >
        {/* Dial face */}
        <div className="dial-face">
          {/* Inner glow ring */}
          <div className="dial-inner-glow" />
          
          
          {/* Notches - positioned to align with numbers */}
          {Array.from({ length: totalSlides * 4 }).map((_, i) => (
            <div
              key={i}
              className={`notch ${i % 4 === 0 ? 'major' : 'minor'}`}
              style={{
                // Start from top (-90 degrees offset)
                transform: `rotate(${(360 / (totalSlides * 4)) * i - 90}deg)`
              }}
            />
          ))}
          
          {/* Center knob */}
          <div className="dial-center">
            <div className="dial-grip" />
            <div className="dial-center-glow" />
          </div>
        </div>
      </div>
      
      {/* Static effect overlay */}
      <div className={`static-overlay ${isChangingChannel ? 'active' : ''}`} />
      
      {/* Static pointer */}
      <div className="dial-pointer" />
      
      {/* Current channel display */}
      <div className={`channel-display ${isChangingChannel ? 'glitching' : ''}`}>
        <span className="channel-label font-tech text-xl">CH</span>
        <span className="channel-number-display font-tech text-xl">{activeChannel + 1}</span>
      </div>
    </div>
  );
};