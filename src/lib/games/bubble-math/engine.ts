import { GameDefinition, GameAction, RawMetrics, PracticeConfig } from "../core/types";
import { SeededRNG } from "../core/rng";
import { BubbleMathState, BubbleMathActionPayload } from "./types";
import { generateQuestion, generateQuestions } from "./generator";
import { generateMockQuestions } from "./mock-generator";
import { validateSelectionOrder } from "./validator";
import { FIXED_PRACTICE_TEST_1_QUESTIONS } from "./practice-1-questions";
import { FIXED_PRACTICE_TEST_2_QUESTIONS } from "./practice-2-questions";
import { FIXED_PRACTICE_TEST_3_QUESTIONS } from "./practice-3-questions";

export const bubbleMathDefinition: GameDefinition<PracticeConfig, BubbleMathState, BubbleMathActionPayload> = {
  id: "bubble-math",
  name: "Bubble Math",
  description: "Rapidly calculate expressions and select the correct bubbles in ascending order.",
  category: "Numerical Dexterity",
  variants: ["default", "practice-1", "practice-2", "practice-3", "speed-techniques", "full-mock-test", "full-challenge", "full-bubble-mock-test"],
  difficultyLevels: ["EASY", "MEDIUM", "HARD", "VARIABLE"],

  createInitialState: (config: PracticeConfig, seed: string): BubbleMathState => {
    const rng = new SeededRNG(seed);
    let questions;
    
    // Practice Tests 1, 2, and 3 use fixed deterministic questions
    if (config.variantId === "practice-1") {
      questions = FIXED_PRACTICE_TEST_1_QUESTIONS;
    } else if (config.variantId === "practice-2") {
      questions = FIXED_PRACTICE_TEST_2_QUESTIONS;
    } else if (config.variantId === "practice-3") {
      questions = FIXED_PRACTICE_TEST_3_QUESTIONS;
    } else if (config.variantId === "full-mock-test" || config.variantId === "full-challenge" || config.variantId === "full-bubble-mock-test") {
      // Full Mock Test, Full Challenge, and Full Bubble Mock Test share the authoritative 28-question progressive generation logic
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
