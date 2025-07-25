import React, { useState } from 'react';
import { PixelButton } from '../ui/PixelButton';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

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

  // Animation hooks with reverse animations
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
    animationType: 'slide',
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 100
  });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: false,
    reverseOnExit: true
  });

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
    <section id="contact" className="section-fullscreen py-20 bg-primary-bg relative overflow-hidden">
      <div className="w-full lg:w-3/5 mx-auto mobile-padding relative z-10">
        <div className="text-left space-y-8">
          {/* Large background text */}
          <div className="section-bg-text">
            <span>SEC05</span>
          </div>

          {/* Subtle background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
            <div className="absolute top-1/4 left-1/4 text-accent-orange font-tech text-6xl font-bold rotate-12">
              GET IN TOUCH
            </div>
            <div className="absolute bottom-1/3 right-1/4 text-accent-green font-tech text-4xl font-bold -rotate-6">
              CONNECT
            </div>
          </div>

          {/* Section Header */}
          <div
            ref={headerRef}
            className={`space-y-4 animate-slide-up ${headerVisible ? 'visible' : ''}`}
          >
            <h2 className="section-header">CONTACT</h2>
            <div className="section-divider"></div>
            <p className="text-text-secondary text-lg max-w-2xl">
              Ready to build something amazing together? Let's connect and discuss your next project.
            </p>
          </div>

          {/* Simple Grid Layout */}
          <div ref={contentRef} className={`animate-slide-up ${contentVisible ? 'visible' : ''} mt-16`}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Email */}
              <div
                className="contact-card group cursor-pointer"
                onClick={() => handleCopyToClipboard('nico@example.com', 'Email')}
              >
                <div className="icon-container-orange">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M2 4h20v2l-10 6L2 6V4zm0 4v12h20V8l-10 6L2 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-tech text-lg font-semibold">
                    nico@example.com
                  </p>
                  <p className="text-text-secondary text-sm">Click to copy</p>
                </div>
              </div>

              {/* Phone */}
              <div
                className="contact-card group cursor-pointer"
                onClick={() => handleCopyToClipboard('+44 7XXX XXXXXX', 'Phone')}
              >
                <div className="icon-container-orange">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-tech text-lg font-semibold">
                    +44 7XXX XXXXXX
                  </p>
                  <p className="text-text-secondary text-sm">Click to copy</p>
                </div>
              </div>

              {/* Location */}
              <div className="contact-card group">
                <div className="icon-container-green">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-tech text-lg font-semibold">
                    Glasgow, UK
                  </p>
                  <p className="text-text-secondary text-sm">Remote worldwide</p>
                </div>
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/nicocruickshank"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-green group block"
              >
                <div className="icon-container-green">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-tech text-lg font-semibold">
                    GitHub
                  </p>
                  <p className="text-text-secondary text-sm">Code & projects</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/nicocruickshank"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card group block"
              >
                <div className="icon-container-orange">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-tech text-lg font-semibold">
                    LinkedIn
                  </p>
                  <p className="text-text-secondary text-sm">Professional network</p>
                </div>
              </a>

              {/* CV Download */}
              <div className="md:col-span-2 lg:col-span-1">
                <PixelButton
                  variant="primary"
                  size="lg"
                  onClick={handleCVDownload}
                  disabled={isDownloading}
                  className="w-full justify-center h-full min-h-[80px]"
                >
                  {isDownloading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-accent-orange border-t-transparent rounded-full animate-spin"></div>
                      <span>DOWNLOADING...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-1">
                      <span>DOWNLOAD CV</span>
                      <span className="text-xs opacity-75">PDF • 2MB</span>
                    </div>
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