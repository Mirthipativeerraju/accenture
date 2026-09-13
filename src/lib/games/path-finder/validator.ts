import {
  ArrowDirection,
  RouteCell,
  PuzzleDefinition,
  TileState,
  TilePort,
} from "./types";

import {
  buildBoard,
  getEffectivePorts,
  getEffectiveTileCells,
} from "./transformations";

// ============================================================================
// DIRECTION VECTORS
// ============================================================================

export const DIRECTION_VECTORS: Record<
  ArrowDirection,
  { dr: number; dc: number }
> = {
  RIGHT: { dr: 0, dc: 1 },
  DOWN_RIGHT: { dr: 1, dc: 1 },
  DOWN: { dr: 1, dc: 0 },
  DOWN_LEFT: { dr: 1, dc: -1 },
  LEFT: { dr: 0, dc: -1 },
  UP_LEFT: { dr: -1, dc: -1 },
  UP: { dr: -1, dc: 0 },
  UP_RIGHT: { dr: -1, dc: 1 },
};

// ============================================================================
// DIRECTION ANGLES
// ============================================================================

export const DIRECTION_ANGLES: Record<
  ArrowDirection,
  number
> = {
  RIGHT: 0,
  DOWN_RIGHT: 45,
  DOWN: 90,
  DOWN_LEFT: 135,
  LEFT: 180,
  UP_LEFT: 225,
  UP: 270,
  UP_RIGHT: 315,
};

// ============================================================================
// FIND NEXT ACTIVE CELL IN ARROW DIRECTION
// ============================================================================
//
// Used by the fallback/custom-matrix validator.
//
// IMPORTANT:
// This function is NOT used to construct the typed 3x3 tile animation path.
// Typed tiles use their enter/center/exit geometry instead.
// ============================================================================

export function getNextActiveCellInDirection(
  grid: RouteCell[][],
  currentR: number,
  currentC: number,
  dir?: ArrowDirection,
  prevR: number | null = null,
  prevC: number | null = null
): { nextR: number; nextC: number } | null {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  let dr = 0;
  let dc = 0;

  if (dir) {
    const vec = DIRECTION_VECTORS[dir];

    if (!vec) {
      return null;
    }

    dr = vec.dr;
    dc = vec.dc;
  } else if (
    prevR !== null &&
    prevC !== null
  ) {
    const rawDr = currentR - prevR;
    const rawDc = currentC - prevC;

    dr =
      rawDr === 0
        ? 0
        : rawDr > 0
          ? 1
          : -1;

    dc =
      rawDc === 0
        ? 0
        : rawDc > 0
          ? 1
          : -1;
  } else {
    dr = 0;
    dc = 1;
  }

  if (dr === 0 && dc === 0) {
    return null;
  }

  let r = currentR + dr;
  let c = currentC + dc;

  while (
    r >= 0 &&
    r < rows &&
    c >= 0 &&
    c < cols
  ) {
    if (
      grid[r]?.[c] &&
      grid[r][c].active
    ) {
      return {
        nextR: r,
        nextC: c,
      };
    }

    r += dr;
    c += dc;
  }

  return null;
}

// ============================================================================
// TILE PORT -> LOCAL 3x3 CELL
// ============================================================================
//
// Every tile is 3x3.
//
// The four connection points are:
//
//             TOP
//              ↓
//          [0,1]
//
// LEFT → [1,0] [1,1] [1,2] ← RIGHT
//
//          [2,1]
//              ↑
//           BOTTOM
//
// The center of every tile is [1,1].
// ============================================================================

function getPortLocalCell(
  port: TilePort
): { r: number; c: number } {
  switch (port) {
    case "TOP":
      return {
        r: 0,
        c: 1,
      };

    case "RIGHT":
      return {
        r: 1,
        c: 2,
      };

    case "BOTTOM":
      return {
        r: 2,
        c: 1,
      };

    case "LEFT":
    default:
      return {
        r: 1,
        c: 0,
      };
  }
}

// ============================================================================
// LOCAL CELL -> GLOBAL CELL
// ============================================================================

function localToGlobalCell(
  tileRow: number,
  tileCol: number,
  localCell: { r: number; c: number },
  tileSize: number
): { r: number; c: number } {
  return {
    r:
      tileRow * tileSize +
      localCell.r,

    c:
      tileCol * tileSize +
      localCell.c,
  };
}

// ============================================================================
// BUILD THE REAL VISUAL PATH THROUGH A TILE
// ============================================================================
//
// This is the most important part of the animation.
//
// A tile is NOT animated by scanning all active cells.
//
// Instead:
//
//     ENTER PORT
//          ↓
//        CENTER
//          ↓
//      EXIT PORT
//
// Examples:
//
// LEFT -> RIGHT:
//
//     ● → ● → ●
//
// LEFT -> TOP:
//
//     ● → ●
//         ↑
//         ●
//
// LEFT -> BOTTOM:
//
//     ● → ●
//         ↓
//         ●
//
// The diagonal arrow displayed at the center of a curve describes the
// curve, but the rocket physically travels through the center cell.
// ============================================================================

function getTileTraversalPath(
  tileRow: number,
  tileCol: number,
  enterPort: TilePort,
  exitPort: TilePort,
  tileSize: number
): {
  r: number;
  c: number;
}[] {
  const enterLocal =
    getPortLocalCell(enterPort);

  const exitLocal =
    getPortLocalCell(exitPort);

  const centerLocal = {
    r: 1,
    c: 1,
  };

  const enterGlobal =
    localToGlobalCell(
      tileRow,
      tileCol,
      enterLocal,
      tileSize
    );

  const centerGlobal =
    localToGlobalCell(
      tileRow,
      tileCol,
      centerLocal,
      tileSize
    );

  const exitGlobal =
    localToGlobalCell(
      tileRow,
      tileCol,
      exitLocal,
      tileSize
    );

  return [
    enterGlobal,
    centerGlobal,
    exitGlobal,
  ];
}

// ============================================================================
// TYPED TILE ROUTE VALIDATION
// ============================================================================
//
// This validator:
//
// 1. Starts at the left starting icon.
// 2. Enters the first tile.
// 3. Checks the tile's effective enter port.
// 4. Traverses:
//
//        ENTER -> CENTER -> EXIT
//
// 5. Moves to the adjacent tile.
// 6. Repeats.
// 7. Reaches the destination only when the final tile exits through the
//    destination side.
//
// visitedPath is now the REAL visual rocket path.
// ============================================================================

export function validateTileRoute(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): {
  isValid: boolean;
  visitedTiles: string[];
  visitedPath: {
    r: number;
    c: number;
  }[];
} {
  const tileSize =
    puzzle.tileSize || 3;

  // --------------------------------------------------------------------------
  // Determine starting tile from start position.
  // --------------------------------------------------------------------------

  let currentTileRow =
    Math.floor(
      puzzle.startPos.row /
        tileSize
    );

  let currentTileCol =
    Math.floor(
      puzzle.startPos.col /
        tileSize
    );

  const destinationTileRow =
    Math.floor(
      puzzle.destinationPos.row /
        tileSize
    );

  const destinationTileCol =
    Math.floor(
      puzzle.destinationPos.col /
        tileSize
    );

  // --------------------------------------------------------------------------
  // Starting connection side.
  // --------------------------------------------------------------------------

  let currentEnterPort: TilePort =
    puzzle.startPos.entrySide ||
    "LEFT";

  // --------------------------------------------------------------------------
  // Result containers.
  // --------------------------------------------------------------------------

  const visitedTiles: string[] = [];

  const visitedSet =
    new Set<string>();

  const visitedPath: {
    r: number;
    c: number;
  }[] = [];

  // --------------------------------------------------------------------------
  // Safety limit.
  // --------------------------------------------------------------------------

  const maxSteps =
    puzzle.tileRows *
      puzzle.tileCols +
    1;

  let steps = 0;

  // ==========================================================================
  // FOLLOW TILE ROUTE
  // ==========================================================================

  while (
    steps < maxSteps
  ) {
    // ------------------------------------------------------------------------
    // Board bounds.
    // ------------------------------------------------------------------------

    if (
      currentTileRow < 0 ||
      currentTileRow >=
        puzzle.tileRows ||
      currentTileCol < 0 ||
      currentTileCol >=
        puzzle.tileCols
    ) {
      break;
    }

    // ------------------------------------------------------------------------
    // Find tile.
    // ------------------------------------------------------------------------

    const tile =
      puzzle.tiles.find(
        (t) =>
          t.gridRow ===
            currentTileRow &&
          t.gridCol ===
            currentTileCol
      );

    if (!tile) {
      break;
    }

    // ------------------------------------------------------------------------
    // Cycle detection.
    // ------------------------------------------------------------------------

    const tileKey =
      `${currentTileRow},${currentTileCol}`;

    if (
      visitedSet.has(tileKey)
    ) {
      // Route entered the same tile twice.
      break;
    }

    visitedSet.add(tileKey);
    visitedTiles.push(tile.id);

    // ------------------------------------------------------------------------
    // Get current tile state.
    // ------------------------------------------------------------------------

    const state =
      tileStates[tile.id] || {
        rotation: 0,
        flipped: false,
        mode: 0,
      };

    // ------------------------------------------------------------------------
    // Get effective geometry.
    //
    // IMPORTANT:
    // getEffectivePorts() and getEffectiveTileCells() use the same
    // transformation state.
    // ------------------------------------------------------------------------

    const effectivePorts =
      getEffectivePorts(
        tile,
        state
      );

    const effectiveCells =
      getEffectiveTileCells(
        tile,
        state
      );

    // ------------------------------------------------------------------------
    // Verify incoming connection.
    // ------------------------------------------------------------------------

    if (
      effectivePorts.enter !==
      currentEnterPort
    ) {
      // Broken connection.
      break;
    }

    // ------------------------------------------------------------------------
    // Verify that the effective tile actually has the required connection
    // cells.
    // ------------------------------------------------------------------------

    const enterLocal =
      getPortLocalCell(
        effectivePorts.enter
      );

    const exitLocal =
      getPortLocalCell(
        effectivePorts.exit
      );

    const centerLocal = {
      r: 1,
      c: 1,
    };

    const enterCell =
      effectiveCells[
        enterLocal.r
      ]?.[
        enterLocal.c
      ];

    const centerCell =
      effectiveCells[
        centerLocal.r
      ]?.[
        centerLocal.c
      ];

    const exitCell =
      effectiveCells[
        exitLocal.r
      ]?.[
        exitLocal.c
      ];

    if (
      !enterCell?.active ||
      !centerCell?.active ||
      !exitCell?.active
    ) {
      // The tile geometry is incomplete.
      break;
    }

    // ------------------------------------------------------------------------
    // Build the REAL visual path.
    //
    // ENTER -> CENTER -> EXIT
    //
    // This is what the rocket will follow.
    // ------------------------------------------------------------------------

    const tilePath =
      getTileTraversalPath(
        currentTileRow,
        currentTileCol,
        effectivePorts.enter,
        effectivePorts.exit,
        tileSize
      );

    // ------------------------------------------------------------------------
    // Append tile traversal path.
    // ------------------------------------------------------------------------

    for (
      const point of tilePath
    ) {
      const previous =
        visitedPath[
          visitedPath.length - 1
        ];

      // Avoid adding the same cell twice if ever encountered.
      if (
        previous &&
        previous.r === point.r &&
        previous.c === point.c
      ) {
        continue;
      }

      visitedPath.push(point);
    }

    // ------------------------------------------------------------------------
    // Destination reached.
    //
    // The final tile must be the tile containing destinationPos and its
    // exit must point toward the destination.
    // ------------------------------------------------------------------------

    const destinationSide =
      puzzle.destinationPos
        .exitSide ||
      "RIGHT";

    if (
      currentTileRow ===
        destinationTileRow &&
      currentTileCol ===
        destinationTileCol &&
      effectivePorts.exit ===
        destinationSide
    ) {
      return {
        isValid: true,
        visitedTiles,
        visitedPath,
      };
    }

    // ------------------------------------------------------------------------
    // Advance to next tile based on EXIT PORT.
    // ------------------------------------------------------------------------

    switch (
      effectivePorts.exit
    ) {
      case "TOP":
        currentTileRow -= 1;
        currentEnterPort =
          "BOTTOM";
        break;

      case "RIGHT":
        currentTileCol += 1;
        currentEnterPort =
          "LEFT";
        break;

      case "BOTTOM":
        currentTileRow += 1;
        currentEnterPort =
          "TOP";
        break;

      case "LEFT":
        currentTileCol -= 1;
        currentEnterPort =
          "RIGHT";
        break;
    }

    steps++;
  }

  return {
    isValid: false,
    visitedTiles,
    visitedPath,
  };
}

// ============================================================================
// GENERIC / CUSTOM MATRIX VALIDATION
// ============================================================================
//
// Kept for compatibility with custom matrix puzzles.
// ============================================================================

export function validateRoute(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): {
  isValid: boolean;
  visitedPath: {
    r: number;
    c: number;
  }[];
} {
  // --------------------------------------------------------------------------
  // Typed 3x3 tile puzzles.
  // --------------------------------------------------------------------------

  if (
    puzzle.tiles.some(
      (tile) =>
        tile.type !==
        undefined
    )
  ) {
    const result =
      validateTileRoute(
        puzzle,
        tileStates
      );

    return {
      isValid:
        result.isValid,

      visitedPath:
        result.visitedPath,
    };
  }

  // --------------------------------------------------------------------------
  // Fallback custom matrix.
  // --------------------------------------------------------------------------

  const grid =
    buildBoard(
      puzzle,
      tileStates
    );

  const rows =
    puzzle.gridRows;

  const cols =
    puzzle.gridCols;

  let currentR =
    puzzle.startPos.row;

  let currentC =
    puzzle.startPos.col;

  let prevR:
    number | null = null;

  let prevC:
    number | null = null;

  // --------------------------------------------------------------------------
  // If the starting cell itself is not active, find the first active cell
  // when the start enters from the left.
  // --------------------------------------------------------------------------

  if (
    !grid[currentR] ||
    !grid[currentR][currentC] ||
    !grid[currentR][currentC]
      .active
  ) {
    if (
      puzzle.startPos
        .entrySide ===
      "LEFT"
    ) {
      let foundC = -1;

      for (
        let c = 0;
        c < cols;
        c++
      ) {
        if (
          grid[currentR]?.[
            c
          ]?.active
        ) {
          foundC = c;
          break;
        }
      }

      if (
        foundC !== -1
      ) {
        currentC = foundC;
      } else {
        return {
          isValid: false,
          visitedPath: [],
        };
      }
    } else {
      return {
        isValid: false,
        visitedPath: [],
      };
    }
  }

  const visited =
    new Set<string>();

  const visitedPath: {
    r: number;
    c: number;
  }[] = [];

  const MAX_ROUTE_STEPS =
    81;

  let steps = 0;

  // ==========================================================================
  // FOLLOW CUSTOM CELL ROUTE
  // ==========================================================================

  while (
    steps <
    MAX_ROUTE_STEPS
  ) {
    // ------------------------------------------------------------------------
    // Bounds.
    // ------------------------------------------------------------------------

    if (
      currentR < 0 ||
      currentR >= rows ||
      currentC < 0 ||
      currentC >= cols
    ) {
      break;
    }

    const cell =
      grid[currentR]?.[
        currentC
      ];

    if (
      !cell ||
      !cell.active
    ) {
      break;
    }

    // ------------------------------------------------------------------------
    // Loop detection.
    // ------------------------------------------------------------------------

    const key =
      `${currentR},${currentC}`;

    if (
      visited.has(key)
    ) {
      break;
    }

    visited.add(key);

    visitedPath.push({
      r: currentR,
      c: currentC,
    });

    // ------------------------------------------------------------------------
    // Destination.
    // ------------------------------------------------------------------------

    if (
      currentR ===
        puzzle.destinationPos
          .row &&
      currentC ===
        puzzle.destinationPos
          .col
    ) {
      return {
        isValid: true,
        visitedPath,
      };
    }

    // ------------------------------------------------------------------------
    // Follow arrow.
    // ------------------------------------------------------------------------

    const next =
      getNextActiveCellInDirection(
        grid,
        currentR,
        currentC,
        cell.arrowDirection,
        prevR,
        prevC
      );

    if (!next) {
      break;
    }

    prevR = currentR;
    prevC = currentC;

    currentR =
      next.nextR;

    currentC =
      next.nextC;

    steps++;
  }

  return {
    isValid: false,
    visitedPath,
  };
}