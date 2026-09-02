import { MemoryMazeQuestion, MemoryMazeActionPayload } from "./types";

export function validateMemoryMazeAction(
  question: MemoryMazeQuestion,
  payload: MemoryMazeActionPayload
): boolean {
  if (payload.isTimeout) return false;
  
  if (payload.selectedPathIds.length !== question.correctPath.length) {
    return false;
  }
  
  for (let i = 0; i < question.correctPath.length; i++) {
    if (payload.selectedPathIds[i] !== question.correctPath[i].id) {
      return false;
    }
  }
  
  return true;
}

export function validatePath(gridSize: number, path: { r: number, c: number, id?: string }[]): boolean {
  if (!path || path.length === 0) return false;

  const visited = new Set<string>();

  for (let i = 0; i < path.length; i++) {
    const cell = path[i];

    // Check bounds
    if (cell.r < 0 || cell.r >= gridSize || cell.c < 0 || cell.c >= gridSize) {
      return false;
    }

    const id = `r${cell.r}c${cell.c}`;
    if (visited.has(id)) {
      return false; // No duplicates allowed
    }
    visited.add(id);

    // Check adjacency
    if (i > 0) {
      const prev = path[i - 1];
      const dr = Math.abs(cell.r - prev.r);
      const dc = Math.abs(cell.c - prev.c);

      // Must be exactly adjacent (no diagonals, no disconnected)
      if (!((dr === 1 && dc === 0) || (dr === 0 && dc === 1))) {
        return false;
      }
    }
  }

  return true;
}
