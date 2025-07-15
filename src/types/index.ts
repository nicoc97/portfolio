export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl: string;
  category: 'web' | 'data' | 'fullstack';
  featured: boolean;
  completedDate: Date;
}

export interface TechSkill {
  name: string;
  category: 'frontend' | 'backend' | 'data' | 'tools';
  proficiency: 1 | 2 | 3 | 4 | 5;
  pixelIcon: string;
  description?: string;
}

export interface PixelButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface ProjectCardProps {
  project: Project;
  index: number;
}

export interface TechBadgeProps {
  skill: TechSkill;
  onClick?: () => void;
}