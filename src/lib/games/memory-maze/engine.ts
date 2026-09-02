import { GameDefinition, GameAction, PracticeConfig, RawMetrics } from "../core/types";
import { SeededRNG } from "../core/rng";
import { 
  MemoryMazeConfig, 
  MemoryMazeState, 
  MemoryMazeActionPayload 
} from "./types";
import { generateMemoryMazeQuestions } from "./generator";
import { validateMemoryMazeAction } from "./validator";

export const memoryMazeDefinition: GameDefinition<MemoryMazeConfig, MemoryMazeState, MemoryMazeActionPayload> = {
  id: "memory-maze",
  name: "Memory Maze",
  description: "Memorize the valid path through the grid and reproduce it.",
  category: "Spatial Memory",
  variants: ["learn", "guided-practice", "timed-practice", "challenge"],
  difficultyLevels: ["EASY", "MEDIUM", "HARD", "VARIABLE"],

  createInitialState: (config: MemoryMazeConfig, seed: string): MemoryMazeState => {
    const rng = new SeededRNG(seed);
    const questions = generateMemoryMazeQuestions(
      rng,
      config.gridSize,
      config.pathLength,
      config.itemCount
    );

    return {
      questions
    };
  },

  validateAction: (state: MemoryMazeState, action: GameAction<MemoryMazeActionPayload>): boolean => {
    const question = state.questions[action.itemIndex];
    if (!question) return false;
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
