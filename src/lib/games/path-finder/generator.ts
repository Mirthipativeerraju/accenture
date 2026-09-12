import { ArrowDirection, PuzzleDefinition, RouteCell, TileDefinition, TileState } from "./types";
import { validateRoute } from "./validator";
import { buildBoard } from "./transformations";
import { solvePuzzle, replayMoves } from "./solver";

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2d79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createEmptyTile(id: string, gridRow: number, gridCol: number): TileDefinition {
  return {
    id,
    gridRow,
    gridCol,
    cells: Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => ({ active: false }))
    ),
  };
}

export const STEP_DIRECTIONS: { dr: number; dc: number; dir: ArrowDirection }[] = [
  { dr: 0, dc: 1, dir: "RIGHT" },
  { dr: 1, dc: 0, dir: "DOWN" },
  { dr: -1, dc: 0, dir: "UP" },
  { dr: 1, dc: 1, dir: "DOWN_RIGHT" },
  { dr: -1, dc: 1, dir: "UP_RIGHT" },
  { dr: 0, dc: -1, dir: "LEFT" },
  { dr: 1, dc: -1, dir: "DOWN_LEFT" },
  { dr: -1, dc: -1, dir: "UP_LEFT" },
];

export function directionFromCoordinates(
  current: { r: number; c: number },
  next: { r: number; c: number }
): ArrowDirection {
  const dr = next.r - current.r;
  const dc = next.c - current.c;
  const match = STEP_DIRECTIONS.find((d) => d.dr === dr && d.dc === dc);
  if (!match) {
    throw new Error(`Invalid step from (${current.r}, ${current.c}) to (${next.r}, ${next.c})`);
  }
  return match.dir;
}

export function generateSolvablePuzzle(
  id: string,
  options: {
    startRow?: number;
    destRow?: number;
    minMoves?: number;
    seed?: number;
    maxAttempts?: number;
  } = {}
): PuzzleDefinition {
  const seed = options.seed !== undefined ? options.seed : Math.floor(Math.random() * 1000000);
  const rng = mulberry32(seed);

  const startRow = options.startRow !== undefined ? options.startRow : 8;
  const destRow = options.destRow !== undefined ? options.destRow : 1;

  const gridRows = 9;
  const gridCols = 9;
  const tileSize = 3;
  const maxAttempts = options.maxAttempts || 100;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // 1. Path must begin with START on LEFT boundary: (startRow, 0) -> (startRow, 1) -> ...
    // This strictly guarantees firstCell.arrowDirection === "RIGHT"
    const path: { r: number; c: number; dir?: ArrowDirection }[] = [
      { r: startRow, c: 0 },
      { r: startRow, c: 1 },
    ];
    const visited = new Set<string>();
    visited.add(`${startRow},0`);
    visited.add(`${startRow},1`);

    function dfs(r: number, c: number, depth: number): boolean {
      if (r === destRow && c === 8) {
        // Path reached destination on right edge with sufficient complexity
        if (depth >= 10) return true;
      }

      if (depth > 24) {
        return false;
      }

      // Shuffle candidate moves with bias towards moving right (toward col 8)
      const candidates = [...STEP_DIRECTIONS].sort((a, b) => {
        const scoreA = (a.dc > 0 ? 3 : a.dc === 0 ? 1 : 0) + (rng() - 0.5);
        const scoreB = (b.dc > 0 ? 3 : b.dc === 0 ? 1 : 0) + (rng() - 0.5);
        return scoreB - scoreA;
      });

      for (const move of candidates) {
        const nr = r + move.dr;
        const nc = c + move.dc;

        if (nr >= 0 && nr < gridRows && nc >= 0 && nc < gridCols) {
          if (!visited.has(`${nr},${nc}`)) {
            // Do not hit destination column too early
            if (nc === 8 && nr === destRow && depth < 10) continue;

            path.push({ r: nr, c: nc });
            visited.add(`${nr},${nc}`);

            if (dfs(nr, nc, depth + 1)) {
              return true;
            }

            path.pop();
            visited.delete(`${nr},${nc}`);
          }
        }
      }

      return false;
    }

    let found = dfs(startRow, 1, 2);
    if (!found) {
      // Fallback structured path from (startRow, 1) to (destRow, 8)
      visited.clear();
      visited.add(`${startRow},0`);
      path.length = 1;
      let cr = startRow;
      let cc = 0;
      while (cc < 8 || cr !== destRow) {
        let nextR = cr;
        let nextC = cc;
        if (cc < 8 && (cr === destRow || rng() > 0.45)) {
          nextC = cc + 1;
        } else if (cr < destRow) {
          nextR = cr + 1;
        } else if (cr > destRow) {
          nextR = cr - 1;
        } else {
          nextC = cc + 1;
        }
        path.push({ r: nextR, c: nextC });
        visited.add(`${nextR},${nextC}`);
        cr = nextR;
        cc = nextC;
      }
    }

    // Step 2: Derive ALL internal arrows directly from consecutive path steps
    for (let i = 0; i < path.length - 1; i++) {
      path[i].dir = directionFromCoordinates(path[i], path[i + 1]);
    }

    // Step 3: Final cell on RIGHT boundary points OUT into DESTINATION (RIGHT)
    path[path.length - 1].dir = "RIGHT";

    // Build the 9 tiles
    const tileMap: Record<string, RouteCell[][]> = {};
    for (let tr = 0; tr < 3; tr++) {
      for (let tc = 0; tc < 3; tc++) {
        const tileId = `T${tr}${tc}`;
        tileMap[tileId] = Array.from({ length: 3 }, () =>
          Array.from({ length: 3 }, () => ({ active: false }))
        );
      }
    }

    // Place path cells into tiles
    const pathSet = new Set<string>();
    for (let i = 0; i < path.length; i++) {
      const pt = path[i];
      pathSet.add(`${pt.r},${pt.c}`);
      const tr = Math.floor(pt.r / 3);
      const tc = Math.floor(pt.c / 3);
      const tileId = `T${tr}${tc}`;
      const cellR = pt.r % 3;
      const cellC = pt.c % 3;

      tileMap[tileId][cellR][cellC] = {
        active: true,
        arrowDirection: pt.dir,
      };
    }

    // Step 4: Add limited decoys (2 to 5 non-path active cells)
    const decoyCount = 2 + Math.floor(rng() * 4);
    for (let d = 0; d < decoyCount; d++) {
      const dr = Math.floor(rng() * 9);
      const dc = Math.floor(rng() * 9);
      if (!pathSet.has(`${dr},${dc}`)) {
        const tr = Math.floor(dr / 3);
        const tc = Math.floor(dc / 3);
        const tileId = `T${tr}${tc}`;
        const cellR = dr % 3;
        const cellC = dc % 3;
        const randomDir = STEP_DIRECTIONS[Math.floor(rng() * STEP_DIRECTIONS.length)].dir;
        tileMap[tileId][cellR][cellC] = {
          active: true,
          arrowDirection: randomDir,
        };
      }
    }

    const tiles: TileDefinition[] = [];
    const solutionTileStates: Record<string, TileState> = {};
    for (let tr = 0; tr < 3; tr++) {
      for (let tc = 0; tc < 3; tc++) {
        const tileId = `T${tr}${tc}`;
        tiles.push({
          id: tileId,
          gridRow: tr,
          gridCol: tc,
          cells: tileMap[tileId],
        });
        solutionTileStates[tileId] = { rotation: 0, directionReversed: false };
      }
    }

    const initialTileStates: Record<string, TileState> = {};
    for (const t of tiles) {
      initialTileStates[t.id] = { rotation: 0, directionReversed: false };
    }

    const puzzle: PuzzleDefinition = {
      id,
      gridRows,
      gridCols,
      tileRows: 3,
      tileCols: 3,
      tileSize,
      startPos: { row: startRow, col: 0, entrySide: "LEFT" },
      destinationPos: { row: destRow, col: 8, exitSide: "RIGHT" },
      tiles,
      initialTileStates,
      solution: {
        minMoves: 4,
        tileStates: solutionTileStates,
        solutionPath: path.map((p) => ({ r: p.r, c: p.c })),
      },
    };

    // Step 5 & 6: Validate solved board with real validator
    const solutionCheck = validateRoute(puzzle, solutionTileStates);
    if (!solutionCheck.isValid) {
      continue;
    }
    if (solutionCheck.visitedPath[0].r !== startRow || solutionCheck.visitedPath[0].c !== 0) {
      continue;
    }
    const lastVisited = solutionCheck.visitedPath[solutionCheck.visitedPath.length - 1];
    if (lastVisited.r !== destRow || lastVisited.c !== 8) {
      continue;
    }

    // Step 29: Direct arrow assertion
    const solvedBoard = buildBoard(puzzle, solutionTileStates);
    let arrowsValid = true;

    // First cell on LEFT edge must point RIGHT
    if (solvedBoard[startRow][0].arrowDirection !== "RIGHT") {
      continue;
    }
    // Final cell on RIGHT edge must point RIGHT
    if (solvedBoard[destRow][8].arrowDirection !== "RIGHT") {
      continue;
    }

    for (let i = 0; i < path.length - 1; i++) {
      const cur = path[i];
      const nxt = path[i + 1];
      const expectedDir = directionFromCoordinates(cur, nxt);
      const actualDir = solvedBoard[cur.r][cur.c].arrowDirection;
      if (actualDir !== expectedDir) {
        arrowsValid = false;
        break;
      }
    }
    if (!arrowsValid) continue;

    // Step 7: Scramble 2 to 6 tiles using real 3x3 rotation transformations and flips
    const tileIds = tiles.map((t) => t.id);
    const rotations: (0 | 1 | 2 | 3)[] = [1, 2, 3];

    const activeTileIds = tileIds.filter((tid) => {
      const tile = tiles.find((t) => t.id === tid);
      return tile?.cells.some((row) => row.some((c) => c.active));
    });

    let scrambled = false;
    for (let sAttempt = 0; sAttempt < 25; sAttempt++) {
      const numToScramble = 2 + Math.floor(rng() * 4);
      for (const tid of tileIds) {
        initialTileStates[tid] = { rotation: 0, directionReversed: false };
      }

      const pool = activeTileIds.length >= 2 ? activeTileIds : tileIds;
      const shuffled = [...pool].sort(() => rng() - 0.5);

      for (let i = 0; i < Math.min(numToScramble, shuffled.length); i++) {
        const tid = shuffled[i];
        const rot = rotations[Math.floor(rng() * rotations.length)];
        const flip = rng() > 0.7;
        initialTileStates[tid] = { rotation: rot, directionReversed: flip };
      }

      // Initial state MUST NOT be already solved
      const initialCheck = validateRoute(puzzle, initialTileStates);
      const hasNonZeroOp = Object.values(initialTileStates).some(
        (st) => st.rotation !== 0 || st.directionReversed
      );

      if (!initialCheck.isValid && hasNonZeroOp) {
        scrambled = true;
        break;
      }
    }

    if (!scrambled) continue;

    // Step 8 & 27: Verify reachability using solver
    const solverRes = solvePuzzle(puzzle, 3);
    if (!solverRes.hasSolution || solverRes.solutions.length === 0) {
      continue;
    }

    // Step 28: Verify replay of solutionMoves achieves valid route
    const bestTargetStates = solverRes.solutions[0];
    const replayed = replayMoves(initialTileStates, solverRes.solutionMoves);
    const replayedCheck = validateRoute(puzzle, replayed);
    if (!replayedCheck.isValid) {
      continue;
    }

    puzzle.solution = {
      minMoves: solverRes.minMoves > 0 ? solverRes.minMoves : 4,
      tileStates: bestTargetStates,
      solutionMoves: solverRes.solutionMoves,
      solutionPath: path.map((p) => ({ r: p.r, c: p.c })),
    };

    return puzzle;
  }

  throw new Error(`Unable to generate a verified solvable Path Finder puzzle for ${id}`);
}

export function generateDeterministicPuzzle(
  id: string,
  startRow = 8,
  destRow = 1,
  seed = 42
): PuzzleDefinition {
  return generateSolvablePuzzle(id, { startRow, destRow, seed });
}

export function generatePractice2Question1(seed?: number): PuzzleDefinition {
  return generateSolvablePuzzle("practice-2-q1", {
    startRow: 8,
    destRow: 1,
    seed: seed !== undefined ? seed : 2024,
  });
}


