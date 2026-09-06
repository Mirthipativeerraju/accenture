import { MemoryMazeQuestion, MemoryMazeActionPayload, Position, Direction, HiddenWall, isWallBetween } from "./types";

/**
 * Finds all simple paths (no repeated vertices) from `start` to `target` in a grid
 * considering invisible walls and grid boundaries.
 */
export function findSimplePaths(
  start: Position,
  target: Position,
  walls: HiddenWall[] | undefined,
  gridSize: number = 3
): Position[][] {
  const results: Position[][] = [];
  const visited = new Set<string>();

  const posKey = (p: Position) => `${p.row},${p.col}`;

  function dfs(current: Position, currentPath: Position[]) {
    if (current.row === target.row && current.col === target.col) {
      results.push([...currentPath]);
      return;
    }

    const directions: { dir: Direction; next: Position }[] = [
      { dir: "up", next: { row: current.row - 1, col: current.col } },
      { dir: "down", next: { row: current.row + 1, col: current.col } },
      { dir: "left", next: { row: current.row, col: current.col - 1 } },
      { dir: "right", next: { row: current.row, col: current.col + 1 } },
    ];

    for (const { dir, next } of directions) {
      // 1. Grid boundary check
      if (next.row < 0 || next.row >= gridSize || next.col < 0 || next.col >= gridSize) {
        continue;
      }

      // 2. Wall check
      if (isWallBetween(walls, current, dir)) {
        continue;
      }

      // 3. Cycle prevention in simple path
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

/**
 * Validates that a maze configuration satisfies all Accenture Memory Maze rules:
 * 1. Valid bounds for START, KEY, and DOOR.
 * 2. Exactly ONE simple path from START to KEY.
 * 3. Exactly ONE simple path from KEY to DOOR.
 */
export function validateMaze(
  maze: MemoryMazeQuestion,
  options?: { requireUniquePath?: boolean }
): {
  valid: boolean;
  error?: string;
  startToKeyPaths: Position[][];
  keyToDoorPaths: Position[][];
  key1ToKey2Paths?: Position[][];
  key2ToDoorPaths?: Position[][];
} {
  const size = maze.gridSize || 3;
  const start = maze.playerStartPosition;
  const key1 = maze.key1Position || maze.keyPosition;
  const key2 = maze.key2Position;
  const door = maze.doorPosition;
  const walls = maze.walls || [];
  const requireUnique = options?.requireUniquePath ?? false;

  // Check bounds
  const inBounds = (p: Position) => p.row >= 0 && p.row < size && p.col >= 0 && p.col < size;
  if (!inBounds(start) || !inBounds(key1) || !inBounds(door) || (key2 && !inBounds(key2))) {
    return {
      valid: false,
      error: "Start, Key, or Door is out of grid bounds",
      startToKeyPaths: [],
      keyToDoorPaths: [],
    };
  }

  // 1. Two-key maze validation
  if (key2) {
    const startToKey1Paths = findSimplePaths(start, key1, walls, size).sort((a, b) => a.length - b.length);
    const key1ToKey2Paths = findSimplePaths(key1, key2, walls, size).sort((a, b) => a.length - b.length);
    const key2ToDoorPaths = findSimplePaths(key2, door, walls, size).sort((a, b) => a.length - b.length);

    const validOptionA = startToKey1Paths.length > 0 && key1ToKey2Paths.length > 0 && key2ToDoorPaths.length > 0;

    const startToKey2Paths = findSimplePaths(start, key2, walls, size).sort((a, b) => a.length - b.length);
    const key2ToKey1Paths = findSimplePaths(key2, key1, walls, size).sort((a, b) => a.length - b.length);
    const key1ToDoorPaths = findSimplePaths(key1, door, walls, size).sort((a, b) => a.length - b.length);

    const validOptionB = startToKey2Paths.length > 0 && key2ToKey1Paths.length > 0 && key1ToDoorPaths.length > 0;

    if (!validOptionA && !validOptionB) {
      return {
        valid: false,
        error: "Maze is unsolvable: no complete path from START to both keys and DOOR",
        startToKeyPaths: startToKey1Paths,
        keyToDoorPaths: key2ToDoorPaths,
      };
    }

    if (requireUnique) {
      if (startToKey1Paths.length > 1 || key1ToKey2Paths.length > 1 || key2ToDoorPaths.length > 1) {
        return {
          valid: false,
          error: "Multiple paths exist for two-key sequence",
          startToKeyPaths: startToKey1Paths,
          keyToDoorPaths: key2ToDoorPaths,
        };
      }
    }

    return {
      valid: true,
      startToKeyPaths: validOptionA ? startToKey1Paths : startToKey2Paths,
      keyToDoorPaths: validOptionA ? key2ToDoorPaths : key1ToDoorPaths,
      key1ToKey2Paths: validOptionA ? key1ToKey2Paths : key2ToKey1Paths,
      key2ToDoorPaths: validOptionA ? key2ToDoorPaths : key1ToDoorPaths,
    };
  }

  // 2. Single-key maze validation
  const startToKeyPaths = findSimplePaths(start, key1, walls, size).sort((a, b) => a.length - b.length);
  if (startToKeyPaths.length === 0) {
    return {
      valid: false,
      error: "KEY is unreachable from START",
      startToKeyPaths,
      keyToDoorPaths: [],
    };
  }
  if (requireUnique && startToKeyPaths.length > 1) {
    return {
      valid: false,
      error: `Multiple paths exist from START to KEY (found ${startToKeyPaths.length} paths)`,
      startToKeyPaths,
      keyToDoorPaths: [],
    };
  }

  // Verify KEY -> DOOR has path
  const keyToDoorPaths = findSimplePaths(key1, door, walls, size).sort((a, b) => a.length - b.length);
  if (keyToDoorPaths.length === 0) {
    return {
      valid: false,
      error: "DOOR is unreachable from KEY",
      startToKeyPaths,
      keyToDoorPaths: [],
    };
  }
  if (requireUnique && keyToDoorPaths.length > 1) {
    return {
      valid: false,
      error: `Multiple paths exist from KEY to DOOR (found ${keyToDoorPaths.length} paths)`,
      startToKeyPaths,
      keyToDoorPaths,
    };
  }

  return {
    valid: true,
    startToKeyPaths,
    keyToDoorPaths,
  };
}

export function validatePath(gridSize: number, path: { r: number; c: number; id?: string }[]): boolean {
  if (!path || path.length === 0) return false;

  const visited = new Set<string>();

  for (let i = 0; i < path.length; i++) {
    const cell = path[i];

    // Check bounds
    if (cell.r < 0 || cell.r >= gridSize || cell.c < 0 || cell.c >= gridSize) {
      return false;
    }

    const id = `r${cell.r}c${cell.c}`;
    if (visited.has(id)) {
      return false; // No duplicates allowed
    }
    visited.add(id);

    // Check adjacency
    if (i > 0) {
      const prev = path[i - 1];
      const dr = Math.abs(cell.r - prev.r);
      const dc = Math.abs(cell.c - prev.c);

      // Must be exactly adjacent (no diagonals, no disconnected)
      if (!((dr === 1 && dc === 0) || (dr === 0 && dc === 1))) {
        return false;
      }
    }
  }

  return true;
}

export function validateMemoryMazeAction(
  question: MemoryMazeQuestion,
  payload: MemoryMazeActionPayload
): boolean {
  if (payload.isTimeout) return false;

  // New action format (completed + keyCollected)
  if (payload.completed !== undefined) {
    return Boolean(payload.completed && payload.keyCollected);
  }

  // Legacy path format (if correctPath exists)
  if (payload.selectedPathIds && question.correctPath) {
    if (payload.selectedPathIds.length !== question.correctPath.length) {
      return false;
    }
    for (let i = 0; i < question.correctPath.length; i++) {
      if (payload.selectedPathIds[i] !== question.correctPath[i].id) {
        return false;
      }
    }
    return true;
  }

  return false;
}

