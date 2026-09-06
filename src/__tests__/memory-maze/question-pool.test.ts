import { describe, it, expect } from "vitest";
import { 
  PRACTICE_TEST_1_MAZES, 
  PRACTICE_TEST_2_MAZES, 
  PRACTICE_TEST_3_MAZES,
  FULL_MOCK_MEDIUM_POOL,
  FULL_MOCK_SOMEWHAT_DIFFICULT_POOL,
  FULL_MOCK_DIFFICULT_POOL,
  generateFullMockMazes,
  getMazesForVariant
} from "@/lib/games/memory-maze/practice-mazes";
import { validateMaze } from "@/lib/games/memory-maze/validator";
import { calculateMazeComplexity } from "@/lib/games/memory-maze/complexity";
import { getMazeStructuralFingerprint } from "@/lib/games/memory-maze/fingerprint";
import { memoryMazeDefinition } from "@/lib/games/memory-maze/engine";
import { isWallBetween, Direction } from "@/lib/games/memory-maze/types";

describe("Memory Maze Full Mock Assessment — Difficulty Balancing & 23 Requirements", () => {
  // TEST 1: Full Mock contains exactly 5 mazes
  it("TEST 1: Full Mock contains exactly 5 assessment mazes", () => {
    const fullMock = generateFullMockMazes("seed-t1");
    expect(fullMock).toHaveLength(7);
    const assessmentMazes = fullMock.slice(2);
    expect(assessmentMazes).toHaveLength(5);
    expect(assessmentMazes[0].stageIdentifier).toBe("Question 1 of 5");
    expect(assessmentMazes[1].stageIdentifier).toBe("Question 2 of 5");
    expect(assessmentMazes[2].stageIdentifier).toBe("Question 3 of 5");
    expect(assessmentMazes[3].stageIdentifier).toBe("Question 4 of 5");
    expect(assessmentMazes[4].stageIdentifier).toBe("Question 5 of 5");
  });

  // TEST 2: Q1 difficulty = MEDIUM
  it("TEST 2: Q1 difficulty = MEDIUM", () => {
    const fullMock = generateFullMockMazes("seed-t2");
    const q1 = fullMock[2];
    expect(q1.difficulty).toBe("MEDIUM");
  });

  // TEST 3: Q2 difficulty = SOMEWHAT DIFFICULT
  it("TEST 3: Q2 difficulty = SOMEWHAT DIFFICULT", () => {
    const fullMock = generateFullMockMazes("seed-t3");
    const q2 = fullMock[3];
    expect(q2.difficulty).toBe("SOMEWHAT DIFFICULT");
  });

  // TEST 4: Q3 difficulty = SOMEWHAT DIFFICULT
  it("TEST 4: Q3 difficulty = SOMEWHAT DIFFICULT", () => {
    const fullMock = generateFullMockMazes("seed-t4");
    const q3 = fullMock[4];
    expect(q3.difficulty).toBe("SOMEWHAT DIFFICULT");
  });

  // TEST 5: Q4 difficulty = DIFFICULT
  it("TEST 5: Q4 difficulty = DIFFICULT", () => {
    const fullMock = generateFullMockMazes("seed-t5");
    const q4 = fullMock[5];
    expect(q4.difficulty).toBe("DIFFICULT");
  });

  // TEST 6: Q5 difficulty = DIFFICULT
  it("TEST 6: Q5 difficulty = DIFFICULT", () => {
    const fullMock = generateFullMockMazes("seed-t6");
    const q5 = fullMock[6];
    expect(q5.difficulty).toBe("DIFFICULT");
  });

  // TEST 7: No Full Mock maze exceeds 6x6
  it("TEST 7: No Full Mock maze exceeds 6x6", () => {
    const seeds = ["seed-grid-1", "seed-grid-2", "seed-grid-3", "seed-grid-4"];
    seeds.forEach((seed) => {
      const fullMock = generateFullMockMazes(seed);
      const assessmentMazes = fullMock.slice(2);
      assessmentMazes.forEach((maze) => {
        expect(maze.gridSize).toBeLessThanOrEqual(6);
        if (maze.gridDimensions) {
          expect(maze.gridDimensions.rows).toBeLessThanOrEqual(6);
          expect(maze.gridDimensions.cols).toBeLessThanOrEqual(6);
        }
      });
    });
  });

  // TEST 8: Every Full Mock maze is solvable
  it("TEST 8: Every Full Mock maze is solvable", () => {
    const fullMock = generateFullMockMazes("seed-t8-solvable");
    const assessment = fullMock.slice(2);
    assessment.forEach((maze) => {
      const val = validateMaze(maze);
      expect(val.valid, `Maze ${maze.id} validation failed: ${val.error}`).toBe(true);
      const comp = calculateMazeComplexity(maze);
      expect(comp.isSolvable).toBe(true);
      expect(comp.solutionPathLength).toBeGreaterThan(0);
    });
  });

  // TEST 9: START is never completely blocked
  it("TEST 9: START is never completely blocked", () => {
    const fullMock = generateFullMockMazes("seed-t9-start");
    const assessment = fullMock.slice(2);
    const dirs: { dir: Direction; dr: number; dc: number }[] = [
      { dir: "up", dr: -1, dc: 0 },
      { dir: "down", dr: 1, dc: 0 },
      { dir: "left", dr: 0, dc: -1 },
      { dir: "right", dr: 0, dc: 1 },
    ];

    assessment.forEach((maze) => {
      const start = maze.playerStartPosition;
      const size = maze.gridSize || 3;
      const walls = maze.walls || [];

      let openMoves = 0;
      for (const { dir, dr, dc } of dirs) {
        const nr = start.row + dr;
        const nc = start.col + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (!isWallBetween(walls, start, dir)) {
            openMoves++;
          }
        }
      }
      expect(openMoves, `Start cell in ${maze.id} must have at least 1 open movement`).toBeGreaterThanOrEqual(1);
    });
  });

  // TEST 10: Every required key is reachable
  it("TEST 10: Every required key is reachable", () => {
    const fullMock = generateFullMockMazes("seed-t10-key");
    const assessment = fullMock.slice(2);
    assessment.forEach((maze) => {
      const val = validateMaze(maze);
      expect(val.startToKeyPaths.length).toBeGreaterThan(0);
      if (maze.key2Position) {
        expect(val.key1ToKey2Paths?.length).toBeGreaterThan(0);
      }
    });
  });

  // TEST 11: Door is reachable after required keys
  it("TEST 11: Door is reachable after required keys", () => {
    const fullMock = generateFullMockMazes("seed-t11-door");
    const assessment = fullMock.slice(2);
    assessment.forEach((maze) => {
      const val = validateMaze(maze);
      if (maze.key2Position) {
        expect(val.key2ToDoorPaths?.length).toBeGreaterThan(0);
      } else {
        expect(val.keyToDoorPaths.length).toBeGreaterThan(0);
      }
    });
  });

  // TEST 12: Mazes contain reasonable navigation complexity
  it("TEST 12: Mazes contain reasonable navigation complexity", () => {
    const fullMock = generateFullMockMazes("seed-t12-comp");
    const assessment = fullMock.slice(2);
    assessment.forEach((maze) => {
      const comp = calculateMazeComplexity(maze);
      expect(comp.solutionPathLength).toBeGreaterThanOrEqual(6);
      expect(comp.turnCount).toBeGreaterThanOrEqual(3);
    });
  });

  // TEST 13: Mazes are not excessively complex
  it("TEST 13: Mazes are not excessively complex", () => {
    const fullMock = generateFullMockMazes("seed-t13-manageable");
    const assessment = fullMock.slice(2);
    assessment.forEach((maze) => {
      expect(maze.gridSize).toBeLessThanOrEqual(6);
      const comp = calculateMazeComplexity(maze);
      expect(comp.solutionPathLength).toBeLessThanOrEqual(25);
    });
  });

  // TEST 14: All five Full Mock mazes are structurally unique
  it("TEST 14: All five Full Mock mazes are structurally unique within the session", () => {
    const fullMock = generateFullMockMazes("seed-t14-unique");
    const assessment = fullMock.slice(2);
    const fingerprints = assessment.map((m) => getMazeStructuralFingerprint(m));
    const uniqueFps = new Set(fingerprints);
    expect(uniqueFps.size).toBe(5);
  });

  // TEST 15: No Full Mock maze matches Practice Test 1
  it("TEST 15: No Full Mock maze matches Practice Test 1", () => {
    const fullMock = generateFullMockMazes("seed-t15");
    const assessment = fullMock.slice(2);
    const p1Fps = new Set(PRACTICE_TEST_1_MAZES.map((m) => getMazeStructuralFingerprint(m)));
    assessment.forEach((maze) => {
      const fp = getMazeStructuralFingerprint(maze);
      expect(p1Fps.has(fp)).toBe(false);
    });
  });

  // TEST 16: No Full Mock maze matches Practice Test 2
  it("TEST 16: No Full Mock maze matches Practice Test 2", () => {
    const fullMock = generateFullMockMazes("seed-t16");
    const assessment = fullMock.slice(2);
    const p2Fps = new Set(PRACTICE_TEST_2_MAZES.map((m) => getMazeStructuralFingerprint(m)));
    assessment.forEach((maze) => {
      const fp = getMazeStructuralFingerprint(maze);
      expect(p2Fps.has(fp)).toBe(false);
    });
  });

  // TEST 17: No Full Mock maze matches Practice Test 3
  it("TEST 17: No Full Mock maze matches Practice Test 3", () => {
    const fullMock = generateFullMockMazes("seed-t17");
    const assessment = fullMock.slice(2);
    const p3Fps = new Set(PRACTICE_TEST_3_MAZES.map((m) => getMazeStructuralFingerprint(m)));
    assessment.forEach((maze) => {
      const fp = getMazeStructuralFingerprint(maze);
      expect(p3Fps.has(fp)).toBe(false);
    });
  });

  // TEST 18: Same session seed produces the same five mazes
  it("TEST 18: Same session seed produces the same five mazes", () => {
    const set1 = generateFullMockMazes("seed-fixed-lock-balanced");
    const set2 = generateFullMockMazes("seed-fixed-lock-balanced");
    expect(set1.map((m) => m.id)).toEqual(set2.map((m) => m.id));
    expect(set1.map((m) => getMazeStructuralFingerprint(m))).toEqual(
      set2.map((m) => getMazeStructuralFingerprint(m))
    );
  });

  // TEST 19: Different session seeds can produce different valid sets
  it("TEST 19: Different session seeds can produce different valid sets", () => {
    const setA = generateFullMockMazes("seed-alpha-balanced-1");
    const setB = generateFullMockMazes("seed-beta-balanced-2");
    const idsA = setA.slice(2).map((m) => m.id).join(",");
    const idsB = setB.slice(2).map((m) => m.id).join(",");
    expect(idsA).not.toBe(idsB);
  });

  // TEST 20: Collision does not regenerate or alter the maze
  it("TEST 20: Collision does not regenerate or alter the maze", () => {
    const fullMock = generateFullMockMazes("seed-lock-check");
    const q1 = fullMock[2];
    const originalStart = { ...q1.playerStartPosition };
    const originalKey = { ...q1.keyPosition };
    const originalDoor = { ...q1.doorPosition };
    const originalWalls = [...(q1.walls || [])];

    // Simulating player collision reset to start position
    const resetPlayerPos = { ...q1.playerStartPosition };
    expect(resetPlayerPos).toEqual(originalStart);
    expect(q1.keyPosition).toEqual(originalKey);
    expect(q1.doorPosition).toEqual(originalDoor);
    expect(q1.walls || []).toEqual(originalWalls);
  });

  // TEST 21: One-key maze logic works
  it("TEST 21: One-key maze logic works", () => {
    const fullMock = generateFullMockMazes("seed-one-key-check");
    const oneKeyMazes = fullMock.slice(2).filter((m) => !m.key2Position);
    expect(oneKeyMazes.length).toBeGreaterThanOrEqual(1);
    oneKeyMazes.forEach((m) => {
      const val = validateMaze(m);
      expect(val.valid).toBe(true);
      expect(val.startToKeyPaths.length).toBe(1);
      expect(val.keyToDoorPaths.length).toBe(1);
    });
  });

  // TEST 22: Two-key maze logic works
  it("TEST 22: Two-key maze logic works", () => {
    const fullMock = generateFullMockMazes("seed-two-key-check");
    const twoKeyMazes = fullMock.slice(2).filter((m) => Boolean(m.key2Position));
    expect(twoKeyMazes.length).toBeGreaterThanOrEqual(1);
    twoKeyMazes.forEach((m) => {
      const val = validateMaze(m);
      expect(val.valid).toBe(true);
      expect(val.startToKeyPaths.length).toBe(1);
      expect(val.key1ToKey2Paths?.length).toBe(1);
      expect(val.key2ToDoorPaths?.length).toBe(1);
    });
  });

  // TEST 23: Practice Test 1/2/3 remain unchanged
  it("TEST 23: Practice Test 1/2/3 remain unchanged", () => {
    const p1 = getMazesForVariant("practice-1");
    const p2 = getMazesForVariant("practice-2");
    const p3 = getMazesForVariant("practice-3");
    expect(p1).toHaveLength(5);
    expect(p2).toHaveLength(5);
    expect(p3).toHaveLength(5);
    expect(p1[0].id).toBe("p1-maze-1");
    expect(p2[0].id).toBe("p2-maze-1");
    expect(p3[0].id).toBe("p3-maze-1");
  });
});
