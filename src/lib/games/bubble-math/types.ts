
export type MathOperator = "+" | "-" | "×" | "÷";

export interface MathExpression {
  id: string; // Unique identifier for the bubble
  display: string;
  value: number;
}

export interface BubbleMathQuestion {
  expressions: MathExpression[];
  correctOrderIds: string[]; // Ascending order of values
  displayOrderIds: string[]; // Randomized initial display
  layoutPattern?: "A" | "B" | "C" | "D";
}

export interface BubbleMathConfig {
  ordering: "ascending" | "descending";
  expressionCount: number;
}

export interface BubbleMathState {
  questions: BubbleMathQuestion[];
  currentSelections: string[]; // IDs of currently selected bubbles in order
}

export interface BubbleMathActionPayload {
  selectedOrderIds: string[];
  isTimeout: boolean;
}
