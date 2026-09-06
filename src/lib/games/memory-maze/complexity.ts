import { MemoryMazeQuestion, Position, Direction, isWallBetween } from "./types";
import { validateMaze } from "./validator";

export interface MazeComplexityMetrics {
  isSolvable: boolean;
  solutionPathLength: number;
  turnCount: number;
  decisionPointsCount: number;
  deadEndBranchesCount: number;
  deadEndCellsCount: number;
  keySeparation: number;
  hasTwoKeys: boolean;
}

export function calculateMazeComplexity(maze: MemoryMazeQuestion): MazeComplexityMetrics {
  const validation = validateMaze(maze);
  if (!validation.valid) {
    return {
      isSolvable: false,
      solutionPathLength: 0,
      turnCount: 0,
      decisionPointsCount: 0,
      deadEndBranchesCount: 0,
      deadEndCellsCount: 0,
      keySeparation: 0,
      hasTwoKeys: Boolean(maze.key2Position),
    };
  }

  const start = maze.playerStartPosition;
  const key1 = maze.key1Position || maze.keyPosition;
  const key2 = maze.key2Position;
  const door = maze.doorPosition;
  const size = maze.gridSize || 3;
  const walls = maze.walls || [];

  // Build full solution path
  let fullPath: Position[] = [];
  if (key2 && validation.key1ToKey2Paths && validation.key2ToDoorPaths) {
    const p1 = validation.startToKeyPaths[0] || [];
    const p2 = validation.key1ToKey2Paths[0] || [];
    const p3 = validation.key2ToDoorPaths[0] || [];
    fullPath = [...p1, ...p2.slice(1), ...p3.slice(1)];
  } else {
    const p1 = validation.startToKeyPaths[0] || [];
    const p2 = validation.keyToDoorPaths[0] || [];
    fullPath = [...p1, ...p2.slice(1)];
  }

  const solutionPathLength = Math.max(0, fullPath.length - 1);

  // Turn count calculation
  let turnCount = 0;
  for (let i = 1; i < fullPath.length - 1; i++) {
    const prev = fullPath[i - 1];
    const curr = fullPath[i];
    const next = fullPath[i + 1];

    const prevDir = { dr: curr.row - prev.row, dc: curr.col - prev.col };
    const nextDir = { dr: next.row - curr.row, dc: next.col - curr.col };

    if (prevDir.dr !== nextDir.dr || prevDir.dc !== nextDir.dc) {
      turnCount++;
    }
  }

  // Find all reachable cells from Start
  const reachableCells = new Set<string>();
  const cellAdjacency = new Map<string, Position[]>();

  const directions: { dir: Direction; dr: number; dc: number }[] = [
    { dir: "up", dr: -1, dc: 0 },
    { dir: "down", dr: 1, dc: 0 },
    { dir: "left", dr: 0, dc: -1 },
    { dir: "right", dr: 0, dc: 1 },
  ];

  const posKey = (p: Position) => `${p.row},${p.col}`;

  // BFS to discover reachable graph
  const queue: Position[] = [start];
  reachableCells.add(posKey(start));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const curKey = posKey(current);
    const neighbors: Position[] = [];

    for (const { dir, dr, dc } of directions) {
      const next: Position = { row: current.row + dr, col: current.col + dc };
      if (next.row < 0 || next.row >= size || next.col < 0 || next.col >= size) {
        continue;
      }
      if (isWallBetween(walls, current, dir)) {
        continue;
      }

      neighbors.push(next);
      const nextKey = posKey(next);
      if (!reachableCells.has(nextKey)) {
        reachableCells.add(nextKey);
        queue.push(next);
      }
    }
    cellAdjacency.set(curKey, neighbors);
  }

  // Solution path set
  const solutionPathKeys = new Set(fullPath.map(posKey));

  // Decision points: cells on solution path that have open neighbors leading into branches
  let decisionPointsCount = 0;
  for (const pos of fullPath) {
    const k = posKey(pos);
    const neighbors = cellAdjacency.get(k) || [];
    const nonPathNeighbors = neighbors.filter((n) => !solutionPathKeys.has(posKey(n)));
    if (nonPathNeighbors.length > 0) {
      decisionPointsCount++;
    }
  }

  // Count dead-end cells (reachable but not on solution path)
  let deadEndCellsCount = 0;
  for (const k of reachableCells) {
    if (!solutionPathKeys.has(k)) {
      deadEndCellsCount++;
    }
  }

  // Dead end branches = sum of non-path neighbors branching directly off solution path
  let deadEndBranchesCount = 0;
  for (const pos of fullPath) {
    const k = posKey(pos);
    const neighbors = cellAdjacency.get(k) || [];
    deadEndBranchesCount += neighbors.filter((n) => !solutionPathKeys.has(posKey(n))).length;
  }

  // Key separation calculation
  let keySeparation =
    Math.abs(start.row - key1.row) +
    Math.abs(start.col - key1.col) +
    Math.abs(key1.row - door.row) +
    Math.abs(key1.col - door.col);

  if (key2) {
    keySeparation =
      Math.abs(start.row - key1.row) +
      Math.abs(start.col - key1.col) +
      Math.abs(key1.row - key2.row) +
      Math.abs(key1.col - key2.col) +
      Math.abs(key2.row - door.row) +
      Math.abs(key2.col - door.col);
  }

  return {
    isSolvable: true,
    solutionPathLength,
    turnCount,
    decisionPointsCount,
    deadEndBranchesCount,
    deadEndCellsCount,
    keySeparation,
    hasTwoKeys: Boolean(key2),
  };
}
