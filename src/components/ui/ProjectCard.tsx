import React, { useState, useEffect } from 'react';
import type { ProjectCardProps } from '../../types';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onCardExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { showToast } = useToast();

  // Detect if device supports touch
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();

    if (project.status === 'wip') {
      showToast('This project is currently in development', 'warning', 4000);
      return;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleCardInteraction = () => {
    if (isTouchDevice) {
      const newExpandedState = !isExpanded;
      setIsExpanded(newExpandedState);
      
      // Pause swiper when expanding card
      if (newExpandedState && onCardExpand) {
        onCardExpand();
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsExpanded(false);
    }
  };



  return (
    <div
      className={`
        group relative h-full min-h-[400px] overflow-hidden rounded-2xl cursor-pointer
        transform transition-all duration-500 ease-out
        ${isExpanded ? '-translate-y-2' : 'translate-y-0 shadow-lg shadow-black/20'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardInteraction}
    >


      {/* Status badge - always visible */}
      <div className="absolute top-4 left-4 z-30">
        <div className={`
          text-white text-sm font-tech font-bold px-2 py-1 tracking-wider rounded-full backdrop-blur-sm
          ${project.status === 'completed'
            ? 'bg-accent-green'
            : 'bg-yellow-500'
          }
        `}>
          {project.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
        </div>
      </div>

      {/* Background Image - fills entire card */}
      <div className="absolute inset-0 w-full h-full">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className={`
              w-full h-full object-cover transition-all duration-700
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              ${isExpanded ? 'scale-110' : 'scale-100'}
            `}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-bg-light to-primary-bg">
            <div className="text-text-secondary/60 font-tech text-lg">
              [WIP_CONTENT_NOT_READY]
            </div>
          </div>
        )}
      </div>

      {/* Minimal overlay for readability - always present but subtle */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Scanline effect - only visible on hover */}
      <div className={`
        absolute inset-0 z-15 pointer-events-none
        transition-opacity duration-300
        ${isExpanded ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-orange/5 to-transparent animate-pulse"
          style={{
            backgroundImage: `repeating-linear-gradient(
                 0deg,
                 transparent,
                 transparent 2px,
                 rgba(255, 165, 0, 0.03) 2px,
                 rgba(255, 165, 0, 0.03) 4px
               )`
          }}>
        </div>
        {/* Moving scanline */}
        <div className={`
          absolute inset-x-0 h-0.5 bg-accent-orange/30 shadow-lg shadow-accent-orange/50
          ${isExpanded ? 'animate-scanline' : ''}
        `}>
        </div>
      </div>

      {/* Category badge - floating on image */}
      <div className="absolute top-4 right-4 z-20">
        <span className={`
          text-xs font-tech font-bold px-3 py-1 rounded-xl uppercase tracking-wide backdrop-blur-sm
          transition-all duration-300
          ${project.category === 'data' ? 'bg-accent-green/20 text-accent-green border border-accent-green/50' :
            project.category === 'fullstack' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' :
              'bg-accent-orange/20 text-accent-orange border border-accent-orange/50'}
          ${isExpanded ? 'scale-105 bg-opacity-90' : ''}
        `}>
          {project.category === 'data' ? 'DATA_SCI' :
            project.category === 'fullstack' ? 'FULL_STK' : 'WEB_APP'}
        </span>
      </div>

      {/* Quick action buttons - top right, always visible but subtle */}
      <div className="absolute top-16 right-4 flex flex-col gap-2 z-20">
        {project.liveUrl && (
          <button
            onClick={(e) => handleLinkClick(e, project.liveUrl)}
            className={`
              bg-white/10 hover:bg-accent-orange text-white p-2 rounded-lg backdrop-blur-sm
              transition-all duration-300 hover:scale-110
              ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-60 translate-x-2'}
            `}
            title="View Live Demo"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={(e) => handleLinkClick(e, project.githubUrl)}
          className={`
            bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg backdrop-blur-sm
            transition-all duration-300 hover:scale-110
            ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-60 translate-x-2'}
          `}
          title="View Source Code"
        >
          <Github className="w-4 h-4" />
        </button>
      </div>

      {/* Content overlay - slides up from bottom on hover */}
      <div className={`
        absolute inset-x-0 bottom-0 p-6 z-20
        bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-sm
        transform transition-all duration-500 ease-out
        ${isExpanded ? 'translate-y-0' : 'translate-y-full'}
      `}>


        {/* Project title */}
        <h3 className="text-2xl font-retro font-bold text-white leading-tight mb-3">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-white/90 text-sm leading-relaxed font-mono mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech stack with staggered animation */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 5).map((tech, techIndex) => (
            <span
              key={techIndex}
              className={`
                text-xs px-2 py-1 rounded-lg font-tech
                bg-white/10 border border-white/20 text-white backdrop-blur-sm
                transition-all duration-200 transform hover:scale-105
                ${isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
              `}
              style={{
                transitionDelay: isExpanded ? `${techIndex * 50 + 200}ms` : '0ms'
              }}
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className={`
              text-white/60 text-xs px-2 py-1 font-tech
              transition-all duration-200 transform
              ${isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
            `}
              style={{
                transitionDelay: isExpanded ? '450ms' : '0ms'
              }}>
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className={`
          flex gap-4
          transition-all duration-300 transform
          ${isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
          style={{
            transitionDelay: isExpanded ? '300ms' : '0ms'
          }}>
          {project.liveUrl && (
            <button
              onClick={(e) => handleLinkClick(e, project.liveUrl)}
              className="text-accent-orange hover:text-white text-sm font-tech font-bold flex items-center gap-2 transition-all duration-200 hover:gap-3"
            >
              LIVE_DEMO
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={(e) => handleLinkClick(e, project.githubUrl)}
            className="text-white/70 hover:text-accent-green text-sm font-tech font-bold flex items-center gap-2 transition-all duration-200 hover:gap-3"
          >
            SOURCE
            <Github className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Minimal title overlay - always visible at bottom */}
      <div className={`
        absolute inset-x-0 bottom-0 p-4 z-10
        bg-gradient-to-t from-black/60 to-transparent
        transition-all duration-500
        ${isExpanded ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}>
        <h3 className="text-lg font-retro font-bold text-white leading-tight">
          {project.title}
        </h3>
        <div className="text-white/60 text-base font-tech mt-1">
          {isTouchDevice ? '[TAP_FOR_DETAILS]' : '[HOVER_FOR_DETAILS]'}
        </div>
      </div>
    </div>
  );
};