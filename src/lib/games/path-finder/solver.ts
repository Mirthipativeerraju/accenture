import { MoveOperation, PuzzleDefinition, TileState } from "./types";
import { validateRoute } from "./validator";

export interface SolverResult {
  hasSolution: boolean;
  solutionCount: number;
  minMoves: number;
  solutions: Record<string, TileState>[];
  solutionMoves: MoveOperation[];
}

const POSSIBLE_ROTATIONS: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];
const POSSIBLE_REVERSALS: boolean[] = [false, true];

export function getMoveCost(initial: TileState, target: TileState): number {
  let cost = 0;
  // Rotation moves: 0, 1, 2, 3 (clockwise quarter turns)
  const rotDiff = (((target.rotation - initial.rotation) % 4) + 4) % 4;
  cost += rotDiff;

  // Direction moves: 0 or 1
  if ((initial.directionReversed ?? initial.flipped) !== (target.directionReversed ?? target.flipped)) {
    cost += 1;
  }
  return cost;
}

export function getMoveSequence(
  initialStates: Record<string, TileState>,
  targetStates: Record<string, TileState>
): MoveOperation[] {
  const moves: MoveOperation[] = [];
  for (const [tileId, target] of Object.entries(targetStates)) {
    const initial = initialStates[tileId] || { rotation: 0, directionReversed: false };
    const rotDiff = (((target.rotation - initial.rotation) % 4) + 4) % 4;
    for (let i = 0; i < rotDiff; i++) {
      moves.push({ tileId, operation: "ROTATE" });
    }
    if ((target.directionReversed ?? target.flipped) !== (initial.directionReversed ?? initial.flipped)) {
      moves.push({ tileId, operation: "FLIP" });
    }
  }
  return moves;
}

export function replayMoves(
  initialStates: Record<string, TileState>,
  moves: MoveOperation[]
): Record<string, TileState> {
  const states: Record<string, TileState> = JSON.parse(JSON.stringify(initialStates));
  for (const move of moves) {
    const st = states[move.tileId] || { rotation: 0, directionReversed: false };
    if (move.operation === "ROTATE") {
      st.rotation = (((st.rotation + 1) % 4) as 0 | 1 | 2 | 3);
    } else if (move.operation === "FLIP") {
      st.directionReversed = !st.directionReversed;
      st.flipped = !st.flipped;
    }
    states[move.tileId] = st;
  }
  return states;
}

export function solvePuzzle(
  puzzle: PuzzleDefinition,
  maxMovesToSearch = 6
): SolverResult {
  const tileIds = puzzle.tiles.map((t) => t.id);
  
  // Serialize tile states to string key
  function serialize(states: Record<string, TileState>): string {
    return tileIds.map((id) => `${id}:${states[id]?.rotation || 0}:${states[id]?.directionReversed ? 1 : 0}`).join(";");
  }

  const initialStates = puzzle.initialTileStates;
  const initialKey = serialize(initialStates);

  // Check initial state
  const initialCheck = validateRoute(puzzle, initialStates);
  if (initialCheck.isValid) {
    return {
      hasSolution: true,
      solutionCount: 1,
      minMoves: 0,
      solutions: [initialStates],
      solutionMoves: [],
    };
  }

  // BFS Queue: [states, moves]
  const queue: { states: Record<string, TileState>; moves: MoveOperation[] }[] = [
    { states: initialStates, moves: [] },
  ];
  const visited = new Set<string>([initialKey]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.moves.length >= maxMovesToSearch) continue;

    for (const tileId of tileIds) {
      // Branch 1: ROTATE
      {
        const nextStates: Record<string, TileState> = { ...current.states };
        const st = { ...(nextStates[tileId] || { rotation: 0, directionReversed: false }) };
        st.rotation = (((st.rotation + 1) % 4) as 0 | 1 | 2 | 3);
        nextStates[tileId] = st;

        const key = serialize(nextStates);
        if (!visited.has(key)) {
          visited.add(key);
          const nextMoves = [...current.moves, { tileId, operation: "ROTATE" as const }];
          const res = validateRoute(puzzle, nextStates);
          if (res.isValid) {
            return {
              hasSolution: true,
              solutionCount: 1,
              minMoves: nextMoves.length,
              solutions: [nextStates],
              solutionMoves: nextMoves,
            };
          }
          queue.push({ states: nextStates, moves: nextMoves });
        }
      }

      // Branch 2: FLIP
      {
        const nextStates: Record<string, TileState> = { ...current.states };
        const st = { ...(nextStates[tileId] || { rotation: 0, directionReversed: false }) };
        st.directionReversed = !st.directionReversed;
        nextStates[tileId] = st;

        const key = serialize(nextStates);
        if (!visited.has(key)) {
          visited.add(key);
          const nextMoves = [...current.moves, { tileId, operation: "FLIP" as const }];
          const res = validateRoute(puzzle, nextStates);
          if (res.isValid) {
            return {
              hasSolution: true,
              solutionCount: 1,
              minMoves: nextMoves.length,
              solutions: [nextStates],
              solutionMoves: nextMoves,
            };
          }
          queue.push({ states: nextStates, moves: nextMoves });
        }
      }
    }
  }

  return {
    hasSolution: false,
    solutionCount: 0,
    minMoves: 0,
    solutions: [],
    solutionMoves: [],
  };
}

