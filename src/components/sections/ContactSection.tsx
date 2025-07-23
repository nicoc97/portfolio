import React, { useState } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';

/**
 * ContactSection Component
 * 
 * Professional contact section with pixel-styled elements including:
 * - Contact information display with pixel styling
 * - Social media links with custom pixel art icons
 * - CV download functionality with animated loading state
 * - Copy-to-clipboard feature with visual feedback
 */
export const ContactSection: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Animation hooks
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.3, 
    animationType: 'slide' 
  });
  const { triggerRef: contactDetailsRef, getStaggeredClasses } = useStaggeredAnimation<HTMLDivElement>(
    3, // email, location, phone
    150,
    { threshold: 0.2 }
  );
  const { triggerRef: socialLinksRef, getStaggeredClasses: getSocialClasses } = useStaggeredAnimation<HTMLDivElement>(
    3, // GitHub, LinkedIn, CV download
    100,
    { threshold: 0.2 }
  );

  // Handle CV download with loading state
  const handleCVDownload = async () => {
    setIsDownloading(true);

    // Simulate download process
    try {
      // In a real implementation, this would download the actual CV file
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = '/cv.pdf'; // This would be the actual CV file path
      link.download = 'Nico_Cruickshank_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle copy to clipboard with visual feedback
  const handleCopyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`${type} copied!`);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      setCopyFeedback('Copy failed');
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-primary-bg relative overflow-hidden min-h-screen">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-start pt-[2rem] pr-[2rem] justify-end opacity-5 pointer-events-none">
        <span className="text-[12rem] md:text-[15rem] lg:text-[18rem] font-bold text-accent-orange font-retro leading-none tracking-tight">05</span>
      </div>

      <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
        <div className="text-left space-y-8">
          {/* Section Header */}
          <div 
            ref={headerRef}
            className={`space-y-4 transition-all duration-700 ${headerVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-5xl md:text-[6rem] font-bold tracking-wide font-retro text-left">
              CONTACT
            </h2>
            <div className="mt-4 w-16 h-px bg-accent-orange"></div>
            <p className="text-text-secondary text-lg max-w-2xl">
              Ready to build something amazing together? Let's connect and discuss your next project.
            </p>
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">

            {/* Contact Details */}
            <div ref={contactDetailsRef} className="space-y-6">
              <h3 className="text-2xl font-bold text-text-primary font-tech">
                GET IN TOUCH
              </h3>

              {/* Email */}
              <div 
                className={`pixel-card group cursor-pointer ${getStaggeredClasses(0, 'slide')}`}
                onClick={() => handleCopyToClipboard('nico@example.com', 'Email')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-accent-orange">
                    {/* Pixel Email Icon */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M2 4h20v2l-10 6L2 6V4zm0 4v12h20V8l-10 6L2 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-text-primary font-tech text-lg">nico@example.com</p>
                    <p className="text-text-secondary text-sm">Click to copy</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className={`pixel-card ${getStaggeredClasses(1, 'slide')}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-accent-green">
                    {/* Pixel Location Icon */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-text-primary font-tech text-lg">Glasgow, UK</p>
                    <p className="text-text-secondary text-sm">Available for remote work</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div 
                className={`pixel-card group cursor-pointer ${getStaggeredClasses(2, 'slide')}`}
                onClick={() => handleCopyToClipboard('+44 7XXX XXXXXX', 'Phone')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 text-accent-orange">
                    {/* Pixel Phone Icon */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-text-primary font-tech text-lg">+44 7XXX XXXXXX</p>
                    <p className="text-text-secondary text-sm">Click to copy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links & Actions */}
            <div ref={socialLinksRef} className="space-y-6">
              <h3 className="text-2xl font-bold text-text-primary font-tech">
                CONNECT & DOWNLOAD
              </h3>

              {/* Social Media Links */}
              <div className="space-y-4">
                {/* GitHub */}
                <a
                  href="https://github.com/nicocruickshank"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pixel-card-green group block hover:scale-105 transition-transform duration-200 ${getSocialClasses(0, 'slide')}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 text-accent-green">
                      {/* Pixel GitHub Icon */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-text-primary font-tech text-lg">GitHub</p>
                      <p className="text-text-secondary text-sm">View my repositories</p>
                    </div>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/nicocruickshank"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pixel-card group block hover:scale-105 transition-transform duration-200 ${getSocialClasses(1, 'slide')}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 text-accent-orange">
                      {/* Pixel LinkedIn Icon */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-text-primary font-tech text-lg">LinkedIn</p>
                      <p className="text-text-secondary text-sm">Professional profile</p>
                    </div>
                  </div>
                </a>
              </div>

              {/* CV Download */}
              <div className={`mt-8 ${getSocialClasses(2, 'scale')}`}>
                <PixelButton
                  variant="primary"
                  size="lg"
                  onClick={handleCVDownload}
                  disabled={isDownloading}
                  className="w-full justify-center"
                >
                  {isDownloading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-accent-orange border-t-transparent rounded-full animate-spin"></div>
                      <span>DOWNLOADING...</span>
                    </div>
                  ) : (
                    'DOWNLOAD CV'
                  )}
                </PixelButton>
              </div>
            </div>
          </div>

          {/* Copy Feedback */}
          {copyFeedback && (
            <div className="fixed bottom-8 right-8 bg-accent-green text-primary-bg px-4 py-2 rounded-lg font-tech text-sm z-50">
              {copyFeedback}
            </div>
          )}

          {/* Footer Message */}
          <div className="mt-16 text-center">
            <p className="text-text-secondary font-tech text-sm">
              Thanks for visiting! Looking forward to hearing from you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};