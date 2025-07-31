import React, { useRef, useState } from 'react';
import { VinylRecord } from '../ui/VinylRecord.tsx';
import { VinylLightbox } from '../ui/VinylLightbox.tsx';
import { InteractiveText } from '../ui/InteractiveText.tsx';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';

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
        <div className="w-full md:w-4/5 mx-auto mobile-padding relative z-10">
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

          {/* Responsive Layout */}
          <div className="flex flex-col gap-8">
            {/* Mobile/Tablet: Accordion Layout - FIXED */}
            <div className="md:hidden space-y-4" ref={albumListRef}>
              {ALBUM_DATA.map((album) => (
                <div key={album.id} className="space-y-4">
                  <div
                    onClick={() => handleAccordionItemClick(album)}
                    className={`
                      cursor-pointer p-4 transition-all duration-300 group relative
                      bg-primary-bg/50 backdrop-blur-sm rounded-lg
                      border border-accent-orange/10 hover:border-accent-orange/30
                      ${selectedAlbum.id === album.id
                        ? 'border-accent-orange shadow-lg shadow-accent-orange/20 bg-accent-orange/5'
                        : ''
                      }
                    `}
                    // Remove the animation classes for mobile to ensure visibility
                    style={{ opacity: 1, transform: 'none' }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Mini Record Icon */}
                      <div
                        className={`
                          w-16 h-16 rounded-full flex-shrink-0 relative
                          transition-all duration-500 bg-black
                          ${selectedAlbum.id === album.id
                            ? 'animate-spin shadow-lg shadow-accent-orange/30'
                            : 'group-hover:scale-110'
                          }
                        `}
                      >
                        {/* Record grooves */}
                        <div className="absolute inset-[2px] rounded-full border border-gray-700/50"></div>
                        <div className="absolute inset-[5px] rounded-full border border-gray-600/40"></div>
                        <div className="absolute inset-[8px] rounded-full border border-gray-500/30"></div>
                        <div className="absolute inset-[11px] rounded-full border border-gray-400/20"></div>

                        {/* Center colored label */}
                        <div
                          className="absolute inset-[20px] rounded-full shadow-inner"
                          style={{
                            backgroundColor: album.labelColor,
                            boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3)`
                          }}
                        >
                          {/* Center hole */}
                          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary-bg/70 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                      </div>

                      {/* Album Info - Ensure text is visible */}
                      <div className="flex-1 space-y-0.5">
                        <h3 className={`
                          font-retro text-base font-bold transition-all duration-300
                          ${selectedAlbum.id === album.id
                            ? 'text-accent-orange'
                            : 'text-white group-hover:text-accent-orange'
                          }
                        `}>
                          {album.title}
                        </h3>
                        <p className="text-gray-400 font-tech text-sm">
                          {album.artist}
                        </p>
                        <p className="text-gray-500 font-tech text-xs">
                          {album.year}
                        </p>
                      </div>

                      {/* Active Indicator */}
                      {selectedAlbum.id === album.id && (
                        <div className="w-2 h-2 bg-accent-orange rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Record Display - Collapsible */}
                  <div className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${selectedAlbum.id === album.id ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="flex justify-center items-center py-4">
                      <div className="w-full max-w-[280px] relative">
                        <VinylRecord
                          album={selectedAlbum}
                          index={ALBUM_DATA.findIndex(a => a.id === selectedAlbum.id)}
                          onClick={() => handleRecordClick(selectedAlbum)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Top-aligned Records with Hover Names */}
            <div className="hidden md:flex flex-col gap-8">
              {/* Record Icons Row */}
              <div ref={albumListRef} className="flex justify-center items-center gap-4 lg:gap-6 xl:gap-8 flex-wrap group/container">
                {ALBUM_DATA.map((album, index) => (
                  <div
                    key={album.id}
                    onClick={() => handleAccordionItemClick(album)}
                    className={`
                      cursor-pointer transition-all duration-500 group relative
                      ${getStaggeredClasses(index, 'slide')}
                    `}
                  >
                    {/* Record Icon */}
                    <div
                      className={`
                        w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full relative
                        transition-all duration-500 pixel-art bg-black
                        ${selectedAlbum.id === album.id
                          ? 'animate-spin shadow-lg shadow-accent-orange/30 scale-110'
                          : 'group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-black/30'
                        }
                      `}
                      style={{
                        filter: 'contrast(1.2) saturate(1.1)'
                      }}
                    >
                      {/* Enhanced record grooves */}
                      <div className="absolute inset-[2px] rounded-full border border-gray-700/70"></div>
                      <div className="absolute inset-[4px] lg:inset-[6px] rounded-full border border-gray-600/60"></div>
                      <div className="absolute inset-[6px] lg:inset-[10px] rounded-full border border-gray-500/50"></div>
                      <div className="absolute inset-[8px] lg:inset-[14px] rounded-full border border-gray-400/40"></div>

                      {/* Center colored label */}
                      <div
                        className="absolute inset-[16px] lg:inset-[24px] rounded-full shadow-inner"
                        style={{
                          backgroundColor: album.labelColor,
                          boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3)`
                        }}
                      >
                        {/* Center hole */}
                        <div className="absolute top-1/2 left-1/2 w-1 h-1 lg:w-1.5 lg:h-1.5 bg-primary-bg/70 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
                      </div>
                    </div>

                    {/* Hover Tooltip with Album Info */}
                    <div className={`
                      absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3
                      bg-primary-bg/95 backdrop-blur-sm border border-accent-orange/20 rounded-lg p-4
                      transition-all duration-300 pointer-events-none z-20 min-w-max
                      ${selectedAlbum.id === album.id
                        ? 'opacity-100 translate-y-0 group-hover/container:opacity-0 group-hover/container:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                        : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                      }
                    `}>
                      <div className="text-center space-y-1.5">
                        <h4 className="font-retro text-base font-bold text-accent-orange">
                          {album.title}
                        </h4>
                        <p className="text-text-secondary font-tech text-sm">
                          {album.artist}
                        </p>
                        <p className="text-text-secondary/70 font-tech text-sm">
                          {album.year}
                        </p>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px w-2 h-2 bg-primary-bg/95 border-r border-b border-accent-orange/20 rotate-45"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Record Display */}
              <div
                ref={recordDisplayRef}
                className={`flex justify-center items-center min-h-[500px] transition-all duration-700 relative ${recordDisplayVisible
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