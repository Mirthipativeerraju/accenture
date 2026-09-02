export type GameId = "bubble-math" | "memory-maze" | "path-finder" | string;
export type GameMode = "LEARN" | "GUIDED_PRACTICE" | "TIMED_PRACTICE" | "CHALLENGE" | "FULL_MOCK";
export type SessionStatus = "IDLE" | "INTRO" | "READY" | "PLAYING" | "COMPLETED" | "TIMEOUT" | "ABORTED" | "FAILED";
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD" | "VARIABLE";

export interface GameAction<TPayload = unknown> {
  timestamp: number;
  type: string;
  itemIndex: number;
  payload: TPayload;
  valid: boolean;
  responseTimeMs: number;
}

export interface RawMetrics {
  correct: number;
  incorrect: number;
  skipped: number;
  timedOut: number;
  totalActions: number;
  elapsedTimeMs: number;
  averageResponseTimeMs: number;
  [key: string]: unknown; // Extensible for game-specific metrics (e.g. wallCollisions)
}

export interface ScoringConfig {
  mode: GameMode;
  weights: {
    accuracy: number;
    speed: number;
    completion: number;
  };
}

export interface GameResult {
  sessionId: string;
  gameId: GameId;
  variantId: string;
  difficulty: DifficultyLevel;
  mode: GameMode;
  score: number; // Practice score
  accuracy: number; // 0 to 1
  rawMetrics: RawMetrics;
  completedAt: number;
  seed: string;
}

export interface PracticeConfig {
  gameId: GameId;
  variantId: string;
  difficulty: DifficultyLevel;
  mode: GameMode;
  itemCount: number;
  timeLimitSeconds: number;
  instructionTimeSeconds: number;
  scoringConfig: ScoringConfig;
  allowRestart: boolean;
  allowBacktrack: boolean;
}

export interface MockSectionConfig {
  gameId: GameId;
  variantId: string;
  difficulty: DifficultyLevel;
  itemCount: number;
  timeLimitSeconds: number;
  instructionTimeSeconds: number;
  scoringConfig: ScoringConfig;
}

export interface MockConfig {
  id: string;
  sections: MockSectionConfig[];
}

export interface GameSession<TState = unknown> {
  sessionId: string;
  gameId: GameId;
  variantId: string;
  difficulty: DifficultyLevel;
  mode: GameMode;
  seed: string;
  status: SessionStatus;
  startedAt: number | null;
  completedAt: number | null;
  currentItemIndex: number;
  totalItems: number;
  actions: GameAction[];
  gameState: TState;
  metadata: Record<string, unknown>;
}

export interface GameDefinition<TConfig = unknown, TState = unknown, TActionPayload = unknown> {
  id: GameId;
  name: string;
  description: string;
  category: string;
  variants: string[];
  difficultyLevels: DifficultyLevel[];
  
  createInitialState(config: TConfig, seed: string): TState;
  validateAction(state: TState, action: GameAction<TActionPayload>): boolean;
  applyAction(state: TState, action: GameAction<TActionPayload>): TState;
  isCompleted(state: TState, currentItemIndex: number, totalItems: number): boolean;
  extractMetrics(state: TState, actions: GameAction<TActionPayload>[]): Partial<RawMetrics>;
}
