import { SeededRNG } from "../core/rng";
import { DifficultyLevel } from "../core/types";
import { MathExpression, MathOperator, BubbleMathQuestion } from "./types";
import { evaluateSafe } from "./evaluator";

const OPERATORS: MathOperator[] = ["+", "-", "×", "÷"];

function generateExpression(rng: SeededRNG, difficulty: DifficultyLevel, index: number): MathExpression {
  let operator: MathOperator;
  let a = 0;
  let b = 0;

  // Simplified bounds based on difficulty
  if (difficulty === "EASY") {
    operator = rng.randomChoice(["+", "-"]);
    a = rng.randomInt(1, 20);
    b = rng.randomInt(1, 20);
    
    // Ensure positive results for easy
    if (operator === "-" && a < b) {
      const temp = a;
      a = b;
      b = temp;
    }
  } else if (difficulty === "MEDIUM") {
    operator = rng.randomChoice(OPERATORS);
    if (operator === "+" || operator === "-") {
      a = rng.randomInt(10, 50);
      b = rng.randomInt(5, 30);
    } else if (operator === "×") {
      a = rng.randomInt(2, 12);
      b = rng.randomInt(2, 12);
    } else { // ÷
      b = rng.randomInt(2, 10);
      // Ensure clean division
      a = b * rng.randomInt(2, 12);
    }
  } else if (difficulty === "HARD") {
    operator = rng.randomChoice(OPERATORS);
    if (operator === "+" || operator === "-") {
      a = rng.randomInt(20, 100);
      b = rng.randomInt(15, 80);
    } else if (operator === "×") {
      a = rng.randomInt(5, 20);
      b = rng.randomInt(3, 15);
    } else {
      b = rng.randomInt(3, 15);
      a = b * rng.randomInt(3, 20);
    }
  } else { // VERY_HARD / VARIABLE
    operator = rng.randomChoice(OPERATORS);
    if (operator === "+" || operator === "-") {
      a = rng.randomInt(50, 200);
      b = rng.randomInt(25, 150);
    } else if (operator === "×") {
      a = rng.randomInt(8, 25);
      b = rng.randomInt(5, 20);
    } else {
      b = rng.randomInt(4, 25);
      a = b * rng.randomInt(4, 25);
    }
  }

  const display = `${a} ${operator} ${b}`;
  const value = evaluateSafe(a, operator, b);

  return {
    id: `expr-${index}`,
    display,
    value
  };
}

export function generateQuestion(rng: SeededRNG, difficulty: DifficultyLevel, expressionCount: number = 3): BubbleMathQuestion {
  const MAX_RETRIES = 100; // Stress-test limit
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const expressions: MathExpression[] = [];
    const values = new Set<number>();
    
    let valid = true;
    for (let i = 0; i < expressionCount; i++) {
      const expr = generateExpression(rng, difficulty, i);
      
      // Ensure distinct values to prevent ties (crucial requirement)
      if (values.has(expr.value)) {
        valid = false;
        break;
      }
      
      values.add(expr.value);
      expressions.push(expr);
    }

    if (valid && expressions.length === expressionCount) {
      // Create correctly ordered IDs (ascending)
      const sorted = [...expressions].sort((a, b) => a.value - b.value);
      const correctOrderIds = sorted.map(e => e.id);
      
      // Create randomized display IDs
      const displayOrderIds = rng.shuffle(expressions.map(e => e.id));

      // Assign layout pattern A, B, C, or D using deterministic RNG
      const layoutPattern = rng.randomChoice(["A", "B", "C", "D"] as const);

      return {
        expressions,
        correctOrderIds,
        displayOrderIds,
        layoutPattern
      };
    }
  }

  throw new Error(`Failed to generate a valid Bubble Math question after ${MAX_RETRIES} attempts.`);
}

export function generateQuestions(rng: SeededRNG, difficulty: DifficultyLevel, count: number, expressionCount: number = 3): BubbleMathQuestion[] {
  const questions: BubbleMathQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateQuestion(rng, difficulty, expressionCount));
  }
  return questions;
}
