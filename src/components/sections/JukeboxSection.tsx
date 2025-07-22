import React, { useRef, useState } from 'react';
import { VinylRecord } from '../ui/VinylRecord.tsx';
import { VinylLightbox } from '../ui/VinylLightbox.tsx';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';

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
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData>(ALBUM_DATA[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Animation hooks
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.3, 
    animationType: 'slide' 
  });
  const { triggerRef: albumListRef, getStaggeredClasses } = useStaggeredAnimation<HTMLDivElement>(
    ALBUM_DATA.length,
    100,
    { threshold: 0.2 }
  );
  const { ref: recordDisplayRef, isVisible: recordDisplayVisible } = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.3, 
    delay: 400,
    animationType: 'pixel' 
  });

  const handleRecordClick = (album: AlbumData) => {
    setSelectedAlbum(album);
    setIsLightboxOpen(true);
    onLightboxStateChange?.(true);
  };

  const handleAccordionItemClick = (album: AlbumData) => {
    setSelectedAlbum(album);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    onLightboxStateChange?.(false);
  };

  return (
    <>
      <section
        id="jukebox"
        ref={sectionRef}
        className="py-20 bg-primary-bg relative overflow-hidden min-h-screen"
      >
        {/* Large background text */}
        <div className="absolute inset-0 flex items-start pt-[2rem] pr-[2rem] justify-end opacity-5 pointer-events-none">
          <span className="text-[12rem] md:text-[15rem] lg:text-[18rem] font-bold text-accent-orange font-retro leading-none tracking-tight">03</span>
        </div>

        <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
          {/* Section Header */}
          <div 
            ref={headerRef}
            className={`text-left mb-16 transition-all duration-700 ${headerVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-5xl md:text-[6rem] font-bold tracking-wide font-retro text-left">
              JUKEBOX
            </h2>
            <div className="mt-4 w-16 h-px bg-accent-orange mb-6"></div>
            <p className="text-accent-orange font-tech text-lg">
              Click to Play
            </p>
          </div>

          {/* Accordion Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Record List (Accordion) */}
            <div ref={albumListRef} className="lg:w-1/2 space-y-4">
              {ALBUM_DATA.map((album, index) => (
                <div key={album.id} className="space-y-4">
                  <div
                    onClick={() => handleAccordionItemClick(album)}
                    className={`
                      cursor-pointer p-4 rounded-lg border-2 transition-all duration-300
                      ${selectedAlbum.id === album.id
                        ? 'border-accent-orange bg-primary-bg-light shadow-lg'
                        : 'border-accent-orange-dark hover:border-accent-orange bg-primary-bg-light/50'
                      }
                      ${getStaggeredClasses(index, 'slide')}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Mini Record Icon */}
                      <div
                        className={`
                          w-[68px] h-[68px] rounded-full flex-shrink-0 relative
                          transition-all duration-300 pixel-art bg-black
                          ${selectedAlbum.id === album.id ? 'animate-spin' : ''}
                        `}
                        style={{
                          filter: 'contrast(1.2) saturate(1.1)'
                        }}
                      >
                        {/* Subtle record grooves */}
                        <div className="absolute inset-[2px] rounded-full border border-gray-700/70"></div>
                        <div className="absolute inset-[8px] rounded-full border border-gray-600/60"></div>
                        <div className="absolute inset-[14px] rounded-full border border-gray-500/50"></div>

                        {/* Center colored label */}
                        <div
                          className="absolute inset-[22px] rounded-full"
                          style={{
                            backgroundColor: album.labelColor,
                          }}
                        >
                          {/* Center hole */}
                          <div
                            className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary-bg/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                          ></div>
                        </div>
                      </div>

                      {/* Album Info */}
                      <div className="flex-1">
                        <h3 className="text-accent-orange font-retro text-lg font-bold">
                          {album.title}
                        </h3>
                        <p className="text-accent-orange-dark font-tech text-sm">
                          {album.artist}
                        </p>
                        <p className="text-accent-orange-dark font-tech text-xs">
                          {album.year}
                        </p>
                      </div>

                      {/* Play/Pause Indicator */}
                      {selectedAlbum.id === album.id && (
                        <div className="text-accent-orange">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile/Tablet Record Display - appears directly below selected item */}
                  {selectedAlbum.id === album.id && (
                    <div className="lg:hidden flex justify-center items-center py-8 relative">
                      {/* Background repeated track names - mobile version */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="relative h-full w-full flex flex-col justify-between py-4">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="text-accent-orange font-retro font-bold opacity-[0.15] select-none text-center truncate px-2"
                              style={{
                                fontSize: 'clamp(1rem, 8vw, 2rem)',
                                WebkitTextStroke: '1px currentColor',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {selectedAlbum.title.toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="w-full max-w-sm relative z-10">
                        <VinylRecord
                          album={selectedAlbum}
                          index={ALBUM_DATA.findIndex(a => a.id === selectedAlbum.id)}
                          onClick={() => handleRecordClick(selectedAlbum)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Record Display - side panel */}
            <div 
              ref={recordDisplayRef}
              className={`hidden lg:flex lg:w-1/2 justify-center items-center min-h-[500px] transition-all duration-700 relative ${recordDisplayVisible 
                ? 'opacity-100 translate-y-0 scale-100 blur-none' 
                : 'opacity-0 translate-y-4 scale-95 blur-sm'
              }`}
            >
              {/* Background repeated track names */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="relative h-full w-full flex flex-col justify-between py-8">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="text-accent-orange font-retro font-bold opacity-[0.3] select-none text-center truncate px-4"
                      style={{
                        fontSize: 'clamp(1.5rem, 6vw, 4rem)',
                        WebkitTextStroke: '1px currentColor',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {selectedAlbum.title.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full max-w-lg relative z-10">
                <VinylRecord
                  album={selectedAlbum}
                  index={ALBUM_DATA.findIndex(album => album.id === selectedAlbum.id)}
                  onClick={() => handleRecordClick(selectedAlbum)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <VinylLightbox
        album={selectedAlbum}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
      />
    </>
  );
};