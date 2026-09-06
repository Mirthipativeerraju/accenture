import { SeededRNG } from "../core/rng";
import { MemoryMazeQuestion, CellCoordinate } from "./types";

const MOVES = [
  { dr: -1, dc: 0 }, // Up
  { dr: 1, dc: 0 },  // Down
  { dr: 0, dc: -1 }, // Left
  { dr: 0, dc: 1 }   // Right
];

export function generateMemoryMazeQuestions(
  rng: SeededRNG,
  gridSize: number,
  pathLength: number,
  count: number
): MemoryMazeQuestion[] {
  const questions: MemoryMazeQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    const questionId = `mm-q-${i}`;
    let path: CellCoordinate[] | null = null;
    let attempts = 0;
    
    // Bounded generation retry mechanism
    while (!path && attempts < 100) {
      path = tryGeneratePath(rng, gridSize, pathLength);
      attempts++;
    }
    
    if (!path) {
      throw new Error(`Failed to generate path for grid ${gridSize} len ${pathLength}`);
    }
    
    questions.push({
      id: questionId,
      gridSize,
      gridDimensions: { rows: gridSize, cols: gridSize },
      playerStartPosition: { row: path[0].r, col: path[0].c },
      keyPosition: { row: path[1].r, col: path[1].c },
      doorPosition: { row: path[path.length - 1].r, col: path[path.length - 1].c },
      pathLength,
      correctPath: path
    });
  }
  
  return questions;
}

function tryGeneratePath(rng: SeededRNG, gridSize: number, pathLength: number): CellCoordinate[] | null {
  // Start at a random cell
  const startR = rng.randomInt(0, gridSize - 1);
  const startC = rng.randomInt(0, gridSize - 1);
  
  const path: CellCoordinate[] = [];
  const visited = new Set<string>();
  
  let currentR = startR;
  let currentC = startC;
  
  for (let step = 0; step < pathLength; step++) {
    const cellId = `r${currentR}c${currentC}`;
    path.push({ r: currentR, c: currentC, id: cellId });
    visited.add(cellId);
    
    if (step === pathLength - 1) {
      break; // Path complete
    }
    
    // Find valid neighbors
    const validNeighbors: {r: number, c: number}[] = [];
    
    // Shuffle moves to ensure randomness
    const shuffledMoves = [...MOVES];
    for (let i = shuffledMoves.length - 1; i > 0; i--) {
      const j = rng.randomInt(0, i);
      [shuffledMoves[i], shuffledMoves[j]] = [shuffledMoves[j], shuffledMoves[i]];
    }
    
    for (const move of shuffledMoves) {
      const nr = currentR + move.dr;
      const nc = currentC + move.dc;
      
      // Check bounds
      if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
        const nid = `r${nr}c${nc}`;
        if (!visited.has(nid)) {
          validNeighbors.push({ r: nr, c: nc });
        }
      }
    }
    
    if (validNeighbors.length === 0) {
      // Dead end, path generation failed
      return null;
    }
    
    // Pick the first valid neighbor (already randomly ordered)
    const nextCell = validNeighbors[0];
    currentR = nextCell.r;
    currentC = nextCell.c;
  }
  
  return path;
}
