import { describe, it, expect } from 'vitest';
import { generateQuestion } from '@/lib/games/bubble-math/generator';
import { SeededRNG } from '@/lib/games/core/rng';

describe('Bubble Math Generator', () => {
  it('generates exactly 3 distinct expressions by default', () => {
    const rng = new SeededRNG('test-seed-1');
    const q = generateQuestion(rng, 'MEDIUM');
    
    expect(q.expressions.length).toBe(3);
    
    const values = q.expressions.map(e => e.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(3); // No ties allowed
  });

  it('correctOrderIds are correctly sorted ascending', () => {
    const rng = new SeededRNG('test-seed-2');
    const q = generateQuestion(rng, 'HARD');
    
    const val1 = q.expressions.find(e => e.id === q.correctOrderIds[0])!.value;
    const val2 = q.expressions.find(e => e.id === q.correctOrderIds[1])!.value;
    const val3 = q.expressions.find(e => e.id === q.correctOrderIds[2])!.value;
    
    expect(val1).toBeLessThan(val2);
    expect(val2).toBeLessThan(val3);
  });

  it('displayOrder is a randomized permutation of correct IDs', () => {
    const rng = new SeededRNG('test-seed-3');
    const q = generateQuestion(rng, 'EASY');
    
    expect(q.displayOrderIds.length).toBe(3);
    expect(q.displayOrderIds.slice().sort()).toEqual(q.correctOrderIds.slice().sort());
  });

  it('is deterministic for the same seed and configuration', () => {
    const rng1 = new SeededRNG('reproducible-seed');
    const rng2 = new SeededRNG('reproducible-seed');
    
    const q1 = generateQuestion(rng1, 'EASY');
    const q2 = generateQuestion(rng2, 'EASY');
    
    expect(q1).toEqual(q2);
  });

  it('STRESS TEST: generates 1000 valid questions without failure', () => {
    const rng = new SeededRNG('stress-test-seed');
    
    expect(() => {
      for(let i = 0; i < 1000; i++) {
        // Mix difficulties
        const diffs = ['EASY', 'MEDIUM', 'HARD', 'VARIABLE'] as const;
        const diff = diffs[i % 4];
        const q = generateQuestion(rng, diff);
        
        // Invariants
        expect(q.expressions.length).toBe(3);
        const unique = new Set(q.expressions.map(e => e.value));
        expect(unique.size).toBe(3);
        
        // No NaNs or Infinity
        q.expressions.forEach(e => {
          expect(Number.isFinite(e.value)).toBe(true);
        });

        // layoutPattern invariant
        expect(['A', 'B', 'C', 'D']).toContain(q.layoutPattern);
      }
    }).not.toThrow();
  });

  it('assigns valid layoutPattern ("A", "B", "C", or "D")', () => {
    const rng = new SeededRNG('layout-test-seed');
    const q = generateQuestion(rng, 'EASY');
    
    expect(['A', 'B', 'C', 'D']).toContain(q.layoutPattern);
  });

  it('generates multiple layout patterns across questions', () => {
    const rng = new SeededRNG('layout-variation-seed-2');
    const patterns = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const q = generateQuestion(rng, 'EASY');
      if (q.layoutPattern) {
        patterns.add(q.layoutPattern);
      }
    }
    expect(patterns.size).toBeGreaterThan(1);
  });
});
