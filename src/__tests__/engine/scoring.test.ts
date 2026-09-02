import { describe, it, expect } from 'vitest';
import { extractRawMetrics, calculatePracticeScore, generateGameResult } from '@/lib/games/core/scoring';
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

  it('calculates 10 points per completed question for practice variants in generateGameResult', () => {
    const actions: GameAction[] = Array.from({ length: 10 }, (_, i) => ({
      itemIndex: i,
      valid: i < 2, // 2 correct, 8 incorrect
      responseTimeMs: 1500,
    } as GameAction));

    const session: Partial<GameSession> = {
      sessionId: 'sess-p1',
      gameId: 'bubble-math',
      variantId: 'practice-1',
      difficulty: 'EASY',
      mode: 'TIMED_PRACTICE',
      actions,
      startedAt: 1000,
      completedAt: 16000,
      seed: 'seed-test'
    };

    const config: ScoringConfig = {
      mode: 'TIMED_PRACTICE',
      weights: { accuracy: 1, speed: 1, completion: 1 }
    };

    const result = generateGameResult(session as GameSession, config);
    // 10 completed questions * 10 = 100, despite 2 correct and 8 incorrect
    expect(result.score).toBe(100);
    expect(result.rawMetrics.totalActions).toBe(10);
    expect(result.rawMetrics.correct).toBe(2);
    expect(result.rawMetrics.incorrect).toBe(8);
  });

  it('calculates score based on actual completed questions (e.g. 1, 2, 5 questions)', () => {
    const config: ScoringConfig = {
      mode: 'TIMED_PRACTICE',
      weights: { accuracy: 1, speed: 1, completion: 1 }
    };

    // 1 question completed -> 10
    const session1: Partial<GameSession> = {
      sessionId: 's-1',
      gameId: 'bubble-math',
      variantId: 'practice-1',
      actions: [{ itemIndex: 0, valid: true, responseTimeMs: 1000 } as GameAction],
      startedAt: 1000,
      completedAt: 2000,
    };
    expect(generateGameResult(session1 as GameSession, config).score).toBe(10);

    // 2 questions completed -> 20
    const session2: Partial<GameSession> = {
      sessionId: 's-2',
      gameId: 'bubble-math',
      variantId: 'practice-2',
      actions: [
        { itemIndex: 0, valid: true, responseTimeMs: 1000 } as GameAction,
        { itemIndex: 1, valid: false, responseTimeMs: 1500 } as GameAction,
      ],
      startedAt: 1000,
      completedAt: 3500,
    };
    expect(generateGameResult(session2 as GameSession, config).score).toBe(20);

    // 5 questions completed -> 50
    const session5: Partial<GameSession> = {
      sessionId: 's-5',
      gameId: 'bubble-math',
      variantId: 'practice-1',
      actions: Array.from({ length: 5 }, (_, i) => ({ itemIndex: i, valid: i % 2 === 0, responseTimeMs: 1000 } as GameAction)),
      startedAt: 1000,
      completedAt: 6000,
    };
    expect(generateGameResult(session5 as GameSession, config).score).toBe(50);
  });

  it('deduplicates actions with same itemIndex to prevent overcounting', () => {
    const config: ScoringConfig = {
      mode: 'TIMED_PRACTICE',
      weights: { accuracy: 1, speed: 1, completion: 1 }
    };

    // If duplicate action was somehow submitted for question 0
    const sessionWithDupes: Partial<GameSession> = {
      sessionId: 's-dupe',
      gameId: 'bubble-math',
      variantId: 'practice-1',
      actions: [
        { itemIndex: 0, valid: true, responseTimeMs: 1000 } as GameAction,
        { itemIndex: 0, valid: true, responseTimeMs: 1000 } as GameAction, // Duplicate
        { itemIndex: 1, valid: true, responseTimeMs: 1000 } as GameAction,
      ],
      startedAt: 1000,
      completedAt: 3000,
    };

    const result = generateGameResult(sessionWithDupes as GameSession, config);
    expect(result.rawMetrics.totalActions).toBe(2);
    expect(result.score).toBe(20);
  });
});
