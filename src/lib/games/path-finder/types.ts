export const GRID_SIZE = 9;
export const BLOCK_SIZE = 3;
export const CELL_SIZE = 42;
export const INITIAL_TIME = 240;

export type ArrowDirection =
  | "RIGHT"
  | "DOWN_RIGHT"
  | "DOWN"
  | "DOWN_LEFT"
  | "LEFT"
  | "UP_LEFT"
  | "UP"
  | "UP_RIGHT";

export interface RouteCell {
  active: boolean;
  arrowDirection?: ArrowDirection;
  connections?: {
    up: boolean;
    right: boolean;
    down: boolean;
    left: boolean;
  };
}

export type CellData = RouteCell;

export type TileType = "STRAIGHT" | "CORNER" | "T_JUNCTION" | "CROSS";

export type TilePort = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";

export interface TileDefinition {
  id: string;
  gridRow: number; // 0, 1, 2 for 3x3 tile grid
  gridCol: number; // 0, 1, 2
  type?: TileType;
  cells: RouteCell[][]; // 3x3 array of cells
}

export interface TileState {
  rotation: 0 | 1 | 2 | 3; // 0=0°, 1=90°, 2=180°, 3=270° (rotateState)
  flipped?: boolean;
  directionReversed?: boolean;
  mode?: number; // flipState: 0..1 for STRAIGHT/CORNER, 0..5 for T_JUNCTION, 0..7 for CROSS
  flipState?: number; // alias for mode
}

export interface MoveOperation {
  tileId: string;
  operation: "ROTATE" | "FLIP";
}

export interface PuzzleDefinition {
  id: string;
  gridRows: number; // 9
  gridCols: number; // 9
  tileRows: number; // 3
  tileCols: number; // 3
  tileSize: number; // 3
  startPos: { row: number; col: number; entrySide: "LEFT" | "TOP" | "RIGHT" | "BOTTOM" };
  destinationPos: { row: number; col: number; exitSide: "LEFT" | "TOP" | "RIGHT" | "BOTTOM" };
  tiles: TileDefinition[];
  initialTileStates: Record<string, TileState>;
  solution?: {
    minMoves: number;
    tileStates: Record<string, TileState>;
    solutionMoves?: MoveOperation[];
    solutionPath?: { r: number; c: number }[];
  };
}

