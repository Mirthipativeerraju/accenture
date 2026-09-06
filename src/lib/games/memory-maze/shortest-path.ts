import { MemoryMazeQuestion, Position, Direction, HiddenWall, isWallBetween } from "./types";

const DIRS: { dir: Direction; dr: number; dc: number }[] = [
  { dir: "up", dr: -1, dc: 0 },
  { dir: "down", dr: 1, dc: 0 },
  { dir: "left", dr: 0, dc: -1 },
  { dir: "right", dr: 0, dc: 1 },
];

/**
 * Finds the shortest path between two points in a maze using Breadth-First Search (BFS).
 * Movement is grid-adjacent with uniform cost 1.
 * Returns the sequence of positions from start to target, or null if unreachable.
 */
export function findShortestPathBFS(
  start: Position,
  target: Position,
  walls: HiddenWall[] | undefined,
  gridSize: number
): Position[] | null {
  if (start.row === target.row && start.col === target.col) {
    return [start];
  }

  const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [start] }];
  const visited = new Set<string>([`${start.row},${start.col}`]);

  while (queue.length > 0) {
    const { pos: current, path } = queue.shift()!;

    for (const { dir, dr, dc } of DIRS) {
      const next: Position = { row: current.row + dr, col: current.col + dc };

      // Boundary check
      if (next.row < 0 || next.row >= gridSize || next.col < 0 || next.col >= gridSize) {
        continue;
      }

      // Wall check
      if (isWallBetween(walls, current, dir)) {
        continue;
      }

      const key = `${next.row},${next.col}`;
      if (visited.has(key)) {
        continue;
      }

      const newPath = [...path, next];
      if (next.row === target.row && next.col === target.col) {
        return newPath;
      }

      visited.add(key);
      queue.push({ pos: next, path: newPath });
    }
  }

  return null;
}

/**
 * Finds all simple paths (without cycles) between two points up to a limit.
 */
export function findAllSimplePaths(
  start: Position,
  target: Position,
  walls: HiddenWall[] | undefined,
  gridSize: number,
  maxPaths: number = 30
): Position[][] {
  const results: Position[][] = [];
  const visited = new Set<string>();

  const posKey = (p: Position) => `${p.row},${p.col}`;

  function dfs(current: Position, currentPath: Position[]) {
    if (results.length >= maxPaths) return;

    if (current.row === target.row && current.col === target.col) {
      results.push([...currentPath]);
      return;
    }

    for (const { dir, dr, dc } of DIRS) {
      const next: Position = { row: current.row + dr, col: current.col + dc };

      if (next.row < 0 || next.row >= gridSize || next.col < 0 || next.col >= gridSize) {
        continue;
      }

      if (isWallBetween(walls, current, dir)) {
        continue;
      }

      const key = posKey(next);
      if (visited.has(key)) {
        continue;
      }

      visited.add(key);
      currentPath.push(next);
      dfs(next, currentPath);
      currentPath.pop();
      visited.delete(key);
    }
  }

  visited.add(posKey(start));
  dfs(start, [start]);

  return results;
}

export interface ShortestPathResult {
  minimumSteps: number;
  optimalPath: Position[];
  isSolvable: boolean;
  hasAlternativeRoute: boolean;
  alternativeSteps?: number;
  optimalKeyOrder?: ("key1" | "key2")[];
}

/**
 * Mathematically calculates the true minimum number of movement steps
 * required from START to KEY(S) to DOOR for a given maze.
 * For 2-key mazes, tests both valid key orders (A->B and B->A) and picks the minimum.
 */
export function calculateMinimumSteps(maze: MemoryMazeQuestion): ShortestPathResult {
  const size = maze.gridSize || 3;
  const start = maze.playerStartPosition;
  const key1 = maze.key1Position || maze.keyPosition;
  const key2 = maze.key2Position;
  const door = maze.doorPosition;
  const walls = maze.walls || [];

  // 1. Two-key calculation
  if (key2) {
    // Option A: Start -> Key1 -> Key2 -> Door
    const p1A = findShortestPathBFS(start, key1, walls, size);
    const p2A = findShortestPathBFS(key1, key2, walls, size);
    const p3A = findShortestPathBFS(key2, door, walls, size);

    const validA = p1A !== null && p2A !== null && p3A !== null;
    const stepsA = validA
      ? (p1A!.length - 1) + (p2A!.length - 1) + (p3A!.length - 1)
      : Infinity;

    // Option B: Start -> Key2 -> Key1 -> Door
    const p1B = findShortestPathBFS(start, key2, walls, size);
    const p2B = findShortestPathBFS(key2, key1, walls, size);
    const p3B = findShortestPathBFS(key1, door, walls, size);

    const validB = p1B !== null && p2B !== null && p3B !== null;
    const stepsB = validB
      ? (p1B!.length - 1) + (p2B!.length - 1) + (p3B!.length - 1)
      : Infinity;

    if (!validA && !validB) {
      return {
        minimumSteps: Infinity,
        optimalPath: [],
        isSolvable: false,
        hasAlternativeRoute: false,
      };
    }

    const useOptionA = stepsA <= stepsB;
    const minimumSteps = useOptionA ? stepsA : stepsB;
    const optimalPath = useOptionA
      ? [...p1A!, ...p2A!.slice(1), ...p3A!.slice(1)]
      : [...p1B!, ...p2B!.slice(1), ...p3B!.slice(1)];
    const optimalKeyOrder: ("key1" | "key2")[] = useOptionA
      ? ["key1", "key2"]
      : ["key2", "key1"];

    // Check for alternative longer valid route
    let hasAlternativeRoute = false;
    let alternativeSteps: number | undefined;

    if (validA && validB && stepsA !== stepsB) {
      hasAlternativeRoute = true;
      alternativeSteps = Math.max(stepsA, stepsB);
    } else {
      const allP1 = findAllSimplePaths(start, key1, walls, size, 5);
      const allP2 = findAllSimplePaths(key1, key2, walls, size, 5);
      const allP3 = findAllSimplePaths(key2, door, walls, size, 5);
      if (allP1.length > 1 || allP2.length > 1 || allP3.length > 1) {
        hasAlternativeRoute = true;
        const altSteps =
          (allP1[allP1.length - 1]?.length - 1 || 0) +
          (allP2[allP2.length - 1]?.length - 1 || 0) +
          (allP3[allP3.length - 1]?.length - 1 || 0);
        if (altSteps > minimumSteps) {
          alternativeSteps = altSteps;
        }
      }
    }

    return {
      minimumSteps,
      optimalPath,
      isSolvable: true,
      hasAlternativeRoute,
      alternativeSteps,
      optimalKeyOrder,
    };
  }

  // 2. Single-key calculation: Start -> Key -> Door
  const p1 = findShortestPathBFS(start, key1, walls, size);
  const p2 = findShortestPathBFS(key1, door, walls, size);

  if (!p1 || !p2) {
    return {
      minimumSteps: Infinity,
      optimalPath: [],
      isSolvable: false,
      hasAlternativeRoute: false,
    };
  }

  const minimumSteps = (p1.length - 1) + (p2.length - 1);
  const optimalPath = [...p1, ...p2.slice(1)];

  // Check alternative simple paths
  const allStartToKey = findAllSimplePaths(start, key1, walls, size, 5);
  const allKeyToDoor = findAllSimplePaths(key1, door, walls, size, 5);

  let hasAlternativeRoute = false;
  let alternativeSteps: number | undefined;

  const candidateAltLengths: number[] = [];
  for (const path1 of allStartToKey) {
    for (const path2 of allKeyToDoor) {
      const totalSteps = (path1.length - 1) + (path2.length - 1);
      if (totalSteps > minimumSteps) {
        candidateAltLengths.push(totalSteps);
      }
    }
  }

  if (candidateAltLengths.length > 0) {
    hasAlternativeRoute = true;
    candidateAltLengths.sort((a, b) => a - b);
    alternativeSteps = candidateAltLengths[0];
  }

  return {
    minimumSteps,
    optimalPath,
    isSolvable: true,
    hasAlternativeRoute,
    alternativeSteps,
  };
}

export interface RouteMetrics {
  actualSteps: number;
  minimumSteps: number;
  extraSteps: number;
  efficiency: number;
}

/**
 * Calculates extra steps and efficiency percentage comparing actual performance to minimum.
 */
export function calculateStepMetrics(actualSteps: number, minimumSteps: number): RouteMetrics {
  const safeActual = Math.max(0, actualSteps);
  const safeMin = Math.max(0, minimumSteps);

  if (safeActual === 0) {
    return {
      actualSteps: 0,
      minimumSteps: safeMin,
      extraSteps: 0,
      efficiency: 100,
    };
  }

  const extraSteps = Math.max(0, safeActual - safeMin);
  const rawEfficiency = (safeMin / safeActual) * 100;
  const efficiency = Math.min(100, Math.max(0, Math.round(rawEfficiency * 100) / 100));

  return {
    actualSteps: safeActual,
    minimumSteps: safeMin,
    extraSteps,
    efficiency,
  };
}
