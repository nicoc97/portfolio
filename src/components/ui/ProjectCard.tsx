import React, { useState } from 'react';
import type { ProjectCardProps } from '../../types';
import { PixelButton } from './PixelButton';
import { ExternalLink, Github } from 'lucide-react';

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <div
      className={`
        pixel-card group relative
        ${isHovered ? 'transform -translate-y-1' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project number */}
      <div className="absolute -top-4 -left-4 z-10">
        <div className="bg-accent-orange text-primary-bg font-retro text-lg px-3 py-1 border-2 border-accent-orange rounded-full">
          {formattedIndex}.
        </div>
      </div>

      {/* Image preview */}
      <div className="relative mb-4 h-48 overflow-hidden bg-primary-bg rounded-lg">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className={`
              w-full h-full object-cover transition-all duration-300
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              ${isHovered ? 'scale-105' : ''}
            `}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-text-secondary font-retro text-sm">
              [PROJECT_IMAGE]
            </div>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className={`
          absolute inset-0 bg-accent-orange-dark bg-opacity-80 
          flex items-center justify-center transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="text-accent-orange font-tech text-sm text-center">
            <p>CLICK TO VIEW</p>
            <p className="mt-1 text-xs">◆ ◆ ◆</p>
          </div>
        </div>
      </div>

      {/* Project title */}
      <h3 className="text-xl font-bold mb-2 text-text-primary relative">
        {project.title}
        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-orange transition-all duration-300 group-hover:w-full"></div>
      </h3>

      {/* Tech stack badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {project.techStack.map((tech, techIndex) => (
          <span
            key={techIndex}
            className="bg-accent-orange-dark text-accent-orange px-3 py-1 text-xs font-tech border border-accent-orange rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Action buttons */}
      <div className="flex gap-3">
        {project.liveUrl && (
          <PixelButton
            variant="primary"
            size="sm"
            onClick={() => window.open(project.liveUrl, '_blank')}
            className="flex-1 flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            LIVE DEMO
          </PixelButton>
        )}
        
        <PixelButton
          variant="success"
          size="sm"
          onClick={() => window.open(project.githubUrl, '_blank')}
          className="flex-1 flex items-center justify-center"
        >
          <Github className="w-4 h-4 mr-1" />
          CODE
        </PixelButton>
      </div>
    </div>
  );
};