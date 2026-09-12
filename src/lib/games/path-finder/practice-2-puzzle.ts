import { PuzzleDefinition, TileDefinition, TilePort, TileState, TileType } from "./types";
import { getEffectivePorts, getEffectiveTileCells } from "./transformations";
import { validateRoute } from "./validator";

export function createSeededRng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getPuzzleSignature(puzzle: PuzzleDefinition): string {
  const routeSig = `${puzzle.startPos.row}->${puzzle.destinationPos.row}`;
  const tileSig = puzzle.tiles
    .map((t) => {
      const sol = puzzle.solution?.tileStates[t.id];
      const init = puzzle.initialTileStates[t.id];
      return `${t.id}:${t.type}:${sol?.rotation ?? 0},${sol?.flipped ? 1 : 0},${sol?.mode ?? 0}:${init?.rotation ?? 0},${init?.flipped ? 1 : 0},${init?.mode ?? 0}`;
    })
    .join(";");
  return `${routeSig}|${tileSig}`;
}

interface RouteStep {
  gridRow: number;
  gridCol: number;
  enterPort: TilePort;
  exitPort: TilePort;
}

function generateRandomTileRoute(
  startTileRow: number,
  destTileRow: number,
  rng: () => number
): RouteStep[] | null {
  const visited = new Set<string>();
  const path: RouteStep[] = [];

  function dfs(r: number, c: number, enterPort: TilePort): boolean {
    const key = `${r},${c}`;
    visited.add(key);

    // If destination tile is reached, we must exit RIGHT
    if (r === destTileRow && c === 2) {
      path.push({ gridRow: r, gridCol: c, enterPort, exitPort: "RIGHT" });
      return true;
    }

    const candidates: { nr: number; nc: number; exitPort: TilePort; nextEnter: TilePort }[] = [
      { nr: r, nc: c + 1, exitPort: "RIGHT", nextEnter: "LEFT" },
      { nr: r - 1, nc: c, exitPort: "TOP", nextEnter: "BOTTOM" },
      { nr: r + 1, nc: c, exitPort: "BOTTOM", nextEnter: "TOP" },
      { nr: r, nc: c - 1, exitPort: "LEFT", nextEnter: "RIGHT" },
    ];

    const validMoves = candidates.filter(
      (m) => m.nr >= 0 && m.nr < 3 && m.nc >= 0 && m.nc < 3 && !visited.has(`${m.nr},${m.nc}`)
    );

    // Shuffle moves
    for (let i = validMoves.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [validMoves[i], validMoves[j]] = [validMoves[j], validMoves[i]];
    }

    for (const move of validMoves) {
      path.push({ gridRow: r, gridCol: c, enterPort, exitPort: move.exitPort });
      if (dfs(move.nr, move.nc, move.nextEnter)) {
        return true;
      }
      path.pop();
    }

    visited.delete(key);
    return false;
  }

  const success = dfs(startTileRow, 0, "LEFT");
  return success ? path : null;
}

function getMatchingTileConfigs(
  gridRow: number,
  gridCol: number,
  enterPort: TilePort,
  exitPort: TilePort
): { type: TileType; state: TileState }[] {
  const configs: { type: TileType; state: TileState }[] = [];
  const tileTypes: TileType[] = ["STRAIGHT", "CORNER", "T_JUNCTION", "CROSS"];

  for (const type of tileTypes) {
    const modes: (0 | 1 | 2 | 3)[] = type === "T_JUNCTION" || type === "CROSS" ? [0, 1, 2, 3] : [0];
    const flips: boolean[] = type === "STRAIGHT" || type === "CORNER" ? [false, true] : [false];
    for (const mode of modes) {
      for (const flipped of flips) {
        for (const rotation of [0, 1, 2, 3] as (0 | 1 | 2 | 3)[]) {
          const dummyTile: TileDefinition = {
            id: `T${gridRow}${gridCol}`,
            gridRow,
            gridCol,
            type,
            cells: [],
          };
          const st: TileState = { rotation, flipped, mode };
          const ports = getEffectivePorts(dummyTile, st);
          if (ports.enter === enterPort && ports.exit === exitPort) {
            configs.push({ type, state: st });
          }
        }
      }
    }
  }
  return configs;
}

export function generatePractice2Question(
  questionIndex: number,
  rng: () => number = Math.random,
  existingSignatures: Set<string> = new Set()
): PuzzleDefinition {
  const MAX_ATTEMPTS = 50;
  const tileTypesList: TileType[] = ["STRAIGHT", "CORNER", "T_JUNCTION", "CROSS"];

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const startTileRow = Math.floor(rng() * 3);
    const destTileRow = Math.floor(rng() * 3);

    const route = generateRandomTileRoute(startTileRow, destTileRow, rng);
    if (!route || route.length === 0) continue;

    const routeMap = new Map<string, RouteStep>();
    for (const step of route) {
      routeMap.set(`${step.gridRow},${step.gridCol}`, step);
    }

    const tiles: TileDefinition[] = [];
    const solutionTileStates: Record<string, TileState> = {};
    let generationFailed = false;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const tileId = `T${r}${c}`;
        const step = routeMap.get(`${r},${c}`);

        let type: TileType;
        let solState: TileState;

        if (step) {
          const matchingConfigs = getMatchingTileConfigs(r, c, step.enterPort, step.exitPort);
          if (matchingConfigs.length === 0) {
            generationFailed = true;
            break;
          }
          const chosen = matchingConfigs[Math.floor(rng() * matchingConfigs.length)];
          type = chosen.type;
          solState = chosen.state;
        } else {
          // Decoy tile
          type = tileTypesList[Math.floor(rng() * tileTypesList.length)];
          const rotation = Math.floor(rng() * 4) as 0 | 1 | 2 | 3;
          const flipped = rng() > 0.5;
          const mode = Math.floor(rng() * 4) as 0 | 1 | 2 | 3;
          solState = { rotation, flipped, mode };
        }

        const dummyTile = { id: tileId, gridRow: r, gridCol: c, type, cells: [] };
        const baseCells = getEffectiveTileCells(dummyTile as TileDefinition, { rotation: 0, flipped: false, mode: 0 });

        tiles.push({
          id: tileId,
          gridRow: r,
          gridCol: c,
          type,
          cells: baseCells,
        });
        solutionTileStates[tileId] = solState;
      }
      if (generationFailed) break;
    }

    if (generationFailed) continue;

    // Start & destination coordinates on 9x9 board: middle row of each tile (row * 3 + 1)
    const startPos = { row: startTileRow * 3 + 1, col: 0, entrySide: "LEFT" as const };
    const destinationPos = { row: destTileRow * 3 + 1, col: 8, exitSide: "RIGHT" as const };

    const candidatePuzzle: PuzzleDefinition = {
      id: `practice-2-q${questionIndex + 1}`,
      gridRows: 9,
      gridCols: 9,
      tileRows: 3,
      tileCols: 3,
      tileSize: 3,
      startPos,
      destinationPos,
      tiles,
      initialTileStates: {},
      solution: {
        minMoves: 0,
        tileStates: solutionTileStates,
      },
    };

    // Step A: Validate solved configuration using production validator
    const solvedValidation = validateRoute(candidatePuzzle, solutionTileStates);
    if (!solvedValidation.isValid || solvedValidation.visitedPath.length === 0) {
      continue;
    }

    // Step B: Scramble using ONLY legal player operations
    const initialTileStates: Record<string, TileState> = {};
    let scrambledMoves = 0;

    for (const t of tiles) {
      const sol = solutionTileStates[t.id];
      const rotDelta = Math.floor(rng() * 4) as 0 | 1 | 2 | 3;
      let flipped = sol.flipped ?? false;
      let mode = sol.mode ?? 0;

      if (t.type === "T_JUNCTION" || t.type === "CROSS") {
        const modeDelta = Math.floor(rng() * 4) as 0 | 1 | 2 | 3;
        mode = (((mode + modeDelta) % 4) as 0 | 1 | 2 | 3);
        if (modeDelta > 0) scrambledMoves += modeDelta;
      } else {
        const doFlip = rng() > 0.5;
        if (doFlip) {
          flipped = !flipped;
          scrambledMoves += 1;
        }
      }

      const rotation = (((sol.rotation + rotDelta) % 4) as 0 | 1 | 2 | 3);
      if (rotDelta > 0) scrambledMoves += rotDelta;

      initialTileStates[t.id] = { rotation, flipped, mode };
    }

    candidatePuzzle.initialTileStates = initialTileStates;

    // Step C: Ensure initial state is NOT already solved
    let initValidation = validateRoute(candidatePuzzle, initialTileStates);
    let extraScrambleAttempts = 0;
    while ((initValidation.isValid || scrambledMoves < 2) && extraScrambleAttempts < 10) {
      // Pick a random route tile and rotate it by 1
      const routeStep = route[Math.floor(rng() * route.length)];
      const targetTileId = `T${routeStep.gridRow}${routeStep.gridCol}`;
      const cur = initialTileStates[targetTileId];
      initialTileStates[targetTileId] = {
        ...cur,
        rotation: (((cur.rotation + 1) % 4) as 0 | 1 | 2 | 3),
      };
      scrambledMoves += 1;
      initValidation = validateRoute(candidatePuzzle, initialTileStates);
      extraScrambleAttempts++;
    }

    if (initValidation.isValid) {
      continue;
    }

    if (candidatePuzzle.solution) {
      candidatePuzzle.solution.minMoves = scrambledMoves;
    }

    // Step D: Prevent duplicates across session questions
    const sig = getPuzzleSignature(candidatePuzzle);
    if (existingSignatures.has(sig)) {
      continue;
    }

    existingSignatures.add(sig);
    return candidatePuzzle;
  }

  throw new Error(`Failed to generate a valid, distinct Practice Test 2 question for index ${questionIndex} within attempt limits.`);
}

export function generatePractice2Questions(count: number = 5, seed?: number): PuzzleDefinition[] {
  const rng = seed !== undefined ? createSeededRng(seed) : Math.random;
  const existingSignatures = new Set<string>();
  const questions: PuzzleDefinition[] = [];

  for (let i = 0; i < count; i++) {
    const question = generatePractice2Question(i, rng, existingSignatures);
    questions.push(question);
  }

  return questions;
}

// Baseline default set for static references
export const PRACTICE_TEST_2_PUZZLES: PuzzleDefinition[] = generatePractice2Questions(5, 42);




