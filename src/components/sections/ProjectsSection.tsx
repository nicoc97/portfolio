import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ProjectCard } from '../ui/ProjectCard';
import { VintageTVDial } from '../ui/VintageTVDial';
import { ScrollReveal } from '../animations/ScrollAnimations';
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
    status: 'wip',
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
    status: 'wip',
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
    status: 'wip',
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
    status: 'wip',
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
    status: 'wip',
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
    status: 'wip',
    completedDate: new Date('2024-06-18')
  }
];

export const ProjectsSection: React.FC = () => {
  // State management
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'web' | 'data' | 'fullstack'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed] = useState(5000); // autoplay delay

  // Animation hooks with reverse animations
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    animationType: 'slide',
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 100
  });
  const { ref: filtersRef, isVisible: filtersVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
    delay: 200,
    animationType: 'pixel',
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 150
  });
  const { ref: swiperRef, isVisible: swiperVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    delay: 400,
    animationType: 'fade',
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 200
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

  // 🔧 UPDATE: Modify filter categories here if you have different project types
  const filterButtons = [
    { key: 'all', label: 'ALL PROJECTS' },
    { key: 'web', label: 'WEB APPS' },
    { key: 'data', label: 'DATA SCIENCE' },
    { key: 'fullstack', label: 'FULL-STACK' }
  ] as const;

  return (
    <section id="projects" className="section-fullscreen py-20 bg-primary-bg relative overlay-hidden">

      <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
        {/* Large background text */}
        <div className="section-bg-text">
          <span>SEC01</span>
        </div>

        {/* Section header with scroll animations */}
        <div className="relative mb-12 md:mb-20">
          <ScrollReveal threshold={0.2} effect="materialize" reverseOnExit={true}>
            {/* header layout */}
            <div
              ref={headerRef}
              className={`text-left space-y-6 animate-slide-up ${headerVisible ? 'visible' : ''}`}
            >
              <div className="relative">
                <h2 className="section-header">PROJECTS</h2>
                {/* decorative line */}
                <div className="section-divider w-32"></div>
              </div>

              {/* description */}
              <div className="max-w-2xl">
                <p className="text-text-secondary text-sm leading-relaxed">
                  A collection of web applications, data science projects, and creative experiments
                  showcasing modern development practices.
                </p>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Filter Buttons - Top Aligned */}
        <div className="md:mb-12">
          <div
            ref={filtersRef}
            className={`animate-pixel ${filtersVisible ? 'visible' : ''}`}
          >
            {/* filter buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {filterButtons.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key)}
                  className={`
                    px-6 py-3 rounded-lg font-tech border-2 transition-all duration-200
                    ${selectedFilter === key
                      ? (key === 'data'
                        ? 'bg-accent-green text-primary-bg border-accent-green shadow-lg transform -translate-y-1'
                        : 'bg-accent-orange text-primary-bg border-accent-orange shadow-lg transform -translate-y-1'
                      )
                      : 'tech-badge-secondary hover:-translate-y-1'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{label}</span>
                    <span className="text-sm opacity-70">
                      ({key === 'all' ? sampleProjects.length : sampleProjects.filter(p => p.category === key).length})
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Swiper */}
        <div className="w-full">
          <div
            ref={swiperRef}
            className={`relative animate-fade ${swiperVisible ? 'visible' : ''}`}
          >
            <div
              onMouseEnter={() => swiperInstance?.autoplay.stop()}
              onMouseLeave={() => isPlaying && swiperInstance?.autoplay.start()}
            >
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={40}
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
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 32,
                  },
                  768: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 36,
                  },
                  1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                    spaceBetween: 40,
                  },
                }}
                className="projects-swiper pb-8"
              >
                {filteredProjects.map((project, index) => {
                  // Only apply asymmetrical positioning on desktop (lg and above)
                  const isOdd = index % 2 === 1;
                  return (
                    <SwiperSlide key={project.id} className="h-auto">
                      <div
                        className={`h-full transition-all duration-300 ${isOdd ? 'lg:transform lg:-translate-y-8 lg:-mt-2' : ''}`}
                      >
                        <ProjectCard project={project} index={index} />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {/* Controls and Dial Layout */}
            <div className="mt-4 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
              {/* Hi-Fi Style Controls */}
              <div className="flex justify-center lg:justify-start items-center">
                {/* Transport Controls */}
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
                </div>
              </div>

              {/* Vintage Radio Dial */}
              <ScrollReveal threshold={0.3} delay={300} effect="glitch" reverseOnExit={true}>
                <div className="flex justify-center lg:justify-end">
                  <VintageTVDial
                    totalSlides={filteredProjects.length}
                    currentSlide={currentSlide}
                    onSlideChange={(index) => swiperInstance?.slideTo(index)}
                    swiperInstance={swiperInstance}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};