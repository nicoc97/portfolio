import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PixelButton } from './PixelButton';

describe('PixelButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders with default props', () => {
    render(<PixelButton>Click me</PixelButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('pixel-button');
  });

  it('renders with custom className', () => {
    render(<PixelButton className="custom-class">Test</PixelButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<PixelButton variant="primary">Primary</PixelButton>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('text-accent-orange');

    rerender(<PixelButton variant="success">Success</PixelButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-accent-green');

    rerender(<PixelButton variant="secondary">Secondary</PixelButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-white');

    rerender(<PixelButton variant="ghost">Ghost</PixelButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-accent-orange');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<PixelButton size="sm">Small</PixelButton>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('text-xs');

    rerender(<PixelButton size="md">Medium</PixelButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-sm');

    rerender(<PixelButton size="lg">Large</PixelButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-base');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    render(<PixelButton onClick={mockOnClick}>Click me</PixelButton>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    render(<PixelButton onClick={mockOnClick} disabled>Disabled</PixelButton>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockOnClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('applies disabled styling when disabled', () => {
    render(<PixelButton disabled>Disabled</PixelButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<PixelButton onClick={mockOnClick}>Keyboard accessible</PixelButton>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    
    await user.keyboard(' ');
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });
});