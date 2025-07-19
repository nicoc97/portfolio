/** @type {import('tailwindcss').Config} */
/**
 * Tailwind CSS Configuration
 * 
 * This file defines the design system for the portfolio:
 * - Custom color palette with pixel/tech aesthetic
 * - Typography with pixel and monospace fonts
 * - Custom animations for pixel effects
 * - Responsive breakpoints (default Tailwind)
 * 
 * 🔧 UPDATE LOCATIONS:
 * - colors: Change the color scheme
 * - fontFamily: Add/modify fonts (also update index.html)
 * - animation: Add new animations
 * - keyframes: Define animation sequences
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      // 🔧 UPDATE: Custom color palette - warm 70s retro-futuristic theme
      colors: {
        'primary-bg': '#1a1611',          // Warm dark brown background
        'primary-bg-light': '#2a2419',    // Lighter warm brown for cards/sections
        'primary-black': '#0f0e0c',        // Deep warm black
        'accent-orange': '#ff8c42',        // Warm orange for primary accents
        'accent-orange-soft': '#ffb380',   // Softer orange for hover states
        'accent-orange-dark': '#b85c00',   // Dark orange for borders and subtle accents
        'text-primary': '#f5f2e8',         // Warm off-white text
        'text-secondary': '#d4c4a0',       // Warm beige for secondary text
        'accent-green': '#7c9756',         // Classic 70s avocado green
        'accent-green-soft': '#95b36d',    // Softer green for hover
        'accent-green-dark': '#5a6e3f',    // Darker green for borders
      },
      // 🔧 UPDATE: Font families - add Google Fonts to index.html first
      fontFamily: {
        'retro': ['Righteous', 'Fredoka One', 'Arial Black', 'sans-serif'],                        // 70s retro font for main headings
        'mono': ['JetBrains Mono', 'Share Tech Mono', 'Monaco', 'Menlo', 'Consolas', 'monospace'], // Clean monospace for body text
        'tech': ['VT323', 'Monaco', 'Menlo', 'Consolas', 'monospace'],                             // VT323 pixel font for orange accents
      },
      // 🔧 UPDATE: Custom animations - add new animations here
      animation: {
        'pixel-pulse': 'pixelPulse 2s ease-in-out infinite',           // Pulsing opacity effect
        'pixel-glow': 'pixelGlow 1.5s ease-in-out infinite alternate',  // Glowing border effect
        'wave-1': 'wave1 20s ease-in-out infinite',                     // Wave animation 1
        'wave-2': 'wave2 18s ease-in-out infinite reverse',             // Wave animation 2
        'wave-3': 'wave3 22s ease-in-out infinite',                     // Wave animation 3
      },
      // 🔧 UPDATE: Animation keyframes - define the actual animation sequences
      keyframes: {
        pixelPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pixelGlow: {
          '0%': { boxShadow: '0 0 5px #ff8c42' },
          '100%': { boxShadow: '0 0 20px #ff8c42, 0 0 30px #ff8c42' },
        },
        wave1: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave2: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '33%': { transform: 'translateY(-8px)' },
          '66%': { transform: 'translateY(-15px)' },
        },
        wave3: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '25%': { transform: 'translateY(-5px)' },
          '75%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [], // 🔧 UPDATE: Add Tailwind plugins here if needed
}