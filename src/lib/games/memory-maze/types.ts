import { PracticeConfig } from "../core/types";

export type MemoryMazeDifficulty = "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";

export type Direction = "up" | "down" | "left" | "right";

export interface Position {
  row: number;
  col: number;
}

export interface CellCoordinate {
  r: number; // Row (0-indexed)
  c: number; // Column (0-indexed)
  id: string; // e.g. "r0c0"
}

export interface HiddenWall {
  from: Position;
  direction: Direction;
}

export interface MemoryMazeDefinition {
  id: string;
  stageIdentifier?: string;
  gridDimensions?: { rows: number; cols: number };
  playerStartPosition: Position;
  keyPosition: Position;
  doorPosition: Position;
  timeLimitSeconds?: number;
  walls?: HiddenWall[];
}

export interface MemoryMazeQuestion {
  id: string;
  stageIdentifier?: string;
  gridSize: number;
  gridDimensions?: { rows: number; cols: number };
  playerStartPosition: Position;
  keyPosition: Position;
  key1Position?: Position;
  key2Position?: Position;
  keys?: Position[];
  doorPosition: Position;
  timeLimitSeconds?: number;
  pathLength?: number;
  correctPath?: CellCoordinate[];
  walls?: HiddenWall[];
  difficulty?: "EASY" | "MEDIUM" | "SOMEWHAT DIFFICULT" | "SOMEWHAT_DIFFICULT" | "DIFFICULT" | "HARD" | "VERY_HARD" | MemoryMazeDifficulty;
}

export type MemoryMazeStatus =
  | "ready"
  | "playing"
  | "keyCollected"
  | "openingDoor"
  | "success"
  | "timeout";

export interface MemoryMazeGameState {
  mazeId: string;
  playerPosition: Position;
  playerStartPosition: Position;
  keyPosition: Position;
  key1Position?: Position;
  key2Position?: Position;
  doorPosition: Position;
  keyCollected: boolean;
  key1Collected?: boolean;
  key2Collected?: boolean;
  visitedCells: Position[];
  status: MemoryMazeStatus;
  elapsedTimeMs: number;
  remainingTimeMs: number;
  movesCount: number;
  collisionDirection: Direction | null;
}

export interface MemoryMazeState {
  questions: MemoryMazeQuestion[];
  currentMazeState?: MemoryMazeGameState;
}

export interface MemoryMazeActionPayload {
  mazeId?: string;
  completed?: boolean;
  keyCollected?: boolean;
  key1Collected?: boolean;
  key2Collected?: boolean;
  movesCount?: number;
  path?: Position[];
  selectedPathIds?: string[];
  isTimeout: boolean;
}

export interface MemoryMazeConfig extends PracticeConfig {
  gridSize?: number;
  pathLength?: number;
  memorizationTimeMs?: number;
  responseTimeMs?: number;
  memoryMazeDifficulty?: MemoryMazeDifficulty;
  mazes?: MemoryMazeDefinition[];
}

export function isWallBetween(
  walls: HiddenWall[] | undefined,
  from: Position,
  dir: "UP" | "DOWN" | "LEFT" | "RIGHT" | "up" | "down" | "left" | "right"
): boolean {
  if (!walls || walls.length === 0) return false;
  const d = dir.toLowerCase() as Direction;

  let target: Position;
  if (d === "up") target = { row: from.row - 1, col: from.col };
  else if (d === "down") target = { row: from.row + 1, col: from.col };
  else if (d === "left") target = { row: from.row, col: from.col - 1 };
  else if (d === "right") target = { row: from.row, col: from.col + 1 };
  else return false;

  for (const wall of walls) {
    const wallDir = wall.direction.toLowerCase() as Direction;
    // Check direct match
    if (wall.from.row === from.row && wall.from.col === from.col && wallDir === d) {
      return true;
    }
    // Check opposite match from target
    const oppDir: Direction =
      wallDir === "up" ? "down" : wallDir === "down" ? "up" : wallDir === "left" ? "right" : "left";
    if (wall.from.row === target.row && wall.from.col === target.col && oppDir === d) {
      return true;
    }
  }

  return false;
}
