import { PracticeConfig } from "../core/types";

export type ArrowDirection = "UP" | "DOWN" | "LEFT" | "RIGHT" | "UP_RIGHT" | "DOWN_RIGHT" | "DOWN_LEFT" | "UP_LEFT";

export interface PathCell {
  r: number; // Row relative to block (0 to blockSize - 1)
  c: number; // Col relative to block (0 to blockSize - 1)
  active: boolean; // True if this is a path cell (gray with arrow)
  direction?: ArrowDirection; // Arrow direction
}

export interface GridBlock {
  blockRow: number; // Block row coordinate (0 to blockGridSize - 1)
  blockCol: number; // Block col coordinate (0 to blockGridSize - 1)
  size: number; // Cells per block dimension (e.g. 3)
  cells: PathCell[][]; // 2D array [r][c] of cells
  rotation: number; // Current rotation in degrees: 0, 90, 180, 270
}

export interface Endpoint {
  side: "TOP" | "BOTTOM" | "LEFT" | "RIGHT";
  index: number; // Global row or column index on the outer border
  type: "START" | "DESTINATION";
}

export interface PathFinderQuestion {
  id: string;
  blockGridSize: number; // Number of blocks per row/col (e.g. 3 for 3x3 blocks = 9x9 grid)
  blockSize: number; // Size of each block in cells (e.g. 3 for 3x3 cells per block)
  totalGridSize: number; // blockGridSize * blockSize (e.g. 9)
  blocks: GridBlock[][]; // [blockRow][blockCol]
  start: Endpoint;
  destination: Endpoint;
  initialRotations: number[][]; // [blockRow][blockCol] initial rotation
  solutionRotations: number[][]; // [blockRow][blockCol] solved rotation
}

export interface PathFinderState {
  questions: PathFinderQuestion[];
  currentQuestionIndex: number;
}

export interface PathFinderConfig extends PracticeConfig {
  blockGridSize?: number;
  blockSize?: number;
}

export interface PathFinderActionPayload {
  rotations: number[][]; // User's current block rotations [blockRow][blockCol]
  direction: "FORWARD" | "REVERSE";
  isTimeout: boolean;
  moves?: number;
}
