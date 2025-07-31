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
  albumArtUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

// Track collection data
const ALBUM_DATA: AlbumData[] = [
  {
    id: 'too-late',
    title: 'Too Late to Turn Back Now',
    artist: 'Cornelius Brothers & Sister Rose',
    year: 'Released 1972',
    labelColor: '#8B4513',
    accentColor: '#FFD700',
    spotifyUrl: 'https://open.spotify.com/track/2OyaNAq8BcGstyzueloqpE',
    appleMusicUrl: 'https://music.apple.com/us/artist/cornelius-brothers-sister-rose/19280425',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e025e7f7ea6cb07e6222bc51f41'
  },
  {
    id: 'bela-lugosi',
    title: 'Bela Lugosi\'s Dead',
    artist: 'Bauhaus',
    year: 'Released August \'79',
    labelColor: '#000000',
    accentColor: '#8B0000',
    spotifyUrl: 'https://open.spotify.com/track/0JfWS5txNJcbTHnJavTImO',
    appleMusicUrl: 'https://music.apple.com/us/song/bela-lugosis-dead/160070993',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e02d951700560c3627500821e24'
  },
  {
    id: 'cherry-bomb',
    title: 'Cherry Bomb',
    artist: 'The Runaways',
    year: 'Released 1976',
    labelColor: '#DC143C',
    accentColor: '#000000',
    spotifyUrl: 'https://open.spotify.com/track/7cdnq45E9aP2XDStHg5vd7',
    appleMusicUrl: 'https://music.apple.com/us/album/the-runaways/1440747926',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e02a1c553575418ca43404cb48b'
  },
  {
    id: 'give-me-night',
    title: 'Give Me the Night',
    artist: 'George Benson',
    year: 'Released 1980',
    labelColor: '#191970',
    accentColor: '#FFD700',
    spotifyUrl: 'https://open.spotify.com/track/5gaUkg5JNk8c4mr2jnpX8H',
    appleMusicUrl: 'https://music.apple.com/us/album/give-me-the-night/309576571',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e029877c2b01fca3367809f9e27'
  },
  {
    id: 'stay-with-me',
    title: 'Stay with Me',
    artist: 'Miki Matsubara',
    year: 'Released November \'79',
    labelColor: '#FF69B4',
    accentColor: '#4B0082',
    spotifyUrl: 'https://open.spotify.com/track/2BHj31ufdEqVK5CkYDp9mA',
    appleMusicUrl: 'https://music.apple.com/us/song/mayonaka-no-door-stay-with-me/1457961960',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e0281052badd62d5e14c3377786'
  },
  {
    id: 'rip-it-up',
    title: 'Rip It Up',
    artist: 'Orange Juice',
    year: 'Released February \'83',
    labelColor: '#FF8C00',
    accentColor: '#000000',
    spotifyUrl: 'https://open.spotify.com/track/1eamsmwcYYhJwTgMFdQ6YN',
    appleMusicUrl: 'https://music.apple.com/us/album/rip-it-up/1183408278',
    albumArtUrl: 'https://i.scdn.co/image/ab67616d00001e0255e7c78ec58c4670bc0180fb'
  }
];

interface JukeboxSectionProps {
  onLightboxStateChange?: (isOpen: boolean) => void;
}

export const JukeboxSection: React.FC<JukeboxSectionProps> = ({ onLightboxStateChange }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData>(ALBUM_DATA[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Animation hooks with reverse animations
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
    animationType: 'slide',
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 100
  });
  const { triggerRef: albumListRef, getStaggeredClasses } = useStaggeredAnimation<HTMLDivElement>(
    ALBUM_DATA.length,
    100,
    { 
      threshold: 0.2,
      triggerOnce: false,
      reverseOnExit: true
    }
  );
  const { ref: recordDisplayRef, isVisible: recordDisplayVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
    delay: 400,
    animationType: 'pixel',
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 200
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
        <div className="w-full lg:w-4/5 xl:w-3/5 mx-auto mobile-padding relative z-10">
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
            <h2 className="section-header">JUKEBOX</h2>
            <div className="section-divider mb-6"></div>
            <p className="section-subtitle mb-4">You'll Love This One</p>
            <p className="text-text-secondary text-left text-sm leading-relaxed max-w-2xl">
              An excuse to show off some three.js
            </p>
          </div>

          {/* Accordion Layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Record List (Accordion) - Modern borderless design */}
            <div ref={albumListRef} className="lg:w-1/2 xl:w-2/5 space-y-6">
              {ALBUM_DATA.map((album, index) => (
                <div key={album.id} className="space-y-6">
                  <div
                    onClick={() => handleAccordionItemClick(album)}
                    className={`
                      cursor-pointer p-6 transition-all duration-500 group relative
                      hover:bg-accent-green/5 hover:backdrop-blur-sm hover:rounded-r-full
                      ${selectedAlbum.id === album.id
                        ? 'border-l-2 border-accent-orange'
                        : ''
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
                          font-retro text-xl lg:text-lg xl:text-xl font-bold transition-all duration-300
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
              className={`hidden lg:flex lg:w-1/2 xl:w-3/5 justify-center items-center min-h-[500px] transition-all duration-700 relative ${recordDisplayVisible
                ? 'opacity-100 translate-y-0 scale-100 blur-none'
                : 'opacity-0 translate-y-4 scale-95 blur-sm'
                }`}
            >
              {/* Background repeated track names */}
              <div className="absolute inset-0">
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
                          // Safari-specific fixes for text stroke
                          textShadow: '0 0 1px currentColor',
                          fontWeight: 'bold',
                          letterSpacing: '0.05em',
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