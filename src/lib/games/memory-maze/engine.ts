import { GameDefinition, GameAction, PracticeConfig, RawMetrics } from "../core/types";
import { SeededRNG } from "../core/rng";
import { 
  MemoryMazeConfig, 
  MemoryMazeState, 
  MemoryMazeActionPayload 
} from "./types";
import { generateMemoryMazeQuestions } from "./generator";
import { validateMemoryMazeAction } from "./validator";
import { getMazesForVariant } from "./practice-mazes";

export const memoryMazeDefinition: GameDefinition<MemoryMazeConfig, MemoryMazeState, MemoryMazeActionPayload> = {
  id: "memory-maze",
  name: "Memory Maze",
  description: "Navigate through the maze, collect the key, and reach the door.",
  category: "Spatial Memory",
  variants: ["learn", "guided-practice", "timed-practice", "challenge", "practice-1", "practice-2", "practice-3", "full-memory-mock-test"],
  difficultyLevels: ["EASY", "MEDIUM", "HARD", "VARIABLE"],

  createInitialState: (config: MemoryMazeConfig, seed: string): MemoryMazeState => {
    if (config.variantId && (
      config.variantId.startsWith("practice-") || 
      config.variantId === "full-memory-mock-test"
    )) {
      const questions = getMazesForVariant(config.variantId, seed);
      return { questions };
    }

    if (config.gridSize && config.pathLength && config.itemCount) {
      const rng = new SeededRNG(seed);
      const questions = generateMemoryMazeQuestions(
        rng,
        config.gridSize,
        config.pathLength,
        config.itemCount
      );
      return { questions };
    }

    const questions = getMazesForVariant(config.variantId || "practice-1", seed);
    return { questions };
  },

  validateAction: (state: MemoryMazeState, action: GameAction<MemoryMazeActionPayload>): boolean => {
    const question = state.questions[action.itemIndex];
    if (!question) return false;
    if (action.payload.isTimeout) return false;
    if (action.payload.completed !== undefined) {
      return !!action.payload.completed && !!action.payload.keyCollected;
    }
    return validateMemoryMazeAction(question, action.payload);
  },

  applyAction: (state: MemoryMazeState, _action: GameAction<MemoryMazeActionPayload>): MemoryMazeState => {
    return state;
  },

  isCompleted: (_state: MemoryMazeState, currentItemIndex: number, totalItems: number): boolean => {
    return currentItemIndex >= totalItems - 1;
  },

  extractMetrics: (_state: MemoryMazeState, actions: GameAction<MemoryMazeActionPayload>[]): Partial<RawMetrics> => {
    let correct = 0;
    let incorrect = 0;
    let timedOut = 0;
    let totalTime = 0;

    actions.forEach(a => {
      if (a.payload.isTimeout) timedOut++;
      else if (a.valid) correct++;
      else incorrect++;
      
      totalTime += a.responseTimeMs;
    });

    const averageResponseTimeMs = actions.length > 0 ? totalTime / actions.length : 0;

    return {
      correct,
      incorrect,
      timedOut,
      totalActions: actions.length,
      elapsedTimeMs: totalTime,
      averageResponseTimeMs
    };
  }
};
