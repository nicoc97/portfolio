import React, { useState } from 'react';
import type { ProjectCardProps } from '../../types';
import { ExternalLink, Github, Calendar, ArrowUpRight } from 'lucide-react';

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <div
      className={`
        group relative h-full min-h-[520px] flex flex-col
        transform transition-all duration-500 ease-out
        ${isHovered ? '-translate-y-3' : 'translate-y-0'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project number - modern floating badge */}
      <div className="absolute -top-3 -right-3 z-20">
        <div className="bg-gradient-to-br from-accent-orange to-accent-orange-dark text-white font-tech font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
          {formattedIndex}
        </div>
      </div>

      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-accent-green text-white text-xs font-tech font-bold px-2 py-1 rounded-full">
            FEATURED
          </div>
        </div>
      )}

      {/* Image preview with modern overlay */}
      <div className={`
        relative mb-8 h-64 overflow-hidden rounded-3xl
        transition-all duration-700 ease-out
        ${isHovered ? 'shadow-2xl shadow-accent-orange/20 scale-[1.02]' : 'shadow-lg shadow-black/20'}
      `}>
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className={`
              w-full h-full object-cover transition-all duration-700
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              ${isHovered ? 'scale-105' : 'scale-100'}
            `}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-bg-light to-primary-bg">
            <div className="text-text-secondary/60 font-tech text-sm">
              [PREVIEW_LOADING...]
            </div>
          </div>
        )}
        
        {/* Modern gradient overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent
          transition-opacity duration-500
          ${isHovered ? 'opacity-100' : 'opacity-60'}
        `} />
        
        {/* Action buttons overlay */}
        <div className={`
          absolute bottom-6 right-6 flex gap-3
          transition-all duration-500 transform
          ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'}
        `}>
          {project.liveUrl && (
            <button
              onClick={() => window.open(project.liveUrl, '_blank')}
              className="bg-accent-orange hover:bg-accent-orange-dark text-white p-3 rounded-2xl transition-all duration-200 hover:scale-110 font-tech text-xs font-bold"
              title="View Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => window.open(project.githubUrl, '_blank')}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-2xl transition-all duration-200 hover:scale-110"
            title="View Source Code"
          >
            <Github className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content section - completely open layout */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Category and date */}
        <div className="flex items-center justify-between">
          <span className={`
            text-xs font-tech font-bold px-4 py-2 rounded-2xl uppercase tracking-wide
            ${project.category === 'data' ? 'bg-accent-green/15 text-accent-green border border-accent-green/30' : 
              project.category === 'fullstack' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
              'bg-accent-orange/15 text-accent-orange border border-accent-orange/30'}
          `}>
            {project.category === 'data' ? 'DATA_SCI' : 
             project.category === 'fullstack' ? 'FULL_STK' : 'WEB_APP'}
          </span>
          
          <div className="flex items-center text-text-secondary/70 text-xs font-tech">
            <Calendar className="w-3 h-3 mr-1" />
            {project.completedDate.toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            })}
          </div>
        </div>

        {/* Project title with pixel typography */}
        <h3 className={`
          text-2xl font-retro font-bold text-text-primary leading-tight 
          transition-all duration-300
          ${isHovered ? 'text-accent-orange transform translate-x-1' : ''}
        `}>
          {project.title}
        </h3>

        {/* Description with better spacing */}
        <p className="text-text-secondary text-sm leading-relaxed flex-grow font-mono opacity-90">
          {project.description}
        </p>

        {/* Tech stack with floating pills */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 5).map((tech, techIndex) => (
            <span
              key={techIndex}
              className={`
                text-xs px-3 py-1.5 rounded-xl font-tech
                bg-transparent border transition-all duration-200
                hover:scale-105 hover:shadow-lg
                ${techIndex % 2 === 0 
                  ? 'border-accent-orange/40 text-accent-orange hover:bg-accent-orange/10 hover:border-accent-orange' 
                  : 'border-accent-green/40 text-accent-green hover:bg-accent-green/10 hover:border-accent-green'
                }
              `}
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="text-text-secondary/60 text-xs px-3 py-1.5 font-tech">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Bottom action area - minimal and clean */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-6">
            {project.liveUrl && (
              <button
                onClick={() => window.open(project.liveUrl, '_blank')}
                className={`
                  text-accent-orange text-sm font-tech font-bold flex items-center gap-2 
                  transition-all duration-200 hover:gap-3
                  ${isHovered ? 'transform translate-x-1' : ''}
                `}
              >
                LIVE_DEMO
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => window.open(project.githubUrl, '_blank')}
              className={`
                text-text-secondary hover:text-accent-green text-sm font-tech font-bold 
                flex items-center gap-2 transition-all duration-200 hover:gap-3
                ${isHovered ? 'transform translate-x-1' : ''}
              `}
            >
              SOURCE
              <Github className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};