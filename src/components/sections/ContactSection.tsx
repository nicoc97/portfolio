import React, { useState } from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '../../hooks/useScrollAnimation';
import { PixelButton } from '../ui/PixelButton';

/**
 * ContactSection Component
 * 
 * Modern contact section with pixel robot animation and email composer
 * Matches the design system of About and Jukebox sections
 */
export const ContactSection: React.FC = () => {
  const [emailData, setEmailData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pixelAnimation, setPixelAnimation] = useState('idle');
  const [emailCopied, setEmailCopied] = useState(false);

  // Animation hooks with reverse animations (matching other sections)
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
    animationType: 'slide',
    triggerOnce: false,
    reverseOnExit: true,
    exitDelay: 100
  });

  const { triggerRef: contentTriggerRef, visibleItems: contentVisible } = useStaggeredAnimation<HTMLDivElement>(
    3,
    200,
    {
      triggerOnce: false,
      reverseOnExit: true
    }
  );

  // Validate email data
  const validateEmail = () => {
    if (!emailData.name || !emailData.email || !emailData.message) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailData.email);
  };

  // Handle email composition
  const handleEmailCompose = () => {
    if (!validateEmail()) {
      setFormStatus('Please fill in all required fields');
      setTimeout(() => setFormStatus(''), 3000);
      return;
    }

    setIsComposing(true);
    setFormStatus('');

    const subject = encodeURIComponent(emailData.subject || 'Portfolio Contact');
    const body = encodeURIComponent(`From: ${emailData.name}\nEmail: ${emailData.email}\n\nMessage:\n${emailData.message}`);
    const mailtoLink = `mailto:nico@example.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      window.location.href = mailtoLink;
      setIsComposing(false);
      setFormStatus('Opening your email client...');
      setEmailData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(''), 5000);
    }, 500);
  };

  // Handle CV download
  const handleCVDownload = async () => {
    setIsDownloading(true);
    setPixelAnimation('downloading');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const link = document.createElement('a');
      link.href = '/Nico Cruickshank CV - Web Developer.pdf'; // File in public folder
      link.download = 'Nico_Cruickshank_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPixelAnimation('success');
      setTimeout(() => setPixelAnimation('idle'), 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setPixelAnimation('error');
      setTimeout(() => setPixelAnimation('idle'), 2000);
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy email to clipboard
  const copyEmail = () => {
    navigator.clipboard.writeText('nico@example.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // Pixel robot animation component
  const PixelRobot = () => {
    const baseColor = pixelAnimation === 'success' ? '#7c9756' : '#ff8c42';
    const eyeAnimation = pixelAnimation === 'downloading' ? 'animate-pulse' : '';

    return (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <g className={pixelAnimation === 'downloading' ? 'animate-bounce' : ''}>
          {/* Main body */}
          <rect x="44" y="48" width="40" height="48" fill={baseColor} rx="2" />

          {/* Head */}
          <rect x="48" y="24" width="32" height="28" fill="#f5f2e8" rx="2" />

          {/* Antenna */}
          <rect x="62" y="16" width="4" height="12" fill={baseColor} />
          <circle cx="64" cy="14" r="4" fill={baseColor} className={pixelAnimation === 'downloading' ? 'animate-pulse' : ''} />

          {/* Eyes */}
          <rect x="54" y="34" width="6" height="6" fill="#1a1611" className={eyeAnimation} />
          <rect x="68" y="34" width="6" height="6" fill="#1a1611" className={eyeAnimation} />

          {/* Mouth */}
          {pixelAnimation === 'success' ? (
            <path d="M56 44 Q64 48 72 44" stroke="#1a1611" strokeWidth="2" fill="none" />
          ) : (
            <rect x="58" y="44" width="12" height="2" fill="#1a1611" />
          )}

          {/* Arms */}
          <rect x="36" y="56" width="8" height="24" fill={baseColor}
            className={pixelAnimation === 'downloading' ? 'origin-top animate-wave-1' : ''} />
          <rect x="84" y="56" width="8" height="24" fill={baseColor}
            className={pixelAnimation === 'downloading' ? 'origin-top animate-wave-2' : ''} />

          {/* Chest display */}
          <rect x="54" y="58" width="20" height="12" fill="#1a1611" rx="1" />
          {pixelAnimation === 'downloading' && (
            <g className="animate-pulse">
              <rect x="56" y="60" width="3" height="8" fill="#7c9756" />
              <rect x="61" y="62" width="3" height="6" fill="#7c9756" />
              <rect x="66" y="60" width="3" height="8" fill="#7c9756" />
              <rect x="71" y="64" width="3" height="4" fill="#7c9756" />
            </g>
          )}
          {pixelAnimation === 'success' && (
            <text x="64" y="66" textAnchor="middle" fontSize="8" fill="#7c9756">✓</text>
          )}

          {/* Legs */}
          <rect x="52" y="96" width="10" height="16" fill={baseColor} />
          <rect x="66" y="96" width="10" height="16" fill={baseColor} />

          {/* Feet */}
          <rect x="50" y="112" width="14" height="6" fill="#1a1611" rx="1" />
          <rect x="64" y="112" width="14" height="6" fill="#1a1611" rx="1" />
        </g>

        {/* Document floating animation */}
        {pixelAnimation === 'downloading' && (
          <g className="animate-pulse">
            <rect x="96" y="40" width="24" height="32" fill="#f5f2e8" stroke="#1a1611" strokeWidth="1" />
            <rect x="100" y="46" width="16" height="2" fill="#1a1611" />
            <rect x="100" y="50" width="16" height="2" fill="#1a1611" />
            <rect x="100" y="54" width="12" height="2" fill="#1a1611" />
          </g>
        )}

        {/* Success sparkles */}
        {pixelAnimation === 'success' && (
          <g className="animate-pulse">
            <text x="30" y="30" fontSize="20" fill="#7c9756">✦</text>
            <text x="90" y="40" fontSize="16" fill="#7c9756">✦</text>
            <text x="95" y="90" fontSize="18" fill="#7c9756">✦</text>
          </g>
        )}
      </svg>
    );
  };

  return (
    <section id="contact" className="section-fullscreen py-20 bg-primary-bg relative overflow-hidden">
      <div className="w-full md:w-4/5 mx-auto mobile-padding relative z-10">
        {/* Large background text - matching other sections */}
        <div className="section-bg-text">
          <span>SEC05</span>
        </div>

        {/* Section Header - matching exact style from other sections */}
        <div
          ref={headerRef}
          className={`mb-16 animate-slide-up ${headerVisible ? 'visible' : ''}`}
        >
          <h2 className="section-header">CONTACT</h2>
          <div className="section-divider mb-6"></div>
          <p className="section-subtitle mb-4">Let's Build Something Amazing</p>
          <p className="text-text-secondary text-left text-sm leading-relaxed max-w-2xl">
            Ready to collaborate on your next project? Get in touch and let's discuss how we can work together
          </p>
        </div>

        {/* Main Content */}
        <div ref={contentTriggerRef} className="space-y-8">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12">
            {/* Left Column - Email Composer */}
            <div className={`animate-slide-up ${contentVisible[0] ? 'visible' : ''}`}>
              <div className="bg-primary-bg/50 backdrop-blur-sm rounded-lg border border-accent-orange/20 hover:border-accent-orange/30 p-8 transition-all duration-300">
                <h3 className="text-lg md:text-xl font-bold text-accent-orange font-tech mb-6 uppercase tracking-wide">
                  Compose Message
                </h3>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-secondary font-mono text-sm mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={emailData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailData({ ...emailData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-primary-bg/50 border border-text-secondary/20 rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent-orange transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-text-secondary font-mono text-sm mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={emailData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailData({ ...emailData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-primary-bg/50 border border-text-secondary/20 rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent-orange transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-secondary font-mono text-sm mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailData.subject}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailData({ ...emailData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-primary-bg/50 border border-text-secondary/20 rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent-orange transition-colors"
                      placeholder="Project Inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary font-mono text-sm mb-2">
                      Message *
                    </label>
                    <textarea
                      value={emailData.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailData({ ...emailData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-primary-bg/50 border border-text-secondary/20 rounded-lg text-text-primary font-mono focus:outline-none focus:border-accent-orange transition-colors resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {formStatus && (
                    <div className={`p-3 rounded-lg font-mono text-sm ${formStatus.includes('Opening')
                        ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                        : 'bg-accent-orange/20 text-accent-orange border border-accent-orange/30'
                      }`}>
                      {formStatus}
                    </div>
                  )}

                  <PixelButton
                    variant="primary"
                    size="lg"
                    onClick={handleEmailCompose}
                    disabled={isComposing}
                    className="w-full"
                  >
                    {isComposing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-bg border-t-transparent rounded-full animate-spin"></span>
                        COMPOSING...
                      </span>
                    ) : (
                      'SEND VIA EMAIL'
                    )}
                  </PixelButton>
                </div>
              </div>
            </div>

            {/* Right Column - CV Download & Quick Links */}
            <div className={`space-y-8 animate-slide-up ${contentVisible[1] ? 'visible' : ''}`}>
              {/* CV Download with Pixel Robot */}
              <div className="bg-primary-bg/50 backdrop-blur-sm rounded-lg border border-accent-green/20 hover:border-accent-green/30 p-8 transition-all duration-300">
                <h3 className="text-lg md:text-xl font-bold text-accent-green font-tech mb-6 uppercase tracking-wide">
                  Download CV
                </h3>

                <div className="flex items-center justify-center mb-6 h-32">
                  <PixelRobot />
                </div>

                <PixelButton
                  variant="secondary"
                  size="lg"
                  onClick={handleCVDownload}
                  disabled={isDownloading}
                  className="w-full"
                >
                  {isDownloading ? 'DOWNLOADING...' : 'GET MY RESUME'}
                </PixelButton>

                <p className="text-text-secondary font-mono text-sm text-center mt-4">
                  Full-stack Developer • PDF • 2MB
                </p>
              </div>

              {/* Quick Links - Email Only */}
              <div className="grid gap-4">
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-4 p-4 bg-primary-bg/50 backdrop-blur-sm rounded-lg border border-text-secondary/20 hover:border-accent-orange/30 transition-all duration-300 group hover:scale-105"
                >
                  <div className="w-12 h-12 bg-accent-orange/10 text-accent-orange rounded-lg flex items-center justify-center border border-accent-orange/20 group-hover:bg-accent-orange/20 transition-all duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-text-primary font-mono">nico@example.com</p>
                    <p className="text-text-secondary text-sm">
                      {emailCopied ? '✓ Copied!' : 'Click to copy'}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* Email Form - Mobile */}
            <div className={`animate-slide-up ${contentVisible[0] ? 'visible' : ''}`}>
              <div className="bg-primary-bg/50 backdrop-blur-sm rounded-lg border border-accent-orange/20 p-6">
                <h3 className="text-lg font-bold text-accent-orange font-tech mb-4 uppercase tracking-wide">
                  Send Message
                </h3>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={emailData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailData({ ...emailData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-primary-bg/50 border border-text-secondary/20 rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent-orange transition-colors"
                      placeholder="Your Name *"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      value={emailData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailData({ ...emailData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-primary-bg/50 border border-text-secondary/20 rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent-orange transition-colors"
                      placeholder="Your Email *"
                    />
                  </div>

                  <div>
                    <textarea
                      value={emailData.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailData({ ...emailData, message: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-primary-bg/50 border border-text-secondary/20 rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent-orange transition-colors resize-none"
                      placeholder="Your Message *"
                    />
                  </div>

                  {formStatus && (
                    <div className={`p-2 rounded-lg font-mono text-xs ${formStatus.includes('Opening')
                        ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                        : 'bg-accent-orange/20 text-accent-orange border border-accent-orange/30'
                      }`}>
                      {formStatus}
                    </div>
                  )}

                  <PixelButton
                    variant="primary"
                    size="md"
                    onClick={handleEmailCompose}
                    disabled={isComposing}
                    className="w-full"
                  >
                    {isComposing ? 'COMPOSING...' : 'SEND EMAIL'}
                  </PixelButton>
                </div>
              </div>
            </div>

            {/* CV Download - Mobile */}
            <div className={`animate-slide-up ${contentVisible[1] ? 'visible' : ''}`}>
              <div className="bg-primary-bg/50 backdrop-blur-sm rounded-lg border border-accent-green/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-accent-green font-tech uppercase tracking-wide">
                    Download CV
                  </h3>
                  <div className="w-20 h-20">
                    <PixelRobot />
                  </div>
                </div>

                <PixelButton
                  variant="secondary"
                  size="md"
                  onClick={handleCVDownload}
                  disabled={isDownloading}
                  className="w-full"
                >
                  {isDownloading ? 'DOWNLOADING...' : 'GET RESUME'}
                </PixelButton>
              </div>
            </div>

            {/* Quick Links - Mobile (Email Only) */}
            <div className={`animate-slide-up ${contentVisible[2] ? 'visible' : ''}`}>
              <button
                onClick={copyEmail}
                className="w-full flex items-center gap-3 p-3 bg-primary-bg/50 backdrop-blur-sm rounded-lg border border-text-secondary/20"
              >
                <div className="w-10 h-10 bg-accent-orange/10 text-accent-orange rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-text-primary font-mono text-sm">nicocruickshank@icloud.com</p>
                  <p className="text-text-secondary text-xs">{emailCopied ? 'Copied!' : 'Tap to copy'}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Footer - Available Status */}
          <div className={`text-center mt-16 animate-slide-up ${contentVisible[2] ? 'visible' : ''}`}>
            <div className="inline-block">
              <p className="text-text-secondary mb-2 font-mono text-sm">
                Based in Glasgow, UK • Available worldwide
              </p>
              <div className="flex items-center justify-center gap-2 text-accent-green">
                <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
                <span className="text-sm font-tech uppercase tracking-wide">
                  Currently Available for Projects
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};