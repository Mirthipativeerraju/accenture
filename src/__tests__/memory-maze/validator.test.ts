import { describe, it, expect } from "vitest";
import { validatePath, validateMemoryMazeAction } from "@/lib/games/memory-maze/validator";
import { MemoryMazeQuestion, MemoryMazeActionPayload } from "@/lib/games/memory-maze/types";

describe("Memory Maze Validator", () => {
  describe("validatePath", () => {
    it("returns true for a valid contiguous path without diagonals", () => {
      const path = [
        { r: 0, c: 0 },
        { r: 0, c: 1 },
        { r: 1, c: 1 },
        { r: 1, c: 2 }
      ];
      expect(validatePath(3, path)).toBe(true);
    });

    it("returns false for diagonal moves", () => {
      const path = [
        { r: 0, c: 0 },
        { r: 1, c: 1 }
      ];
      expect(validatePath(3, path)).toBe(false);
    });

    it("returns false for disconnected cells", () => {
      const path = [
        { r: 0, c: 0 },
        { r: 0, c: 1 },
        { r: 2, c: 2 }
      ];
      expect(validatePath(3, path)).toBe(false);
    });

    it("returns false for out of bounds cells", () => {
      const path = [
        { r: 2, c: 2 },
        { r: 2, c: 3 }
      ];
      expect(validatePath(3, path)).toBe(false);
    });
    
    it("returns false for duplicates", () => {
      const path = [
        { r: 0, c: 0 },
        { r: 0, c: 1 },
        { r: 0, c: 0 }
      ];
      expect(validatePath(3, path)).toBe(false);
    });
  });

  describe("validateMemoryMazeAction", () => {
    const question: MemoryMazeQuestion = {
      id: "q1",
      gridSize: 3,
      pathLength: 3,
      correctPath: [
        { r: 0, c: 0, id: "r0c0" },
        { r: 0, c: 1, id: "r0c1" },
        { r: 1, c: 1, id: "r1c1" }
      ]
    };

    it("returns true for exact match", () => {
      const payload: MemoryMazeActionPayload = {
        selectedPathIds: ["r0c0", "r0c1", "r1c1"],
        isTimeout: false
      };
      expect(validateMemoryMazeAction(question, payload)).toBe(true);
    });

    it("returns false for incorrect order", () => {
      const payload: MemoryMazeActionPayload = {
        selectedPathIds: ["r0c0", "r1c1", "r0c1"],
        isTimeout: false
      };
      expect(validateMemoryMazeAction(question, payload)).toBe(false);
    });

    it("returns false for incomplete path", () => {
      const payload: MemoryMazeActionPayload = {
        selectedPathIds: ["r0c0", "r0c1"],
        isTimeout: false
      };
      expect(validateMemoryMazeAction(question, payload)).toBe(false);
    });

    it("returns false on timeout", () => {
      const payload: MemoryMazeActionPayload = {
        selectedPathIds: ["r0c0", "r0c1", "r1c1"],
        isTimeout: true
      };
      expect(validateMemoryMazeAction(question, payload)).toBe(false);
    });
  });
});
