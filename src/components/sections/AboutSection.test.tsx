import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AboutSection } from './AboutSection';

// Mock the scroll animation hooks
vi.mock('../../hooks/useScrollAnimation', () => ({
  useScrollAnimation: vi.fn(() => ({
    ref: { current: null },
    isVisible: true
  })),
  useStaggeredAnimation: vi.fn(() => ({
    triggerRef: { current: null },
    visibleItems: [true, true, true, true, true, true]
  }))
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('AboutSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the section with correct id', () => {
      const { container } = render(<AboutSection />);
      const section = container.querySelector('#about');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'about');
    });

    it('renders the main heading', () => {
      render(<AboutSection />);
      const heading = screen.getByRole('heading', { level: 2, name: /about/i });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('font-retro', 'text-accent-orange');
    });

    it('renders the subtitle', () => {
      render(<AboutSection />);
      const subtitle = screen.getByText('Collaborative Web Developer');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass('font-tech', 'text-accent-orange');
    });
  });

  describe('Content Sections', () => {
    it('renders the personal introduction section', () => {
      render(<AboutSection />);
      const introHeading = screen.getByRole('heading', { level: 3, name: /hello, i'm nico/i });
      expect(introHeading).toBeInTheDocument();
      
      const introText = screen.getByText(/collaborative web developer with a passion/i);
      expect(introText).toBeInTheDocument();
    });

    it('renders the location information', () => {
      render(<AboutSection />);
      const locationHeading = screen.getByRole('heading', { level: 4, name: /based in glasgow, uk/i });
      expect(locationHeading).toBeInTheDocument();
      
      const availabilityText = screen.getByText(/available for remote work/i);
      expect(availabilityText).toBeInTheDocument();
    });

    it('renders the current role information', () => {
      render(<AboutSection />);
      const roleHeading = screen.getByRole('heading', { level: 4, name: /wordpress developer/i });
      expect(roleHeading).toBeInTheDocument();
      
      const currentBadge = screen.getByText('CURRENT');
      expect(currentBadge).toBeInTheDocument();
      expect(currentBadge).toHaveClass('text-accent-green');
      
      const companyInfo = screen.getByText(/scoot digital/i);
      expect(companyInfo).toBeInTheDocument();
    });

    it('renders the experience highlights', () => {
      render(<AboutSection />);
      const experienceHeading = screen.getByRole('heading', { level: 4, name: /experience highlights/i });
      expect(experienceHeading).toBeInTheDocument();
      
      const experienceItems = [
        /5\+ years in web development/i,
        /full-stack experience/i,
        /team collaboration/i,
        /apprenticeship to senior developer/i
      ];
      
      experienceItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('renders the personal interests section', () => {
      render(<AboutSection />);
      const interestsHeading = screen.getByRole('heading', { level: 4, name: /beyond code/i });
      expect(interestsHeading).toBeInTheDocument();
      
      const interestsText = screen.getByText(/retro technology/i);
      expect(interestsText).toBeInTheDocument();
    });
  });

  describe('Tech Stack Section', () => {
    it('renders the core technologies heading', () => {
      render(<AboutSection />);
      const techHeading = screen.getByRole('heading', { level: 3, name: /core technologies/i });
      expect(techHeading).toBeInTheDocument();
    });

    it('renders all technology badges', () => {
      render(<AboutSection />);
      const technologies = [
        'HTML/CSS/JavaScript',
        'React & Next.js',
        'PHP & Symfony',
        'WordPress & ACF',
        'C# & .NET Core',
        'SQL Databases'
      ];
      
      technologies.forEach(tech => {
        const techBadge = screen.getByText(tech);
        expect(techBadge).toBeInTheDocument();
        expect(techBadge).toHaveClass('font-tech', 'text-accent-orange');
      });
    });

    it('applies correct styling to tech badges', () => {
      render(<AboutSection />);
      const firstTechBadge = screen.getByText('HTML/CSS/JavaScript');
      expect(firstTechBadge).toHaveClass(
        'bg-accent-orange/20',
        'border-accent-orange/30',
        'hover:bg-accent-orange/30'
      );
    });
  });

  describe('Pixel Decorative Elements', () => {
    it('renders pixel accent elements on cards', () => {
      const { container } = render(<AboutSection />);
      const section = container.querySelector('#about');
      
      // Check for pixel decorative elements (they should be present as div elements with specific classes)
      const pixelElements = section?.querySelectorAll('.animate-pixel-pulse');
      expect(pixelElements?.length).toBeGreaterThan(0);
    });

    it('renders numbered pixel accents', () => {
      render(<AboutSection />);
      
      // Check for numbered pixel accents (01, 02, 03, etc.)
      const numberedAccents = ['01', '02', '03', '04', '05', '06'];
      numberedAccents.forEach(number => {
        const accent = screen.getByText(number);
        expect(accent).toBeInTheDocument();
        expect(accent).toHaveClass('font-tech', 'animate-pixel-pulse');
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies mobile padding class', () => {
      const { container } = render(<AboutSection />);
      const mobilePaddingContainer = container.querySelector('.mobile-padding');
      expect(mobilePaddingContainer).toBeInTheDocument();
    });

    it('uses responsive grid classes', () => {
      const { container } = render(<AboutSection />);
      const gridContainer = container.querySelector('.grid.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<AboutSection />);
      
      // Check that headings follow proper hierarchy (h2 -> h3 -> h4)
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      const h4Elements = screen.getAllByRole('heading', { level: 4 });
      
      expect(h2).toBeInTheDocument();
      expect(h3Elements.length).toBeGreaterThan(0);
      expect(h4Elements.length).toBeGreaterThan(0);
    });

    it('has semantic section structure', () => {
      const { container } = render(<AboutSection />);
      const section = container.querySelector('#about');
      expect(section).toBeInTheDocument();
      expect(section?.tagName).toBe('SECTION');
    });

    it('uses proper list structure for experience items', () => {
      render(<AboutSection />);
      const experienceList = screen.getByRole('list');
      expect(experienceList).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(4); // Four experience highlights
    });
  });

  describe('Animation Classes', () => {
    it('applies transition classes for animations', () => {
      const { container } = render(<AboutSection />);
      const section = container.querySelector('#about');
      
      // Check for transition classes on animated elements
      const animatedElements = section?.querySelectorAll('.transition-all');
      expect(animatedElements?.length).toBeGreaterThan(0);
    });

    it('applies pixel card styling classes', () => {
      const { container } = render(<AboutSection />);
      const section = container.querySelector('#about');
      
      // Check for pixel-card classes
      const pixelCards = section?.querySelectorAll('.pixel-card');
      const pixelCardsGreen = section?.querySelectorAll('.pixel-card-green');
      
      expect(pixelCards?.length).toBeGreaterThan(0);
      expect(pixelCardsGreen?.length).toBeGreaterThan(0);
    });
  });
});