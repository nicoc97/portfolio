import { useState, useEffect } from 'react';

interface UseTypingAnimationProps {
  strings: readonly string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
}

export const useTypingAnimation = ({
  strings,
  typingSpeed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}: UseTypingAnimationProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(typingSpeed);

  // Reset on mount to ensure animation plays
  useEffect(() => {
    setDisplayedText('');
    setCurrentStringIndex(0);
    setIsDeleting(false);
  }, []);

  // Typing animation effect
  useEffect(() => {
    const currentString = strings[currentStringIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        if (displayedText.length < currentString.length) {
          setDisplayedText(currentString.slice(0, displayedText.length + 1));
          setCurrentSpeed(typingSpeed);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => {
            setIsDeleting(true);
            setCurrentSpeed(deleteSpeed);
          }, pauseTime);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
          setCurrentSpeed(deleteSpeed);
        } else {
          // Finished deleting, move to next string
          setIsDeleting(false);
          setCurrentStringIndex((prev) => (prev + 1) % strings.length);
          setCurrentSpeed(typingSpeed);
        }
      }
    };

    const timeout = setTimeout(handleTyping, currentSpeed);
    return () => clearTimeout(timeout);
  }, [displayedText, currentStringIndex, isDeleting, currentSpeed, strings, typingSpeed, deleteSpeed, pauseTime]);

  return displayedText;
};