import { BubbleMathQuestion } from "./types";

/**
 * Validates the selected bubble IDs against the correct order.
 */
export function validateSelectionOrder(question: BubbleMathQuestion, selectedIds: string[]): boolean {
  if (selectedIds.length !== question.correctOrderIds.length) {
    return false;
  }
  
  for (let i = 0; i < question.correctOrderIds.length; i++) {
    if (selectedIds[i] !== question.correctOrderIds[i]) {
      return false;
    }
  }
  
  return true;
}
