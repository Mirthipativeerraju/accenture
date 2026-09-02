import { MathOperator } from "./types";

/**
 * Safe evaluator for strictly controlled arithmetic operations.
 * Does NOT use eval() or new Function().
 */
export function evaluateSafe(a: number, operator: MathOperator, b: number): number {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      if (b === 0) throw new Error("Division by zero");
      return a / b;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}
