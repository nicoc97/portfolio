import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SkillsSection } from './SkillsSection';
import { techSkills, skillCategories } from '../../constants/skills';

// Mock the TechBadge component to simplify testing
vi.mock('../ui/TechBadge', () => ({
  TechBadge: ({ skill, onClick, className }: any) => (
    <div
      data-testid={`tech-badge-${skill.name}`}
      onClick={onClick}
      className={className}
    >
      {skill.name} - {skill.category}
    </div>
  ),
}));

describe('SkillsSection', () => {
  it('renders the section with correct title and description', () => {
    render(<SkillsSection />);
    
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText(/Interactive showcase of my technical skills/)).toBeInTheDocument();
  });

  it('displays all skills by default', () => {
    render(<SkillsSection />);
    
    // Check that all skills are rendered
    techSkills.forEach(skill => {
      expect(screen.getByTestId(`tech-badge-${skill.name}`)).toBeInTheDocument();
    });
  });

  it('displays category filter buttons with correct counts', () => {
    render(<SkillsSection />);
    
    // Check "All Skills" button
    expect(screen.getByText(`All Skills (${techSkills.length})`)).toBeInTheDocument();
    
    // Check category buttons
    skillCategories.forEach(category => {
      const categorySkills = techSkills.filter(skill => skill.category === category.key);
      expect(screen.getByText(`${category.label} (${categorySkills.length})`)).toBeInTheDocument();
    });
  });

  it('filters skills by category when category button is clicked', async () => {
    render(<SkillsSection />);
    
    // Click on frontend category
    const frontendButton = screen.getByText(/Frontend \(\d+\)/);
    fireEvent.click(frontendButton);
    
    await waitFor(() => {
      // Check that only frontend skills are visible
      const frontendSkills = techSkills.filter(skill => skill.category === 'frontend');
      const nonFrontendSkills = techSkills.filter(skill => skill.category !== 'frontend');
      
      frontendSkills.forEach(skill => {
        expect(screen.getByTestId(`tech-badge-${skill.name}`)).toBeInTheDocument();
      });
      
      // Non-frontend skills should not be present
      nonFrontendSkills.forEach(skill => {
        expect(screen.queryByTestId(`tech-badge-${skill.name}`)).not.toBeInTheDocument();
      });
    });
  });

  it('shows all skills when "All Skills" button is clicked after filtering', async () => {
    render(<SkillsSection />);
    
    // First filter by backend
    const backendButton = screen.getByText(/Backend \(\d+\)/);
    fireEvent.click(backendButton);
    
    // Then click "All Skills"
    const allSkillsButton = screen.getByText(`All Skills (${techSkills.length})`);
    fireEvent.click(allSkillsButton);
    
    await waitFor(() => {
      // All skills should be visible again
      techSkills.forEach(skill => {
        expect(screen.getByTestId(`tech-badge-${skill.name}`)).toBeInTheDocument();
      });
    });
  });

  it('opens skill details when a skill is clicked', async () => {
    render(<SkillsSection />);
    
    const reactSkill = techSkills.find(skill => skill.name === 'React');
    if (!reactSkill) throw new Error('React skill not found in test data');
    
    const reactBadge = screen.getByTestId('tech-badge-React');
    fireEvent.click(reactBadge);
    
    await waitFor(() => {
      // Check that skill details are displayed
      expect(screen.getByText('React', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.getByText(reactSkill.description!)).toBeInTheDocument();
      
      // Check proficiency stars
      const expectedStars = '★'.repeat(reactSkill.proficiency) + '☆'.repeat(5 - reactSkill.proficiency);
      expect(screen.getByText(expectedStars)).toBeInTheDocument();
      
      // Check category badge
      expect(screen.getByText('FRONTEND')).toBeInTheDocument();
    });
  });

  it('closes skill details when close button is clicked', async () => {
    render(<SkillsSection />);
    
    // Open skill details
    const reactBadge = screen.getByTestId('tech-badge-React');
    fireEvent.click(reactBadge);
    
    await waitFor(() => {
      expect(screen.getByText('React', { selector: 'h3' })).toBeInTheDocument();
    });
    
    // Close skill details
    const closeButton = screen.getByLabelText('Close skill details');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('React', { selector: 'h3' })).not.toBeInTheDocument();
    });
  });

  it('toggles skill details when the same skill is clicked twice', async () => {
    render(<SkillsSection />);
    
    const reactBadge = screen.getByTestId('tech-badge-React');
    
    // First click - open details
    fireEvent.click(reactBadge);
    await waitFor(() => {
      expect(screen.getByText('React', { selector: 'h3' })).toBeInTheDocument();
    });
    
    // Second click - close details
    fireEvent.click(reactBadge);
    await waitFor(() => {
      expect(screen.queryByText('React', { selector: 'h3' })).not.toBeInTheDocument();
    });
  });

  it('displays skills summary with correct statistics', () => {
    render(<SkillsSection />);
    
    skillCategories.forEach(category => {
      const categorySkills = techSkills.filter(skill => skill.category === category.key);
      const avgProficiency = categorySkills.reduce((sum, skill) => sum + skill.proficiency, 0) / categorySkills.length;
      
      // Check category name
      expect(screen.getByText(category.label)).toBeInTheDocument();
      
      // Check average proficiency (more specific than just the count)
      expect(screen.getByText(`Avg: ${avgProficiency.toFixed(1)}/5.0`)).toBeInTheDocument();
    });
  });

  it('shows related technologies when a skill is selected', async () => {
    render(<SkillsSection />);
    
    // Click on React skill (which should have related technologies)
    const reactBadge = screen.getByTestId('tech-badge-React');
    fireEvent.click(reactBadge);
    
    await waitFor(() => {
      expect(screen.getByText('Related Technologies:')).toBeInTheDocument();
      
      // React should have related technologies like TypeScript, JavaScript, etc.
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
  });

  it('allows navigation between related skills', async () => {
    render(<SkillsSection />);
    
    // Click on React skill
    const reactBadge = screen.getByTestId('tech-badge-React');
    fireEvent.click(reactBadge);
    
    await waitFor(() => {
      expect(screen.getByText('React', { selector: 'h3' })).toBeInTheDocument();
    });
    
    // Click on a related technology (TypeScript)
    const typeScriptRelatedButton = screen.getByText('TypeScript');
    fireEvent.click(typeScriptRelatedButton);
    
    await waitFor(() => {
      // Should now show TypeScript details instead of React
      expect(screen.getByText('TypeScript', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.queryByText('React', { selector: 'h3' })).not.toBeInTheDocument();
    });
  });

  it('applies correct CSS classes for filtering and highlighting', async () => {
    render(<SkillsSection />);
    
    // Test category filter button states
    const allSkillsButton = screen.getByText(`All Skills (${techSkills.length})`);
    expect(allSkillsButton).toHaveClass('bg-accent-orange');
    
    // Click frontend category
    const frontendButton = screen.getByText(/Frontend \(\d+\)/);
    fireEvent.click(frontendButton);
    
    await waitFor(() => {
      expect(frontendButton).toHaveClass('bg-accent-orange');
      expect(allSkillsButton).not.toHaveClass('bg-accent-orange');
    });
  });

  it('handles empty related skills gracefully', async () => {
    render(<SkillsSection />);
    
    // Use Vue.js which doesn't have related skills defined in the relationships object
    const vueSkill = techSkills.find(skill => skill.name === 'Vue.js');
    if (!vueSkill) throw new Error('Vue.js skill not found in test data');
    
    const vueBadge = screen.getByTestId('tech-badge-Vue.js');
    fireEvent.click(vueBadge);
    
    await waitFor(() => {
      expect(screen.getByText('Vue.js', { selector: 'h3' })).toBeInTheDocument();
      // Should not show related technologies section if there are none
      expect(screen.queryByText('Related Technologies:')).not.toBeInTheDocument();
    });
  });
});