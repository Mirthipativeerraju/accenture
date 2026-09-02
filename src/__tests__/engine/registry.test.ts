import { describe, it, expect, beforeEach } from 'vitest';
import { gameRegistry } from '@/lib/games/core/registry';
import { GameDefinition } from '@/lib/games/core/types';

describe('GameRegistry', () => {
  beforeEach(() => {
    gameRegistry.clear();
  });

  const dummyGame: GameDefinition = {
    id: 'test-game',
    name: 'Test Game',
    description: 'Test',
    category: 'Test',
    variants: ['default'],
    difficultyLevels: ['EASY'],
    createInitialState: () => ({}),
    validateAction: () => true,
    applyAction: () => ({}),
    isCompleted: () => false,
    extractMetrics: () => ({ correct: 0, incorrect: 0 })
  };

  it('can register and retrieve a game', () => {
    gameRegistry.register(dummyGame);
    expect(gameRegistry.hasGame('test-game')).toBe(true);
    expect(gameRegistry.getGame('test-game')).toBe(dummyGame);
  });

  it('throws when getting non-existent game', () => {
    expect(() => gameRegistry.getGame('unknown')).toThrow();
  });

  it('returns all registered games', () => {
    gameRegistry.register(dummyGame);
    const all = gameRegistry.getAllGames();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('test-game');
  });
});
