import { describe, it, expect } from 'vitest';
import { extractRawMetrics, calculatePracticeScore } from '@/lib/games/core/scoring';
import { GameSession, GameAction, ScoringConfig, RawMetrics } from '@/lib/games/core/types';

describe('Scoring Architecture', () => {
  it('extracts raw metrics correctly', () => {
    const actions: GameAction[] = [
      { valid: true, responseTimeMs: 1000 } as GameAction,
      { valid: false, responseTimeMs: 2000 } as GameAction,
      { valid: true, responseTimeMs: 3000 } as GameAction,
    ];

    const session: Partial<GameSession> = {
      actions,
      startedAt: 10000,
      completedAt: 20000
    };

    const metrics = extractRawMetrics(session as GameSession);
    expect(metrics.correct).toBe(2);
    expect(metrics.incorrect).toBe(1);
    expect(metrics.totalActions).toBe(3);
    expect(metrics.averageResponseTimeMs).toBe(2000); // (1000+2000+3000)/3
    expect(metrics.elapsedTimeMs).toBe(10000);
  });

  it('calculates practice score safely', () => {
    const config: ScoringConfig = {
      mode: 'TIMED_PRACTICE',
      weights: { accuracy: 1, speed: 1, completion: 1 }
    };

    const metrics = {
      correct: 8,
      incorrect: 2,
      skipped: 0,
      timedOut: 0,
      totalActions: 10,
      elapsedTimeMs: 10000,
      averageResponseTimeMs: 1000
    };

    // Accuracy: (8 - 2*0.5) / 10 = 7 / 10 = 0.7 => 70
    const score = calculatePracticeScore(metrics, config);
    expect(score).toBe(70);
  });

  it('returns 0 for learning modes', () => {
    const config: ScoringConfig = {
      mode: 'LEARN',
      weights: { accuracy: 1, speed: 1, completion: 1 }
    };

    const score = calculatePracticeScore({ correct: 10, incorrect: 0, totalActions: 10 } as unknown as RawMetrics, config);
    expect(score).toBe(0);
  });
});
