import { ArrowDirection, RouteCell, PuzzleDefinition, TileState, TilePort } from "./types";
import { buildBoard, getEffectivePorts, getEffectiveTileCells } from "./transformations";

export const DIRECTION_VECTORS: Record<ArrowDirection, { dr: number; dc: number }> = {
  RIGHT: { dr: 0, dc: 1 },
  DOWN_RIGHT: { dr: 1, dc: 1 },
  DOWN: { dr: 1, dc: 0 },
  DOWN_LEFT: { dr: 1, dc: -1 },
  LEFT: { dr: 0, dc: -1 },
  UP_LEFT: { dr: -1, dc: -1 },
  UP: { dr: -1, dc: 0 },
  UP_RIGHT: { dr: -1, dc: 1 },
};

export function getNextActiveCellInDirection(
  grid: RouteCell[][],
  currentR: number,
  currentC: number,
  dir?: ArrowDirection,
  prevR: number | null = null,
  prevC: number | null = null
): { nextR: number; nextC: number } | null {
  const rows = grid.length;
  const cols = grid[0].length;

  let dr = 0;
  let dc = 0;

  if (dir) {
    const vec = DIRECTION_VECTORS[dir];
    if (!vec) return null;
    dr = vec.dr;
    dc = vec.dc;
  } else if (prevR !== null && prevC !== null) {
    const rawDr = currentR - prevR;
    const rawDc = currentC - prevC;
    dr = rawDr === 0 ? 0 : rawDr > 0 ? 1 : -1;
    dc = rawDc === 0 ? 0 : rawDc > 0 ? 1 : -1;
  } else {
    dr = 0;
    dc = 1;
  }

  if (dr === 0 && dc === 0) return null;

  let r = currentR + dr;
  let c = currentC + dc;

  while (r >= 0 && r < rows && c >= 0 && c < cols) {
    if (grid[r][c] && grid[r][c].active) {
      return { nextR: r, nextC: c };
    }
    r += dr;
    c += dc;
  }

  return null;
}

export function validateTileRoute(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): { isValid: boolean; visitedTiles: string[]; visitedPath: { r: number; c: number }[] } {
  const startTileRow = Math.floor(puzzle.startPos.row / puzzle.tileSize);
  const destTileRow = Math.floor(puzzle.destinationPos.row / puzzle.tileSize);

  let currentTileRow = startTileRow;
  let currentTileCol = 0;
  let currentEnterPort: TilePort = puzzle.startPos.entrySide || "LEFT";

  const visitedTiles: string[] = [];
  const visitedSet = new Set<string>();
  const visitedPath: { r: number; c: number }[] = [];

  const maxSteps = puzzle.tileRows * puzzle.tileCols; // 9
  let steps = 0;

  while (steps < maxSteps) {
    if (
      currentTileRow < 0 ||
      currentTileRow >= puzzle.tileRows ||
      currentTileCol < 0 ||
      currentTileCol >= puzzle.tileCols
    ) {
      break;
    }

    const tile = puzzle.tiles.find(
      (t) => t.gridRow === currentTileRow && t.gridCol === currentTileCol
    );
    if (!tile) break;

    const tileKey = `${currentTileRow},${currentTileCol}`;
    if (visitedSet.has(tileKey)) {
      // Cycle detected
      break;
    }
    visitedSet.add(tileKey);
    visitedTiles.push(tile.id);

    const state = tileStates[tile.id] || { rotation: 0, flipped: false, mode: 0 };
    const effectivePorts = getEffectivePorts(tile, state);
    const effectiveCells = getEffectiveTileCells(tile, state);

    // Check if the tile accepts connection on currentEnterPort
    if (effectivePorts.enter !== currentEnterPort) {
      // Broken connection
      break;
    }

    // Append cells in this tile along startRow, startCol
    const startRow = tile.gridRow * puzzle.tileSize;
    const startCol = tile.gridCol * puzzle.tileSize;
    for (let r = 0; r < puzzle.tileSize; r++) {
      for (let c = 0; c < puzzle.tileSize; c++) {
        if (effectiveCells[r][c].active) {
          visitedPath.push({ r: startRow + r, c: startCol + c });
        }
      }
    }

    const exitPort = effectivePorts.exit;

    // Check if Destination is reached
    if (
      currentTileRow === destTileRow &&
      currentTileCol === puzzle.tileCols - 1 &&
      exitPort === (puzzle.destinationPos.exitSide || "RIGHT")
    ) {
      return { isValid: true, visitedTiles, visitedPath };
    }

    // Advance to adjacent tile
    if (exitPort === "TOP") {
      currentTileRow -= 1;
      currentEnterPort = "BOTTOM";
    } else if (exitPort === "RIGHT") {
      currentTileCol += 1;
      currentEnterPort = "LEFT";
    } else if (exitPort === "BOTTOM") {
      currentTileRow += 1;
      currentEnterPort = "TOP";
    } else if (exitPort === "LEFT") {
      currentTileCol -= 1;
      currentEnterPort = "RIGHT";
    }
    steps++;
  }

  return { isValid: false, visitedTiles, visitedPath };
}

export function validateRoute(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): { isValid: boolean; visitedPath: { r: number; c: number }[] } {
  // If tiles have types defined, use port-based validation
  if (puzzle.tiles.some((t) => t.type !== undefined)) {
    const res = validateTileRoute(puzzle, tileStates);
    return { isValid: res.isValid, visitedPath: res.visitedPath };
  }

  // Fallback to cell ray tracing for custom matrices
  const grid = buildBoard(puzzle, tileStates);
  const rows = puzzle.gridRows;
  const cols = puzzle.gridCols;

  let currentR = puzzle.startPos.row;
  let currentC = puzzle.startPos.col;
  let prevR: number | null = null;
  let prevC: number | null = null;

  if (!grid[currentR] || !grid[currentR][currentC] || !grid[currentR][currentC].active) {
    if (puzzle.startPos.entrySide === "LEFT") {
      let foundC = -1;
      for (let c = 0; c < cols; c++) {
        if (grid[currentR][c]?.active) {
          foundC = c;
          break;
        }
      }
      if (foundC !== -1) {
        currentC = foundC;
      } else {
        return { isValid: false, visitedPath: [] };
      }
    } else {
      return { isValid: false, visitedPath: [] };
    }
  }

  const visited = new Set<string>();
  const visitedPath: { r: number; c: number }[] = [];

  const MAX_ROUTE_STEPS = 81;
  let steps = 0;

  while (steps < MAX_ROUTE_STEPS) {
    if (currentR < 0 || currentR >= rows || currentC < 0 || currentC >= cols) {
      break;
    }

    const cell = grid[currentR][currentC];
    if (!cell || !cell.active) {
      break;
    }

    const key = `${currentR},${currentC}`;
    if (visited.has(key)) {
      // Loop detected
      break;
    }

    visited.add(key);
    visitedPath.push({ r: currentR, c: currentC });

    // Check if Destination is reached
    if (currentR === puzzle.destinationPos.row && currentC === puzzle.destinationPos.col) {
      return { isValid: true, visitedPath };
    }

    const next = getNextActiveCellInDirection(grid, currentR, currentC, cell.arrowDirection, prevR, prevC);
    if (!next) break;

    prevR = currentR;
    prevC = currentC;
    currentR = next.nextR;
    currentC = next.nextC;
    steps++;
  }

  return { isValid: false, visitedPath };
}


