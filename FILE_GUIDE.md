# File-by-File Guide

## Quick Reference: Where to Update What

### 🎨 **Styling & Design**
- **Colors**: `tailwind.config.js` → `colors` object
- **Fonts**: `tailwind.config.js` → `fontFamily` + `index.html` → Google Fonts
- **Animations**: `tailwind.config.js` → `animation` and `keyframes`
- **Global Styles**: `src/index.css` → `@layer base` and `@layer components`

### 📝 **Content**
- **Main Headline**: `src/components/sections/HeroSection.tsx` → `fullText` variable
- **Personal Info**: `src/components/sections/HeroSection.tsx` → subtitle text
- **Projects**: `src/components/sections/ProjectsSection.tsx` → `sampleProjects` array
- **Page Title**: `index.html` → `<title>` tag

### 🔧 **Functionality**
- **Navigation**: `src/components/sections/HeroSection.tsx` → scroll functions
- **Project Filters**: `src/components/sections/ProjectsSection.tsx` → `filterButtons` array
- **Button Actions**: Individual button `onClick` handlers in components

---

## Detailed File Breakdown

### 📄 `index.html`
**Purpose**: HTML template and external font loading  
**Update for**:
- Page title: `<title>Your Name - Portfolio</title>`
- Add Google Fonts: `<link href="https://fonts.googleapis.com/css2?family=...>`
- Favicon: `<link rel="icon" href="/your-icon.ico">`

### 📄 `src/App.tsx`
**Purpose**: Main application component and section layout  
**Update for**:
- Add new sections: Import and add JSX
- Remove/reorder sections: Modify JSX structure
- Update section IDs: Change `id="section-name"` attributes

### 📄 `src/components/sections/HeroSection.tsx`
**Purpose**: Landing section with typing animation  
**Key update locations**:
```typescript
// Line ~9: Main headline
const fullText = 'Your custom headline here';

// Line ~15: Typing speed (lower = faster)
}, 100);

// Line ~65: Personal description
Full-stack developer & data scientist...

// Line ~68: Tech stack
React • TypeScript • Python • Machine Learning

// Line ~73-82: Button text and actions
<PixelButton>VIEW PROJECTS</PixelButton>
```

### 📄 `src/components/sections/ProjectsSection.tsx`
**Purpose**: Project showcase with filtering  
**Key update locations**:
```typescript
// Line ~18: Project data array
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Your Project Name',
    description: 'Project description...',
    techStack: ['React', 'TypeScript'],
    imageUrl: '/images/project1.jpg',
    liveUrl: 'https://project.com',
    githubUrl: 'https://github.com/user/project',
    category: 'web', // 'web' | 'data' | 'fullstack'
    featured: true,
    completedDate: new Date('2024-01-01')
  }
];

// Line ~105: Filter categories
const filterButtons = [
  { key: 'all', label: 'ALL PROJECTS' },
  { key: 'web', label: 'WEB APPS' },
  // Add/modify as needed
];

// Line ~113: Section description
A collection of web applications...
```

### 📄 `src/components/ui/PixelButton.tsx`
**Purpose**: Reusable button component  
**Key update locations**:
```typescript
// Line ~28-32: Button variants
const variantClasses = {
  primary: 'bg-primary-bg-light hover:bg-accent-green hover:text-primary-bg',
  secondary: 'bg-accent-green-dark hover:bg-accent-green-soft',
  ghost: 'bg-transparent hover:bg-accent-green-dark border-accent-green-dark'
};

// Line ~35-39: Button sizes
const sizeClasses = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};
```

### 📄 `src/components/ui/ProjectCard.tsx`
**Purpose**: Project display cards  
**Key update locations**:
```typescript
// Line ~20: Project numbering format
const formattedIndex = String(index + 1).padStart(2, '0');

// Line ~56: Hover overlay text
<p>CLICK TO VIEW</p>
<p className="mt-1 text-xs">◆ ◆ ◆</p>

// Line ~93-95: Button text
<PixelButton>LIVE DEMO</PixelButton>
<PixelButton>CODE</PixelButton>
```

### 📄 `src/components/ui/TechBadge.tsx`
**Purpose**: Technology skill badges  
**Key update locations**:
```typescript
// Line ~9: Proficiency display
const proficiencyStars = '★'.repeat(skill.proficiency) + '☆'.repeat(5 - skill.proficiency);

// Line ~11-16: Category colors
const categoryColors = {
  frontend: 'border-accent-green bg-accent-green-dark',
  backend: 'border-accent-green-soft bg-accent-green-dark',
  data: 'border-accent-green bg-accent-green-dark',
  tools: 'border-accent-green-soft bg-accent-green-dark'
};
```

### 📄 `src/types/index.ts`
**Purpose**: TypeScript type definitions  
**Key update locations**:
```typescript
// Line ~1: Project interface
export interface Project {
  // Add/modify fields as needed
}

// Line ~13: Skill categories
category: 'frontend' | 'backend' | 'data' | 'tools';

// Line ~15: Skill proficiency levels
proficiency: 1 | 2 | 3 | 4 | 5;
```

### 📄 `tailwind.config.js`
**Purpose**: Tailwind CSS configuration  
**Key update locations**:
```javascript
// Line ~20: Color palette
colors: {
  'primary-bg': '#1a1a1a',
  'accent-green': '#00ff88',
  // Modify these values to change theme
}

// Line ~31: Font families
fontFamily: {
  'pixel': ['Orbitron', 'Share Tech Mono', ...],
  'tech': ['Share Tech Mono', ...],
  // Add new fonts here
}

// Line ~37: Custom animations
animation: {
  'pixel-pulse': 'pixelPulse 2s ease-in-out infinite',
  // Add new animations here
}
```

### 📄 `src/index.css`
**Purpose**: Global styles and CSS components  
**Key update locations**:
```css
/* Line ~24: Default body font */
font-family: 'JetBrains Mono', -apple-system, ...

/* Line ~36: Pixel button base styles */
.pixel-button {
  @apply bg-primary-bg-light text-text-primary px-4 py-2...
}

/* Line ~42: Pixel card base styles */
.pixel-card {
  @apply bg-primary-bg-light border-2 border-accent-green-dark...
}
```

---

## Common Update Workflows

### 🎯 **Adding a New Project**
1. Open `src/components/sections/ProjectsSection.tsx`
2. Find `sampleProjects` array (line ~18)
3. Add new project object with all required fields
4. Add project image to `public/images/` folder
5. Update `imageUrl` field to point to your image

### 🎨 **Changing Colors**
1. Open `tailwind.config.js`
2. Modify values in `colors` object (line ~20)
3. Run `npm run build` to regenerate CSS
4. Colors will update throughout the entire site

### 🔤 **Adding New Fonts**
1. Add Google Font link to `index.html`
2. Add font family to `tailwind.config.js` → `fontFamily`
3. Use new font class (`font-your-font`) in components

### 📱 **Modifying Responsive Layout**
1. Open component file you want to modify
2. Find grid/layout classes (e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
3. Update breakpoint classes:
   - `sm:` - Small screens (640px+)
   - `md:` - Medium screens (768px+)
   - `lg:` - Large screens (1024px+)
   - `xl:` - Extra large screens (1280px+)

### 🔧 **Adding New Animations**
1. Define keyframes in `tailwind.config.js` → `keyframes`
2. Add animation name to `animation` object
3. Use `animate-your-animation` class in components

---

## File Dependencies

```
index.html
├── src/main.tsx
│   └── src/App.tsx
│       ├── src/components/sections/HeroSection.tsx
│       │   └── src/components/ui/PixelButton.tsx
│       └── src/components/sections/ProjectsSection.tsx
│           ├── src/components/ui/ProjectCard.tsx
│           │   └── src/components/ui/PixelButton.tsx
│           └── src/components/ui/TechBadge.tsx
│
├── src/types/index.ts (imported by all components)
├── src/index.css (global styles)
└── tailwind.config.js (design system)
```

---

## Search Tips

**Find specific elements quickly:**
- `Cmd/Ctrl + F` in VS Code
- Search for `🔧 UPDATE:` to find all customization points
- Search for specific text you want to change
- Search for color values (e.g., `#00ff88`) to find all color uses
- Search for `font-` to find font usages

**Common search terms:**
- `sampleProjects` - Find project data
- `fullText` - Find main headline
- `colors:` - Find color definitions
- `fontFamily:` - Find font definitions
- `className=` - Find styling classes