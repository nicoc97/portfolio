# Developer Guide - Portfolio Website

## Table of Contents
1. [Project Structure](#project-structure)
2. [Design System](#design-system)
3. [Component Reference](#component-reference)
4. [Common Tasks](#common-tasks)
5. [Customization Guide](#customization-guide)
6. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
portfolio-site/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── PixelButton.tsx    # Button component with pixel styling
│   │   │   ├── ProjectCard.tsx    # Project display cards
│   │   │   └── TechBadge.tsx      # Technology skill badges
│   │   ├── sections/              # Page sections
│   │   │   ├── HeroSection.tsx    # Landing/hero section
│   │   │   └── ProjectsSection.tsx # Projects showcase
│   │   └── animations/            # Animation components (planned)
│   ├── assets/
│   │   ├── icons/                 # Pixel art icons
│   │   └── images/                # Project images
│   ├── types/                     # TypeScript type definitions
│   │   └── index.ts               # Main type definitions
│   ├── utils/                     # Utility functions
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles and Tailwind imports
├── public/                        # Static assets
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── package.json                   # Dependencies and scripts
└── index.html                     # HTML template
```

---

## Design System

### Color Palette
Located in: `tailwind.config.js`

```javascript
colors: {
  'primary-bg': '#1a1a1a',          // Main background
  'primary-bg-light': '#2a2a2a',    // Card backgrounds
  'primary-black': '#000000',        // True black
  'accent-green': '#00ff88',         // Primary green accent
  'accent-green-soft': '#33cc66',    // Softer green variant
  'accent-green-dark': '#004d1a',    // Dark green for borders
  'text-primary': '#ffffff',         // Main text color
  'text-secondary': '#e0e0e0',       // Secondary text color
}
```

### Typography
Located in: `tailwind.config.js` and `index.html`

```javascript
fontFamily: {
  'pixel': ['Orbitron', 'Share Tech Mono', 'Monaco', 'monospace'],     // Futuristic headings
  'mono': ['JetBrains Mono', 'Share Tech Mono', 'Monaco', 'monospace'], // Body text
  'tech': ['Share Tech Mono', 'Monaco', 'monospace'],                   // Green accent text
}
```

**Font Usage Guidelines:**
- `font-pixel` - Section headings (PROJECTS, ABOUT, SKILLS, CONTACT)
- `font-tech` - All green text elements (buttons, badges, placeholders)
- `font-mono` - Body text and descriptions (default)

### Animations
Located in: `tailwind.config.js`

```javascript
animation: {
  'pixel-pulse': 'pixelPulse 2s ease-in-out infinite',
  'pixel-glow': 'pixelGlow 1.5s ease-in-out infinite alternate',
}
```

---

## Component Reference

### PixelButton (`src/components/ui/PixelButton.tsx`)
**Purpose:** Reusable button component with pixel styling and hover effects

**Props:**
```typescript
interface PixelButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
<PixelButton variant="primary" size="lg" onClick={handleClick}>
  CLICK ME
</PixelButton>
```

**Styling Classes:**
- `pixel-button` - Base button styles (defined in `index.css`)
- `font-tech` - Uses Share Tech Mono font for text

### ProjectCard (`src/components/ui/ProjectCard.tsx`)
**Purpose:** Display project information in card format

**Props:**
```typescript
interface ProjectCardProps {
  project: Project;
  index: number;
}
```

**Key Features:**
- Numbered project display (01. 02. 03.)
- Tech stack badges with green accent
- Hover overlay with "CLICK TO VIEW"
- Links to live demo and GitHub

**Styling:**
- `pixel-card` - Base card styles
- `font-tech` - Tech stack badges and hover text
- `font-pixel` - Project numbering

### TechBadge (`src/components/ui/TechBadge.tsx`)
**Purpose:** Interactive skill/technology badges

**Props:**
```typescript
interface TechBadgeProps {
  skill: TechSkill;
  onClick?: () => void;
}
```

**Features:**
- Hover tooltips with skill proficiency
- Color-coded by category (frontend, backend, data, tools)
- Pixel icon display

### HeroSection (`src/components/sections/HeroSection.tsx`)
**Purpose:** Landing section with typing animation

**Key Elements:**
- Typing effect for main headline
- Pixel art avatar (CSS-only)
- CTA buttons for navigation
- Animated background particles

**Styling:**
- `font-tech` - Typing cursor and tech stack text

### ProjectsSection (`src/components/sections/ProjectsSection.tsx`)
**Purpose:** Showcase projects with filtering

**Features:**
- Filter buttons (All, Web Apps, Data Science, Full-Stack)
- Grid layout that adapts to screen size
- Sample project data (replace with real projects)

**Data Structure:**
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl: string;
  category: 'web' | 'data' | 'fullstack';
  featured: boolean;
  completedDate: Date;
}
```

---

## Common Tasks

### 1. Adding New Projects
**File:** `src/components/sections/ProjectsSection.tsx`

**Steps:**
1. Find the `sampleProjects` array (around line 6)
2. Add new project object:
```typescript
{
  id: '7',
  title: 'Your New Project',
  description: 'Brief description of what this project does...',
  techStack: ['React', 'TypeScript', 'Node.js'],
  imageUrl: '/path/to/image.jpg',
  liveUrl: 'https://yourproject.com',
  githubUrl: 'https://github.com/username/project',
  category: 'web', // or 'data' or 'fullstack'
  featured: true,
  completedDate: new Date('2024-07-15')
}
```

### 2. Updating Colors
**File:** `tailwind.config.js`

**Steps:**
1. Locate the `colors` object in `theme.extend`
2. Update color values:
```javascript
colors: {
  'accent-green': '#your-new-green-color',
  'primary-bg': '#your-new-background-color',
  // ... other colors
}
```

### 3. Changing Fonts
**Files:** `index.html` and `tailwind.config.js`

**Steps:**
1. Add new Google Font link to `index.html`
2. Update font families in `tailwind.config.js`:
```javascript
fontFamily: {
  'pixel': ['YourNewFont', 'fallback', 'monospace'],
}
```

### 4. Adding New Sections
**File:** `src/App.tsx`

**Steps:**
1. Create new section component in `src/components/sections/`
2. Import and add to App.tsx:
```tsx
import { YourNewSection } from './components/sections/YourNewSection';

// In the JSX:
<YourNewSection />
```

### 5. Updating Personal Information
**Files to Update:**
- `src/components/sections/HeroSection.tsx` - Name, headline, subtitle
- `index.html` - Page title
- `src/components/sections/ProjectsSection.tsx` - Replace sample projects

---

## Customization Guide

### Changing the Color Scheme
1. **Primary Colors:** Update `tailwind.config.js` color values
2. **CSS Classes:** Search for color classes in components and update
3. **Test:** Run `npm run build` to ensure no errors

### Adding New Animations
1. **Define Keyframes:** Add to `tailwind.config.js` in `keyframes` section
2. **Create Animation:** Add to `animation` section
3. **Apply:** Use `animate-your-animation` class in components

### Modifying Layout
1. **Grid Changes:** Update classes in `ProjectsSection.tsx`
2. **Responsive:** Modify breakpoint classes (sm:, md:, lg:)
3. **Spacing:** Update padding/margin classes

### Adding New Component Variants
1. **Button Variants:** Add to `PixelButton.tsx` variant object
2. **Card Styles:** Modify `ProjectCard.tsx` styling
3. **Badge Categories:** Update `TechBadge.tsx` category colors

---

## File Quick Reference

### Need to update content?
- **Personal info:** `src/components/sections/HeroSection.tsx`
- **Projects:** `src/components/sections/ProjectsSection.tsx`
- **Skills:** Create new component or update existing badges

### Need to change styling?
- **Colors:** `tailwind.config.js`
- **Fonts:** `tailwind.config.js` + `index.html`
- **Component styles:** Individual component files
- **Global styles:** `src/index.css`

### Need to add functionality?
- **New sections:** Create in `src/components/sections/`
- **New UI components:** Create in `src/components/ui/`
- **Types:** Add to `src/types/index.ts`
- **Utilities:** Add to `src/utils/`

### Need to troubleshoot?
- **Build errors:** Check console output from `npm run build`
- **Style issues:** Inspect element and check Tailwind classes
- **Type errors:** Check TypeScript definitions in `src/types/`

---

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linting (if configured)
```

---

## Tips for Maintenance

1. **Keep components small** - Each component should have one responsibility
2. **Use TypeScript** - Always define interfaces for props and data
3. **Test responsive design** - Check all breakpoints when making changes
4. **Update documentation** - Keep this guide current when adding features
5. **Version control** - Commit changes frequently with clear messages

---

This guide should help you navigate and maintain your portfolio website. For specific implementation details, refer to the individual component files which contain detailed comments.