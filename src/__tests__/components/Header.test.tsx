import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '@/components/layout/Header';

describe('Header Component', () => {
  it('renders the application title', () => {
    render(<Header />);
    expect(screen.getByText('Aptitude Simulator')).toBeInTheDocument();
  });

  it('renders primary navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /games/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /practice/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /progress/i })).toBeInTheDocument();
  });

  it('renders call to action buttons', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /full mock/i })).toBeInTheDocument();
  });
});
