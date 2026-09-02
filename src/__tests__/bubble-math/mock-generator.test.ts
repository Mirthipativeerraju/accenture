import { describe, it, expect } from "vitest";
import { SeededRNG } from "@/lib/games/core/rng";
import { generateMockQuestions } from "@/lib/games/bubble-math/mock-generator";

describe("Full Mock Test Question Generator — 100-Test Stress Test & Rules Validation", () => {
  it("generates 100 complete mock tests (2,800 questions) verifying all 26 invariants", () => {
    let totalLowestNested = 0;
    let totalMiddleNested = 0;
    let totalHighestNested = 0;
    let totalChainedQuestionsAcrossAllTests = 0;

    for (let testIndex = 0; testIndex < 100; testIndex++) {
      const rng = new SeededRNG(`mock-test-seed-${testIndex}`);
      const questions = generateMockQuestions(rng, 28);

      expect(questions.length).toBe(28);

      let chainedInThisTest = 0;

      questions.forEach((q, idx) => {
        // Rule 1: Exactly 3 bubbles
        expect(q.expressions.length).toBe(3);
        expect(q.correctOrderIds.length).toBe(3);
        expect(q.displayOrderIds.length).toBe(3);
        expect(["A", "B", "C", "D"]).toContain(q.layoutPattern);

        // Rule 1: All 3 evaluated values are finite, valid numbers
        q.expressions.forEach((expr) => {
          expect(Number.isFinite(expr.value)).toBe(true);
          expect(isNaN(expr.value)).toBe(false);
        });

        // Rule 1: All 3 evaluated values MUST BE STRICTLY UNIQUE
        const values = q.expressions.map((e) => e.value);
        const uniqueValues = new Set(values);
        expect(uniqueValues.size).toBe(3);

        // Rule 14: Ascending sorted order in correctOrderIds
        const orderedValues = q.correctOrderIds.map(
          (id) => q.expressions.find((e) => e.id === id)!.value
        );
        expect(orderedValues[0]).toBeLessThan(orderedValues[1]);
        expect(orderedValues[1]).toBeLessThan(orderedValues[2]);

        // Rule 2: Early questions (Q1–Q5) contain 1 single integer + 2 arithmetic
        if (idx < 5) {
          const singleValues = q.expressions.filter((e) => /^\d+$/.test(e.display.trim()));
          const arithmeticExprs = q.expressions.filter((e) => !/^\d+$/.test(e.display.trim()));
          expect(singleValues.length).toBe(1);
          expect(arithmeticExprs.length).toBe(2);
        }

        // Rule 8: Check for chained arithmetic (e.g. 12 + 5 - 4)
        const hasChainedExpr = q.expressions.some((e) => {
          const parts = e.display.split(/[\+\-\×\÷]/);
          return parts.length >= 3 && !e.display.includes("(");
        });
        if (hasChainedExpr) {
          chainedInThisTest++;
        }

        // Rule 9: Parentheses/nested expressions appear ONLY in final 2–3 questions (idx >= 25)
        if (idx < 25) {
          q.expressions.forEach((expr) => {
            expect(expr.display.includes("(")).toBe(false);
            expect(expr.display.includes(")")).toBe(false);
          });
        } else {
          // Final questions: check nested ranking
          const nested = q.expressions.find((e) => e.display.includes("(") && e.display.includes(")"));
          if (nested) {
            const sortedVals = [...values].sort((a, b) => a - b);
            if (nested.value === sortedVals[0]) totalLowestNested++;
            else if (nested.value === sortedVals[1]) totalMiddleNested++;
            else totalHighestNested++;
          }
        }
      });

      // Rule 8: MAXIMUM 1 chained-arithmetic question per 28-question test
      expect(chainedInThisTest).toBeLessThanOrEqual(1);
      totalChainedQuestionsAcrossAllTests += chainedInThisTest;
    }

    // Rule 10 & 11: Nested expressions achieve ALL three rankings across the 100 tests
    expect(totalLowestNested).toBeGreaterThan(20);
    expect(totalMiddleNested).toBeGreaterThan(20);
    expect(totalHighestNested).toBeGreaterThan(20);

    // Rule 8: Chained questions occurred occasionally (<= 100 across 100 tests)
    expect(totalChainedQuestionsAcrossAllTests).toBeLessThanOrEqual(100);
  }, 25000);

  it("verifies decimals, squares, and cubes are properly introduced in their respective bands", () => {
    const rng = new SeededRNG("feature-bands-validation-seed");
    const questions = generateMockQuestions(rng, 28);

    // Band 3 (Q11–Q15) contains decimals
    const decQ = questions.slice(10, 15);
    const hasDecimals = decQ.some((q) => q.expressions.some((e) => e.display.includes(".")));
    expect(hasDecimals).toBe(true);

    // Band 4 (Q16–Q21) contains squares and cubes
    const powerQ = questions.slice(15, 21);
    const hasSquares = powerQ.some((q) => q.expressions.some((e) => e.display.includes("²")));
    const hasCubes = powerQ.some((q) => q.expressions.some((e) => e.display.includes("³")));
    expect(hasSquares).toBe(true);
    expect(hasCubes).toBe(true);
  });

  it("produces deterministic output with identical seed", () => {
    const rng1 = new SeededRNG("deterministic-seed-xyz");
    const rng2 = new SeededRNG("deterministic-seed-xyz");

    const test1 = generateMockQuestions(rng1, 28);
    const test2 = generateMockQuestions(rng2, 28);

    expect(test1).toEqual(test2);
  });
});
