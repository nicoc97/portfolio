import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactSection } from './ContactSection';

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn(),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

describe('ContactSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders contact section with all elements', () => {
    render(<ContactSection />);
    
    // Check main heading
    expect(screen.getByText('CONTACT')).toBeInTheDocument();
    
    // Check section subheadings
    expect(screen.getByText('GET IN TOUCH')).toBeInTheDocument();
    expect(screen.getByText('CONNECT & DOWNLOAD')).toBeInTheDocument();
    
    // Check contact information
    expect(screen.getByText('nico@example.com')).toBeInTheDocument();
    expect(screen.getByText('Glasgow, UK')).toBeInTheDocument();
    expect(screen.getByText('+44 7XXX XXXXXX')).toBeInTheDocument();
    
    // Check social links
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    
    // Check CV download button
    expect(screen.getByText('DOWNLOAD CV')).toBeInTheDocument();
  });

  it('copies email to clipboard when email card is clicked', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    render(<ContactSection />);
    
    const emailCard = screen.getByText('nico@example.com').closest('.pixel-card');
    expect(emailCard).toBeInTheDocument();
    
    fireEvent.click(emailCard!);
    
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith('nico@example.com');
    });
    
    // Check for feedback message
    await waitFor(() => {
      expect(screen.getByText('Email copied!')).toBeInTheDocument();
    });
  });

  it('copies phone number to clipboard when phone card is clicked', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    render(<ContactSection />);
    
    const phoneCard = screen.getByText('+44 7XXX XXXXXX').closest('.pixel-card');
    expect(phoneCard).toBeInTheDocument();
    
    fireEvent.click(phoneCard!);
    
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith('+44 7XXX XXXXXX');
    });
    
    // Check for feedback message
    await waitFor(() => {
      expect(screen.getByText('Phone copied!')).toBeInTheDocument();
    });
  });

  it('handles clipboard copy failure gracefully', async () => {
    mockClipboard.writeText.mockRejectedValue(new Error('Clipboard failed'));
    
    render(<ContactSection />);
    
    const emailCard = screen.getByText('nico@example.com').closest('.pixel-card');
    fireEvent.click(emailCard!);
    
    await waitFor(() => {
      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });
  });

  it('shows loading state during CV download', async () => {
    render(<ContactSection />);
    
    const downloadButton = screen.getByText('DOWNLOAD CV');
    fireEvent.click(downloadButton);
    
    // Check loading state
    expect(screen.getByText('DOWNLOADING...')).toBeInTheDocument();
    expect(downloadButton).toBeDisabled();
    
    // Wait for download to complete
    await waitFor(() => {
      expect(screen.getByText('DOWNLOAD CV')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(downloadButton).not.toBeDisabled();
  });

  it('triggers CV download functionality', async () => {
    render(<ContactSection />);
    
    const downloadButton = screen.getByText('DOWNLOAD CV');
    
    // Check initial state
    expect(downloadButton).not.toBeDisabled();
    
    // Click download button
    fireEvent.click(downloadButton);
    
    // Check loading state appears
    expect(screen.getByText('DOWNLOADING...')).toBeInTheDocument();
    expect(downloadButton).toBeDisabled();
    
    // Wait for download to complete
    await waitFor(() => {
      expect(screen.getByText('DOWNLOAD CV')).toBeInTheDocument();
      expect(downloadButton).not.toBeDisabled();
    }, { timeout: 2000 });
  });

  it('has correct external links with proper attributes', () => {
    render(<ContactSection />);
    
    const githubLink = screen.getByText('GitHub').closest('a');
    const linkedinLink = screen.getByText('LinkedIn').closest('a');
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com/nicocruickshank');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/nicocruickshank');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays copy feedback message and hides it after timeout', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined);
    
    render(<ContactSection />);
    
    const emailCard = screen.getByText('nico@example.com').closest('.pixel-card');
    fireEvent.click(emailCard!);
    
    await waitFor(() => {
      expect(screen.getByText('Email copied!')).toBeInTheDocument();
    });
    
    // Wait for the timeout to complete
    await waitFor(() => {
      expect(screen.queryByText('Email copied!')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('has proper accessibility attributes', () => {
    render(<ContactSection />);
    
    // Check that clickable elements have proper cursor styling
    const emailCard = screen.getByText('nico@example.com').closest('.pixel-card');
    const phoneCard = screen.getByText('+44 7XXX XXXXXX').closest('.pixel-card');
    
    expect(emailCard).toHaveClass('cursor-pointer');
    expect(phoneCard).toHaveClass('cursor-pointer');
    
    // Check that external links have proper security attributes
    const externalLinks = screen.getAllByRole('link');
    externalLinks.forEach(link => {
      if (link.getAttribute('target') === '_blank') {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  it('renders pixel-styled icons for all contact methods', () => {
    render(<ContactSection />);
    
    // Check specific icon containers by finding SVG elements directly
    const emailIcon = screen.getByText('nico@example.com').closest('.pixel-card')?.querySelector('svg');
    const phoneIcon = screen.getByText('+44 7XXX XXXXXX').closest('.pixel-card')?.querySelector('svg');
    const locationIcon = screen.getByText('Glasgow, UK').closest('.pixel-card')?.querySelector('svg');
    const githubIcon = screen.getByText('GitHub').closest('a')?.querySelector('svg');
    const linkedinIcon = screen.getByText('LinkedIn').closest('a')?.querySelector('svg');
    
    expect(emailIcon).toBeInTheDocument();
    expect(phoneIcon).toBeInTheDocument();
    expect(locationIcon).toBeInTheDocument();
    expect(githubIcon).toBeInTheDocument();
    expect(linkedinIcon).toBeInTheDocument();
    
    // Check that all SVG icons have proper styling classes
    expect(emailIcon).toHaveClass('w-full', 'h-full');
    expect(phoneIcon).toHaveClass('w-full', 'h-full');
    expect(locationIcon).toHaveClass('w-full', 'h-full');
    expect(githubIcon).toHaveClass('w-full', 'h-full');
    expect(linkedinIcon).toHaveClass('w-full', 'h-full');
  });
});