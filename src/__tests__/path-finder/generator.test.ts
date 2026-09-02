import { describe, it, expect } from "vitest";
import { SeededRNG } from "@/lib/games/core/rng";
import { generatePathFinderQuestion, generatePathFinderQuestions } from "@/lib/games/path-finder/generator";
import { validateRoute } from "@/lib/games/path-finder/validator";

describe("Path Finder — Generator Suite", () => {
  it("generates questions that always have a guaranteed valid solution", () => {
    const rng = new SeededRNG("generator-test-seed-100");
    const questions = generatePathFinderQuestions(rng, 10, 3, 3);

    expect(questions.length).toBe(10);

    questions.forEach((q, idx) => {
      expect(q.blockGridSize).toBe(3);
      expect(q.blockSize).toBe(3);
      expect(q.totalGridSize).toBe(9);

      // Verify solution rotations always solve the route
      const res = validateRoute(q, q.solutionRotations, "FORWARD");
      expect(res.isValid).toBe(true);
      expect(res.visitedCells.length).toBeGreaterThan(3);
    });
  });

  it("produces deterministic output for the same seed", () => {
    const rng1 = new SeededRNG("deterministic-pf-seed");
    const rng2 = new SeededRNG("deterministic-pf-seed");

    const q1 = generatePathFinderQuestion(rng1, 0, 3, 3);
    const q2 = generatePathFinderQuestion(rng2, 0, 3, 3);

    expect(q1).toEqual(q2);
  });
});
