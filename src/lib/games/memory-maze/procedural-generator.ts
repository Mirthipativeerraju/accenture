import { SeededRNG } from "../core/rng";
import { MemoryMazeQuestion, Position, Direction, HiddenWall } from "./types";
import { calculateMazeComplexity } from "./complexity";
import { validateMaze } from "./validator";
import { getMazeStructuralFingerprint } from "./fingerprint";

export type TargetDifficulty = "MEDIUM" | "SOMEWHAT DIFFICULT" | "SOMEWHAT_DIFFICULT" | "DIFFICULT";

interface GenerationConfig {
  gridSize: number;
  minPathLength: number;
  maxPathLength: number;
  minTurns: number;
  minDecisionPoints: number;
  minDeadEndBranches: number;
  maxDeadEndBranches: number;
  twoKeys: boolean;
}

const DIFFICULTY_CONFIGS: Record<"MEDIUM" | "SOMEWHAT DIFFICULT" | "DIFFICULT", GenerationConfig[]> = {
  MEDIUM: [
    { gridSize: 4, minPathLength: 6, maxPathLength: 9, minTurns: 3, minDecisionPoints: 1, minDeadEndBranches: 1, maxDeadEndBranches: 1, twoKeys: false },
    { gridSize: 5, minPathLength: 7, maxPathLength: 10, minTurns: 3, minDecisionPoints: 1, minDeadEndBranches: 1, maxDeadEndBranches: 2, twoKeys: false },
  ],
  "SOMEWHAT DIFFICULT": [
    { gridSize: 5, minPathLength: 9, maxPathLength: 13, minTurns: 4, minDecisionPoints: 2, minDeadEndBranches: 1, maxDeadEndBranches: 2, twoKeys: false },
    { gridSize: 5, minPathLength: 9, maxPathLength: 13, minTurns: 4, minDecisionPoints: 2, minDeadEndBranches: 1, maxDeadEndBranches: 2, twoKeys: true },
    { gridSize: 6, minPathLength: 10, maxPathLength: 14, minTurns: 5, minDecisionPoints: 2, minDeadEndBranches: 1, maxDeadEndBranches: 2, twoKeys: false },
  ],
  DIFFICULT: [
    { gridSize: 6, minPathLength: 12, maxPathLength: 18, minTurns: 5, minDecisionPoints: 2, minDeadEndBranches: 2, maxDeadEndBranches: 3, twoKeys: false },
    { gridSize: 6, minPathLength: 13, maxPathLength: 19, minTurns: 6, minDecisionPoints: 2, minDeadEndBranches: 2, maxDeadEndBranches: 3, twoKeys: true },
  ],
};

const DIRS: { dir: Direction; dr: number; dc: number }[] = [
  { dir: "up", dr: -1, dc: 0 },
  { dir: "down", dr: 1, dc: 0 },
  { dir: "left", dr: 0, dc: -1 },
  { dir: "right", dr: 0, dc: 1 },
];

/**
 * Procedurally generates a balanced, solvable hidden-wall maze matching
 * the target difficulty level and capped strictly at max 6x6.
 */
export function generateProceduralMaze(
  seed: string,
  difficultyInput: TargetDifficulty,
  questionIndex: number,
  excludedFingerprints: Set<string> = new Set()
): MemoryMazeQuestion | null {
  const normDifficulty: "MEDIUM" | "SOMEWHAT DIFFICULT" | "DIFFICULT" =
    difficultyInput === "SOMEWHAT_DIFFICULT" || difficultyInput === "SOMEWHAT DIFFICULT"
      ? "SOMEWHAT DIFFICULT"
      : difficultyInput === "MEDIUM"
      ? "MEDIUM"
      : "DIFFICULT";

  const rng = new SeededRNG(`${seed}-${normDifficulty}-q${questionIndex}`);
  const configs = DIFFICULTY_CONFIGS[normDifficulty];
  const config = configs[rng.randomInt(0, configs.length - 1)];

  for (let attempt = 0; attempt < 35; attempt++) {
    const candidate = tryGenerateGuaranteedPathMaze(
      rng,
      config,
      `${normDifficulty.toLowerCase().replace(/\s+/g, "_")}-proc-${questionIndex}-${attempt}`,
      normDifficulty
    );
    if (candidate) {
      // Ensure grid size does not exceed 6x6
      if (candidate.gridSize > 6) continue;

      const complexity = calculateMazeComplexity(candidate);
      if (
        complexity.isSolvable &&
        complexity.solutionPathLength >= config.minPathLength &&
        complexity.solutionPathLength <= config.maxPathLength + 3 &&
        complexity.turnCount >= config.minTurns &&
        complexity.decisionPointsCount >= config.minDecisionPoints &&
        complexity.deadEndBranchesCount >= config.minDeadEndBranches
      ) {
        const fp = getMazeStructuralFingerprint(candidate);
        if (!excludedFingerprints.has(fp)) {
          return candidate;
        }
      }
    }
  }

  return null;
}

function tryGenerateGuaranteedPathMaze(
  rng: SeededRNG,
  config: GenerationConfig,
  id: string,
  difficulty: "MEDIUM" | "SOMEWHAT DIFFICULT" | "DIFFICULT"
): MemoryMazeQuestion | null {
  const { gridSize, twoKeys } = config;
  if (gridSize > 6) return null;

  const posKey = (p: Position) => `${p.row},${p.col}`;

  // Start cell selection
  const startRow = rng.randomInt(0, gridSize - 1);
  const startCol = rng.randomInt(0, gridSize - 1);
  const start: Position = { row: startRow, col: startCol };

  // Generate self-avoiding random walk with turns for main path
  const targetWalkLength = Math.min(
    gridSize * gridSize - 2,
    config.minPathLength + rng.randomInt(0, config.maxPathLength - config.minPathLength)
  );

  const mainPath: Position[] = [start];
  const visited = new Set<string>([posKey(start)]);

  let current = start;
  let lastDir: Direction | null = null;

  for (let step = 0; step < targetWalkLength; step++) {
    const validMoves: { next: Position; dir: Direction }[] = [];
    for (const { dir, dr, dc } of DIRS) {
      const next: Position = { row: current.row + dr, col: current.col + dc };
      if (next.row >= 0 && next.row < gridSize && next.col >= 0 && next.col < gridSize) {
        if (!visited.has(posKey(next))) {
          validMoves.push({ next, dir });
        }
      }
    }

    if (validMoves.length === 0) break;

    // Prefer turns over straight moves for cognitive engagement
    const turnMoves = validMoves.filter((m) => m.dir !== lastDir);
    const chosen =
      turnMoves.length > 0 && rng.next() < 0.7
        ? turnMoves[rng.randomInt(0, turnMoves.length - 1)]
        : validMoves[rng.randomInt(0, validMoves.length - 1)];

    mainPath.push(chosen.next);
    visited.add(posKey(chosen.next));
    lastDir = chosen.dir;
    current = chosen.next;
  }

  if (mainPath.length < config.minPathLength) {
    return null;
  }

  // Assign Key1, Key2 (if applicable), and Door along the main path
  const doorIndex = mainPath.length - 1;
  let key1Index = Math.floor(mainPath.length * 0.4);
  let key2Index: number | undefined;

  if (twoKeys && mainPath.length >= 6) {
    key1Index = Math.floor(mainPath.length * 0.3);
    key2Index = Math.floor(mainPath.length * 0.7);
    if (key2Index <= key1Index) key2Index = key1Index + 1;
  }

  const key1 = mainPath[key1Index];
  const key2 = key2Index !== undefined ? mainPath[key2Index] : undefined;
  const door = mainPath[doorIndex];

  // Adjacency tree: passages that are OPEN (bidirectional)
  const openPassages = new Set<string>();
  const passageKey = (p1: Position, p2: Position) => {
    const k1 = `${p1.row},${p1.col}`;
    const k2 = `${p2.row},${p2.col}`;
    return k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;
  };

  for (let i = 0; i < mainPath.length - 1; i++) {
    openPassages.add(passageKey(mainPath[i], mainPath[i + 1]));
  }

  // Carve a controlled number of small dead-end branches (1 to 2 steps)
  const candidateBranchOrigins = mainPath.slice(0, -1);
  let createdBranches = 0;

  for (const origin of candidateBranchOrigins) {
    if (createdBranches >= config.maxDeadEndBranches) break;

    if (rng.next() < 0.5) {
      let branchHead = origin;
      const branchLength = rng.randomInt(1, 2);

      for (let b = 0; b < branchLength; b++) {
        const branchMoves: Position[] = [];
        for (const { dr, dc } of DIRS) {
          const n: Position = { row: branchHead.row + dr, col: branchHead.col + dc };
          if (n.row >= 0 && n.row < gridSize && n.col >= 0 && n.col < gridSize) {
            if (!visited.has(posKey(n))) {
              branchMoves.push(n);
            }
          }
        }
        if (branchMoves.length === 0) break;
        const nextB = branchMoves[rng.randomInt(0, branchMoves.length - 1)];
        openPassages.add(passageKey(branchHead, nextB));
        visited.add(posKey(nextB));
        branchHead = nextB;
      }
      createdBranches++;
    }
  }

  // Construct hidden walls on all adjacent grid pairs that are NOT in openPassages
  const walls: HiddenWall[] = [];
  const addedWallEdges = new Set<string>();

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell: Position = { row: r, col: c };

      // Check right neighbor
      if (c + 1 < gridSize) {
        const rightCell: Position = { row: r, col: c + 1 };
        const pk = passageKey(cell, rightCell);
        if (!openPassages.has(pk) && !addedWallEdges.has(pk)) {
          walls.push({ from: cell, direction: "right" });
          addedWallEdges.add(pk);
        }
      }

      // Check down neighbor
      if (r + 1 < gridSize) {
        const downCell: Position = { row: r + 1, col: c };
        const pk = passageKey(cell, downCell);
        if (!openPassages.has(pk) && !addedWallEdges.has(pk)) {
          walls.push({ from: cell, direction: "down" });
          addedWallEdges.add(pk);
        }
      }
    }
  }

  const question: MemoryMazeQuestion = {
    id,
    difficulty,
    gridSize,
    gridDimensions: { rows: gridSize, cols: gridSize },
    playerStartPosition: start,
    keyPosition: key1,
    key1Position: key1,
    key2Position: key2,
    doorPosition: door,
    timeLimitSeconds: 240,
    walls,
  };

  const val = validateMaze(question);
  if (!val.valid) {
    return null;
  }

  return question;
}
