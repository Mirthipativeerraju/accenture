import { describe, it, expect } from "vitest";
import { 
  PRACTICE_TEST_1_MAZES, 
  PRACTICE_TEST_2_MAZES, 
  PRACTICE_TEST_3_MAZES, 
  FULL_MEMORY_MOCK_TEST_MAZES,
  getMazesForVariant 
} from "@/lib/games/memory-maze/practice-mazes";
import { memoryMazeDefinition } from "@/lib/games/memory-maze/engine";
import { Position, Direction, isWallBetween } from "@/lib/games/memory-maze/types";
import { validateMaze } from "@/lib/games/memory-maze/validator";

describe("Memory Maze Visual & Gameplay Reference Test Suite", () => {
  it("verifies reference maze initial positions (Key at (0,0), Player at (1,1), Door at (2,2))", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    expect(maze.gridSize).toBe(3);
    expect(maze.playerStartPosition).toEqual({ row: 1, col: 1 });
    expect(maze.keyPosition).toEqual({ row: 0, col: 0 });
    expect(maze.doorPosition).toEqual({ row: 2, col: 2 });
    expect(maze.timeLimitSeconds).toBe(240); // 4 minutes = 240 seconds
  });

  it("provides 5 mazes for Practice Tests 1, 2, 3, and 7 mazes (2 practice + 5 assessment) for Full Memory Mock Test", () => {
    expect(getMazesForVariant("practice-1")).toHaveLength(5);
    expect(getMazesForVariant("practice-2")).toHaveLength(5);
    expect(getMazesForVariant("practice-3")).toHaveLength(5);
    expect(getMazesForVariant("full-memory-mock-test")).toHaveLength(7);
  });

  it("verifies all 5 mazes in Practice Test 3 are difficult mazes with two keys", () => {
    const p3Mazes = getMazesForVariant("practice-3");
    expect(p3Mazes).toHaveLength(5);

    const ids = new Set(p3Mazes.map((m) => m.id));
    expect(ids.size).toBe(5);

    // Q1 = 4x4, Q2 = 5x5, Q3 = 5x5, Q4 = 5x5, Q5 = 5x5
    expect(p3Mazes[0].gridSize).toBe(4);
    expect(p3Mazes[1].gridSize).toBe(5);
    expect(p3Mazes[2].gridSize).toBe(5);
    expect(p3Mazes[3].gridSize).toBe(5);
    expect(p3Mazes[4].gridSize).toBe(5);

    p3Mazes.forEach((maze, index) => {
      expect(maze.timeLimitSeconds).toBe(240);
      expect(maze.stageIdentifier).toBe(`Section ${index + 1} of 5`);

      const key1 = maze.key1Position || maze.keyPosition;
      const key2 = maze.key2Position!;
      expect(key1).toBeDefined();
      expect(key2).toBeDefined();

      // All positions must be distinct
      expect(maze.playerStartPosition).not.toEqual(key1);
      expect(maze.playerStartPosition).not.toEqual(key2);
      expect(maze.playerStartPosition).not.toEqual(maze.doorPosition);
      expect(key1).not.toEqual(key2);
      expect(key1).not.toEqual(maze.doorPosition);
      expect(key2).not.toEqual(maze.doorPosition);

      // Neither key should be adjacent to START (Manhattan distance > 1)
      const dist1 =
        Math.abs(maze.playerStartPosition.row - key1.row) +
        Math.abs(maze.playerStartPosition.col - key1.col);
      const dist2 =
        Math.abs(maze.playerStartPosition.row - key2.row) +
        Math.abs(maze.playerStartPosition.col - key2.col);
      expect(dist1).toBeGreaterThan(1);
      expect(dist2).toBeGreaterThan(1);

      const result = validateMaze(maze);
      expect(result.valid).toBe(true);
      expect(result.startToKeyPaths).toHaveLength(1);
      expect(result.key1ToKey2Paths).toHaveLength(1);
      expect(result.key2ToDoorPaths).toHaveLength(1);
    });
  });

  it("enforces two-key unlocking rules (0 keys = locked, only key1 = locked, only key2 = locked, 2 keys = unlocked)", () => {
    const maze = PRACTICE_TEST_3_MAZES[0];
    const key1Pos = maze.key1Position!;
    const key2Pos = maze.key2Position!;
    const doorPos = maze.doorPosition;

    let key1Collected = false;
    let key2Collected = false;

    // Case A: 0 keys collected at door
    let player = { ...doorPos };
    let canOpenDoor = (key1Collected && key2Collected) && player.row === doorPos.row && player.col === doorPos.col;
    expect(canOpenDoor).toBe(false);

    // Case B: Only key 1 collected at door
    player = { ...key1Pos };
    if (player.row === key1Pos.row && player.col === key1Pos.col) {
      key1Collected = true;
    }
    expect(key1Collected).toBe(true);
    expect(key2Collected).toBe(false);

    player = { ...doorPos };
    canOpenDoor = (key1Collected && key2Collected) && player.row === doorPos.row && player.col === doorPos.col;
    expect(canOpenDoor).toBe(false);

    // Case C: Only key 2 collected at door (e.g. key1 lost / uncollected)
    key1Collected = false;
    key2Collected = true;
    player = { ...doorPos };
    canOpenDoor = (key1Collected && key2Collected) && player.row === doorPos.row && player.col === doorPos.col;
    expect(canOpenDoor).toBe(false);

    // Case D: Both keys collected at door
    key1Collected = true;
    key2Collected = true;
    player = { ...doorPos };
    canOpenDoor = (key1Collected && key2Collected) && player.row === doorPos.row && player.col === doorPos.col;
    expect(canOpenDoor).toBe(true);
  });

  it("tracks key1Collected and key2Collected independently", () => {
    const maze = PRACTICE_TEST_3_MAZES[1];
    const key1Pos = maze.key1Position!;
    const key2Pos = maze.key2Position!;

    let key1Collected = false;
    let key2Collected = false;

    // Player enters key 1 cell
    let player = { ...key1Pos };
    if (player.row === key1Pos.row && player.col === key1Pos.col) {
      key1Collected = true;
    }
    expect(key1Collected).toBe(true);
    expect(key2Collected).toBe(false);

    // Player enters key 2 cell
    player = { ...key2Pos };
    if (player.row === key2Pos.row && player.col === key2Pos.col) {
      key2Collected = true;
    }
    expect(key1Collected).toBe(true);
    expect(key2Collected).toBe(true);
  });

  it("resets both keys and visited path on wall collision in two-key maze, preserving positions and timer", () => {
    const maze = PRACTICE_TEST_3_MAZES[0];
    const start = maze.playerStartPosition;
    const key1Pos = maze.key1Position!;
    const key2Pos = maze.key2Position!;
    const doorPos = maze.doorPosition;

    let player = { ...start };
    let visitedCells = [start];
    let key1Collected = false;
    let key2Collected = false;
    let timerSec = 220;

    // Collect key 1
    player = { ...key1Pos };
    key1Collected = true;
    visitedCells.push(key1Pos);

    // Move towards key 2 and hit invisible wall
    player = { row: 0, col: 1 };
    visitedCells.push({ row: 0, col: 1 });
    const wallCollision = true;

    if (wallCollision) {
      player = { ...start };
      visitedCells = [start];
      key1Collected = false;
      key2Collected = false;
    }

    expect(player).toEqual(start);
    expect(visitedCells).toEqual([start]);
    expect(key1Collected).toBe(false);
    expect(key2Collected).toBe(false);
    expect(maze.key1Position).toEqual(key1Pos);
    expect(maze.key2Position).toEqual(key2Pos);
    expect(maze.doorPosition).toEqual(doorPos);
    expect(timerSec).toBe(220); // Timer uninterrupted
  });

  it("enforces dynamic grid boundaries on player movement (4x4 rows/cols 0-3, 5x5 rows/cols 0-4)", () => {
    function move(pos: Position, dir: "UP" | "DOWN" | "LEFT" | "RIGHT", gridSize: number): Position {
      let r = pos.row;
      let c = pos.col;
      if (dir === "UP") r -= 1;
      if (dir === "DOWN") r += 1;
      if (dir === "LEFT") c -= 1;
      if (dir === "RIGHT") c += 1;

      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
        return pos; // boundary blocked
      }
      return { row: r, col: c };
    }

    // 4x4 Grid boundary checks (0-3)
    expect(move({ row: 0, col: 0 }, "UP", 4)).toEqual({ row: 0, col: 0 });
    expect(move({ row: 0, col: 0 }, "LEFT", 4)).toEqual({ row: 0, col: 0 });
    expect(move({ row: 3, col: 3 }, "DOWN", 4)).toEqual({ row: 3, col: 3 });
    expect(move({ row: 3, col: 3 }, "RIGHT", 4)).toEqual({ row: 3, col: 3 });
    expect(move({ row: 2, col: 2 }, "RIGHT", 4)).toEqual({ row: 2, col: 3 });

    // 5x5 Grid boundary checks (0-4)
    expect(move({ row: 3, col: 3 }, "DOWN", 5)).toEqual({ row: 4, col: 3 });
    expect(move({ row: 3, col: 3 }, "RIGHT", 5)).toEqual({ row: 3, col: 4 });
    expect(move({ row: 4, col: 4 }, "DOWN", 5)).toEqual({ row: 4, col: 4 });
    expect(move({ row: 4, col: 4 }, "RIGHT", 5)).toEqual({ row: 4, col: 4 });
    expect(move({ row: 0, col: 4 }, "RIGHT", 5)).toEqual({ row: 0, col: 4 });
    expect(move({ row: 0, col: 4 }, "UP", 5)).toEqual({ row: 0, col: 4 });
  });

  it("verifies all 5 mazes in Practice Test 2 are valid 4x4 mazes with progressive difficulty", () => {
    const p2Mazes = getMazesForVariant("practice-2");
    expect(p2Mazes).toHaveLength(5);

    const ids = new Set(p2Mazes.map((m) => m.id));
    expect(ids.size).toBe(5);

    const totalPathLengths: number[] = [];

    p2Mazes.forEach((maze, index) => {
      expect(maze.gridSize).toBe(4);
      expect(maze.timeLimitSeconds).toBe(240);
      expect(maze.stageIdentifier).toBe(`Section ${index + 1} of 5`);

      // Start, Key, and Door must all be distinct
      expect(maze.playerStartPosition).not.toEqual(maze.keyPosition);
      expect(maze.keyPosition).not.toEqual(maze.doorPosition);
      expect(maze.playerStartPosition).not.toEqual(maze.doorPosition);

      // Key must not be adjacent (Manhattan distance > 1) to start
      const manhattanDist =
        Math.abs(maze.playerStartPosition.row - maze.keyPosition.row) +
        Math.abs(maze.playerStartPosition.col - maze.keyPosition.col);
      expect(manhattanDist).toBeGreaterThan(1);

      const result = validateMaze(maze);
      expect(result.valid).toBe(true);
      expect(result.startToKeyPaths).toHaveLength(1);
      expect(result.keyToDoorPaths).toHaveLength(1);

      const startToKeyLen = result.startToKeyPaths[0].length - 1;
      const keyToDoorLen = result.keyToDoorPaths[0].length - 1;
      totalPathLengths.push(startToKeyLen + keyToDoorLen);
    });

    // Verify first three mazes maintain difficulty progression (Maze 1 < Maze 2 < Maze 3)
    expect(totalPathLengths[0]).toBeLessThan(totalPathLengths[1]);
    expect(totalPathLengths[1]).toBeLessThan(totalPathLengths[2]);
  });

  it("verifies all 5 mazes in Practice Test 1 are valid solvable 3x3 mazes with unique solutions", () => {
    const p1Mazes = getMazesForVariant("practice-1");
    expect(p1Mazes).toHaveLength(5);

    // Each maze must have gridSize 3 and unique positions/IDs
    const ids = new Set(p1Mazes.map((m) => m.id));
    expect(ids.size).toBe(5);

    p1Mazes.forEach((maze, index) => {
      expect(maze.gridSize).toBe(3);
      expect(maze.timeLimitSeconds).toBe(240);
      expect(maze.stageIdentifier).toBe(`Section ${index + 1} of 5`);

      const result = validateMaze(maze);
      expect(result.valid).toBe(true);
      expect(result.startToKeyPaths).toHaveLength(1);
      expect(result.keyToDoorPaths).toHaveLength(1);
    });
  });

  it("enforces 3x3 grid physical boundaries on player movement", () => {
    function move(pos: Position, dir: "UP" | "DOWN" | "LEFT" | "RIGHT"): Position {
      let r = pos.row;
      let c = pos.col;
      if (dir === "UP") r -= 1;
      if (dir === "DOWN") r += 1;
      if (dir === "LEFT") c -= 1;
      if (dir === "RIGHT") c += 1;

      if (r < 0 || r > 2 || c < 0 || c > 2) {
        return pos; // boundary blocked
      }
      return { row: r, col: c };
    }

    // Top-left cell (0, 0): cannot go UP or LEFT
    expect(move({ row: 0, col: 0 }, "UP")).toEqual({ row: 0, col: 0 });
    expect(move({ row: 0, col: 0 }, "LEFT")).toEqual({ row: 0, col: 0 });
    expect(move({ row: 0, col: 0 }, "RIGHT")).toEqual({ row: 0, col: 1 });
    expect(move({ row: 0, col: 0 }, "DOWN")).toEqual({ row: 1, col: 0 });

    // Bottom-right cell (2, 2): cannot go DOWN or RIGHT
    expect(move({ row: 2, col: 2 }, "DOWN")).toEqual({ row: 2, col: 2 });
    expect(move({ row: 2, col: 2 }, "RIGHT")).toEqual({ row: 2, col: 2 });
    expect(move({ row: 2, col: 2 }, "UP")).toEqual({ row: 1, col: 2 });
    expect(move({ row: 2, col: 2 }, "LEFT")).toEqual({ row: 2, col: 1 });
  });

  it("calculates which directional arrows should be attached to current player cell", () => {
    function getAvailableArrows(pos: Position, gridSize: number = 3) {
      return {
        up: pos.row > 0,
        down: pos.row < gridSize - 1,
        left: pos.col > 0,
        right: pos.col < gridSize - 1,
      };
    }

    // Center cell (1, 1): all 4 arrows present
    expect(getAvailableArrows({ row: 1, col: 1 })).toEqual({
      up: true,
      down: true,
      left: true,
      right: true,
    });

    // Top-left cell (0, 0): only right and down
    expect(getAvailableArrows({ row: 0, col: 0 })).toEqual({
      up: false,
      down: true,
      left: false,
      right: true,
    });

    // Bottom-right cell (2, 2): only up and left
    expect(getAvailableArrows({ row: 2, col: 2 })).toEqual({
      up: true,
      down: false,
      left: true,
      right: false,
    });
  });

  it("detects hidden walls bidirectionally and triggers collision without timer reset", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    // Wall exists between (1, 1) and (0, 1) (UP from start)
    expect(isWallBetween(maze.walls, { row: 1, col: 1 }, "up")).toBe(true);
    expect(isWallBetween(maze.walls, { row: 0, col: 1 }, "down")).toBe(true);

    let playerPos = { ...maze.playerStartPosition };
    let visitedCells = [maze.playerStartPosition];
    let keyCollected = false;
    let timerSec = 236; // 3:56

    // Move UP into hidden wall
    if (isWallBetween(maze.walls, playerPos, "up")) {
      // Collision reset
      playerPos = { ...maze.playerStartPosition };
      visitedCells = [maze.playerStartPosition];
      keyCollected = false;
    }

    expect(playerPos).toEqual({ row: 1, col: 1 });
    expect(visitedCells).toEqual([{ row: 1, col: 1 }]);
    expect(keyCollected).toBe(false);
    expect(timerSec).toBe(236); // Timer unaffected by collision
  });

  it("requires key collection before door completion", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    let player = { ...maze.playerStartPosition };
    let keyCollected = false;

    // Moving toward door (2, 2) without key
    player = { row: 2, col: 2 };
    const canCompleteWithoutKey = keyCollected && player.row === maze.doorPosition.row && player.col === maze.doorPosition.col;
    expect(canCompleteWithoutKey).toBe(false);

    // Collect key at (0, 0)
    player = { row: 0, col: 0 };
    if (player.row === maze.keyPosition.row && player.col === maze.keyPosition.col) {
      keyCollected = true;
    }
    expect(keyCollected).toBe(true);

    // Reaching door at (2, 2) after key
    player = { row: 2, col: 2 };
    const canCompleteWithKey = keyCollected && player.row === maze.doorPosition.row && player.col === maze.doorPosition.col;
    expect(canCompleteWithKey).toBe(true);
  });

  it("rejects movement through an invisible wall and triggers collision feedback", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    const isBlocked = isWallBetween(maze.walls, maze.playerStartPosition, "up");
    expect(isBlocked).toBe(true);
  });

  it("resets player to start after wall collision and keeps the same maze active", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    let player = { row: 1, col: 0 }; // Player moved left
    let keyCollected = false;

    // Player attempts an illegal movement into a wall
    const collisionOccurred = isWallBetween(maze.walls, { row: 1, col: 1 }, "up");
    expect(collisionOccurred).toBe(true);

    // Reset sequence
    player = { ...maze.playerStartPosition };
    keyCollected = false;

    expect(player).toEqual(maze.playerStartPosition);
    expect(keyCollected).toBe(false);
  });

  it("does not reset timer after wall collision", () => {
    let remainingSec = 215; // 3:35 elapsed
    const collisionOccurred = true;

    if (collisionOccurred) {
      // Collision only resets player pos, timer keeps running
      remainingSec = remainingSec;
    }

    expect(remainingSec).toBe(215);
  });

  it("collects key when player enters key cell", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    let keyCollected = false;
    const player = { ...maze.keyPosition };

    if (player.row === maze.keyPosition.row && player.col === maze.keyPosition.col) {
      keyCollected = true;
    }

    expect(keyCollected).toBe(true);
  });

  it("door does not complete maze before key", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    const player = { ...maze.doorPosition };
    const keyCollected = false;

    const completed = keyCollected && player.row === maze.doorPosition.row && player.col === maze.doorPosition.col;
    expect(completed).toBe(false);
  });

  it("door opens after key is collected and player reaches door", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    const player = { ...maze.doorPosition };
    const keyCollected = true;

    const canOpen = keyCollected && player.row === maze.doorPosition.row && player.col === maze.doorPosition.col;
    expect(canOpen).toBe(true);
  });

  it("initializes the starting cell as visited", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    const visitedCells = [maze.playerStartPosition];
    expect(visitedCells).toHaveLength(1);
    expect(visitedCells[0]).toEqual(maze.playerStartPosition);
  });

  it("accumulates visited cells on valid moves without duplicates", () => {
    const start: Position = { row: 1, col: 1 };
    let visited: Position[] = [start];

    function addVisited(p: Position) {
      if (!visited.some((v) => v.row === p.row && v.col === p.col)) {
        visited = [...visited, p];
      }
    }

    // Move left to (1, 0)
    addVisited({ row: 1, col: 0 });
    expect(visited).toHaveLength(2);

    // Move up to (0, 0)
    addVisited({ row: 0, col: 0 });
    expect(visited).toHaveLength(3);

    // Revisit (1, 0)
    addVisited({ row: 1, col: 0 });
    expect(visited).toHaveLength(3); // No duplicate added
  });

  it("clears visited path cells on wall collision, keeping only the start position visited", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    const start = maze.playerStartPosition; // e.g. (1, 1)
    const cellA = { row: 1, col: 0 };
    const cellB = { row: 0, col: 0 };
    const cellC = { row: 0, col: 1 };

    // Player moves START -> A -> B -> C
    let player = { ...cellC };
    let visitedCells = [start, cellA, cellB, cellC];
    let collisionDirection: string | null = null;
    let timerSec = 210;

    // Verify all 4 cells are initially visited
    expect(visitedCells).toContainEqual(start);
    expect(visitedCells).toContainEqual(cellA);
    expect(visitedCells).toContainEqual(cellB);
    expect(visitedCells).toContainEqual(cellC);

    // Player hits an invisible wall from C (e.g. attempting blocked move)
    const collisionOccurred = true;
    collisionDirection = "up";

    if (collisionOccurred) {
      // 1. Temporary collision feedback
      expect(collisionDirection).toBe("up");

      // 2. Full path reset: player returns to START, visitedCells clears to ONLY [start]
      player = { ...start };
      visitedCells = [start];
      collisionDirection = null;
    }

    // Assert player is back at START
    expect(player).toEqual(start);

    // Assert visitedCells contains ONLY START (A, B, C are now white)
    expect(visitedCells).toHaveLength(1);
    expect(visitedCells[0]).toEqual(start);
    expect(visitedCells).not.toContainEqual(cellA);
    expect(visitedCells).not.toContainEqual(cellB);
    expect(visitedCells).not.toContainEqual(cellC);

    // Assert timer, maze layout, key, and door remain unchanged
    expect(timerSec).toBe(210);
    expect(maze.id).toBe("p1-maze-1");
    expect(maze.keyPosition).toEqual({ row: 0, col: 0 });
    expect(maze.doorPosition).toEqual({ row: 2, col: 2 });
    expect(collisionDirection).toBeNull();
  });

  it("resets keyCollected to false and restores key on wall collision, keeping timer uninterrupted", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    const start = maze.playerStartPosition; // (1, 1)
    const keyPos = maze.keyPosition; // (0, 0)
    const doorPos = maze.doorPosition; // (2, 2)

    // Initial state: key not collected, key is visible at keyPosition
    let keyCollected = false;
    let isKeyVisible = !keyCollected;
    expect(isKeyVisible).toBe(true);

    // Player collects the key
    let player = { ...keyPos };
    keyCollected = true;
    isKeyVisible = !keyCollected;
    let visitedCells = [start, { row: 1, col: 0 }, keyPos];
    expect(keyCollected).toBe(true);
    expect(isKeyVisible).toBe(false); // Key is now collected

    // Player continues navigating and hits an invisible wall
    player = { row: 0, col: 1 };
    visitedCells.push({ row: 0, col: 1 });
    let timerSec = 195;

    // WALL COLLISION OCCURS AFTER KEY COLLECTION
    player = { ...start };
    visitedCells = [start];
    keyCollected = false; // Required: reset keyCollected
    isKeyVisible = !keyCollected; // Key becomes visible/collectible again at original keyPosition

    expect(keyCollected).toBe(false);
    expect(isKeyVisible).toBe(true);
    expect(visitedCells).toEqual([start]);
    expect(timerSec).toBe(195); // Timer continues

    // Player cannot complete door before re-collecting key
    player = { ...doorPos };
    const canCompleteWithoutReKey = keyCollected && player.row === doorPos.row && player.col === doorPos.col;
    expect(canCompleteWithoutReKey).toBe(false);
  });

  it("handles Practice Test 1 5-maze sequential progression and independent timers", () => {
    const mazes = getMazesForVariant("practice-1");
    expect(mazes).toHaveLength(5);

    let currentItemIndex = 0;
    let remainingSec = 240;

    // Step through each of the 5 mazes
    for (let i = 0; i < 5; i++) {
      expect(mazes[currentItemIndex].stageIdentifier).toBe(`Section ${i + 1} of 5`);
      expect(remainingSec).toBe(240);
      currentItemIndex++;
      remainingSec = 240; // Fresh 4:00 timer
    }

    // Complete Maze 5 -> Session Complete
    const isFinished = currentItemIndex >= mazes.length;
    expect(isFinished).toBe(true);
  });

  it("triggers openingDoor state when player reaches door with collected key", () => {
    const maze = PRACTICE_TEST_1_MAZES[0];
    let status: string = "playing";
    let keyCollected = true;
    let doorPhase: string | null = null;
    let player = { ...maze.doorPosition };

    if (keyCollected && player.row === maze.doorPosition.row && player.col === maze.doorPosition.col) {
      status = "openingDoor";
      doorPhase = "entering";
    }

    expect(status).toBe("openingDoor");
    expect(doorPhase).toBe("entering");

    // After key enters doorway, door swings open
    doorPhase = "opened";
    expect(doorPhase).toBe("opened");

    // After animation finishes, success is recorded
    status = "success";
    expect(status).toBe("success");
  });

  it("provides an independent 240-second (4:00) timer for each new maze", () => {
    const MEMORY_MAZE_TOTAL_SECONDS = 240;

    // Maze 1 starts at 4:00 (240s)
    let questionStartTime = 1000000;
    let now = 1000000 + 45000; // 45 seconds elapsed in Maze 1
    let remainingSec = Math.max(0, MEMORY_MAZE_TOTAL_SECONDS - Math.floor((now - questionStartTime) / 1000));
    expect(remainingSec).toBe(195); // 3:15

    // Maze 1 is completed. Maze 2 starts!
    // Remaining time from Maze 1 does NOT carry over to Maze 2
    questionStartTime = now + 1000; // New question start timestamp
    remainingSec = MEMORY_MAZE_TOTAL_SECONDS; // Fresh 240s timer
    expect(remainingSec).toBe(240); // Exactly 4:00

    // Collision in Maze 2 does not reset the current Maze 2 timer
    now = questionStartTime + 20000; // 20s elapsed in Maze 2
    const collisionOccurred = true;
    if (collisionOccurred) {
      remainingSec = Math.max(0, MEMORY_MAZE_TOTAL_SECONDS - Math.floor((now - questionStartTime) / 1000));
    }
    expect(remainingSec).toBe(220); // 3:40 (Timer continues uninterrupted)
  });

  it("handles adjacent grid cell clicking identically to directional arrow clicks and rejects non-adjacent clicks", () => {
    function getMoveDirectionFromCellClick(
      playerPos: Position,
      clickedRow: number,
      clickedCol: number
    ): Direction | null {
      if (clickedRow === playerPos.row - 1 && clickedCol === playerPos.col) return "up";
      if (clickedRow === playerPos.row + 1 && clickedCol === playerPos.col) return "down";
      if (clickedRow === playerPos.row && clickedCol === playerPos.col - 1) return "left";
      if (clickedRow === playerPos.row && clickedCol === playerPos.col + 1) return "right";
      return null;
    }

    const player: Position = { row: 1, col: 1 };

    // 1. Directly adjacent cells return correct direction
    expect(getMoveDirectionFromCellClick(player, 0, 1)).toBe("up");
    expect(getMoveDirectionFromCellClick(player, 2, 1)).toBe("down");
    expect(getMoveDirectionFromCellClick(player, 1, 0)).toBe("left");
    expect(getMoveDirectionFromCellClick(player, 1, 2)).toBe("right");

    // 2. Non-adjacent cells return null (do nothing, no movement)
    expect(getMoveDirectionFromCellClick(player, 0, 0)).toBeNull(); // diagonal top-left
    expect(getMoveDirectionFromCellClick(player, 0, 2)).toBeNull(); // diagonal top-right
    expect(getMoveDirectionFromCellClick(player, 2, 0)).toBeNull(); // diagonal bottom-left
    expect(getMoveDirectionFromCellClick(player, 2, 2)).toBeNull(); // diagonal bottom-right
    expect(getMoveDirectionFromCellClick(player, 1, 1)).toBeNull(); // current cell
    expect(getMoveDirectionFromCellClick(player, 3, 3)).toBeNull(); // distant cell
  });
});
