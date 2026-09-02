import { describe, it, expect } from 'vitest';
import { SeededRNG } from '@/lib/games/core/rng';

describe('SeededRNG', () => {
  it('generates the same sequence for the same seed', () => {
    const rng1 = new SeededRNG('test-seed-123');
    const rng2 = new SeededRNG('test-seed-123');

    for (let i = 0; i < 10; i++) {
      expect(rng1.next()).toBe(rng2.next());
    }
  });

  it('generates different sequences for different seeds', () => {
    const rng1 = new SeededRNG('seed-A');
    const rng2 = new SeededRNG('seed-B');

    // Very high probability these differ on first pull
    expect(rng1.next()).not.toBe(rng2.next());
  });

  it('randomInt generates within bounds', () => {
    const rng = new SeededRNG('seed');
    for (let i = 0; i < 100; i++) {
      const val = rng.randomInt(1, 5);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(5);
    }
  });

  it('randomChoice selects an element', () => {
    const rng = new SeededRNG('seed');
    const arr = ['a', 'b', 'c'];
    const choice = rng.randomChoice(arr);
    expect(arr).toContain(choice);
  });

  it('shuffle reorders array but keeps elements', () => {
    const rng = new SeededRNG('seed');
    const arr = [1, 2, 3, 4, 5];
    const shuffled = rng.shuffle(arr);
    
    expect(shuffled.length).toBe(arr.length);
    expect(shuffled.sort()).toEqual(arr.sort());
  });
});
