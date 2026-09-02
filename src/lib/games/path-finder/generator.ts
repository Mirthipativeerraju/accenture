import { SeededRNG } from "../core/rng";
import { ArrowDirection, Endpoint, GridBlock, PathCell, PathFinderQuestion } from "./types";
import { validateRoute } from "./validator";

export function generatePathFinderQuestion(
  rng: SeededRNG,
  index: number,
  blockGridSize: number = 3,
  blockSize: number = 3
): PathFinderQuestion {
  const totalGridSize = blockGridSize * blockSize;

  // Initialize global cell grid
  const globalCells: PathCell[][] = [];
  for (let r = 0; r < totalGridSize; r++) {
    globalCells[r] = [];
    for (let c = 0; c < totalGridSize; c++) {
      globalCells[r][c] = {
        r: r % blockSize,
        c: c % blockSize,
        active: false,
      };
    }
  }

  // 1. Choose endpoints
  // Pick Start on LEFT (or TOP) and Destination on RIGHT (or BOTTOM)
  const startRow = rng.randomInt(1, totalGridSize - 2);
  const destRow = rng.randomInt(1, totalGridSize - 2);

  const start: Endpoint = {
    side: "LEFT",
    index: startRow,
    type: "START",
  };

  const destination: Endpoint = {
    side: "RIGHT",
    index: destRow,
    type: "DESTINATION",
  };

  // 2. Generate continuous path from (startRow, 0) to (destRow, totalGridSize - 1)
  // Use randomized directional path generation
  const path: { r: number; c: number }[] = [];
  let curR = startRow;
  let curC = 0;

  const visited = new Set<string>();

  while (curC < totalGridSize - 1) {
    path.push({ r: curR, c: curC });
    visited.add(`${curR},${curC}`);

    // Possible next steps (prioritize rightward, vertical winding)
    const options: { r: number; c: number; weight: number }[] = [];

    // Move RIGHT
    if (curC + 1 < totalGridSize && !visited.has(`${curR},${curC + 1}`)) {
      options.push({ r: curR, c: curC + 1, weight: 5 });
    }
    // Move UP
    if (curR > 0 && !visited.has(`${curR - 1},${curC}`)) {
      const w = curR > destRow ? 4 : 2;
      options.push({ r: curR - 1, c: curC, weight: w });
    }
    // Move DOWN
    if (curR < totalGridSize - 1 && !visited.has(`${curR + 1},${curC}`)) {
      const w = curR < destRow ? 4 : 2;
      options.push({ r: curR + 1, c: curC, weight: w });
    }

    if (options.length === 0) {
      // Direct escape to right
      curC++;
      continue;
    }

    // Weighted selection
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
    let randomW = rng.next() * totalWeight;
    let chosen = options[0];
    for (const opt of options) {
      if (randomW < opt.weight) {
        chosen = opt;
        break;
      }
      randomW -= opt.weight;
    }

    curR = chosen.r;
    curC = chosen.c;
  }

  // Connect to the final destination row
  while (curR !== destRow) {
    path.push({ r: curR, c: curC });
    visited.add(`${curR},${curC}`);
    curR += curR < destRow ? 1 : -1;
  }
  path.push({ r: destRow, c: totalGridSize - 1 });
  visited.add(`${destRow},${totalGridSize - 1}`);

  // Set active path cells and assign direction pointing to next cell
  for (let i = 0; i < path.length; i++) {
    const current = path[i];
    globalCells[current.r][current.c].active = true;

    if (i < path.length - 1) {
      const next = path[i + 1];
      const dr = next.r - current.r;
      const dc = next.c - current.c;

      if (dr === -1 && dc === 0) globalCells[current.r][current.c].direction = "UP";
      else if (dr === 1 && dc === 0) globalCells[current.r][current.c].direction = "DOWN";
      else if (dr === 0 && dc === 1) globalCells[current.r][current.c].direction = "RIGHT";
      else if (dr === 0 && dc === -1) globalCells[current.r][current.c].direction = "LEFT";
      else if (dr === -1 && dc === 1) globalCells[current.r][current.c].direction = "UP_RIGHT";
      else if (dr === 1 && dc === 1) globalCells[current.r][current.c].direction = "DOWN_RIGHT";
      else if (dr === 1 && dc === -1) globalCells[current.r][current.c].direction = "DOWN_LEFT";
      else if (dr === -1 && dc === -1) globalCells[current.r][current.c].direction = "UP_LEFT";
    } else {
      // Exit cell points RIGHT (towards destination marker)
      globalCells[current.r][current.c].direction = "RIGHT";
    }
  }

  // 3. Add branching distractor paths/crossings for visual realism
  const numDecoys = rng.randomInt(10, 18);
  for (let d = 0; d < numDecoys; d++) {
    const dr = rng.randomInt(0, totalGridSize - 1);
    const dc = rng.randomInt(0, totalGridSize - 1);
    if (!globalCells[dr][dc].active) {
      globalCells[dr][dc].active = true;
      globalCells[dr][dc].direction = rng.randomChoice(["UP", "DOWN", "LEFT", "RIGHT"]);
    }
  }

  // 4. Construct GridBlocks
  const blocks: GridBlock[][] = [];
  const solutionRotations: number[][] = [];
  const initialRotations: number[][] = [];

  for (let br = 0; br < blockGridSize; br++) {
    blocks[br] = [];
    solutionRotations[br] = [];
    initialRotations[br] = [];

    for (let bc = 0; bc < blockGridSize; bc++) {
      const blockCells: PathCell[][] = [];
      for (let lr = 0; lr < blockSize; lr++) {
        blockCells[lr] = [];
        for (let lc = 0; lc < blockSize; lc++) {
          const gr = br * blockSize + lr;
          const gc = bc * blockSize + lc;
          blockCells[lr][lc] = {
            r: lr,
            c: lc,
            active: globalCells[gr][gc].active,
            direction: globalCells[gr][gc].direction,
          };
        }
      }

      blocks[br][bc] = {
        blockRow: br,
        blockCol: bc,
        size: blockSize,
        cells: blockCells,
        rotation: 0,
      };

      solutionRotations[br][bc] = 0;

      // Scramble: rotate 1 to 4 blocks by 90, 180, or 270 degrees
      const shouldScramble = rng.probability(0.5);
      const scrambleAngle = shouldScramble ? rng.randomChoice([90, 180, 270]) : 0;
      initialRotations[br][bc] = scrambleAngle;
    }
  }

  // Ensure at least 1-2 blocks are rotated so the puzzle requires player interaction
  let totalScrambled = initialRotations.flat().filter((r) => r !== 0).length;
  if (totalScrambled === 0) {
    const rBr = rng.randomInt(0, blockGridSize - 1);
    const rBc = rng.randomInt(0, blockGridSize - 1);
    initialRotations[rBr][rBc] = rng.randomChoice([90, 180, 270]);
  }

  const question: PathFinderQuestion = {
    id: `pf-q-${index + 1}`,
    blockGridSize,
    blockSize,
    totalGridSize,
    blocks,
    start,
    destination,
    initialRotations,
    solutionRotations,
  };

  // Verify that solution rotations solve the puzzle
  const verification = validateRoute(question, solutionRotations, "FORWARD");
  if (!verification.isValid) {
    throw new Error(`Generated Path Finder question ${index + 1} failed solution validation.`);
  }

  return question;
}

export function generatePathFinderQuestions(
  rng: SeededRNG,
  count: number = 10,
  blockGridSize: number = 3,
  blockSize: number = 3
): PathFinderQuestion[] {
  const questions: PathFinderQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generatePathFinderQuestion(rng, i, blockGridSize, blockSize));
  }
  return questions;
}
