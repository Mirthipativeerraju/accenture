import { describe, it, expect } from 'vitest';
import { SessionController } from '@/lib/games/core/session';
import { GameDefinition, PracticeConfig } from '@/lib/games/core/types';

describe('SessionController', () => {
  const dummyGame: GameDefinition = {
    id: 'test',
    name: 'test',
    description: 'test',
    category: 'test',
    variants: ['default'],
    difficultyLevels: ['EASY'],
    createInitialState: () => ({ val: 0 }),
    validateAction: () => true, // all valid
    applyAction: (s: { val: number }) => ({ val: s.val + 1 }),
    isCompleted: (s: { val: number }, i: number, t: number) => i >= t - 1 && s.val > 0,
    extractMetrics: () => ({})
  };

  const config: PracticeConfig = {
    gameId: 'test',
    variantId: 'default',
    difficulty: 'EASY',
    mode: 'TIMED_PRACTICE',
    itemCount: 2,
    timeLimitSeconds: 60,
    instructionTimeSeconds: 10,
    scoringConfig: { mode: 'TIMED_PRACTICE', weights: { accuracy: 1, speed: 1, completion: 1 } },
    allowRestart: true,
    allowBacktrack: false
  };

  it('initializes in IDLE state', () => {
    const session = new SessionController('sess-1', config, dummyGame, 'seed');
    expect(session.getSession().status).toBe('IDLE');
    expect(session.getSession().currentItemIndex).toBe(0);
  });

  it('allows valid state transitions', () => {
    const session = new SessionController('sess-1', config, dummyGame, 'seed');
    expect(session.transitionTo('INTRO')).toBe(true);
    expect(session.transitionTo('READY')).toBe(true);
    expect(session.transitionTo('PLAYING')).toBe(true);
  });

  it('rejects invalid state transitions', () => {
    const session = new SessionController('sess-1', config, dummyGame, 'seed');
    // IDLE -> PLAYING is invalid
    expect(() => session.transitionTo('PLAYING')).toThrow();
  });

  it('records valid actions and advances items', () => {
    const session = new SessionController('sess-1', config, dummyGame, 'seed');
    session.transitionTo('READY');
    session.transitionTo('PLAYING');
    
    // Record action 1
    session.recordAction({ x: 1 }, 1000);
    expect(session.getSession().actions).toHaveLength(1);
    expect((session.getSession().gameState as { val: number }).val).toBe(1);
    
    session.advanceItem();
    expect(session.getSession().currentItemIndex).toBe(1);

    // Record action 2 (completes)
    session.recordAction({ x: 2 }, 1500);
    expect(session.getSession().status).toBe('COMPLETED');
  });
});
