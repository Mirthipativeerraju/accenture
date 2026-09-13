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
// 1. O(1) DICTIONARY LOOKUPS
// ============================================================================

export const CLOCKWISE_ARROW_ROTATION_MAP: Record<
  ArrowDirection,
  ArrowDirection
> = {
  RIGHT: "DOWN",
  DOWN_RIGHT: "DOWN_LEFT",
  DOWN: "LEFT",
  DOWN_LEFT: "UP_LEFT",
  LEFT: "UP",
  UP_LEFT: "UP_RIGHT",
  UP: "RIGHT",
  UP_RIGHT: "DOWN_RIGHT",
};

export const DIRECTION_REVERSE_MAP: Record<
  ArrowDirection,
  ArrowDirection
> = {
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
  const turns = ((clockwiseQuarterTurns % 4) + 4) % 4;

  let current = direction;

  for (let i = 0; i < turns; i++) {
    current = CLOCKWISE_ARROW_ROTATION_MAP[current] || current;
  }

  return current;
}

export function rotateArrow(
  dir: ArrowDirection,
  steps = 1
): ArrowDirection {
  return rotateArrowDirection(dir, steps);
}

export function reverseArrow(
  dir: ArrowDirection
): ArrowDirection {
  return DIRECTION_REVERSE_MAP[dir] || dir;
}

export function rotatePort(
  port: TilePort,
  clockwiseQuarterTurns: number = 1
): TilePort {
  const turns = ((clockwiseQuarterTurns % 4) + 4) % 4;

  let p = port;

  for (let i = 0; i < turns; i++) {
    p = PORT_ROTATION[p];
  }

  return p;
}

// ============================================================================
// CANONICAL FLIP / DIRECTION STATE COUNTS
// ============================================================================

export const SHAPE_FLIP_STATES_COUNT: Record<TileType, number> = {
  STRAIGHT: 2,
  CORNER: 2,
  T_JUNCTION: 6,
  CROSS: 12,
};

export function getTileFlipState(
  type: TileType,
  state: TileState
): number {
  const max = SHAPE_FLIP_STATES_COUNT[type] || 2;

  if (state.flipState !== undefined) {
    return ((state.flipState % max) + max) % max;
  }

  if (state.mode !== undefined) {
    return ((state.mode % max) + max) % max;
  }

  if (state.flipped !== undefined) {
    return state.flipped ? 1 : 0;
  }

  // directionReversed is deliberately NOT used here.
  // It is a separate transformation from flipState.
  return 0;
}

// ============================================================================
// 3. PHYSICAL TILE ROTATION
// ============================================================================

export function rotateTile(
  cells: RouteCell[][],
  degrees: number = 90
): RouteCell[][] {
  const rotSteps =
    ((Math.round(degrees / 90) % 4) + 4) % 4;

  if (rotSteps === 0) {
    return cells.map((row) =>
      row.map((cell) => ({ ...cell }))
    );
  }

  const size = 3;

  let current: RouteCell[][] = cells.map((row) =>
    row.map((cell) => ({ ...cell }))
  );

  for (let s = 0; s < rotSteps; s++) {
    const rotated: RouteCell[][] = Array.from(
      { length: size },
      () =>
        Array.from(
          { length: size },
          () => ({ active: false })
        )
    );

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const oldCell = current[r][c];

        const newR = c;
        const newC = size - 1 - r;

        if (oldCell.active) {
          rotated[newR][newC] = {
            active: true,

            arrowDirection: oldCell.arrowDirection
              ? rotateArrowDirection(
                  oldCell.arrowDirection,
                  1
                )
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
          rotated[newR][newC] = {
            active: false,
          };
        }
      }
    }

    current = rotated;
  }

  return current;
}

// ============================================================================
// 4. DIRECTION REVERSAL
// ============================================================================

/**
 * Reverses every non-null arrow.
 *
 * IMPORTANT:
 * - Active-cell positions DO NOT move.
 * - Null-arrow active cells remain unchanged.
 * - Only arrow direction is reversed.
 */
export function reverseTileDirection(
  cells: RouteCell[][]
): RouteCell[][] {
  return cells.map((row) =>
    row.map((cell) => {
      if (!cell.active) {
        return {
          active: false,
        };
      }

      if (!cell.arrowDirection) {
        return {
          active: true,
          connections: cell.connections
            ? { ...cell.connections }
            : undefined,
        };
      }

      return {
        active: true,

        arrowDirection: reverseArrow(
          cell.arrowDirection
        ),

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
// 5. CANONICAL PREDEFINED TILE GEOMETRIES
//
// STRAIGHT    = 2
// CORNER      = 2
// T_JUNCTION  = 6
// CROSS       = 12
// ============================================================================

export function getBaseTileGeometry(
  type: TileType,
  flipStateOrFlipped: number | boolean = 0,
  legacyMode?: number
): {
  cells: RouteCell[][];
  ports: {
    enter: TilePort;
    exit: TilePort;
  };
} {
  let flipState = 0;

  if (typeof flipStateOrFlipped === "number") {
    flipState = flipStateOrFlipped;
  } else if (typeof legacyMode === "number") {
    flipState = legacyMode;
  } else if (flipStateOrFlipped === true) {
    flipState = 1;
  }

  const emptyGrid = (): RouteCell[][] => [
    [
      { active: false },
      { active: false },
      { active: false },
    ],
    [
      { active: false },
      { active: false },
      { active: false },
    ],
    [
      { active: false },
      { active: false },
      { active: false },
    ],
  ];

  switch (type) {
    // ========================================================================
    // STRAIGHT
    // ========================================================================

    case "STRAIGHT": {
      const mode = ((flipState % 2) + 2) % 2;
      const grid = emptyGrid();

      if (mode === 0) {
        // STATE 0:
        // . . .
        // ← ← ←
        // . . .

        grid[1][0] = {
          active: true,
          arrowDirection: "LEFT",
        };

        grid[1][1] = {
          active: true,
          arrowDirection: "LEFT",
        };

        grid[1][2] = {
          active: true,
          arrowDirection: "LEFT",
        };

        return {
          ports: {
            enter: "RIGHT",
            exit: "LEFT",
          },
          cells: grid,
        };
      }

      // STATE 1:
      // . . .
      // → → →
      // . . .

      grid[1][0] = {
        active: true,
        arrowDirection: "RIGHT",
      };

      grid[1][1] = {
        active: true,
        arrowDirection: "RIGHT",
      };

      grid[1][2] = {
        active: true,
        arrowDirection: "RIGHT",
      };

      return {
        ports: {
          enter: "LEFT",
          exit: "RIGHT",
        },
        cells: grid,
      };
    }

    // ========================================================================
    // CORNER
    // ========================================================================

    case "CORNER": {
      const mode = ((flipState % 2) + 2) % 2;
      const grid = emptyGrid();

      if (mode === 0) {
        // STATE 0:
        // . ↑ .
        // . ↖ ←
        // . . .

        grid[0][1] = {
          active: true,
          arrowDirection: "UP",
        };

        grid[1][1] = {
          active: true,
          arrowDirection: "UP_LEFT",
        };

        grid[1][2] = {
          active: true,
          arrowDirection: "LEFT",
        };

        return {
          ports: {
            enter: "RIGHT",
            exit: "TOP",
          },
          cells: grid,
        };
      }

      // STATE 1:
      // . ↓ .
      // . ↘ →
      // . . .

      grid[0][1] = {
        active: true,
        arrowDirection: "DOWN",
      };

      grid[1][1] = {
        active: true,
        arrowDirection: "DOWN_RIGHT",
      };

      grid[1][2] = {
        active: true,
        arrowDirection: "RIGHT",
      };

      return {
        ports: {
          enter: "TOP",
          exit: "RIGHT",
        },
        cells: grid,
      };
    }

    // ========================================================================
    // T-JUNCTION
    // ========================================================================

    case "T_JUNCTION": {
      const T_JUNCTION_STATE_ORDER = [0, 3, 1, 4, 2, 5];

const mode =
  T_JUNCTION_STATE_ORDER[
    ((flipState % 6) + 6) % 6
  ];
      const grid = emptyGrid();

      switch (mode) {
        case 0:
          // .  ↑  .
          // -  ↖  ←
          // .  .  .

          grid[0][1] = {
            active: true,
            arrowDirection: "UP",
          };

          grid[1][0] = {
            active: true,
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "UP_LEFT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "LEFT",
          };

          return {
            ports: {
              enter: "RIGHT",
              exit: "TOP",
            },
            cells: grid,
          };

        case 1:
          // .  ↑  .
          // →  ↗  -
          // .  .  .

          grid[0][1] = {
            active: true,
            arrowDirection: "UP",
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "UP_RIGHT",
          };

          grid[1][2] = {
            active: true,
          };

          return {
            ports: {
              enter: "LEFT",
              exit: "TOP",
            },
            cells: grid,
          };

        case 2:
          // .  -  .
          // →  →  →
          // .  .  .

          grid[0][1] = {
            active: true,
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          return {
            ports: {
              enter: "LEFT",
              exit: "RIGHT",
            },
            cells: grid,
          };

        case 3:
          // .  ↓  .
          // -  ↘  →
          // .  .  .

          grid[0][1] = {
            active: true,
            arrowDirection: "DOWN",
          };

          grid[1][0] = {
            active: true,
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "DOWN_RIGHT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          return {
            ports: {
              enter: "TOP",
              exit: "RIGHT",
            },
            cells: grid,
          };

        case 4:
          // .  ↓  .
          // ←  ↙  -
          // .  .  .

          grid[0][1] = {
            active: true,
            arrowDirection: "DOWN",
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "DOWN_LEFT",
          };

          grid[1][2] = {
            active: true,
          };

          return {
            ports: {
              enter: "TOP",
              exit: "LEFT",
            },
            cells: grid,
          };

        case 5:
        default:
          // .  -  .
          // ←  ←  ←
          // .  .  .

          grid[0][1] = {
            active: true,
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "LEFT",
          };

          return {
            ports: {
              enter: "RIGHT",
              exit: "LEFT",
            },
            cells: grid,
          };
      }
    }

    // ========================================================================
    // CROSS / PLUS
    //
    // 12 STATES:
    //
    // 0 = UP straight
    // 1 = RIGHT straight
    // 2 = DOWN straight
    // 3 = LEFT straight
    //
    // 4-11 = 8 curve directions
    // ========================================================================

    case "CROSS": {
      const CROSS_STATE_ORDER = [
  0, 2,
  1, 3,
  4, 8,
  5, 10,
  6, 11,
  7, 9,
];

const mode =
  CROSS_STATE_ORDER[
    ((flipState % 12) + 12) % 12
  ];
      const grid = emptyGrid();

      switch (mode) {
        // ====================================================================
        // STRAIGHT 1/4
        // ====================================================================

        case 0:
          // PLUS STATE 0
          //
          // .  ↑  .
          // -  ↑  -
          // .  ↑  .

          grid[0][1] = {
            active: true,
            arrowDirection: "UP",
          };

          grid[1][0] = {
            active: true,
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "UP",
          };

          grid[1][2] = {
            active: true,
          };

          grid[2][1] = {
            active: true,
            arrowDirection: "UP",
          };

          return {
            ports: {
              enter: "BOTTOM",
              exit: "TOP",
            },
            cells: grid,
          };

        // ====================================================================
        // STRAIGHT 2/4
        // ====================================================================

        case 1:
          // PLUS STATE 1
          //
          // .  -  .
          // →  →  →
          // .  -  .

          grid[0][1] = {
            active: true,
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[2][1] = {
            active: true,
          };

          return {
            ports: {
              enter: "LEFT",
              exit: "RIGHT",
            },
            cells: grid,
          };

        // ====================================================================
        // STRAIGHT 3/4
        // ====================================================================

        case 2:
          // PLUS STATE 2
          //
          // .  ↓  .
          // -  ↓  -
          // .  ↓  .

          grid[0][1] = {
            active: true,
            arrowDirection: "DOWN",
          };

          grid[1][0] = {
            active: true,
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "DOWN",
          };

          grid[1][2] = {
            active: true,
          };

          grid[2][1] = {
            active: true,
            arrowDirection: "DOWN",
          };

          return {
            ports: {
              enter: "TOP",
              exit: "BOTTOM",
            },
            cells: grid,
          };

        // ====================================================================
        // STRAIGHT 4/4
        // ====================================================================

        case 3:
          // PLUS STATE 3
          //
          // .  -  .
          // ←  ←  ←
          // .  -  .

          grid[0][1] = {
            active: true,
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[2][1] = {
            active: true,
          };

          return {
            ports: {
              enter: "RIGHT",
              exit: "LEFT",
            },
            cells: grid,
          };

        // ====================================================================
        // CURVE 1
        // LEFT -> TOP
        // ====================================================================

        case 4:
          // PLUS STATE 4
          //
          // .  ↑  .
          // →  ↗  -
          // .  -  .

          grid[0][1] = {
            active: true,
            arrowDirection: "UP",
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "UP_RIGHT",
          };

          grid[1][2] = {
            active: true,
          };

          grid[2][1] = {
            active: true,
          };

          return {
            ports: {
              enter: "LEFT",
              exit: "TOP",
            },
            cells: grid,
          };

        // ====================================================================
        // CURVE 2
        // TOP -> RIGHT
        // ====================================================================

        case 5:
          // PLUS STATE 5
          //
          // .  ↓  .
          // -  ↘  →
          // .  -  .

          grid[0][1] = {
            active: true,
            arrowDirection: "DOWN",
          };

          grid[1][0] = {
            active: true,
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "DOWN_RIGHT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[2][1] = {
            active: true,
          };

          return {
            ports: {
              enter: "TOP",
              exit: "RIGHT",
            },
            cells: grid,
          };

        // ====================================================================
        // CURVE 3
        // RIGHT -> BOTTOM
        // ====================================================================

        case 6:
          // PLUS STATE 6
          //
          // .  -  .
          // -  ↙  ←
          // .  ↓  .

          grid[0][1] = {
            active: true,
          };

          grid[1][0] = {
            active: true,
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "DOWN_LEFT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[2][1] = {
            active: true,
            arrowDirection: "DOWN",
          };

          return {
            ports: {
              enter: "RIGHT",
              exit: "BOTTOM",
            },
            cells: grid,
          };

        // ====================================================================
        // CURVE 4
        // BOTTOM -> LEFT
        // ====================================================================

        case 7:
          // PLUS STATE 7
          //
          // .  -  .
          // ←  ↖  -
          // .  ↑  .

          grid[0][1] = {
            active: true,
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "UP_LEFT",
          };

          grid[1][2] = {
            active: true,
          };

          grid[2][1] = {
            active: true,
            arrowDirection: "UP",
          };

          return {
            ports: {
              enter: "BOTTOM",
              exit: "LEFT",
            },
            cells: grid,
          };

        // ====================================================================
        // CURVE 5
        // TOP -> LEFT
        // ====================================================================

        case 8:
          // PLUS STATE 8
          //
          // .  ↓  .
          // ←  ↙  -
          // .  -  .

          grid[0][1] = {
            active: true,
            arrowDirection: "DOWN",
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "DOWN_LEFT",
          };

          grid[1][2] = {
            active: true,
          };

          grid[2][1] = {
            active: true,
          };

          return {
            ports: {
              enter: "TOP",
              exit: "LEFT",
            },
            cells: grid,
          };

        // ====================================================================
        // CURVE 6
        // RIGHT -> TOP
        // ====================================================================

        case 9:
          // PLUS STATE 9
          //
          // .  ↑  .
          // -  ↖  ←
          // .  -  .

          grid[0][1] = {
            active: true,
            arrowDirection: "UP",
          };

          grid[1][0] = {
            active: true,
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "UP_LEFT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "LEFT",
          };

          grid[2][1] = {
            active: true,
          };

          return {
            ports: {
              enter: "RIGHT",
              exit: "TOP",
            },
            cells: grid,
          };

        // ====================================================================
        // CURVE 7
        // BOTTOM -> RIGHT
        // ====================================================================

        case 10:
          // PLUS STATE 10
          //
          // .  -  .
          // -  ↗  →
          // .  ↑  .

          grid[0][1] = {
            active: true,
          };

          grid[1][0] = {
            active: true,
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "UP_RIGHT",
          };

          grid[1][2] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[2][1] = {
            active: true,
            arrowDirection: "UP",
          };

          return {
            ports: {
              enter: "BOTTOM",
              exit: "RIGHT",
            },
            cells: grid,
          };

        // ====================================================================
        // CURVE 8
        // LEFT -> BOTTOM
        // ====================================================================

        case 11:
        default:
          // PLUS STATE 11
          //
          // .  -  .
          // →  ↘  -
          // .  ↓  .

          grid[0][1] = {
            active: true,
          };

          grid[1][0] = {
            active: true,
            arrowDirection: "RIGHT",
          };

          grid[1][1] = {
            active: true,
            arrowDirection: "DOWN_RIGHT",
          };

          grid[1][2] = {
            active: true,
          };

          grid[2][1] = {
            active: true,
            arrowDirection: "DOWN",
          };

          return {
            ports: {
              enter: "LEFT",
              exit: "BOTTOM",
            },
            cells: grid,
          };
      }
    }

    default: {
      const grid = emptyGrid();

      return {
        ports: {
          enter: "LEFT",
          exit: "RIGHT",
        },
        cells: grid,
      };
    }
  }
}

// ============================================================================
// 6. ROTATION NORMALIZATION
// ============================================================================

export function normalizeRotation(
  rotation: number = 0
): 0 | 1 | 2 | 3 {
  if (rotation === 90) return 1;
  if (rotation === 180) return 2;
  if (rotation === 270) return 3;

  return (
    ((Math.round(rotation) % 4) + 4) % 4
  ) as 0 | 1 | 2 | 3;
}

// ============================================================================
// 7. EFFECTIVE PORTS
// ============================================================================

export function getEffectivePorts(
  tile: TileDefinition,
  state: TileState
): {
  enter: TilePort;
  exit: TilePort;
} {
  const normRotation = normalizeRotation(
    state.rotation
  );

  const type = tile.type || "STRAIGHT";

  const flipState = getTileFlipState(
    type,
    state
  );

  const base = getBaseTileGeometry(
    type,
    flipState
  );

  let enter = rotatePort(
    base.ports.enter,
    normRotation
  );

  let exit = rotatePort(
    base.ports.exit,
    normRotation
  );

  // Changing direction reverses the route.
  // Therefore enter and exit must also swap.
  if (state.directionReversed === true) {
    const temp = enter;
    enter = exit;
    exit = temp;
  }

  return {
    enter,
    exit,
  };
}

// ============================================================================
// 8. EFFECTIVE TILE CELLS
// ============================================================================

export function getEffectiveTileCells(
  tile: TileDefinition,
  state: TileState
): RouteCell[][] {
  const normRotation = normalizeRotation(
    state.rotation
  );

  const type = tile.type || "STRAIGHT";

  let cells: RouteCell[][];

  if (tile.type) {
    const flipState = getTileFlipState(
      type,
      state
    );

    const base = getBaseTileGeometry(
      type,
      flipState
    );

    cells = base.cells.map((row) =>
      row.map((cell) => ({
        ...cell,
      }))
    );
  } else {
    cells = tile.cells.map((row) =>
      row.map((cell) => ({
        ...cell,
      }))
    );
  }

  // ----------------------------------------------------------
  // 1. Physical rotation
  // ----------------------------------------------------------

  if (normRotation !== 0) {
    cells = rotateTile(
      cells,
      normRotation * 90
    );
  }

  // ----------------------------------------------------------
  // 2. Direction reversal
  //
  // IMPORTANT:
  // This happens AFTER physical rotation.
  //
  // It reverses:
  // RIGHT      <-> LEFT
  // UP         <-> DOWN
  // UP_RIGHT   <-> DOWN_LEFT
  // DOWN_RIGHT <-> UP_LEFT
  //
  // Cell positions remain unchanged.
  // ----------------------------------------------------------

  if (state.directionReversed === true) {
    cells = reverseTileDirection(cells);
  }

  return cells;
}

// ============================================================================
// 9. GENERIC TILE TRANSFORMATION
// ============================================================================

export function transformTile(
  baseCells: RouteCell[][],
  state: TileState
): RouteCell[][] {
  const normRotation = normalizeRotation(
    state.rotation
  );

  let cells = baseCells.map((row) =>
    row.map((cell) => ({
      ...cell,
    }))
  );

  // Physical rotation
  if (normRotation !== 0) {
    cells = rotateTile(
      cells,
      normRotation * 90
    );
  }

  // Separate route-direction reversal
  if (state.directionReversed === true) {
    cells = reverseTileDirection(cells);
  }

  return cells;
}

// ============================================================================
// 10. ARROW STATE TRANSFORMATION
// ============================================================================

export function transformTileArrowState(
  cells: RouteCell[][],
  operation:
    | "ROTATE_90"
    | "ROTATE_180"
    | "ROTATE_270"
    | "REVERSE_DIRECTION"
    | "CHANGE_DIRECTION"
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
      return cells.map((row) =>
        row.map((cell) => ({
          ...cell,
        }))
      );
  }
}

// ============================================================================
// 11. BOARD BUILDER
// ============================================================================

export function buildBoard(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): RouteCell[][] {
  const fullGrid: RouteCell[][] =
    Array.from(
      {
        length: puzzle.gridRows,
      },
      () =>
        Array.from(
          {
            length: puzzle.gridCols,
          },
          () => ({
            active: false,
          })
        )
    );

  for (const tile of puzzle.tiles) {
    const state =
      tileStates[tile.id] || {
        rotation: 0,
        flipped: false,
        mode: 0,
        directionReversed: false,
      };

    const transformed =
      getEffectiveTileCells(
        tile,
        state
      );

    const startRow =
      tile.gridRow * puzzle.tileSize;

    const startCol =
      tile.gridCol * puzzle.tileSize;

    for (
      let r = 0;
      r < puzzle.tileSize;
      r++
    ) {
      for (
        let c = 0;
        c < puzzle.tileSize;
        c++
      ) {
        fullGrid[
          startRow + r
        ][
          startCol + c
        ] = transformed[r][c];
      }
    }
  }

  return fullGrid;
}