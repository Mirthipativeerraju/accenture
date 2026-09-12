import {
  ArrowDirection,
  RouteCell,
  PuzzleDefinition,
  TileState,
  TileType,
  TilePort,
  TileDefinition,
} from "./types";

// ============================================================================
// 1. O(1) DICTIONARY LOOKUPS (Replaces bulky math/switch statements)
// ============================================================================

export const CLOCKWISE_ARROW_ROTATION_MAP: Record<ArrowDirection, ArrowDirection> = {
  RIGHT: "DOWN",
  DOWN_RIGHT: "DOWN_LEFT",
  DOWN: "LEFT",
  DOWN_LEFT: "UP_LEFT",
  LEFT: "UP",
  UP_LEFT: "UP_RIGHT",
  UP: "RIGHT",
  UP_RIGHT: "DOWN_RIGHT",
};

export const DIRECTION_REVERSE_MAP: Record<ArrowDirection, ArrowDirection> = {
  RIGHT: "LEFT",
  DOWN_RIGHT: "UP_LEFT",
  DOWN: "UP",
  DOWN_LEFT: "UP_RIGHT",
  LEFT: "RIGHT",
  UP_LEFT: "DOWN_RIGHT",
  UP: "DOWN",
  UP_RIGHT: "DOWN_LEFT",
};

export const DIRECTION_ANGLE: Record<ArrowDirection, number> = {
  RIGHT: 0,
  DOWN_RIGHT: 45,
  DOWN: 90,
  DOWN_LEFT: 135,
  LEFT: 180,
  UP_LEFT: 225,
  UP: 270,
  UP_RIGHT: 315,
};

export const PORT_ROTATION: Record<TilePort, TilePort> = {
  TOP: "RIGHT",
  RIGHT: "BOTTOM",
  BOTTOM: "LEFT",
  LEFT: "TOP",
};

// ============================================================================
// 2. CORE ARROW & PORT LOGIC
// ============================================================================

export function rotateArrowDirection(
  direction: ArrowDirection,
  clockwiseQuarterTurns: number = 1
): ArrowDirection {
  const turns = ((clockwiseQuarterTurns % 8) + 8) % 8;
  let current = direction;
  for (let i = 0; i < turns; i++) {
    current = CLOCKWISE_ARROW_ROTATION_MAP[current] || current;
  }
  return current;
}

export function rotateArrow(dir: ArrowDirection, steps = 1): ArrowDirection {
  return rotateArrowDirection(dir, steps);
}

export function reverseArrow(dir: ArrowDirection): ArrowDirection {
  return DIRECTION_REVERSE_MAP[dir] || dir;
}

export function rotatePort(port: TilePort, clockwiseQuarterTurns: number = 1): TilePort {
  const turns = ((clockwiseQuarterTurns % 4) + 4) % 4;
  let p = port;
  for (let i = 0; i < turns; i++) {
    p = PORT_ROTATION[p];
  }
  return p;
}

// ============================================================================
// 3. PHYSICAL TILE ROTATION (Clean Recursion & Matrix Transposition)
// ============================================================================

export function rotateTile(cells: RouteCell[][], degrees: number = 90): RouteCell[][] {
  // Base case: Return exact copy if 0 or 360 degrees
  if (degrees % 360 === 0) {
    return cells.map((row) => row.map((cell) => ({ ...cell })));
  }

  const size = 3;
  const rotated: RouteCell[][] = [
    [{}, {}, {}],
    [{}, {}, {}],
    [{}, {}, {}],
  ];

  // Perform exactly one 90-degree clockwise transpose
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const oldCell = cells[r][c];
      const newR = c;
      const newC = size - 1 - r;

      if (oldCell.active) {
        rotated[newR][newC] = {
          active: true,
          arrowDirection: oldCell.arrowDirection
            ? rotateArrowDirection(oldCell.arrowDirection, 1)
            : undefined,
          connections: oldCell.connections
            ? {
                up: oldCell.connections.left,
                right: oldCell.connections.up,
                down: oldCell.connections.right,
                left: oldCell.connections.down,
              }
            : undefined,
        };
      } else {
        rotated[newR][newC] = { active: false };
      }
    }
  }

  // If we need to rotate 180 or 270, pass it back recursively
  if (degrees > 90) {
    return rotateTile(rotated, degrees - 90);
  }

  return rotated;
}

export function reverseTileDirection(cells: RouteCell[][]): RouteCell[][] {
  return cells.map((row) =>
    row.map((cell) => {
      if (!cell.active || !cell.arrowDirection) {
        return { ...cell };
      }
      return {
        ...cell,
        arrowDirection: reverseArrow(cell.arrowDirection),
        connections: cell.connections
          ? {
              up: cell.connections.down,
              right: cell.connections.left,
              down: cell.connections.up,
              left: cell.connections.right,
            }
          : undefined,
      };
    })
  );
}

// ============================================================================
// 4. GAME BOARD & GEOMETRY GENERATION
// ============================================================================

export function getBaseTileGeometry(
  type: TileType,
  flipped: boolean,
  mode: 0 | 1 | 2 | 3
): { cells: RouteCell[][]; ports: { enter: TilePort; exit: TilePort } } {
  const emptyRow = () => [{ active: false }, { active: false }, { active: false }];

  switch (type) {
    case "STRAIGHT": {
      if (!flipped) {
        return {
          ports: { enter: "LEFT", exit: "RIGHT" },
          cells: [
            emptyRow(),
            [
              { active: true, arrowDirection: "RIGHT" },
              { active: true, arrowDirection: "RIGHT" },
              { active: true, arrowDirection: "RIGHT" },
            ],
            emptyRow(),
          ],
        };
      } else {
        return {
          ports: { enter: "RIGHT", exit: "LEFT" },
          cells: [
            emptyRow(),
            [
              { active: true, arrowDirection: "LEFT" },
              { active: true, arrowDirection: "LEFT" },
              { active: true, arrowDirection: "LEFT" },
            ],
            emptyRow(),
          ],
        };
      }
    }

    case "CORNER": {
      if (!flipped) {
        return {
          ports: { enter: "LEFT", exit: "BOTTOM" },
          cells: [
            emptyRow(),
            [
              { active: true, arrowDirection: "RIGHT" },
              { active: true, arrowDirection: "DOWN_RIGHT" },
              { active: false },
            ],
            [
              { active: false },
              { active: true, arrowDirection: "DOWN" },
              { active: false },
            ],
          ],
        };
      } else {
        return {
          ports: { enter: "BOTTOM", exit: "LEFT" },
          cells: [
            emptyRow(),
            [
              { active: true, arrowDirection: "LEFT" },
              { active: true, arrowDirection: "UP_LEFT" },
              { active: false },
            ],
            [
              { active: false },
              { active: true, arrowDirection: "UP" },
              { active: false },
            ],
          ],
        };
      }
    }

    case "T_JUNCTION": {
      switch (mode) {
        case 0:
          return {
            ports: { enter: "TOP", exit: "LEFT" },
            cells: [
              [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
              [{ active: true, arrowDirection: "LEFT" }, { active: true, arrowDirection: "DOWN_LEFT" }, { active: false }],
              [{ active: false }, { active: true }, { active: false }],
            ],
          };
        case 1:
          return {
            ports: { enter: "BOTTOM", exit: "LEFT" },
            cells: [
              [{ active: false }, { active: true }, { active: false }],
              [{ active: true, arrowDirection: "LEFT" }, { active: true, arrowDirection: "UP_LEFT" }, { active: false }],
              [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
            ],
          };
        case 2:
          return {
            ports: { enter: "BOTTOM", exit: "TOP" },
            cells: [
              [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
              [{ active: true }, { active: true, arrowDirection: "UP" }, { active: false }],
              [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
            ],
          };
        case 3:
          return {
            ports: { enter: "LEFT", exit: "TOP" },
            cells: [
              [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
              [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "UP_RIGHT" }, { active: false }],
              [{ active: false }, { active: true }, { active: false }],
            ],
          };
      }
    }

    case "CROSS": {
      switch (mode) {
        case 0:
          return {
            ports: { enter: "LEFT", exit: "RIGHT" },
            cells: [
              [{ active: false }, { active: true }, { active: false }],
              [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "RIGHT" }],
              [{ active: false }, { active: true }, { active: false }],
            ],
          };
        case 1:
          return {
            ports: { enter: "TOP", exit: "BOTTOM" },
            cells: [
              [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
              [{ active: true }, { active: true, arrowDirection: "DOWN" }, { active: true }],
              [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
            ],
          };
        case 2:
          return {
            ports: { enter: "LEFT", exit: "TOP" },
            cells: [
              [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
              [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "UP_RIGHT" }, { active: true }],
              [{ active: false }, { active: true }, { active: false }],
            ],
          };
        case 3:
          return {
            ports: { enter: "LEFT", exit: "BOTTOM" },
            cells: [
              [{ active: false }, { active: true }, { active: false }],
              [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "DOWN_RIGHT" }, { active: true }],
              [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
            ],
          };
      }
    }
  }
}

export function normalizeRotation(rotation: number = 0): 0 | 1 | 2 | 3 {
  if (rotation === 90) return 1;
  if (rotation === 180) return 2;
  if (rotation === 270) return 3;
  return (((Math.round(rotation) % 4) + 4) % 4) as 0 | 1 | 2 | 3;
}

export function getEffectivePorts(
  tile: TileDefinition,
  state: TileState
): { enter: TilePort; exit: TilePort } {
  const normRotation = normalizeRotation(state.rotation);
  const type = tile.type || "STRAIGHT";
  const isFlipped = Boolean(state.flipped ?? state.directionReversed);
  const base = getBaseTileGeometry(type, isFlipped, state.mode ?? 0);

  return {
    enter: rotatePort(base.ports.enter, normRotation),
    exit: rotatePort(base.ports.exit, normRotation),
  };
}

export function getEffectiveTileCells(
  tile: TileDefinition,
  state: TileState
): RouteCell[][] {
  const normRotation = normalizeRotation(state.rotation);
  const isFlipped = Boolean(state.flipped ?? state.directionReversed);

  if (tile.type) {
    const base = getBaseTileGeometry(tile.type, isFlipped, state.mode ?? 0);
    return rotateTile(base.cells, normRotation * 90);
  }

  // Fallback for custom tile cells
  let cells = rotateTile(tile.cells, normRotation * 90);
  if (isFlipped) {
    cells = reverseTileDirection(cells);
  }
  return cells;
}

export function transformTile(baseCells: RouteCell[][], state: TileState): RouteCell[][] {
  const normRotation = normalizeRotation(state.rotation);
  const isFlipped = Boolean(state.flipped ?? state.directionReversed);
  let cells = rotateTile(baseCells, normRotation * 90);
  if (isFlipped) {
    cells = reverseTileDirection(cells);
  }
  return cells;
}

export function transformTileArrowState(
  cells: RouteCell[][],
  operation: "ROTATE_90" | "ROTATE_180" | "ROTATE_270" | "REVERSE_DIRECTION" | "CHANGE_DIRECTION"
): RouteCell[][] {
  switch (operation) {
    case "ROTATE_90":
      return rotateTile(cells, 90);
    case "ROTATE_180":
      return rotateTile(cells, 180);
    case "ROTATE_270":
      return rotateTile(cells, 270);
    case "REVERSE_DIRECTION":
    case "CHANGE_DIRECTION":
      return reverseTileDirection(cells);
    default:
      return cells.map((row) => row.map((cell) => ({ ...cell })));
  }
}

export function buildBoard(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): RouteCell[][] {
  const fullGrid: RouteCell[][] = Array.from({ length: puzzle.gridRows }, () =>
    Array.from({ length: puzzle.gridCols }, () => ({ active: false }))
  );

  for (const tile of puzzle.tiles) {
    const state = tileStates[tile.id] || { rotation: 0, flipped: false, mode: 0 };
    const transformed = getEffectiveTileCells(tile, state);
    const startRow = tile.gridRow * puzzle.tileSize;
    const startCol = tile.gridCol * puzzle.tileSize;

    for (let r = 0; r < puzzle.tileSize; r++) {
      for (let c = 0; c < puzzle.tileSize; c++) {
        fullGrid[startRow + r][startCol + c] = transformed[r][c];
      }
    }
  }

  return fullGrid;
}