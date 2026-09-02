import { describe, it, expect } from 'vitest';
import { validateSelectionOrder } from '@/lib/games/bubble-math/validator';
import { BubbleMathQuestion } from '@/lib/games/bubble-math/types';

describe('validateSelectionOrder', () => {
  const dummyQuestion: BubbleMathQuestion = {
    expressions: [],
    displayOrderIds: ['b', 'c', 'a'],
    correctOrderIds: ['a', 'b', 'c']
  };

  it('returns true for correct complete order', () => {
    expect(validateSelectionOrder(dummyQuestion, ['a', 'b', 'c'])).toBe(true);
  });

  it('returns false for incorrect complete order', () => {
    expect(validateSelectionOrder(dummyQuestion, ['a', 'c', 'b'])).toBe(false);
  });

  it('returns false for incomplete selection', () => {
    expect(validateSelectionOrder(dummyQuestion, ['a', 'b'])).toBe(false);
  });
});
