import type { TechSkill } from '../types';

/**
 * Technical Skills Data
 * 
 * This file contains all the technical skills data for the portfolio.
 * Each skill includes category, proficiency level, pixel icon, and description.
 * 
 * 🔧 UPDATE LOCATIONS:
 * - Add new skills to the appropriate category
 * - Update proficiency levels as skills improve
 * - Modify descriptions to reflect current experience
 * - Add new pixel icons for new technologies
 */

export const techSkills: TechSkill[] = [
  // Frontend Skills
  {
    name: 'React',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: '⚛',
    description: 'Advanced React development with hooks, context, and modern patterns'
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: 'TS',
    description: 'Strong typing, interfaces, generics, and advanced TypeScript features'
  },
  {
    name: 'JavaScript',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: 'JS',
    description: 'ES6+, async/await, functional programming, and modern JavaScript'
  },
  {
    name: 'HTML5',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: '🏗',
    description: 'Semantic HTML, accessibility, and modern web standards'
  },
  {
    name: 'CSS3',
    category: 'frontend',
    proficiency: 5,
    pixelIcon: '🎨',
    description: 'Advanced CSS, animations, flexbox, grid, and responsive design'
  },
  {
    name: 'Tailwind',
    category: 'frontend',
    proficiency: 4,
    pixelIcon: '🌊',
    description: 'Utility-first CSS framework for rapid UI development'
  },
  {
    name: 'Vue.js',
    category: 'frontend',
    proficiency: 3,
    pixelIcon: '🟢',
    description: 'Component-based frontend framework with composition API'
  },

  // Backend Skills
  {
    name: 'Node.js',
    category: 'backend',
    proficiency: 4,
    pixelIcon: '🟢',
    description: 'Server-side JavaScript, Express.js, and API development'
  },
  {
    name: 'Python',
    category: 'backend',
    proficiency: 5,
    pixelIcon: '🐍',
    description: 'Full-stack Python development, Django, Flask, and automation'
  },
  {
    name: 'PostgreSQL',
    category: 'backend',
    proficiency: 4,
    pixelIcon: '🐘',
    description: 'Advanced SQL, database design, and query optimization'
  },
  {
    name: 'MongoDB',
    category: 'backend',
    proficiency: 3,
    pixelIcon: '🍃',
    description: 'NoSQL database design and aggregation pipelines'
  },
  {
    name: 'REST APIs',
    category: 'backend',
    proficiency: 5,
    pixelIcon: '🔗',
    description: 'RESTful API design, authentication, and best practices'
  },
  {
    name: 'GraphQL',
    category: 'backend',
    proficiency: 3,
    pixelIcon: '📊',
    description: 'Query language for APIs with Apollo and schema design'
  },

  // Data Science Skills
  {
    name: 'Pandas',
    category: 'data',
    proficiency: 5,
    pixelIcon: '🐼',
    description: 'Data manipulation, analysis, and transformation with Python'
  },
  {
    name: 'NumPy',
    category: 'data',
    proficiency: 4,
    pixelIcon: '🔢',
    description: 'Numerical computing and array operations'
  },
  {
    name: 'Matplotlib',
    category: 'data',
    proficiency: 4,
    pixelIcon: '📈',
    description: 'Data visualization and statistical plotting'
  },
  {
    name: 'Scikit-learn',
    category: 'data',
    proficiency: 4,
    pixelIcon: '🤖',
    description: 'Machine learning algorithms and model evaluation'
  },
  {
    name: 'Jupyter',
    category: 'data',
    proficiency: 5,
    pixelIcon: '📓',
    description: 'Interactive data analysis and research notebooks'
  },
  {
    name: 'SQL',
    category: 'data',
    proficiency: 5,
    pixelIcon: '💾',
    description: 'Complex queries, data analysis, and database optimization'
  },

  // Tools & DevOps
  {
    name: 'Git',
    category: 'tools',
    proficiency: 5,
    pixelIcon: '🌳',
    description: 'Version control, branching strategies, and collaboration'
  },
  {
    name: 'Docker',
    category: 'tools',
    proficiency: 4,
    pixelIcon: '🐳',
    description: 'Containerization, multi-stage builds, and orchestration'
  },
  {
    name: 'AWS',
    category: 'tools',
    proficiency: 3,
    pixelIcon: '☁️',
    description: 'Cloud services, S3, EC2, Lambda, and serverless architecture'
  },
  {
    name: 'Linux',
    category: 'tools',
    proficiency: 4,
    pixelIcon: '🐧',
    description: 'Command line, shell scripting, and system administration'
  },
  {
    name: 'Vite',
    category: 'tools',
    proficiency: 4,
    pixelIcon: '⚡',
    description: 'Fast build tool and development server for modern web apps'
  },
  {
    name: 'Webpack',
    category: 'tools',
    proficiency: 3,
    pixelIcon: '📦',
    description: 'Module bundling, optimization, and build configuration'
  }
];

// Helper functions for filtering and categorizing skills
export const getSkillsByCategory = (category: TechSkill['category']): TechSkill[] => {
  return techSkills.filter(skill => skill.category === category);
};

export const getFeaturedSkills = (): TechSkill[] => {
  return techSkills.filter(skill => skill.proficiency >= 4);
};

export const getSkillByName = (name: string): TechSkill | undefined => {
  return techSkills.find(skill => skill.name.toLowerCase() === name.toLowerCase());
};

export const skillCategories = [
  { key: 'frontend' as const, label: 'Frontend', color: 'accent-orange' },
  { key: 'backend' as const, label: 'Backend', color: 'accent-green' },
  { key: 'data' as const, label: 'Data Science', color: 'accent-green' },
  { key: 'tools' as const, label: 'Tools & DevOps', color: 'accent-green' }
];