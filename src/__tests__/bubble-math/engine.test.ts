import { describe, it, expect } from 'vitest';
import { bubbleMathDefinition } from '@/lib/games/bubble-math/engine';
import { PracticeConfig, GameAction } from '@/lib/games/core/types';
import { BubbleMathActionPayload } from '@/lib/games/bubble-math/types';

describe('Bubble Math Engine Definition', () => {
  const dummyConfig: PracticeConfig = {
    gameId: 'bubble-math',
    variantId: 'default',
    difficulty: 'EASY',
    mode: 'TIMED_PRACTICE',
    itemCount: 2,
    timeLimitSeconds: 30,
    instructionTimeSeconds: 5,
    scoringConfig: { mode: 'TIMED_PRACTICE', weights: { accuracy: 1, speed: 0, completion: 0 } },
    allowRestart: false,
    allowBacktrack: false
  };

  it('creates valid initial state', () => {
    const state = bubbleMathDefinition.createInitialState(dummyConfig, 'seed');
    expect(state.questions.length).toBe(2);
    expect(state.currentSelections).toEqual([]);
  });

  it('validates a correct submission', () => {
    const state = bubbleMathDefinition.createInitialState(dummyConfig, 'seed');
    const correctOrder = state.questions[0].correctOrderIds;
    
    const action: GameAction<BubbleMathActionPayload> = {
      timestamp: Date.now(),
      type: 'ACTION',
      itemIndex: 0,
      responseTimeMs: 1000,
      valid: false,
      payload: { selectedOrderIds: correctOrder, isTimeout: false }
    };

    expect(bubbleMathDefinition.validateAction(state, action)).toBe(true);
  });

  it('rejects an incorrect submission', () => {
    const state = bubbleMathDefinition.createInitialState(dummyConfig, 'seed');
    const correctOrder = state.questions[0].correctOrderIds;
    // Swap last two
    const wrongOrder = [correctOrder[0], correctOrder[2], correctOrder[1]];
    
    const action: GameAction<BubbleMathActionPayload> = {
      timestamp: Date.now(),
      type: 'ACTION',
      itemIndex: 0,
      responseTimeMs: 1000,
      valid: false,
      payload: { selectedOrderIds: wrongOrder, isTimeout: false }
    };

    expect(bubbleMathDefinition.validateAction(state, action)).toBe(false);
  });

  it('rejects on timeout', () => {
    const state = bubbleMathDefinition.createInitialState(dummyConfig, 'seed');
    
    const action: GameAction<BubbleMathActionPayload> = {
      timestamp: Date.now(),
      type: 'ACTION',
      itemIndex: 0,
      responseTimeMs: 1000,
      valid: false,
      payload: { selectedOrderIds: [], isTimeout: true }
    };

    expect(bubbleMathDefinition.validateAction(state, action)).toBe(false);
  });

  it('creates valid initial state for full-mock-test variant with 28 items', () => {
    const mockConfig: PracticeConfig = {
      ...dummyConfig,
      variantId: 'full-mock-test',
      itemCount: 28,
    };
    const state = bubbleMathDefinition.createInitialState(mockConfig, 'seed-mock');
    expect(state.questions.length).toBe(28);
    expect(bubbleMathDefinition.variants).toContain('full-mock-test');
    expect(bubbleMathDefinition.variants).toContain('default');
  });

  it('creates identical question sets for full-challenge and full-mock-test given the same seed', () => {
    const challengeConfig: PracticeConfig = {
      ...dummyConfig,
      variantId: 'full-challenge',
      itemCount: 28,
    };
    const mockConfig: PracticeConfig = {
      ...dummyConfig,
      variantId: 'full-mock-test',
      itemCount: 28,
    };
    const seed = 'seed-parity-test-123';
    const challengeState = bubbleMathDefinition.createInitialState(challengeConfig, seed);
    const mockState = bubbleMathDefinition.createInitialState(mockConfig, seed);

    expect(challengeState.questions.length).toBe(28);
    expect(mockState.questions.length).toBe(28);
    expect(challengeState.questions).toEqual(mockState.questions);
    expect(bubbleMathDefinition.variants).toContain('full-challenge');
  });
});
