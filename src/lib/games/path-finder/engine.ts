import { GameDefinition, GameAction, RawMetrics, PracticeConfig } from "../core/types";
import { SeededRNG } from "../core/rng";
import { PathFinderState, PathFinderActionPayload, PathFinderConfig } from "./types";
import { generatePathFinderQuestions } from "./generator";
import { validateRoute } from "./validator";

export const pathFinderDefinition: GameDefinition<PathFinderConfig, PathFinderState, PathFinderActionPayload> = {
  id: "path-finder",
  name: "Path Finder",
  description: "Rotate grid blocks to create a continuous directional route from the start shuttle to the destination planet.",
  category: "Spatial & Logical Reasoning",
  variants: ["default", "practice-1", "full-challenge"],
  difficultyLevels: ["EASY", "MEDIUM", "HARD"],

  createInitialState: (config: PracticeConfig, seed: string): PathFinderState => {
    const rng = new SeededRNG(seed);
    const count = config.itemCount || 10;
    const questions = generatePathFinderQuestions(rng, count, 3, 3);

    return {
      questions,
      currentQuestionIndex: 0,
    };
  },

  validateAction: (state: PathFinderState, action: GameAction<PathFinderActionPayload>): boolean => {
    const currentQ = state.questions[action.itemIndex];
    if (!currentQ) return false;
    if (action.payload.isTimeout) return false;

    const result = validateRoute(currentQ, action.payload.rotations, action.payload.direction);
    return result.isValid;
  },

  applyAction: (state: PathFinderState, action: GameAction<PathFinderActionPayload>): PathFinderState => {
    return {
      ...state,
      currentQuestionIndex: action.itemIndex + 1,
    };
  },

  isCompleted: (_state: PathFinderState, currentItemIndex: number, totalItems: number): boolean => {
    return currentItemIndex >= totalItems - 1;
  },

  extractMetrics: (_state: PathFinderState, actions: GameAction<PathFinderActionPayload>[]): Partial<RawMetrics> => {
    const totalQuestions = actions.length;
    const correctCount = actions.filter((a) => a.valid).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const avgResponseTimeMs =
      totalQuestions > 0 ? actions.reduce((sum, a) => sum + (a.responseTimeMs || 0), 0) / totalQuestions : 0;

    return {
      accuracy,
      avgResponseTimeMs,
      completionRate: 100,
    };
  },
};
