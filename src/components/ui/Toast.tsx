import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose, 
  isVisible 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      default:
        return 'bg-accent-orange/20 border-accent-orange/50 text-accent-orange';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm
          font-tech text-sm transition-all duration-300 transform
          ${getTypeStyles()}
          ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1">{message}</span>
        <button
          onClick={handleClose}
          className="text-current hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};