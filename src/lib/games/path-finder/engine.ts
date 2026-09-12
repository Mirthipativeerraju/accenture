import { ArrowDirection, CellData, PuzzleDefinition, TileState } from "./types";

export const ROTATION_ORDER: ArrowDirection[] = [
  "RIGHT",
  "DOWN_RIGHT",
  "DOWN",
  "DOWN_LEFT",
  "LEFT",
  "UP_LEFT",
  "UP",
  "UP_RIGHT",
];

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

export function rotateArrowClockwise(dir: ArrowDirection, steps = 1): ArrowDirection {
  return rotateArrowDirection(dir, steps);
}

export function reverseArrowDirection(dir: ArrowDirection): ArrowDirection {
  return DIRECTION_REVERSE_MAP[dir] || dir;
}

export function getTransformedTileCells(
  baseCells: CellData[][],
  state: TileState
): CellData[][] {
  const size = 3;
  let cells: CellData[][] = baseCells.map((row) => row.map((cell) => ({ ...cell })));

  // Apply rotation
  const rotSteps = (state.rotation / 90) % 4;
  for (let s = 0; s < rotSteps; s++) {
    const rotated: CellData[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({ active: false }))
    );
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const oldCell = cells[r][c];
        const newR = c;
        const newC = size - 1 - r;
        rotated[newR][newC] = {
          active: oldCell.active,
          arrowDirection: oldCell.arrowDirection
            ? rotateArrowClockwise(oldCell.arrowDirection, 1)
            : undefined,
        };
      }
    }
    cells = rotated;
  }

  // Apply direction reversal if active
  if (state.directionReversed) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (cells[r][c].active && cells[r][c].arrowDirection) {
          cells[r][c].arrowDirection = reverseArrowDirection(cells[r][c].arrowDirection!);
        }
      }
    }
  }

  return cells;
}

export function getFullBoardGrid(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): CellData[][] {
  const fullGrid: CellData[][] = Array.from({ length: puzzle.gridRows }, () =>
    Array.from({ length: puzzle.gridCols }, () => ({ active: false }))
  );

  for (const tile of puzzle.tiles) {
    const state = tileStates[tile.id] || { rotation: 0, directionReversed: false };
    const transformed = getTransformedTileCells(tile.cells, state);
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

export function getStepFromDirection(
  dir: ArrowDirection | undefined,
  currentR: number,
  currentC: number,
  prevR: number | null,
  prevC: number | null,
  grid: CellData[][]
): { nextR: number; nextC: number } | null {
  const rows = grid.length;
  const cols = grid[0].length;

  if (!dir) {
    // Cell is active without arrow (pipe): continue straight in the direction entered
    if (prevR !== null && prevC !== null) {
      const dr = currentR - prevR;
      const dc = currentC - prevC;
      return { nextR: currentR + dr, nextC: currentC + dc };
    }
    // Start cell default: try right neighbor
    if (currentC + 1 < cols && grid[currentR][currentC + 1]?.active) {
      return { nextR: currentR, nextC: currentC + 1 };
    }
    return null;
  }

  switch (dir) {
    case "RIGHT":
      return { nextR: currentR, nextC: currentC + 1 };
    case "LEFT":
      return { nextR: currentR, nextC: currentC - 1 };
    case "DOWN":
      return { nextR: currentR + 1, nextC: currentC };
    case "UP":
      return { nextR: currentR - 1, nextC: currentC };
    case "DOWN_RIGHT": {
      if (prevR !== null && prevR < currentR) return { nextR: currentR, nextC: currentC + 1 };
      if (prevC !== null && prevC < currentC) return { nextR: currentR + 1, nextC: currentC };
      if (currentC + 1 < cols && grid[currentR][currentC + 1]?.active) return { nextR: currentR, nextC: currentC + 1 };
      if (currentR + 1 < rows && grid[currentR + 1][currentC]?.active) return { nextR: currentR + 1, nextC: currentC };
      return { nextR: currentR, nextC: currentC + 1 };
    }
    case "DOWN_LEFT": {
      if (prevR !== null && prevR < currentR) return { nextR: currentR, nextC: currentC - 1 };
      if (prevC !== null && prevC > currentC) return { nextR: currentR + 1, nextC: currentC };
      if (currentC - 1 >= 0 && grid[currentR][currentC - 1]?.active) return { nextR: currentR, nextC: currentC - 1 };
      if (currentR + 1 < rows && grid[currentR + 1][currentC]?.active) return { nextR: currentR + 1, nextC: currentC };
      return { nextR: currentR, nextC: currentC - 1 };
    }
    case "UP_RIGHT": {
      if (prevR !== null && prevR > currentR) return { nextR: currentR, nextC: currentC + 1 };
      if (prevC !== null && prevC < currentC) return { nextR: currentR - 1, nextC: currentC };
      if (currentC + 1 < cols && grid[currentR][currentC + 1]?.active) return { nextR: currentR, nextC: currentC + 1 };
      if (currentR - 1 >= 0 && grid[currentR - 1][currentC]?.active) return { nextR: currentR - 1, nextC: currentC };
      return { nextR: currentR, nextC: currentC + 1 };
    }
    case "UP_LEFT": {
      if (prevR !== null && prevR > currentR) return { nextR: currentR, nextC: currentC - 1 };
      if (prevC !== null && prevC > currentC) return { nextR: currentR - 1, nextC: currentC };
      if (currentC - 1 >= 0 && grid[currentR][currentC - 1]?.active) return { nextR: currentR, nextC: currentC - 1 };
      if (currentR - 1 >= 0 && grid[currentR - 1][currentC]?.active) return { nextR: currentR - 1, nextC: currentC };
      return { nextR: currentR, nextC: currentC - 1 };
    }
    default:
      return null;
  }
}

export function validateRoute(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): { isValid: boolean; visitedPath: { r: number; c: number }[] } {
  const grid = getFullBoardGrid(puzzle, tileStates);
  const rows = puzzle.gridRows;
  const cols = puzzle.gridCols;

  let currentR = puzzle.startPos.row;
  let currentC = puzzle.startPos.col;
  let prevR: number | null = null;
  let prevC: number | null = null;

  const visited = new Set<string>();
  const visitedPath: { r: number; c: number }[] = [];

  const maxSteps = rows * cols * 2;
  let steps = 0;

  while (steps < maxSteps) {
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

    // Check if we reached destination
    if (currentR === puzzle.destinationPos.row && currentC === puzzle.destinationPos.col) {
      return { isValid: true, visitedPath };
    }

    const next = getStepFromDirection(cell.arrowDirection, currentR, currentC, prevR, prevC, grid);
    if (!next) break;

    prevR = currentR;
    prevC = currentC;
    currentR = next.nextR;
    currentC = next.nextC;
    steps++;
  }

  return { isValid: false, visitedPath };
}
