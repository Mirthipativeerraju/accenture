import { describe, it, expect } from "vitest";
import {
  rotateDirection,
  validateRoute,
  getNextCoordinates,
  getEffectiveCellAtGlobal,
  getRotatedCellSource,
  getRotatedCell,
  DIRECTION_VECTORS,
  OPPOSITE_DIRECTIONS,
  DIRECTION_ANGLES,
} from "@/lib/games/path-finder/validator";
import { generatePathFinderQuestion } from "@/lib/games/path-finder/generator";
import { SeededRNG } from "@/lib/games/core/rng";
import { ArrowDirection, GridBlock } from "@/lib/games/path-finder/types";

describe("Path Finder — Comprehensive Validator & Engine Test Suite", () => {
  // A & B. Rotation Cycles & All 8 Directions
  describe("A & B. Rotation Cycles & 8 Directions", () => {
    const directions: ArrowDirection[] = [
      "UP",
      "UP_RIGHT",
      "RIGHT",
      "DOWN_RIGHT",
      "DOWN",
      "DOWN_LEFT",
      "LEFT",
      "UP_LEFT",
    ];

    it("handles 0°, 90°, 180°, 270°, and 360° returning to 0° for all directions", () => {
      directions.forEach((dir) => {
        expect(rotateDirection(dir, 0)).toBe(dir);
        expect(rotateDirection(dir, 360)).toBe(dir);
        expect(rotateDirection(dir, 720)).toBe(dir);

        // 4 rotations of 90° returns to original
        let cur = dir;
        for (let i = 0; i < 4; i++) {
          cur = rotateDirection(cur, 90);
        }
        expect(cur).toBe(dir);
      });
    });

    it("verifies 90° clockwise rotations for cardinal directions", () => {
      expect(rotateDirection("UP", 90)).toBe("RIGHT");
      expect(rotateDirection("RIGHT", 90)).toBe("DOWN");
      expect(rotateDirection("DOWN", 90)).toBe("LEFT");
      expect(rotateDirection("LEFT", 90)).toBe("UP");
    });

    it("verifies 90° clockwise rotations for diagonal directions", () => {
      expect(rotateDirection("UP_RIGHT", 90)).toBe("DOWN_RIGHT");
      expect(rotateDirection("DOWN_RIGHT", 90)).toBe("DOWN_LEFT");
      expect(rotateDirection("DOWN_LEFT", 90)).toBe("UP_LEFT");
      expect(rotateDirection("UP_LEFT", 90)).toBe("UP_RIGHT");
    });

    it("verifies 180° rotations match opposite directions", () => {
      directions.forEach((dir) => {
        expect(rotateDirection(dir, 180)).toBe(OPPOSITE_DIRECTIONS[dir]);
      });
    });

    it("maps all 8 directions to precise degrees in DIRECTION_ANGLES", () => {
      expect(DIRECTION_ANGLES["RIGHT"]).toBe(0);
      expect(DIRECTION_ANGLES["DOWN_RIGHT"]).toBe(45);
      expect(DIRECTION_ANGLES["DOWN"]).toBe(90);
      expect(DIRECTION_ANGLES["DOWN_LEFT"]).toBe(135);
      expect(DIRECTION_ANGLES["LEFT"]).toBe(180);
      expect(DIRECTION_ANGLES["UP_LEFT"]).toBe(225);
      expect(DIRECTION_ANGLES["UP"]).toBe(270);
      expect(DIRECTION_ANGLES["UP_RIGHT"]).toBe(315);
    });
  });

  // C & D. Coordinate Transforms and Movement
  describe("C & D. Coordinate Transforms and Vector Movement", () => {
    it("transforms local coordinates accurately for all rotation angles in an N=3 block", () => {
      const N = 3;
      // Center cell (1, 1) remains at center
      expect(getRotatedCellSource(1, 1, N, 0)).toEqual({ sr: 1, sc: 1 });
      expect(getRotatedCellSource(1, 1, N, 90)).toEqual({ sr: 1, sc: 1 });
      expect(getRotatedCellSource(1, 1, N, 180)).toEqual({ sr: 1, sc: 1 });
      expect(getRotatedCellSource(1, 1, N, 270)).toEqual({ sr: 1, sc: 1 });

      // Top-Left (0, 0)
      expect(getRotatedCellSource(0, 0, N, 0)).toEqual({ sr: 0, sc: 0 });
      expect(getRotatedCellSource(0, 0, N, 90)).toEqual({ sr: 2, sc: 0 });
      expect(getRotatedCellSource(0, 0, N, 180)).toEqual({ sr: 2, sc: 2 });
      expect(getRotatedCellSource(0, 0, N, 270)).toEqual({ sr: 0, sc: 2 });
    });

    it("calculates next coordinates correctly for all direction vectors", () => {
      expect(getNextCoordinates(5, 5, "UP")).toEqual({ r: 4, c: 5 });
      expect(getNextCoordinates(5, 5, "DOWN")).toEqual({ r: 6, c: 5 });
      expect(getNextCoordinates(5, 5, "LEFT")).toEqual({ r: 5, c: 4 });
      expect(getNextCoordinates(5, 5, "RIGHT")).toEqual({ r: 5, c: 6 });
      expect(getNextCoordinates(5, 5, "UP_RIGHT")).toEqual({ r: 4, c: 6 });
      expect(getNextCoordinates(5, 5, "DOWN_RIGHT")).toEqual({ r: 6, c: 6 });
      expect(getNextCoordinates(5, 5, "DOWN_LEFT")).toEqual({ r: 6, c: 4 });
      expect(getNextCoordinates(5, 5, "UP_LEFT")).toEqual({ r: 4, c: 4 });
    });

    it("unwraps angles correctly to take the shortest turn without 270° backflips", () => {
      const unwrapAngle = (current: number, target: number): number => {
        const delta = ((target - current + 540) % 360) - 180;
        return current + delta;
      };

      // 1. LEFT (180°) -> UP (-90° / 270°) must turn +90° to 270°, NOT -270° spin
      expect(unwrapAngle(180, -90)).toBe(270);
      expect(unwrapAngle(180, 270)).toBe(270);

      // 2. UP (270°) -> RIGHT (0° / 360°) must turn +90° to 360°
      expect(unwrapAngle(270, 0)).toBe(360);

      // 3. RIGHT (0°) -> DOWN (90°) must turn +90° to 90°
      expect(unwrapAngle(0, 90)).toBe(90);

      // 4. LEFT (180°) -> DOWN (90°) must turn -90° to 90°
      expect(unwrapAngle(180, 90)).toBe(90);
    });
  });

  // E, F, G, H, I. Edge Cases and Traversal Rules
  describe("E through I. Boundary, Dead End, Cycle, and Traversal Rules", () => {
    it("detects and rejects infinite loops/cycles", () => {
      const rng = new SeededRNG("cycle-test-seed");
      const question = generatePathFinderQuestion(rng, 0, 3, 3);

      // Create a block with a 2-cell reciprocal loop: cell (0,0) -> RIGHT, cell (0,1) -> LEFT
      const cyclicBlocks: GridBlock[][] = Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => ({
          size: 3,
          blockRow: r,
          blockCol: c,
          rotation: 0,
          cells: [
            [
              { r: 0, c: 0, active: true, direction: "RIGHT" as const },
              { r: 0, c: 1, active: true, direction: "LEFT" as const },
              { r: 0, c: 2, active: false },
            ],
            [
              { r: 1, c: 0, active: false },
              { r: 1, c: 1, active: false },
              { r: 1, c: 2, active: false },
            ],
            [
              { r: 2, c: 0, active: false },
              { r: 2, c: 1, active: false },
              { r: 2, c: 2, active: false },
            ],
          ],
        }))
      );

      const cyclicQuestion = {
        ...question,
        blocks: cyclicBlocks,
        start: { side: "LEFT" as const, index: 0, type: "START" as const },
        destination: { side: "RIGHT" as const, index: 2, type: "DESTINATION" as const },
      };

      const result = validateRoute(cyclicQuestion, [[0, 0, 0], [0, 0, 0], [0, 0, 0]], "FORWARD");
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain("infinite loop or cycle");
    });

    it("rejects out-of-bounds transitions that do not exit at destination", () => {
      const rng = new SeededRNG("oob-test-seed");
      const question = generatePathFinderQuestion(rng, 1, 3, 3);

      // Block where start cell points UP off the top of the board
      const oobBlocks: GridBlock[][] = Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => ({
          size: 3,
          blockRow: r,
          blockCol: c,
          rotation: 0,
          cells: [
            [
              { r: 0, c: 0, active: true, direction: "UP" as const },
              { r: 0, c: 1, active: false },
              { r: 0, c: 2, active: false },
            ],
            [
              { r: 1, c: 0, active: false },
              { r: 1, c: 1, active: false },
              { r: 1, c: 2, active: false },
            ],
            [
              { r: 2, c: 0, active: false },
              { r: 2, c: 1, active: false },
              { r: 2, c: 2, active: false },
            ],
          ],
        }))
      );

      const oobQuestion = {
        ...question,
        blocks: oobBlocks,
        start: { side: "LEFT" as const, index: 0, type: "START" as const },
        destination: { side: "RIGHT" as const, index: 8, type: "DESTINATION" as const },
      };

      const result = validateRoute(oobQuestion, [[0, 0, 0], [0, 0, 0], [0, 0, 0]], "FORWARD");
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain("exited out of bounds");
    });
  });

  // J, K, L, M, N. Forward & Reverse Traversal and Solvability
  describe("J through N. Forward, Reverse, and Rotation Validation", () => {
    it("validates solvable puzzles in FORWARD mode with exact ordered visited cells", () => {
      const rng = new SeededRNG("solvable-forward-seed");
      const question = generatePathFinderQuestion(rng, 5, 3, 3);

      const result = validateRoute(question, question.solutionRotations, "FORWARD");
      expect(result.isValid).toBe(true);
      expect(result.visitedCells.length).toBeGreaterThanOrEqual(4);

      // First cell is start cell
      expect(result.visitedCells[0].c).toBe(0);
      // Last cell is destination cell
      expect(result.visitedCells[result.visitedCells.length - 1].c).toBe(question.totalGridSize - 1);
    });

    it("validates solvable puzzles in REVERSE mode with reversed ordered visited cells", () => {
      const rng = new SeededRNG("solvable-reverse-seed");
      const question = generatePathFinderQuestion(rng, 6, 3, 3);

      const forwardResult = validateRoute(question, question.solutionRotations, "FORWARD");
      const reverseResult = validateRoute(question, question.solutionRotations, "REVERSE");

      expect(forwardResult.isValid).toBe(true);
      expect(reverseResult.isValid).toBe(true);
      expect(reverseResult.visitedCells).toEqual([...forwardResult.visitedCells].reverse());
    });

    it("fails on scrambled initial rotations and succeeds only when rotated to solution", () => {
      const rng = new SeededRNG("rotation-check-seed");
      const question = generatePathFinderQuestion(rng, 7, 3, 3);

      // Initial scrambled rotations should fail
      const initialResult = validateRoute(question, question.initialRotations, "FORWARD");
      expect(initialResult.isValid).toBe(false);

      // Solution rotations must succeed
      const solutionResult = validateRoute(question, question.solutionRotations, "FORWARD");
      expect(solutionResult.isValid).toBe(true);
    });

    it("guarantees 100% solvability across 25 randomly seeded generated questions", () => {
      for (let i = 0; i < 25; i++) {
        const rng = new SeededRNG(`solvability-batch-${i}`);
        const question = generatePathFinderQuestion(rng, i, 3, 3);
        const result = validateRoute(question, question.solutionRotations, "FORWARD");
        expect(result.isValid).toBe(true);
        expect(result.visitedCells.length).toBeGreaterThan(0);
      }
    });
  });
});
