import React, { useRef, useState } from 'react';
import { VinylRecord } from '../ui/VinylRecord.tsx';
import { VinylLightbox } from '../ui/VinylLightbox.tsx';

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
          <div className="text-left mb-16">
            <h2 className="text-5xl md:text-[6rem] font-bold tracking-wide font-retro text-left">
              GROOVE<br></br>COLLECTION
            </h2>
            <div className="mt-4 w-16 h-px bg-accent-orange mb-6"></div>
            <p className="text-accent-orange font-tech text-lg">
              Click to Play
            </p>
          </div>

          {/* Accordion Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Record List (Accordion) */}
            <div className="lg:w-1/2 space-y-4">
              {ALBUM_DATA.map((album) => (
                <div
                  key={album.id}
                  onClick={() => handleAccordionItemClick(album)}
                  className={`
                    cursor-pointer p-4 rounded-lg border-2 transition-all duration-300
                    ${selectedAlbum.id === album.id
                      ? 'border-accent-orange bg-primary-bg-light shadow-lg'
                      : 'border-accent-orange-dark hover:border-accent-orange bg-primary-bg-light/50'
                    }
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
              ))}
            </div>

            {/* Selected Record Display */}
            <div className="lg:w-1/2 flex justify-center items-center min-h-[500px]">
              <div className="w-full max-w-lg">
                <VinylRecord
                  album={selectedAlbum}
                  index={ALBUM_DATA.findIndex(album => album.id === selectedAlbum.id)}
                  onClick={() => handleRecordClick(selectedAlbum)}
                />
              </div>
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
      <VinylLightbox
        album={selectedAlbum}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
      />
    </>
  );
};