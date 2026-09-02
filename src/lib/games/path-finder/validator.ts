import { ArrowDirection, Endpoint, GridBlock, PathCell, PathFinderQuestion } from "./types";

/**
 * Canonical Direction Vectors
 */
export const DIRECTION_VECTORS: Record<ArrowDirection, { dr: number; dc: number }> = {
  UP: { dr: -1, dc: 0 },
  DOWN: { dr: 1, dc: 0 },
  LEFT: { dr: 0, dc: -1 },
  RIGHT: { dr: 0, dc: 1 },
  UP_RIGHT: { dr: -1, dc: 1 },
  DOWN_RIGHT: { dr: 1, dc: 1 },
  DOWN_LEFT: { dr: 1, dc: -1 },
  UP_LEFT: { dr: -1, dc: -1 },
};

/**
 * Canonical Direction Angles (Degrees)
 */
export const DIRECTION_ANGLES: Record<ArrowDirection, number> = {
  RIGHT: 0,
  DOWN_RIGHT: 45,
  DOWN: 90,
  DOWN_LEFT: 135,
  LEFT: 180,
  UP_LEFT: 225,
  UP: 270,
  UP_RIGHT: 315,
};

/**
 * Reciprocal / Opposite Directions
 */
export const OPPOSITE_DIRECTIONS: Record<ArrowDirection, ArrowDirection> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
  UP_RIGHT: "DOWN_LEFT",
  DOWN_RIGHT: "UP_LEFT",
  DOWN_LEFT: "UP_RIGHT",
  UP_LEFT: "DOWN_RIGHT",
};

/**
 * Rotates an arrow direction by degrees (normalized to 0, 90, 180, 270)
 */
export function rotateDirection(dir: ArrowDirection, deg: number): ArrowDirection {
  const normDeg = ((deg % 360) + 360) % 360;
  if (normDeg === 0) return dir;

  const directions4: ArrowDirection[] = ["UP", "RIGHT", "DOWN", "LEFT"];
  const directions8: ArrowDirection[] = [
    "UP",
    "UP_RIGHT",
    "RIGHT",
    "DOWN_RIGHT",
    "DOWN",
    "DOWN_LEFT",
    "LEFT",
    "UP_LEFT",
  ];

  if (directions4.includes(dir) && normDeg % 90 === 0) {
    const idx = directions4.indexOf(dir);
    const steps = normDeg / 90;
    return directions4[(idx + steps) % 4];
  }

  const idx8 = directions8.indexOf(dir);
  const steps8 = Math.round(normDeg / 45) % 8;
  return directions8[(idx8 + steps8) % 8];
}

/**
 * Canonical rotation coordinate transform for a square block of size N
 * 0°: (lr, lc)
 * 90° clockwise: (N - 1 - lc, lr)
 * 180°: (N - 1 - lr, N - 1 - lc)
 * 270° clockwise: (lc, N - 1 - lr)
 */
export function getRotatedCellSource(
  lr: number,
  lc: number,
  blockSize: number,
  rotation: number
): { sr: number; sc: number } {
  const rot = ((rotation % 360) + 360) % 360;

  if (rot === 90) {
    return { sr: blockSize - 1 - lc, sc: lr };
  }
  if (rot === 180) {
    return { sr: blockSize - 1 - lr, sc: blockSize - 1 - lc };
  }
  if (rot === 270) {
    return { sr: lc, sc: blockSize - 1 - lr };
  }
  return { sr: lr, sc: lc };
}

/**
 * Returns effective rotated cell and rotated direction for a given block
 */
export function getRotatedCell(
  block: GridBlock,
  lr: number,
  lc: number,
  rotation: number
): { active: boolean; direction?: ArrowDirection } {
  const { sr, sc } = getRotatedCellSource(lr, lc, block.size, rotation);
  const cell = block.cells?.[sr]?.[sc];
  if (!cell || !cell.active) {
    return { active: false };
  }

  const effectiveDir = cell.direction ? rotateDirection(cell.direction, rotation) : undefined;
  return {
    active: true,
    direction: effectiveDir,
  };
}

/**
 * Resolves global grid cell information given current question and block rotations
 */
export function getEffectiveCellAtGlobal(
  question: PathFinderQuestion,
  rotations: number[][],
  globalRow: number,
  globalCol: number
): { active: boolean; direction?: ArrowDirection } | null {
  const S = question.blockSize;
  const B = question.blockGridSize;
  const total = question.totalGridSize;

  if (globalRow < 0 || globalRow >= total || globalCol < 0 || globalCol >= total) {
    return null;
  }

  const br = Math.floor(globalRow / S);
  const bc = Math.floor(globalCol / S);
  const lr = globalRow % S;
  const lc = globalCol % S;

  if (br < 0 || br >= B || bc < 0 || bc >= B) {
    return null;
  }

  const block = question.blocks[br]?.[bc];
  if (!block) return null;

  const blockRot = rotations?.[br]?.[bc] ?? 0;
  return getRotatedCell(block, lr, lc, blockRot);
}

/**
 * Endpoint coordinates calculator
 */
export function getEndpointCoordinates(endpoint: Endpoint, totalGridSize: number): { r: number; c: number } {
  switch (endpoint.side) {
    case "TOP":
      return { r: 0, c: endpoint.index };
    case "BOTTOM":
      return { r: totalGridSize - 1, c: endpoint.index };
    case "LEFT":
      return { r: endpoint.index, c: 0 };
    case "RIGHT":
      return { r: endpoint.index, c: totalGridSize - 1 };
  }
}

/**
 * Next coordinates using direction vector mapping
 */
export function getNextCoordinates(r: number, c: number, dir: ArrowDirection): { r: number; c: number } {
  const vec = DIRECTION_VECTORS[dir];
  return { r: r + vec.dr, c: c + vec.dc };
}

export interface RouteValidationResult {
  isValid: boolean;
  visitedCells: { r: number; c: number }[];
  reason?: string;
}

/**
 * Pure deterministic route validator
 * Validates directional traversal from start to destination (or in reverse)
 */
export function validateRoute(
  question: PathFinderQuestion,
  rotations: number[][],
  direction: "FORWARD" | "REVERSE" = "FORWARD"
): RouteValidationResult {
  const startCoord = getEndpointCoordinates(question.start, question.totalGridSize);
  const targetCoord = getEndpointCoordinates(question.destination, question.totalGridSize);

  let curR = startCoord.r;
  let curC = startCoord.c;

  const visited: { r: number; c: number }[] = [];
  const visitedSet = new Set<string>();

  const maxSteps = question.totalGridSize * question.totalGridSize;

  for (let step = 0; step < maxSteps; step++) {
    const key = `${curR},${curC}`;
    if (visitedSet.has(key)) {
      return {
        isValid: false,
        visitedCells: visited,
        reason: `Route contains an infinite loop or cycle at (${curR}, ${curC})`,
      };
    }

    visitedSet.add(key);
    visited.push({ r: curR, c: curC });

    // Check if we have arrived at the destination
    if (curR === targetCoord.r && curC === targetCoord.c) {
      const finalVisited = direction === "REVERSE" ? [...visited].reverse() : visited;
      return {
        isValid: true,
        visitedCells: finalVisited,
      };
    }

    const cellInfo = getEffectiveCellAtGlobal(question, rotations, curR, curC);
    if (!cellInfo || !cellInfo.active || !cellInfo.direction) {
      return {
        isValid: false,
        visitedCells: visited,
        reason: `Inactive or dead-end cell at (${curR}, ${curC})`,
      };
    }

    const nextCoord = getNextCoordinates(curR, curC, cellInfo.direction);

    // Bounds checking
    if (
      nextCoord.r < 0 ||
      nextCoord.r >= question.totalGridSize ||
      nextCoord.c < 0 ||
      nextCoord.c >= question.totalGridSize
    ) {
      // Exiting out of bounds exactly at target coordinate
      if (curR === targetCoord.r && curC === targetCoord.c) {
        const finalVisited = direction === "REVERSE" ? [...visited].reverse() : visited;
        return {
          isValid: true,
          visitedCells: finalVisited,
        };
      }

      return {
        isValid: false,
        visitedCells: visited,
        reason: `Route exited out of bounds from (${curR}, ${curC})`,
      };
    }

    curR = nextCoord.r;
    curC = nextCoord.c;
  }

  return {
    isValid: false,
    visitedCells: visited,
    reason: "Route did not reach destination within step limit",
  };
}
