import { GameSession, RawMetrics, ScoringConfig, GameResult } from "./types";

export function extractRawMetrics(session: GameSession): RawMetrics {
  let correct = 0;
  let incorrect = 0;
  const skipped = 0;
  const timedOut = 0;
  
  let totalResponseTimeMs = 0;

  session.actions.forEach(action => {
    if (action.valid) {
      correct++;
    } else {
      // Different games might have different meanings for invalid, but baseline is incorrect
      incorrect++; 
    }
    totalResponseTimeMs += action.responseTimeMs;
  });

  const totalActions = session.actions.length;
  const averageResponseTimeMs = totalActions > 0 ? totalResponseTimeMs / totalActions : 0;
  
  const elapsedTimeMs = session.completedAt && session.startedAt 
    ? session.completedAt - session.startedAt 
    : 0;

  return {
    correct,
    incorrect,
    skipped,
    timedOut,
    totalActions,
    elapsedTimeMs,
    averageResponseTimeMs,
  };
}

export function calculatePracticeScore(metrics: RawMetrics, config: ScoringConfig): number {
  if (config.mode === "LEARN" || config.mode === "GUIDED_PRACTICE") {
    return 0; // Score not applicable for un-timed/learning modes conceptually
  }

  const { correct, incorrect, totalActions } = metrics;
  
  // Baseline accuracy (0-1)
  const accuracy = totalActions > 0 ? Math.max(0, correct - (incorrect * 0.5)) / (correct + incorrect) : 0;
  const safeAccuracy = Math.max(0, Math.min(1, accuracy));

  // Speed factor (game-specific speed logic would ideally override this, but this is a generic baseline)
  const speedBonus = 1.0; // Needs game specific context to be meaningful

  const score = (safeAccuracy * config.weights.accuracy * 100) * speedBonus;
  
  return Math.round(score);
}

export function generateGameResult(session: GameSession, config: ScoringConfig): GameResult {
  const rawMetrics = extractRawMetrics(session);
  const totalAttempted = rawMetrics.correct + rawMetrics.incorrect;
  const accuracy = totalAttempted > 0 ? rawMetrics.correct / totalAttempted : 0;
  
  return {
    sessionId: session.sessionId,
    gameId: session.gameId,
    variantId: session.variantId,
    difficulty: session.difficulty,
    mode: session.mode,
    score: calculatePracticeScore(rawMetrics, config),
    accuracy: accuracy,
    rawMetrics,
    completedAt: session.completedAt || Date.now(),
    seed: session.seed
  };
}
