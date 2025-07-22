import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ProjectCard } from '../ui/ProjectCard';
import { VintageTVDial } from '../ui/VintageTVDial';
import { ScrollReveal, StaggeredList, ParallaxText } from '../animations/ScrollAnimations';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(5000); // autoplay delay

  // Animation hooks
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.2, 
    animationType: 'slide' 
  });
  const { ref: filtersRef, isVisible: filtersVisible } = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.3, 
    delay: 200,
    animationType: 'pixel' 
  });
  const { ref: swiperRef, isVisible: swiperVisible } = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.1, 
    delay: 400,
    animationType: 'fade' 
  });

  // Filter projects
  const filteredProjects = selectedFilter === 'all'
    ? sampleProjects
    : sampleProjects.filter(project => project.category === selectedFilter);

  // Hi-Fi Control Functions
  const handlePlayPause = () => {
    if (!swiperInstance) return;

    if (isPlaying) {
      swiperInstance.autoplay.stop();
      setIsPlaying(false);
    } else {
      swiperInstance.autoplay.start();
      setIsPlaying(true);
    }
  };

  const handleRewind = () => {
    if (!swiperInstance) return;
    swiperInstance.slideTo(0);
  };

  const handleFastForward = () => {
    if (!swiperInstance) return;
    swiperInstance.slideTo(filteredProjects.length - 1);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (swiperInstance && isPlaying) {
      swiperInstance.autoplay.stop();
      // Update autoplay delay
      if (swiperInstance.params.autoplay && typeof swiperInstance.params.autoplay === 'object') {
        swiperInstance.params.autoplay.delay = newSpeed;
      }
      swiperInstance.autoplay.start();
    }
  };

  // 🔧 UPDATE: Modify filter categories here if you have different project types
  const filterButtons = [
    { key: 'all', label: 'ALL PROJECTS' },
    { key: 'web', label: 'WEB APPS' },
    { key: 'data', label: 'DATA SCIENCE' },
    { key: 'fullstack', label: 'FULL-STACK' }
  ] as const;

  return (
    <section id="projects" className="py-20 bg-primary-bg relative overflow-hidden">
      {/* Parallax background text */}
      <ParallaxText text="01" speed={0.15} opacity={0.05} />

      {/* Pixel background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent-green animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent-orange animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-accent-green animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-accent-orange animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
        {/* Section header with scroll animations */}
        <div className="relative mb-20">
          <ScrollReveal threshold={0.2} effect="materialize">
            {/*  header layout with vintage dial */}
            <div className="flex items-start justify-between gap-8">
              <div 
                ref={headerRef}
                className={`text-left space-y-6 flex-1 transition-all duration-700 ${headerVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="relative">
                  <h2 className="text-5xl md:text-[6rem] font-bold tracking-wide font-retro">
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

              {/* Vintage Radio Dial - positioned to the right of header */}
              <ScrollReveal threshold={0.3} delay={300} effect="glitch">
                <div className="flex-shrink-0 mt-4">
                  <VintageTVDial
                    totalSlides={filteredProjects.length}
                    currentSlide={currentSlide}
                    onSlideChange={(index) => swiperInstance?.slideTo(index)}
                    swiperInstance={swiperInstance}
                  />
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>

          {/* filter buttons with staggered animation */}
          <div 
            ref={filtersRef}
            className={`mt-4 flex flex-wrap gap-3 justify-center transition-all duration-700 ${filtersVisible 
              ? 'opacity-100 translate-y-0 scale-100 blur-none' 
              : 'opacity-0 translate-y-4 scale-95 blur-sm'
            }`}
          >
            <StaggeredList
              items={filterButtons.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key)}
                  className={`
                    pixel-button px-6 py-2 font-tech transition-all duration-200
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
              className="flex flex-wrap gap-3 justify-center"
              staggerDelay={100}
              animationType="pixel"
            />
          </div>
        </div>

        {/* Projects Swiper */}
        <div 
          ref={swiperRef}
          className={`relative transition-all duration-700 ${swiperVisible 
            ? 'opacity-100' 
            : 'opacity-0'
          }`}
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            slidesPerGroup={1}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            autoplay={{
              delay: playbackSpeed,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 32,
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 1,
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

          {/* Hi-Fi Style Controls */}
          <div className="flex justify-center items-center mt-4">
            {/* Left Side: Transport Controls */}
            <div className="flex items-center gap-3">
              {/* Rewind */}
              <button
                onClick={handleRewind}
                className="p-3 transition-all duration-200 group text-text-secondary hover:text-accent-orange"
                title="Rewind to start"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11,19 2,12 11,5" />
                  <polygon points="22,19 13,12 22,5" />
                </svg>
              </button>

              {/* Previous (Skip Back) */}
              <button
                className="swiper-button-prev-custom p-3 transition-all duration-200 group text-text-secondary hover:text-accent-orange"
                title="Previous track"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="19,20 9,12 19,4" />
                  <line x1="5" y1="19" x2="5" y2="5" />
                </svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="p-4 transition-all duration-200 group text-text-secondary hover:text-accent-orange"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>

              {/* Next (Skip Forward) */}
              <button
                className="swiper-button-next-custom p-3 transition-all duration-200 group text-text-secondary hover:text-accent-orange"
                title="Next track"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5,4 15,12 5,20" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
              </button>

              {/* Fast Forward */}
              <button
                onClick={handleFastForward}
                className="p-3 transition-all duration-200 group text-text-secondary hover:text-accent-orange"
                title="Fast forward to end"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13,19 22,12 13,5" />
                  <polygon points="2,19 11,12 2,5" />
                </svg>
              </button>

              {/* Speed Control */}
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xs text-text-secondary font-tech">SPEED</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  className="text-xs bg-transparent text-text-secondary hover:text-accent-orange transition-colors duration-200 cursor-pointer"
                >
                  <option value={2000}>2x</option>
                  <option value={3000}>1.5x</option>
                  <option value={5000}>1x</option>
                  <option value={8000}>0.5x</option>
                </select>
              </div>
            </div>


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