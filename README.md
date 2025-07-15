# Portfolio Website

A dark-themed, pixel art-inspired portfolio website built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Dark theme with Apple-esque design
- 🎯 Pixel art styling and animations
- 📱 Fully responsive layout
- ⚡ Modern tech stack (React, TypeScript, Tailwind)
- 🚀 Fast development with Vite

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom pixel-themed components
- **Typography**: Righteous/Fredoka One for 70s retro headings, VT323 pixel fonts for accents
- **Color Scheme**: Warm brown and orange theme inspired by 70s retro-futuristic design
- **Design**: Rounded corners and soft edges for a cozy, approachable feel
- **Icons**: Lucide React
- **Animations**: Custom pixel animations
- **Build Tool**: Vite
- **Development**: Hot reload and fast refresh

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── PixelButton.tsx
│   │   ├── ProjectCard.tsx
│   │   └── TechBadge.tsx
│   ├── sections/        # Page sections
│   │   ├── HeroSection.tsx
│   │   └── ProjectsSection.tsx
│   └── animations/      # Animation components (planned)
├── assets/
│   ├── icons/           # Pixel art icons
│   └── images/          # Project images
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx              # Main application component
```

## Design System

### Colors
- **Primary Background**: #1a1a1a (Deep charcoal)
- **Secondary Background**: #2a2a2a (Lighter dark for cards)
- **Accent Green**: #00ff88 (Primary accent)
- **Text**: #ffffff (Primary) / #e0e0e0 (Secondary)

### Components
- **PixelButton**: Pixel-styled buttons with hover effects
- **ProjectCard**: Cards for displaying projects with tech stack badges
- **TechBadge**: Interactive badges for skills and technologies

## Current Status

✅ Project setup with React + TypeScript + Tailwind  
✅ Dark theme configuration with custom green palette  
✅ Core pixel-style UI components  
✅ Hero section with typing animation  
✅ Projects section with filtering  
🔄 Additional sections (About, Skills, Contact) - in progress  
⏳ Pixel animations and hover effects - planned  
⏳ Content management - planned  
⏳ Performance optimization - planned  

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

## Contributing

This is a personal portfolio project. Feel free to use it as inspiration for your own portfolio!

## License

MIT License - feel free to use and modify as needed.
