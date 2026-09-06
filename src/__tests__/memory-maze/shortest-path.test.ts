import { describe, it, expect } from "vitest";
import {
  findShortestPathBFS,
  findAllSimplePaths,
  calculateMinimumSteps,
  calculateStepMetrics,
} from "@/lib/games/memory-maze/shortest-path";
import {
  PRACTICE_TEST_1_MAZES,
  PRACTICE_TEST_2_MAZES,
  PRACTICE_TEST_3_MAZES,
  FULL_MOCK_MEDIUM_POOL,
  generateFullMockMazes,
} from "@/lib/games/memory-maze/practice-mazes";
import { MemoryMazeQuestion, Position, Direction, isWallBetween } from "@/lib/games/memory-maze/types";
import { getMazeStructuralFingerprint } from "@/lib/games/memory-maze/fingerprint";

/**
 * Simulates player interaction with a maze according to MemoryMazeGame mechanics:
 * - steps starts at 0
 * - successful movement: steps += 1
 * - blocked boundary or wall move: steps does NOT change
 * - wall collision: resets steps = 0, player returns to start
 */
class MazePlayerSession {
  public playerPosition: Position;
  public steps: number = 0;
  public visitedCells: Position[] = [];
  public key1Collected: boolean = false;
  public key2Collected: boolean = false;
  public status: "playing" | "success" = "playing";
  public finalSteps: number | null = null;
  public readonly minimumSteps: number;

  constructor(public readonly maze: MemoryMazeQuestion) {
    this.playerPosition = { ...maze.playerStartPosition };
    this.visitedCells = [{ ...maze.playerStartPosition }];
    const minRes = calculateMinimumSteps(maze);
    this.minimumSteps = minRes.minimumSteps;
  }

  public attemptMove(dir: Direction): { moved: boolean; collided: boolean; completed: boolean } {
    let nextRow = this.playerPosition.row;
    let nextCol = this.playerPosition.col;

    if (dir === "up") nextRow -= 1;
    else if (dir === "down") nextRow += 1;
    else if (dir === "left") nextCol -= 1;
    else if (dir === "right") nextCol += 1;

    const gSize = this.maze.gridSize || 3;
    // Boundary check
    if (nextRow < 0 || nextRow >= gSize || nextCol < 0 || nextCol >= gSize) {
      return { moved: false, collided: false, completed: false };
    }

    // Wall collision check
    if (isWallBetween(this.maze.walls, this.playerPosition, dir)) {
      // Collision reset: steps reset to 0, player position reset to start
      this.playerPosition = { ...this.maze.playerStartPosition };
      this.visitedCells = [{ ...this.maze.playerStartPosition }];
      this.key1Collected = false;
      this.key2Collected = false;
      this.steps = 0; // RESET TO 0!
      return { moved: false, collided: true, completed: false };
    }

    // Successful valid move
    const newPos: Position = { row: nextRow, col: nextCol };
    this.playerPosition = newPos;
    this.steps += 1;
    this.visitedCells.push(newPos);

    // Key collection check
    const k1Pos = this.maze.key1Position || this.maze.keyPosition;
    const k2Pos = this.maze.key2Position;
    if (k1Pos && newPos.row === k1Pos.row && newPos.col === k1Pos.col) {
      this.key1Collected = true;
    }
    if (k2Pos && newPos.row === k2Pos.row && newPos.col === k2Pos.col) {
      this.key2Collected = true;
    }

    const hasTwoKeys = Boolean(k2Pos);
    const allCollected = hasTwoKeys ? (this.key1Collected && this.key2Collected) : this.key1Collected;

    // Door check
    if (allCollected && newPos.row === this.maze.doorPosition.row && newPos.col === this.maze.doorPosition.col) {
      this.status = "success";
      this.finalSteps = this.steps;
      return { moved: true, collided: false, completed: true };
    }

    return { moved: true, collided: false, completed: false };
  }
}

describe("Memory Maze — Per-Attempt Step Counting & Minimum-Steps Requirements", () => {
  const sampleMaze: MemoryMazeQuestion = {
    id: "test-step-maze",
    stageIdentifier: "Question 1 of 5",
    gridSize: 3,
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 1, col: 1 },
    doorPosition: { row: 2, col: 2 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 1 }, direction: "right" }, // blocks (0,1) <-> (0,2)
      { from: { row: 0, col: 2 }, direction: "down" },  // blocks (0,2) <-> (1,2)
      { from: { row: 1, col: 0 }, direction: "right" }, // blocks (1,0) <-> (1,1)
      { from: { row: 2, col: 1 }, direction: "right" }, // blocks (2,1) <-> (2,2)
    ],
  };

  // TEST 1: Initial maze: steps === 0
  it("TEST 1: Initial maze starts with steps === 0", () => {
    const session = new MazePlayerSession(sampleMaze);
    expect(session.steps).toBe(0);
    expect(session.finalSteps).toBeNull();
  });

  // TEST 2: One successful movement: steps === 1
  it("TEST 2: One successful movement produces steps === 1", () => {
    const session = new MazePlayerSession(sampleMaze);
    const moveRes = session.attemptMove("right"); // (0,0) -> (0,1)
    expect(moveRes.moved).toBe(true);
    expect(session.steps).toBe(1);
  });

  // TEST 3: Three successful movements: steps === 3
  it("TEST 3: Three successful movements produce steps === 3", () => {
    const session = new MazePlayerSession(sampleMaze);
    session.attemptMove("down");  // (0,0) -> (1,0) [steps = 1]
    session.attemptMove("down");  // (1,0) -> (2,0) [steps = 2]
    session.attemptMove("right"); // (2,0) -> (2,1) [steps = 3]
    expect(session.steps).toBe(3);
  });

  // TEST 4: Blocked movement: steps does not change
  it("TEST 4: Blocked movement (wall or grid boundary) does not change steps", () => {
    const session = new MazePlayerSession(sampleMaze);
    // Boundary bump: (0,0) moving UP is out of bounds
    const boundaryMove = session.attemptMove("up");
    expect(boundaryMove.moved).toBe(false);
    expect(session.steps).toBe(0);

    // Make 1 valid move to (0,1)
    session.attemptMove("right");
    expect(session.steps).toBe(1);

    // Boundary bump: (0,1) moving UP is out of bounds
    session.attemptMove("up");
    expect(session.steps).toBe(1);
  });

  // TEST 5: Collision after 3 movements: steps becomes 0 after collision reset
  it("TEST 5: Collision after 3 movements resets steps to 0", () => {
    const session = new MazePlayerSession(sampleMaze);
    session.attemptMove("down");  // (0,0) -> (1,0) [steps = 1]
    session.attemptMove("down");  // (1,0) -> (2,0) [steps = 2]
    session.attemptMove("right"); // (2,0) -> (2,1) [steps = 3]
    expect(session.steps).toBe(3);

    // (2,1) moving RIGHT hits wall to (2,2)
    const collisionRes = session.attemptMove("right");
    expect(collisionRes.collided).toBe(true);
    expect(session.playerPosition).toEqual(sampleMaze.playerStartPosition);
    expect(session.steps).toBe(0); // MUST BE 0!
  });

  // TEST 6: MinimumSteps survives collision: minimumSteps remains unchanged
  it("TEST 6: minimumSteps is calculated from maze topology and survives collision unchanged", () => {
    const session = new MazePlayerSession(sampleMaze);
    expect(session.minimumSteps).toBe(4);

    session.attemptMove("down");
    session.attemptMove("down");
    session.attemptMove("right");
    session.attemptMove("right"); // Collision!

    expect(session.steps).toBe(0);
    expect(session.minimumSteps).toBe(4); // Remains 4
  });

  // TEST 7: Second attempt: after reset, six successful movements produce steps === 6, not 9
  it("TEST 7: Second attempt after collision produces steps === 6 (NOT 9)", () => {
    const session = new MazePlayerSession(sampleMaze);
    // Attempt 1: 3 steps -> collision
    session.attemptMove("down");
    session.attemptMove("down");
    session.attemptMove("right");
    expect(session.steps).toBe(3);
    session.attemptMove("right"); // Collision! steps -> 0
    expect(session.steps).toBe(0);

    // Attempt 2: Take alternative 6-step route to door
    // (0,0) -> (1,0) -> (2,0) -> (2,1) -> (1,1)[Key] -> (1,2) -> (2,2)[Door]
    session.attemptMove("down");  // steps = 1
    session.attemptMove("down");  // steps = 2
    session.attemptMove("right"); // steps = 3
    session.attemptMove("up");    // steps = 4 [Key collected at (1,1)]
    session.attemptMove("right"); // steps = 5
    const finalMove = session.attemptMove("down");  // steps = 6 [Door reached at (2,2)]

    expect(finalMove.completed).toBe(true);
    expect(session.status).toBe("success");
    expect(session.steps).toBe(6); // MUST BE 6, NOT 9!
    expect(session.finalSteps).toBe(6);
  });

  // TEST 8: Successful completion freezes finalSteps
  it("TEST 8: Successful completion freezes finalSteps", () => {
    const session = new MazePlayerSession(sampleMaze);
    // Take optimal 4-step path: (0,0) -> (0,1) -> (1,1)[Key] -> (1,2) -> (2,2)[Door]
    session.attemptMove("right");
    session.attemptMove("down");
    session.attemptMove("right");
    session.attemptMove("down");

    expect(session.status).toBe("success");
    expect(session.finalSteps).toBe(4);
  });

  // TEST 9: Optimal completion: Your Steps === Minimum Steps, Extra Steps === 0, Efficiency === 100%
  it("TEST 9: Optimal completion produces Extra Steps === 0 and Efficiency === 100%", () => {
    const metrics = calculateStepMetrics(4, 4);
    expect(metrics.actualSteps).toBe(4);
    expect(metrics.minimumSteps).toBe(4);
    expect(metrics.extraSteps).toBe(0);
    expect(metrics.efficiency).toBe(100);
  });

  // TEST 10: Non-optimal completion: Your Steps > Minimum Steps, Extra Steps is calculated correctly, Efficiency is calculated correctly
  it("TEST 10: Non-optimal completion calculates Extra Steps and Efficiency correctly", () => {
    // 6 actual steps vs 4 minimum steps
    const metrics1 = calculateStepMetrics(6, 4);
    expect(metrics1.actualSteps).toBe(6);
    expect(metrics1.minimumSteps).toBe(4);
    expect(metrics1.extraSteps).toBe(2);
    expect(metrics1.efficiency).toBe(66.67); // 4 / 6 = 66.67%

    // 8 actual steps vs 6 minimum steps
    const metrics2 = calculateStepMetrics(8, 6);
    expect(metrics2.actualSteps).toBe(8);
    expect(metrics2.minimumSteps).toBe(6);
    expect(metrics2.extraSteps).toBe(2);
    expect(metrics2.efficiency).toBe(75); // 6 / 8 = 75%
  });

  // TEST 11: Two-key maze: minimumSteps evaluates both valid key orders
  it("TEST 11: Two-key maze evaluates both valid key orders to find true minimum", () => {
    const twoKeyMaze: MemoryMazeQuestion = {
      id: "test-2key-order",
      stageIdentifier: "Assessment",
      gridSize: 5,
      playerStartPosition: { row: 0, col: 0 },
      keyPosition: { row: 0, col: 2 },
      key1Position: { row: 0, col: 2 },
      key2Position: { row: 4, col: 4 },
      doorPosition: { row: 4, col: 0 },
      timeLimitSeconds: 240,
      walls: [],
    };

    const res = calculateMinimumSteps(twoKeyMaze);
    expect(res.isSolvable).toBe(true);
    // Key 1 first = 12 steps vs Key 2 first = 20 steps
    expect(res.minimumSteps).toBe(12);
    expect(res.optimalKeyOrder).toEqual(["key1", "key2"]);
  });

  // TEST 12: At least one Full Mock maze is 3x3
  it("TEST 12: At least one Full Mock maze in the pool is 3x3", () => {
    const fullMock = generateFullMockMazes("seed-t12");
    const assessment = fullMock.slice(2);
    expect(assessment).toHaveLength(5);
    const has3x3 = FULL_MOCK_MEDIUM_POOL.some((m) => m.gridSize === 3);
    expect(has3x3).toBe(true);
  });

  // TEST 13: Every Full Mock maze is solvable
  it("TEST 13: Every Full Mock maze generated is solvable with finite minimum steps", () => {
    const seeds = ["seed-a", "seed-b", "seed-c", "seed-d"];
    seeds.forEach((seed) => {
      const fullMock = generateFullMockMazes(seed);
      const assessment = fullMock.slice(2);
      assessment.forEach((maze) => {
        expect(maze.gridSize).toBeLessThanOrEqual(6);
        const res = calculateMinimumSteps(maze);
        expect(res.isSolvable).toBe(true);
        expect(res.minimumSteps).toBeGreaterThan(0);
        expect(res.minimumSteps).toBeLessThan(Infinity);
      });
    });
  });

  // TEST 14: Every Full Mock maze has a shortest route and at least one longer alternative route where topology permits
  it("TEST 14: 3x3 Full Mock maze contains optimal shortest route (4 steps) and alternative route (6 steps)", () => {
    const twoRoute3x3 = FULL_MOCK_MEDIUM_POOL[0];
    const res = calculateMinimumSteps(twoRoute3x3);
    expect(res.isSolvable).toBe(true);
    expect(res.minimumSteps).toBe(4);
    expect(res.hasAlternativeRoute).toBe(true);
    expect(res.alternativeSteps).toBe(6);
  });

  // TEST 15: Full Mock does not reuse Practice Test 1/2/3 maze topology
  it("TEST 15: Full Mock does not reuse Practice Test 1, 2, or 3 maze structures", () => {
    const practiceMazes = [
      ...PRACTICE_TEST_1_MAZES,
      ...PRACTICE_TEST_2_MAZES,
      ...PRACTICE_TEST_3_MAZES,
    ];
    const practiceFingerprints = new Set(
      practiceMazes.map((m) => getMazeStructuralFingerprint(m))
    );

    const fullMock = generateFullMockMazes("seed-t15-exclusion");
    const assessment = fullMock.slice(2);
    assessment.forEach((maze) => {
      const fp = getMazeStructuralFingerprint(maze);
      expect(practiceFingerprints.has(fp)).toBe(false);
    });
  });
});
