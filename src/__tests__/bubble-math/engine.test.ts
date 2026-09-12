import { describe, it, expect } from 'vitest';
import { bubbleMathDefinition } from '@/lib/games/bubble-math/engine';
import { PracticeConfig, GameAction } from '@/lib/games/core/types';
import { BubbleMathActionPayload } from '@/lib/games/bubble-math/types';
import { SessionController } from '@/lib/games/core/session';

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

  it('creates exactly 10 deterministic fixed questions for practice-1 variant', () => {
    const p1Config: PracticeConfig = {
      ...dummyConfig,
      variantId: 'practice-1',
      itemCount: 10,
    };
    const state1 = bubbleMathDefinition.createInitialState(p1Config, 'seed-1');
    const state2 = bubbleMathDefinition.createInitialState(p1Config, 'seed-2');

    expect(state1.questions.length).toBe(10);
    expect(state2.questions.length).toBe(10);
    expect(state1.questions).toEqual(state2.questions);
    
    // Verify each question has 3 expressions and correct ascending order
    state1.questions.forEach((q, idx) => {
      expect(q.expressions.length).toBe(3);
      expect(q.correctOrderIds.length).toBe(3);
      
      const val0 = q.expressions.find(e => e.id === q.correctOrderIds[0])!.value;
      const val1 = q.expressions.find(e => e.id === q.correctOrderIds[1])!.value;
      const val2 = q.expressions.find(e => e.id === q.correctOrderIds[2])!.value;
      expect(val0).toBeLessThan(val1);
      expect(val1).toBeLessThan(val2);
    });
  });

  it('creates exactly 15 deterministic fixed questions for practice-2 variant', () => {
    const p2Config: PracticeConfig = {
      ...dummyConfig,
      variantId: 'practice-2',
      itemCount: 15,
    };
    const state1 = bubbleMathDefinition.createInitialState(p2Config, 'seed-1');
    const state2 = bubbleMathDefinition.createInitialState(p2Config, 'seed-2');

    expect(state1.questions.length).toBe(15);
    expect(state2.questions.length).toBe(15);
    expect(state1.questions).toEqual(state2.questions);
    
    // Verify each question has 3 expressions and correct ascending order (<= for duplicates like Q3)
    state1.questions.forEach((q, idx) => {
      expect(q.expressions.length).toBe(3);
      expect(q.correctOrderIds.length).toBe(3);
      
      const val0 = q.expressions.find(e => e.id === q.correctOrderIds[0])!.value;
      const val1 = q.expressions.find(e => e.id === q.correctOrderIds[1])!.value;
      const val2 = q.expressions.find(e => e.id === q.correctOrderIds[2])!.value;
      expect(val0).toBeLessThanOrEqual(val1);
      expect(val1).toBeLessThanOrEqual(val2);
    });

    // Check specific Q3 duplicate value of 9
    const q3 = state1.questions[2];
    expect(q3.expressions.map(e => e.display)).toEqual(["7", "3 + 6", "12 - 3"]);
    expect(q3.expressions.map(e => e.value)).toEqual([7, 9, 9]);

    // Check decimal questions (Q11-Q15)
    expect(state1.questions[10].expressions.map(e => e.display)).toEqual(["5", "2.5", "2 + 2"]);
    expect(state1.questions[14].expressions.map(e => e.display)).toEqual(["7", "3.2 + 2.5", "8.4 - 1.1"]);
  });

  it('creates exactly 20 deterministic fixed questions for practice-3 variant with verified orders', () => {
    const p3Config: PracticeConfig = {
      ...dummyConfig,
      variantId: 'practice-3',
      itemCount: 20,
    };
    const state1 = bubbleMathDefinition.createInitialState(p3Config, 'seed-1');
    const state2 = bubbleMathDefinition.createInitialState(p3Config, 'seed-2');

    expect(state1.questions.length).toBe(20);
    expect(state2.questions.length).toBe(20);
    expect(state1.questions).toEqual(state2.questions);
    
    // Expected order patterns from prompt:
    const expectedOrders = [
      [1, 0, 2], // Q1: 2 -> 1 -> 3
      [2, 1, 0], // Q2: 3 -> 2 -> 1
      [0, 1, 2], // Q3: 1 -> 2 -> 3
      [2, 1, 0], // Q4: 3 -> 2 -> 1
      [2, 1, 0], // Q5: 3 -> 2 -> 1
      [1, 2, 0], // Q6: 2 -> 3 -> 1
      [2, 0, 1], // Q7: 3 -> 1 -> 2
      [1, 0, 2], // Q8: 2 -> 1 -> 3
      [1, 0, 2], // Q9: 2 -> 1 -> 3
      [2, 1, 0], // Q10: 3 -> 2 -> 1
      [0, 2, 1], // Q11: 1 -> 3 -> 2
      [2, 0, 1], // Q12: 3 -> 1 -> 2
      [0, 1, 2], // Q13: 1 -> 2 -> 3
      [2, 1, 0], // Q14: 3 -> 2 -> 1
      [1, 0, 2], // Q15: 2 -> 1 -> 3
      [2, 0, 1], // Q16: 3 -> 1 -> 2
      [1, 0, 2], // Q17: 2 -> 1 -> 3
      [1, 0, 2], // Q18: 2 -> 1 -> 3
      [2, 1, 0], // Q19: 3 -> 2 -> 1
      [2, 1, 0], // Q20: 3 -> 2 -> 1
    ];

    state1.questions.forEach((q, idx) => {
      expect(q.expressions.length).toBe(3);
      expect(q.correctOrderIds.length).toBe(3);

      const expectedIdxs = expectedOrders[idx];
      const expectedIds = expectedIdxs.map(i => q.expressions[i].id);
      expect(q.correctOrderIds).toEqual(expectedIds);

      const val0 = q.expressions.find(e => e.id === q.correctOrderIds[0])!.value;
      const val1 = q.expressions.find(e => e.id === q.correctOrderIds[1])!.value;
      const val2 = q.expressions.find(e => e.id === q.correctOrderIds[2])!.value;
      expect(val0).toBeLessThan(val1);
      expect(val1).toBeLessThan(val2);
    });

    // Verify Q16-Q20 special formats (powers, brackets)
    expect(state1.questions[15].expressions[0].display).toBe("3²");
    expect(state1.questions[16].expressions[1].display).toBe("2³");
    expect(state1.questions[17].expressions[0].display).toBe("18 + (3 + 2)");
    expect(state1.questions[18].expressions[1].display).toBe("3³");
    expect(state1.questions[19].expressions[2].display).toBe("24 + (10 + 13)");
  });

  it('guarantees Full Mock Test with 28 questions progresses sequentially on timeouts and only completes on Question 28', () => {
    const mockConfig: PracticeConfig = {
      ...dummyConfig,
      variantId: 'full-mock-test',
      itemCount: 28,
      timeLimitSeconds: 15,
    };

    const controller = new SessionController('test-mock-sess', mockConfig, bubbleMathDefinition, 'seed-timeout-test');
    controller.transitionTo('READY');
    controller.transitionTo('PLAYING');

    // Simulate timeouts for Question 1 to Question 27 (indices 0 to 26)
    for (let i = 0; i < 27; i++) {
      expect(controller.getSession().currentItemIndex).toBe(i);
      expect(controller.getSession().status).toBe('PLAYING');

      // Record timeout action for question i
      controller.recordAction({ selectedOrderIds: [], isTimeout: true }, 15000);
      expect(controller.getSession().status).toBe('PLAYING');

      // Advance to next question
      controller.advanceItem();
      expect(controller.getSession().currentItemIndex).toBe(i + 1);
    }

    // Now on Question 28 (index 27)
    expect(controller.getSession().currentItemIndex).toBe(27);
    expect(controller.getSession().status).toBe('PLAYING');

    // Timeout on Question 28 -> should complete session
    controller.recordAction({ selectedOrderIds: [], isTimeout: true }, 15000);
    expect(controller.getSession().status).toBe('COMPLETED');
    expect(controller.getSession().actions).toHaveLength(28);
    expect(controller.getSession().actions.every((a: any) => a.payload.isTimeout)).toBe(true);
  });
});
