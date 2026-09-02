import { GameDefinition, GameAction, RawMetrics, PracticeConfig } from "../core/types";
import { SeededRNG } from "../core/rng";
import { BubbleMathState, BubbleMathActionPayload } from "./types";
import { generateQuestion, generateQuestions } from "./generator";
import { generateMockQuestions } from "./mock-generator";
import { validateSelectionOrder } from "./validator";

export const bubbleMathDefinition: GameDefinition<PracticeConfig, BubbleMathState, BubbleMathActionPayload> = {
  id: "bubble-math",
  name: "Bubble Math",
  description: "Rapidly calculate expressions and select the correct bubbles in ascending order.",
  category: "Numerical Dexterity",
  variants: ["default", "speed-techniques", "full-mock-test", "full-challenge", "full-bubble-mock-test"],
  difficultyLevels: ["EASY", "MEDIUM", "HARD", "VARIABLE"],

  createInitialState: (config: PracticeConfig, seed: string): BubbleMathState => {
    const rng = new SeededRNG(seed);
    let questions;
    
    // Full Mock Test, Full Challenge, and Full Bubble Mock Test share the authoritative 28-question progressive generation logic
    if (config.variantId === "full-mock-test" || config.variantId === "full-challenge" || config.variantId === "full-bubble-mock-test") {
      questions = generateMockQuestions(rng, config.itemCount || 28);
    } else {
      questions = generateQuestions(rng, config.difficulty, config.itemCount, 3);
    }

    return {
      questions,
      currentSelections: []
    };
  },

  validateAction: (state: BubbleMathState, action: GameAction<BubbleMathActionPayload>): boolean => {
    const currentQ = state.questions[action.itemIndex];
    if (!currentQ) return false;
    
    if (action.payload.isTimeout) return false;

    return validateSelectionOrder(currentQ, action.payload.selectedOrderIds);
  },

  applyAction: (state: BubbleMathState, _action: GameAction<BubbleMathActionPayload>): BubbleMathState => {
    // Actions are recorded in the session, state stays the same except for UI
    return state;
  },

  isCompleted: (_state: BubbleMathState, currentItemIndex: number, totalItems: number): boolean => {
    return currentItemIndex >= totalItems - 1;
  },

  extractMetrics: (_state: BubbleMathState, _actions: GameAction<BubbleMathActionPayload>[]): Partial<RawMetrics> => {
    // Rely on core generic scoring logic for basic extraction
    return {};
  }
};
