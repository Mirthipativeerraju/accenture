import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GameCard } from '@/components/game/GameCard';

describe('GameCard Component', () => {
  const defaultProps = {
    id: "memory-maze" as const,
    title: "Test Game",
    description: "A fun test game.",
    skills: ["Skill 1", "Skill 2"],
    difficulty: "Medium" as const,
  };

  it('renders title and description', () => {
    render(<GameCard {...defaultProps} />);
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('A fun test game.')).toBeInTheDocument();
  });

  it('renders skills as badges', () => {
    render(<GameCard {...defaultProps} />);
    expect(screen.getByText('Skill 1')).toBeInTheDocument();
    expect(screen.getByText('Skill 2')).toBeInTheDocument();
  });

  it('renders the difficulty', () => {
    render(<GameCard {...defaultProps} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });
  
  it('renders the practice link', () => {
    render(<GameCard {...defaultProps} />);
    const link = screen.getByRole('link', { name: /practice/i });
    expect(link).toHaveAttribute('href', '/practice/memory-maze');
  });
});
