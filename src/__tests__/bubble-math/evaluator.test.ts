import { describe, it, expect } from 'vitest';
import { evaluateSafe } from '@/lib/games/bubble-math/evaluator';

describe('evaluateSafe', () => {
  it('evaluates addition correctly', () => {
    expect(evaluateSafe(14, '+', 18)).toBe(32);
  });

  it('evaluates subtraction correctly', () => {
    expect(evaluateSafe(45, '-', 19)).toBe(26);
  });

  it('evaluates multiplication correctly', () => {
    expect(evaluateSafe(9, '×', 4)).toBe(36);
  });

  it('evaluates division correctly', () => {
    expect(evaluateSafe(56, '÷', 7)).toBe(8);
  });

  it('throws on division by zero', () => {
    expect(() => evaluateSafe(10, '÷', 0)).toThrow('Division by zero');
  });

  it('throws on unknown operator', () => {
    expect(() => evaluateSafe(10, '^' as unknown as import('@/lib/games/bubble-math/types').MathOperator, 2)).toThrow('Unknown operator: ^');
  });
});
