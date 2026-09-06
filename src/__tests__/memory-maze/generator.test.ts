import { describe, it, expect } from "vitest";
import { SeededRNG } from "@/lib/games/core/rng";
import { generateMemoryMazeQuestions } from "@/lib/games/memory-maze/generator";
import { validatePath } from "@/lib/games/memory-maze/validator";

describe("Memory Maze Generator", () => {
  it("generates deterministic paths for a given seed", () => {
    const rng1 = new SeededRNG("test-seed-1");
    const rng2 = new SeededRNG("test-seed-1");
    
    const questions1 = generateMemoryMazeQuestions(rng1, 4, 5, 1);
    const questions2 = generateMemoryMazeQuestions(rng2, 4, 5, 1);
    
    expect(questions1[0].correctPath).toEqual(questions2[0].correctPath);
  });
  
  it("generates valid contiguous paths", () => {
    const rng = new SeededRNG("test-seed-2");
    const questions = generateMemoryMazeQuestions(rng, 5, 8, 10);
    
    questions.forEach(q => {
      expect(q.correctPath).toBeDefined();
      expect(q.correctPath!.length).toBe(8);
      expect(validatePath(5, q.correctPath!)).toBe(true);
    });
  });
  
  it("stress test: generates 1000 valid paths across various difficulties", () => {
    const rng = new SeededRNG("stress-test");
    const difficulties = [
      { size: 3, len: 4 },
      { size: 4, len: 6 },
      { size: 5, len: 8 },
      { size: 5, len: 12 }
    ];
    
    for (const diff of difficulties) {
      const questions = generateMemoryMazeQuestions(rng, diff.size, diff.len, 250);
      expect(questions.length).toBe(250);
      
      questions.forEach(q => {
        expect(q.correctPath).toBeDefined();
        expect(q.correctPath!.length).toBe(diff.len);
        expect(validatePath(diff.size, q.correctPath!)).toBe(true);
      });
    }
  });
});
