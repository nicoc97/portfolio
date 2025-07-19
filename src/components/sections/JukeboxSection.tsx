import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { VinylRecord } from '../ui/VinylRecord.tsx';
import { VinylLightbox } from '../ui/VinylLightbox.tsx';
import { VintageTVDial } from '../ui/VintageTVDial';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/swiper-bundle.css';
import '../../styles/swiper-custom.css';

/**
 * JukeboxSection Component
 * 
 * Interactive vinyl record collection with Three.js animations.
 * Features scroll-triggered animations and clickable records that open in a lightbox.
 */

export interface AlbumData {
  id: string;
  title: string;
  artist: string;
  year: string;
  labelColor: string;
  accentColor: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

const ALBUM_DATA: AlbumData[] = [
  {
    id: 'cosmic-voyage',
    title: 'Cosmic Voyage',
    artist: 'The Groove Masters',
    year: 'Released Summer \'77',
    labelColor: '#ff8c42',
    accentColor: '#7c9756',
    spotifyUrl: 'https://open.spotify.com/track/example',
    appleMusicUrl: 'https://music.apple.com/example'
  },
  {
    id: 'electric-dreams',
    title: 'Electric Dreams',
    artist: 'Funkadelic Sunrise',
    year: 'Released Fall \'76',
    labelColor: '#7c9756',
    accentColor: '#ff8c42',
    spotifyUrl: 'https://open.spotify.com/track/example',
    appleMusicUrl: 'https://music.apple.com/example'
  },
  {
    id: 'sunset-boulevard',
    title: 'Sunset Boulevard',
    artist: 'The Velvet Underground Revival',
    year: 'Released Spring \'78',
    labelColor: '#d4c4a0',
    accentColor: '#b85c00',
    spotifyUrl: 'https://open.spotify.com/track/example',
    appleMusicUrl: 'https://music.apple.com/example'
  },
  {
    id: 'neon-nights',
    title: 'Neon Nights',
    artist: 'Disco Dynamics',
    year: 'Released Winter \'79',
    labelColor: '#ffb380',
    accentColor: '#5a6e3f',
    spotifyUrl: 'https://open.spotify.com/track/example',
    appleMusicUrl: 'https://music.apple.com/example'
  },
  {
    id: 'disco-fever',
    title: 'Disco Fever',
    artist: 'Studio 77',
    year: 'Released Summer \'77',
    labelColor: '#b85c00',
    accentColor: '#d4c4a0',
    spotifyUrl: 'https://open.spotify.com/track/example',
    appleMusicUrl: 'https://music.apple.com/example'
  },
  {
    id: 'moonlight-serenade',
    title: 'Moonlight Serenade',
    artist: 'The Midnight Express',
    year: 'Released Fall \'78',
    labelColor: '#5a6e3f',
    accentColor: '#ffb380',
    spotifyUrl: 'https://open.spotify.com/track/example',
    appleMusicUrl: 'https://music.apple.com/example'
  }
];

interface JukeboxSectionProps {
  onLightboxStateChange?: (isOpen: boolean) => void;
}

export const JukeboxSection: React.FC<JukeboxSectionProps> = ({ onLightboxStateChange }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleRecordClick = (album: AlbumData) => {
    setSelectedAlbum(album);
    setIsLightboxOpen(true);
    onLightboxStateChange?.(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedAlbum(null);
    onLightboxStateChange?.(false);
  };

  // Handle hover to pause/resume autoplay
  const handleMouseEnter = () => {
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.start();
    }
  };

  return (
    <>
      <section
        id="jukebox"
        ref={sectionRef}
        className="py-20 bg-primary-bg relative overflow-hidden min-h-screen"
      >
        {/* Large background text */}
        <div className="absolute inset-0 flex items-start pt-[2rem] pl-[2rem] justify-start opacity-5 pointer-events-none">
          <span className="text-[12rem] md:text-[15rem] lg:text-[18rem] font-bold text-accent-orange font-retro leading-none">04</span>
        </div>

        <div className="w-full lg:w-4/5 mx-auto mobile-padding relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-accent-orange font-retro mb-4">
              GROOVE COLLECTION
            </h2>
            <div className="mx-auto w-16 h-px bg-accent-orange mb-6"></div>
            <p className="text-accent-orange font-tech text-lg">
              Spin the Vinyl ↻ Click to Play
            </p>
          </div>

          {/* Vinyl Records Swiper */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
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
                delay: 4000,
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
              className="vinyl-swiper"
            >
              {ALBUM_DATA.map((album, index) => (
                <SwiperSlide key={album.id} className="h-auto">
                  <div className="h-full">
                    <VinylRecord
                      album={album}
                      index={index}
                      onClick={() => handleRecordClick(album)}
                    />
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
                totalSlides={ALBUM_DATA.length}
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

          {/* Hint text */}
          <div className="text-center mt-16">
            <p className="text-accent-orange font-tech text-lg animate-pixel-pulse">
              // Far Out, Man //
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedAlbum && (
        <VinylLightbox
          album={selectedAlbum}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};