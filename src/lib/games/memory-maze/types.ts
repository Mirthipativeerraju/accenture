import { PracticeConfig } from "../core/types";

export type MemoryMazeDifficulty = "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";

export interface MemoryMazeConfig extends PracticeConfig {
  gridSize: number;
  pathLength: number;
  memorizationTimeMs: number;
  responseTimeMs: number;
  memoryMazeDifficulty: MemoryMazeDifficulty;
}

export interface CellCoordinate {
  r: number; // Row (0-indexed)
  c: number; // Column (0-indexed)
  id: string; // e.g. "r0c0"
}

export interface MemoryMazeQuestion {
  id: string;
  gridSize: number; // N x N grid
  pathLength: number;
  correctPath: CellCoordinate[]; // Ordered sequence of cells
}

export interface MemoryMazeState {
  questions: MemoryMazeQuestion[];
}

export interface MemoryMazeActionPayload {
  selectedPathIds: string[]; // Ordered list of selected cell IDs
  isTimeout: boolean;
}
