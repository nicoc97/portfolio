import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TechBadge } from './TechBadge';
import type { TechSkill } from '../../types';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('TechBadge', () => {
  const mockOnClick = vi.fn();
  
  const mockSkill: TechSkill = {
    name: 'React',
    category: 'frontend',
    proficiency: 4,
    pixelIcon: '⚛',
    description: 'Advanced React development with hooks and modern patterns'
  };

  const mockBackendSkill: TechSkill = {
    name: 'Node.js',
    category: 'backend',
    proficiency: 3,
    pixelIcon: '🟢',
    description: 'Server-side JavaScript development'
  };

  beforeEach(() => {
    mockOnClick.mockClear();
    mockIntersectionObserver.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders skill name and icon', () => {
      render(<TechBadge skill={mockSkill} />);
      
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('⚛')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<TechBadge skill={mockSkill} className="custom-class" />);
      
      const badge = screen.getByRole('presentation');
      expect(badge).toHaveClass('custom-class');
    });

    it('renders without animation when animated=false', () => {
      render(<TechBadge skill={mockSkill} animated={false} />);
      
      const badge = screen.getByRole('presentation');
      expect(badge).not.toHaveClass('opacity-0');
      expect(badge).not.toHaveClass('translate-y-4');
    });
  });

  describe('Category-based Styling', () => {
    it('applies frontend category styles', () => {
      render(<TechBadge skill={mockSkill} />);
      
      const badge = screen.getByRole('presentation');
      expect(badge).toHaveClass('border-accent-orange');
      expect(badge).toHaveClass('bg-accent-orange-dark/20');
    });

    it('applies backend category styles', () => {
      render(<TechBadge skill={mockBackendSkill} />);
      
      const badge = screen.getByRole('presentation');
      expect(badge).toHaveClass('border-accent-green');
      expect(badge).toHaveClass('bg-accent-green-dark/20');
    });

    it('applies correct icon styling for frontend', () => {
      render(<TechBadge skill={mockSkill} />);
      
      const icon = screen.getByText('⚛');
      expect(icon).toHaveClass('bg-accent-orange');
      expect(icon).toHaveClass('border-accent-orange-soft');
    });

    it('applies correct icon styling for backend', () => {
      render(<TechBadge skill={mockBackendSkill} />);
      
      const icon = screen.getByText('🟢');
      expect(icon).toHaveClass('bg-accent-green');
      expect(icon).toHaveClass('border-accent-green-soft');
    });
  });

  describe('Interactive Behavior', () => {
    it('handles click events when onClick is provided', async () => {
      const user = userEvent.setup();
      render(<TechBadge skill={mockSkill} onClick={mockOnClick} />);
      
      const badge = screen.getByRole('button');
      await user.click(badge);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not have button role when onClick is not provided', () => {
      render(<TechBadge skill={mockSkill} />);
      
      const badge = screen.getByRole('presentation');
      expect(badge).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles keyboard navigation with Enter key', async () => {
      const user = userEvent.setup();
      render(<TechBadge skill={mockSkill} onClick={mockOnClick} />);
      
      const badge = screen.getByRole('button');
      badge.focus();
      await user.keyboard('{Enter}');
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation with Space key', async () => {
      const user = userEvent.setup();
      render(<TechBadge skill={mockSkill} onClick={mockOnClick} />);
      
      const badge = screen.getByRole('button');
      badge.focus();
      await user.keyboard(' ');
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('applies hover effects on mouse enter', async () => {
      const user = userEvent.setup();
      render(<TechBadge skill={mockSkill} />);
      
      const badge = screen.getByRole('presentation');
      await user.hover(badge);
      
      expect(badge).toHaveClass('scale-105');
    });
  });

  describe('Tooltip Functionality', () => {
    it('shows tooltip on hover when showTooltip is true', async () => {
      const user = userEvent.setup();
      render(<TechBadge skill={mockSkill} showTooltip={true} />);
      
      const badge = screen.getByRole('presentation');
      await user.hover(badge);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Advanced React development with hooks and modern patterns')).toBeInTheDocument();
      });
    });

    it('shows tooltip on focus when showTooltip is true', async () => {
      render(<TechBadge skill={mockSkill} onClick={mockOnClick} showTooltip={true} />);
      
      const badge = screen.getByRole('button');
      badge.focus();
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('does not show tooltip when showTooltip is false', async () => {
      const user = userEvent.setup();
      render(<TechBadge skill={mockSkill} showTooltip={false} />);
      
      const badge = screen.getByRole('presentation');
      await user.hover(badge);
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('displays proficiency stars in tooltip', async () => {
      const user = userEvent.setup();
      render(<TechBadge skill={mockSkill} showTooltip={true} />);
      
      const badge = screen.getByRole('presentation');
      await user.hover(badge);
      
      await waitFor(() => {
        expect(screen.getByText('★★★★☆')).toBeInTheDocument();
      });
    });

    it('displays category badge in tooltip', async () => {
      const user = userEvent.setup();
      render(<TechBadge skill={mockSkill} showTooltip={true} />);
      
      const badge = screen.getByRole('presentation');
      await user.hover(badge);
      
      await waitFor(() => {
        expect(screen.getByText('FRONTEND')).toBeInTheDocument();
      });
    });

    it('handles skills without description', async () => {
      const skillWithoutDescription: TechSkill = {
        ...mockSkill,
        description: undefined
      };
      
      const user = userEvent.setup();
      render(<TechBadge skill={skillWithoutDescription} showTooltip={true} />);
      
      const badge = screen.getByRole('presentation');
      await user.hover(badge);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getAllByText('React')).toHaveLength(2); // One in badge, one in tooltip
        expect(screen.getByText('★★★★☆')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<TechBadge skill={mockSkill} onClick={mockOnClick} />);
      
      const badge = screen.getByRole('button');
      expect(badge).toHaveAttribute('aria-label', 'React - frontend skill, proficiency 4 out of 5');
    });

    it('has proper focus management', () => {
      render(<TechBadge skill={mockSkill} onClick={mockOnClick} />);
      
      const badge = screen.getByRole('button');
      expect(badge).toHaveAttribute('tabIndex', '0');
    });

    it('has no tabIndex when not clickable', () => {
      render(<TechBadge skill={mockSkill} />);
      
      const badge = screen.getByRole('presentation');
      expect(badge).toHaveAttribute('tabIndex', '-1');
    });

    it('has proper focus ring styles', () => {
      render(<TechBadge skill={mockSkill} onClick={mockOnClick} />);
      
      const badge = screen.getByRole('button');
      expect(badge).toHaveClass('focus:outline-none');
      expect(badge).toHaveClass('focus:ring-2');
      expect(badge).toHaveClass('focus:ring-accent-orange');
    });

    it('has proper focus ring styles for backend category', () => {
      render(<TechBadge skill={mockBackendSkill} onClick={mockOnClick} />);
      
      const badge = screen.getByRole('button');
      expect(badge).toHaveClass('focus:ring-accent-green');
    });

    it('associates tooltip with badge using aria-describedby', async () => {
      const user = userEvent.setup();
      render(<TechBadge skill={mockSkill} showTooltip={true} />);
      
      const badge = screen.getByRole('presentation');
      await user.hover(badge);
      
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('id', 'tooltip-react');
        expect(badge).toHaveAttribute('aria-describedby', 'tooltip-react');
      });
    });
  });

  describe('Animation and Intersection Observer', () => {
    it('sets up intersection observer when animated is true', () => {
      render(<TechBadge skill={mockSkill} animated={true} />);
      
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.1 }
      );
    });

    it('does not set up intersection observer when animated is false', () => {
      render(<TechBadge skill={mockSkill} animated={false} />);
      
      expect(mockIntersectionObserver).not.toHaveBeenCalled();
    });

    it('starts with opacity-0 when animated is true', () => {
      render(<TechBadge skill={mockSkill} animated={true} />);
      
      const badge = screen.getByRole('presentation');
      expect(badge).toHaveClass('opacity-0');
    });
  });

  describe('Proficiency Display', () => {
    it('displays correct number of stars for different proficiency levels', async () => {
      const skillLevel1: TechSkill = { ...mockSkill, proficiency: 1 };
      const skillLevel5: TechSkill = { ...mockSkill, proficiency: 5 };
      
      const user = userEvent.setup();
      
      const { rerender } = render(<TechBadge skill={skillLevel1} showTooltip={true} />);
      let badge = screen.getByRole('presentation');
      await user.hover(badge);
      
      await waitFor(() => {
        expect(screen.getByText('★☆☆☆☆')).toBeInTheDocument();
      });
      
      await user.unhover(badge);
      
      rerender(<TechBadge skill={skillLevel5} showTooltip={true} />);
      badge = screen.getByRole('presentation');
      await user.hover(badge);
      
      await waitFor(() => {
        expect(screen.getByText('★★★★★')).toBeInTheDocument();
      });
    });
  });
});