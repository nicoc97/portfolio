import React, { useRef, useState } from 'react';
import { VinylRecord } from '../ui/VinylRecord.tsx';
import { VinylLightbox } from '../ui/VinylLightbox.tsx';
import { InteractiveText } from '../ui/InteractiveText.tsx';
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
        className="section-fullscreen py-20 bg-primary-bg relative overflow-hidden"
      >
        <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
          {/* Large background text */}
          <div className="section-bg-text">
            <span>SEC03</span>
          </div>

          {/* Section Header */}
          <div
            ref={headerRef}
            className={`text-left mb-16 transition-all duration-700 ${headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}
          >
            <h2 className="section-header">
              JUKEBOX
            </h2>
            <div className="mt-4 w-16 h-px bg-accent-orange mb-6"></div>
            <p className="text-accent-orange font-tech text-lg">
              You'll Love This One
            </p>
          </div>

          {/* Accordion Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Record List (Accordion) - Modern borderless design */}
            <div ref={albumListRef} className="lg:w-2/5 space-y-6">
              {ALBUM_DATA.map((album, index) => (
                <div key={album.id} className="space-y-6">
                  <div
                    onClick={() => handleAccordionItemClick(album)}
                    className={`
                      cursor-pointer p-6 transition-all duration-500 group relative
                      ${selectedAlbum.id === album.id
                        ? 'border-l-2 border-accent-orange'
                        : 'hover:bg-white/5 hover:backdrop-blur-sm hover:shadow-xl hover:shadow-black/20'
                      }
                      ${getStaggeredClasses(index, 'slide')}
                    `}
                  >
                    <div className="flex items-center gap-6">
                      {/* Mini Record Icon - Enhanced */}
                      <div
                        className={`
                          w-20 h-20 rounded-full flex-shrink-0 relative
                          transition-all duration-500 pixel-art bg-black
                          ${selectedAlbum.id === album.id
                            ? 'animate-spin shadow-lg shadow-accent-orange/30'
                            : 'group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-black/30'
                          }
                        `}
                        style={{
                          filter: 'contrast(1.2) saturate(1.1)'
                        }}
                      >
                        {/* Enhanced record grooves */}
                        <div className="absolute inset-[2px] rounded-full border border-gray-700/70"></div>
                        <div className="absolute inset-[6px] rounded-full border border-gray-600/60"></div>
                        <div className="absolute inset-[10px] rounded-full border border-gray-500/50"></div>
                        <div className="absolute inset-[14px] rounded-full border border-gray-400/40"></div>

                        {/* Center colored label - larger */}
                        <div
                          className="absolute inset-[24px] rounded-full shadow-inner"
                          style={{
                            backgroundColor: album.labelColor,
                            boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3)`
                          }}
                        >
                          {/* Center hole */}
                          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-primary-bg/70 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
                        </div>
                      </div>

                      {/* Album Info - Enhanced typography */}
                      <div className="flex-1 space-y-1">
                        <h3 className={`
                          font-retro text-xl font-bold transition-all duration-300
                          ${selectedAlbum.id === album.id
                            ? 'text-accent-orange'
                            : 'text-text-primary group-hover:text-accent-orange'
                          }
                        `}>
                          {album.title}
                        </h3>
                        <p className="text-text-secondary font-tech text-sm opacity-90">
                          {album.artist}
                        </p>
                        <p className="text-text-secondary/70 font-tech text-xs">
                          {album.year}
                        </p>
                      </div>

                      {/* Active Indicator - Minimal */}
                      <div className={`
                        transition-all duration-300 flex items-center
                        ${selectedAlbum.id === album.id ? 'opacity-100' : 'opacity-0'}
                      `}>
                        {selectedAlbum.id === album.id && (
                          <div className="w-2 h-2 bg-accent-orange rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile/Tablet Record Display - appears directly below selected item */}
                  {selectedAlbum.id === album.id && (
                    <div className="lg:hidden flex justify-center items-center py-8 relative">
                      {/* Background repeated track names - mobile version */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="relative h-full w-full flex flex-col justify-between py-4">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center px-2 opacity-[0.15]"
                            >
                              <InteractiveText
                                text={selectedAlbum.title.toUpperCase()}
                                className="text-accent-orange font-retro font-bold select-none"
                                style={{
                                  fontSize: 'clamp(1rem, 8vw, 2rem)',
                                  WebkitTextStroke: '1px currentColor',
                                  WebkitTextFillColor: 'transparent',
                                }}
                                magnetStrength={25}
                              />
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
              className={`hidden lg:flex lg:w-3/5 justify-center items-center min-h-[500px] transition-all duration-700 relative ${recordDisplayVisible
                ? 'opacity-100 translate-y-0 scale-100 blur-none'
                : 'opacity-0 translate-y-4 scale-95 blur-sm'
                }`}
            >
              {/* Background repeated track names */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="relative h-full w-full flex flex-col justify-between">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center opacity-[0.3]"
                    >
                      <InteractiveText
                        text={selectedAlbum.title.toUpperCase()}
                        className="text-accent-orange font-retro font-bold select-none"
                        style={{
                          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                          WebkitTextStroke: '1px currentColor',
                          WebkitTextFillColor: 'transparent',
                        }}
                        magnetStrength={40}
                      />
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