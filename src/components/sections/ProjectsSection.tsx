import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ProjectCard } from '../ui/ProjectCard';
import { VintageTVDial } from '../ui/VintageTVDial';
import type { Project } from '../../types';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/swiper-bundle.css';
import '../../styles/swiper-custom.css';

/**
 * ProjectsSection Component
 * 
 * Displays a filterable grid of projects with:
 * - Category filtering (All, Web Apps, Data Science, Full-Stack)
 * - Responsive grid layout
 * - Project cards with hover effects
 * - Vintage TV dial navigation
 * - Sample data (replace with real projects)
 */

// 🔧 UPDATE: Replace this sample data with actual projects
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Interactive Data Dashboard',
    description: 'A real-time analytics dashboard built with React and D3.js, featuring interactive charts and data visualization for business intelligence.',
    techStack: ['React', 'TypeScript', 'D3.js', 'Python', 'FastAPI'],
    imageUrl: '',
    liveUrl: 'https://example.com/dashboard',
    githubUrl: 'https://github.com/username/dashboard',
    category: 'data',
    featured: true,
    completedDate: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe', 'PostgreSQL'],
    imageUrl: '',
    liveUrl: 'https://example.com/shop',
    githubUrl: 'https://github.com/username/ecommerce',
    category: 'fullstack',
    featured: true,
    completedDate: new Date('2024-02-20')
  },
  {
    id: '3',
    title: 'ML Model Visualizer',
    description: 'Interactive tool for visualizing machine learning model performance and feature importance with real-time predictions.',
    techStack: ['React', 'Python', 'Scikit-learn', 'Plotly', 'Flask'],
    imageUrl: '',
    githubUrl: 'https://github.com/username/ml-viz',
    category: 'data',
    featured: false,
    completedDate: new Date('2024-03-10')
  },
  {
    id: '4',
    title: 'Task Management App',
    description: 'Collaborative task management application with real-time updates, file sharing, and team collaboration features.',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
    imageUrl: '',
    liveUrl: 'https://example.com/tasks',
    githubUrl: 'https://github.com/username/task-app',
    category: 'web',
    featured: true,
    completedDate: new Date('2024-04-05')
  },
  {
    id: '5',
    title: 'API Documentation Portal',
    description: 'Modern API documentation site with interactive examples, authentication testing, and automated endpoint discovery.',
    techStack: ['Next.js', 'TypeScript', 'Swagger', 'Prism', 'Docker'],
    imageUrl: '',
    liveUrl: 'https://example.com/api-docs',
    githubUrl: 'https://github.com/username/api-docs',
    category: 'web',
    featured: false,
    completedDate: new Date('2024-05-12')
  },
  {
    id: '6',
    title: 'Creative Coding Experiment',
    description: 'Interactive WebGL experience with particle systems, procedural generation, and audio-reactive animations.',
    techStack: ['Three.js', 'WebGL', 'GLSL', 'Web Audio API'],
    imageUrl: '',
    liveUrl: 'https://example.com/creative',
    githubUrl: 'https://github.com/username/creative-coding',
    category: 'web',
    featured: false,
    completedDate: new Date('2024-06-18')
  }
];

export const ProjectsSection: React.FC = () => {
  // State management
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'web' | 'data' | 'fullstack'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // Filter projects
  const filteredProjects = selectedFilter === 'all' 
    ? sampleProjects 
    : sampleProjects.filter(project => project.category === selectedFilter);

  // 🔧 UPDATE: Modify filter categories here if you have different project types
  const filterButtons = [
    { key: 'all', label: 'ALL PROJECTS' },
    { key: 'web', label: 'WEB APPS' },
    { key: 'data', label: 'DATA SCIENCE' },
    { key: 'fullstack', label: 'FULL-STACK' }
  ] as const;

  return (
    <section id="projects" className="py-20 bg-primary-bg relative overflow-hidden">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-start pt-[2rem] pr-[2rem] justify-end opacity-5 pointer-events-none">
        <span className="text-[12rem] md:text-[15rem] lg:text-[18rem] font-bold text-accent-orange font-retro leading-none">02</span>
      </div>

      <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
        {/* Centered section header */}
        <div className="relative mb-20">

          {/* Centered header layout */}
          <div className="text-left space-y-6">
            <div className="relative">
              <h2 className="text-5xl md:text-[8rem] font-bold text-accent-orange font-retro">
                PROJECTS
              </h2>
              {/* decorative line */}
              <div className="mt-4 w-32 h-px bg-accent-orange"></div>
            </div>

            {/* description */}
            <div className="max-w-2xl">
              <p className="text-text-secondary text-sm leading-relaxed">
                A collection of web applications, data science projects, and creative experiments
                showcasing modern development practices.
              </p>
            </div>
          </div>

          {/* Centered filter buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            {filterButtons.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedFilter(key)}
                className={`
                  pixel-button px-6 py-2 font-tech text-base transition-all duration-200
                  ${selectedFilter === key
                    ? (key === 'data'
                      ? 'bg-accent-green text-primary-bg border-accent-green'
                      : 'bg-accent-orange text-primary-bg border-accent-orange')
                    : 'bg-primary-bg-light text-text-primary border-accent-orange-dark hover:border-accent-orange'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Swiper */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 32,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="projects-swiper"
          >
            {filteredProjects.map((project, index) => (
              <SwiperSlide key={project.id} className="h-auto">
                <div className="h-full">
                  <ProjectCard project={project} index={index} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation with TV Dial */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <button className="swiper-button-prev-custom pixel-button p-3 bg-primary-bg-light border-accent-orange-dark hover:border-accent-orange transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* TV Dial Navigation */}
            <VintageTVDial
              totalSlides={filteredProjects.length}
              currentSlide={currentSlide}
              onSlideChange={(index) => swiperInstance?.slideTo(index)}
              swiperInstance={swiperInstance}
            />

            <button className="swiper-button-next-custom pixel-button p-3 bg-primary-bg-light border-accent-orange-dark hover:border-accent-orange transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* No projects message with unconventional styling */}
        {filteredProjects.length === 0 && (
          <div className="relative py-20">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-accent-orange font-tech text-xs opacity-30">
              ERROR_404
            </div>
            <div className="text-center">
              <div className="text-accent-orange font-tech text-lg">
                [NO_PROJECTS_FOUND]
              </div>
              <div className="mt-4 text-text-secondary text-sm">
                Try adjusting your filter selection
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};