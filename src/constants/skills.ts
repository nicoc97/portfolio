import type { TechSkill } from '../types';

/**
 * Technical Skills Data
 * 
 * This file contains all the technical skills data for the portfolio.
 * Each skill includes category, pixel icon, and description based on real experience.
 * 
 * 🔧 UPDATE LOCATIONS:
 * - Add new skills to the appropriate category
 * - Modify descriptions to reflect current experience
 * - Add new pixel icons for new technologies
 * - Update skill relationships for better UX
 */

export const techSkills: TechSkill[] = [
  // Frontend Skills
  {
    name: 'HTML',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: '🏗',
    description: 'Semantic HTML, accessibility, and modern web standards'
  },
  {
    name: 'CSS',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: '🎨',
    description: 'Advanced CSS, animations, flexbox, grid, and responsive design'
  },
  {
    name: 'JavaScript',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: 'JS',
    description: 'ES6+, async/await, functional programming, and modern JavaScript'
  },
  {
    name: 'React',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: '⚛',
    description: 'Modern React development with hooks, context, and Next.js'
  },
  {
    name: 'Next.js',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: '▲',
    description: 'Full-stack React framework with SSR and static generation'
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: 'TS',
    description: 'Strong typing, interfaces, generics, and advanced TypeScript features'
  },

  // Backend & CMS Skills
  {
    name: 'PHP',
    category: 'backend',
    proficiency: 5,
    pixelIcon: '🐘',
    description: 'Server-side development with Symfony framework and modern PHP practices'
  },
  {
    name: 'Symfony',
    category: 'backend',
    proficiency: 5,
    pixelIcon: '🎼',
    description: 'PHP framework for building robust web applications and APIs'
  },
  {
    name: 'WordPress',
    category: 'backend',
    proficiency: 5,
    pixelIcon: 'WP',
    description: 'Custom theme development, plugin creation, and content management'
  },
  {
    name: 'ACF',
    category: 'backend',
    proficiency: 5,
    pixelIcon: '🔧',
    description: 'Advanced Custom Fields for flexible WordPress content management'
  },
  {
    name: 'Timber',
    category: 'backend',
    proficiency: 5,
    pixelIcon: '🌲',
    description: 'Twig templating for WordPress theme development'
  },
  {
    name: 'C#',
    category: 'backend',
    proficiency: 4,
    pixelIcon: 'C#',
    description: 'Object-oriented programming with .NET Core for web applications'
  },
  {
    name: '.NET Core',
    category: 'backend',
    proficiency: 4,
    pixelIcon: '🔷',
    description: 'Cross-platform framework for building modern web applications'
  },

  // Database Skills
  {
    name: 'SQL Server',
    category: 'database',
    proficiency: 4,
    pixelIcon: '💾',
    description: 'Database design, queries, and management with SQL Server Management Studio'
  },
  {
    name: 'SQL',
    category: 'database',
    proficiency: 5,
    pixelIcon: '🗃',
    description: 'Complex queries, data analysis, and database optimization'
  },

  // Tools & DevOps
  {
    name: 'Git',
    category: 'tools',
    proficiency: 5,
    pixelIcon: '🌳',
    description: 'Version control, branching strategies, and collaboration workflows'
  },
  {
    name: 'Vite',
    category: 'tools',
    proficiency: 4,
    pixelIcon: '⚡',
    description: 'Fast build tool and development server for modern web apps'
  },
  {
    name: 'Hardware Troubleshooting',
    category: 'tools',
    proficiency: 4,
    pixelIcon: '🔧',
    description: 'Diagnosing and repairing computer hardware and mobility equipment'
  }
];

// Helper functions for filtering and categorizing skills
export const getSkillsByCategory = (category: TechSkill['category']): TechSkill[] => {
  return techSkills.filter(skill => skill.category === category);
};

export const getFeaturedSkills = (): TechSkill[] => {
  // Return core skills that are most relevant
  const featuredSkillNames = ['JavaScript', 'React', 'PHP', 'WordPress', 'HTML', 'CSS'];
  return techSkills.filter(skill => featuredSkillNames.includes(skill.name));
};

export const getSkillByName = (name: string): TechSkill | undefined => {
  return techSkills.find(skill => skill.name.toLowerCase() === name.toLowerCase());
};

export const skillCategories = [
  { key: 'frontend' as const, label: 'Frontend', color: 'accent-orange' },
  { key: 'backend' as const, label: 'Backend & CMS', color: 'accent-green' },
  { key: 'database' as const, label: 'Database', color: 'accent-green' },
  { key: 'tools' as const, label: 'Tools', color: 'accent-green' }
];