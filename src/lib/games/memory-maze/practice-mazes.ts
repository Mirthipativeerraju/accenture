import { MemoryMazeQuestion } from "./types";
import { generateProceduralMaze } from "./procedural-generator";
import { getMazeStructuralFingerprint } from "./fingerprint";

export const PRACTICE_TEST_1_MAZES: MemoryMazeQuestion[] = [
  {
    id: "p1-maze-1",
    stageIdentifier: "Section 1 of 5",
    gridSize: 3,
    gridDimensions: { rows: 3, cols: 3 },
    playerStartPosition: { row: 1, col: 1 },
    keyPosition: { row: 0, col: 0 },
    doorPosition: { row: 2, col: 2 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 1, col: 1 }, direction: "up" },
      { from: { row: 1, col: 1 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "right" },
      { from: { row: 2, col: 1 }, direction: "right" },
    ]
  },
  {
    id: "p1-maze-2",
    stageIdentifier: "Section 2 of 5",
    gridSize: 3,
    gridDimensions: { rows: 3, cols: 3 },
    playerStartPosition: { row: 2, col: 0 },
    keyPosition: { row: 0, col: 2 },
    doorPosition: { row: 1, col: 1 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 2 }, direction: "left" },
    ]
  },
  {
    id: "p1-maze-3",
    stageIdentifier: "Section 3 of 5",
    gridSize: 3,
    gridDimensions: { rows: 3, cols: 3 },
    playerStartPosition: { row: 0, col: 2 },
    keyPosition: { row: 2, col: 0 },
    doorPosition: { row: 0, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 2 }, direction: "left" },
      { from: { row: 1, col: 2 }, direction: "left" },
      { from: { row: 2, col: 1 }, direction: "up" },
      { from: { row: 1, col: 0 }, direction: "up" },
    ]
  },
  {
    id: "p1-maze-4",
    stageIdentifier: "Section 4 of 5",
    gridSize: 3,
    gridDimensions: { rows: 3, cols: 3 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 2, col: 2 },
    doorPosition: { row: 2, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 2 }, direction: "left" },
      { from: { row: 2, col: 1 }, direction: "left" },
    ]
  },
  {
    id: "p1-maze-5",
    stageIdentifier: "Section 5 of 5",
    gridSize: 3,
    gridDimensions: { rows: 3, cols: 3 },
    playerStartPosition: { row: 2, col: 2 },
    keyPosition: { row: 0, col: 0 },
    doorPosition: { row: 0, col: 2 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 2, col: 2 }, direction: "up" },
      { from: { row: 2, col: 1 }, direction: "up" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 2 }, direction: "up" },
    ]
  }
];

export const PRACTICE_TEST_2_MAZES: MemoryMazeQuestion[] = [
  {
    id: "p2-maze-1",
    stageIdentifier: "Section 1 of 5",
    gridSize: 4,
    gridDimensions: { rows: 4, cols: 4 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 0, col: 3 },
    doorPosition: { row: 3, col: 3 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 1, col: 3 }, direction: "left" },
      { from: { row: 2, col: 3 }, direction: "left" },
      { from: { row: 3, col: 3 }, direction: "left" },
    ]
  },
  {
    id: "p2-maze-2",
    stageIdentifier: "Section 2 of 5",
    gridSize: 4,
    gridDimensions: { rows: 4, cols: 4 },
    playerStartPosition: { row: 3, col: 0 },
    keyPosition: { row: 1, col: 2 },
    doorPosition: { row: 0, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 2, col: 0 }, direction: "up" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 3, col: 1 }, direction: "right" },
      { from: { row: 2, col: 1 }, direction: "up" },
      { from: { row: 2, col: 2 }, direction: "up" },
      { from: { row: 2, col: 3 }, direction: "left" },
      { from: { row: 1, col: 3 }, direction: "up" },
      { from: { row: 1, col: 2 }, direction: "left" },
      { from: { row: 0, col: 2 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 0, col: 0 }, direction: "down" },
    ]
  },
  {
    id: "p2-maze-3",
    stageIdentifier: "Section 3 of 5",
    gridSize: 4,
    gridDimensions: { rows: 4, cols: 4 },
    playerStartPosition: { row: 3, col: 3 },
    keyPosition: { row: 0, col: 0 },
    doorPosition: { row: 3, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 3, col: 3 }, direction: "left" },
      { from: { row: 2, col: 3 }, direction: "left" },
      { from: { row: 1, col: 3 }, direction: "left" },
      { from: { row: 0, col: 2 }, direction: "left" },
      { from: { row: 1, col: 2 }, direction: "left" },
      { from: { row: 2, col: 2 }, direction: "down" },
      { from: { row: 2, col: 1 }, direction: "down" },
      { from: { row: 2, col: 1 }, direction: "left" },
      { from: { row: 1, col: 1 }, direction: "left" },
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 3, col: 1 }, direction: "right" },
    ]
  },
  {
    id: "p2-maze-4",
    stageIdentifier: "Section 4 of 5",
    gridSize: 4,
    gridDimensions: { rows: 4, cols: 4 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 3, col: 0 },
    doorPosition: { row: 0, col: 3 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 3, col: 1 }, direction: "up" },
      { from: { row: 3, col: 2 }, direction: "up" },
      { from: { row: 2, col: 3 }, direction: "left" },
      { from: { row: 1, col: 3 }, direction: "left" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "right" },
      { from: { row: 2, col: 1 }, direction: "right" },
      { from: { row: 1, col: 2 }, direction: "down" },
    ]
  },
  {
    id: "p2-maze-5",
    stageIdentifier: "Section 5 of 5",
    gridSize: 4,
    gridDimensions: { rows: 4, cols: 4 },
    playerStartPosition: { row: 3, col: 0 },
    keyPosition: { row: 0, col: 3 },
    doorPosition: { row: 3, col: 3 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 1, col: 3 }, direction: "left" },
      { from: { row: 2, col: 3 }, direction: "down" },
      { from: { row: 2, col: 2 }, direction: "left" },
      { from: { row: 2, col: 2 }, direction: "up" },
      { from: { row: 3, col: 2 }, direction: "left" },
      { from: { row: 3, col: 1 }, direction: "up" },
    ]
  }
];

export const PRACTICE_TEST_3_MAZES: MemoryMazeQuestion[] = [
  {
    id: "p3-maze-1",
    stageIdentifier: "Section 1 of 5",
    gridSize: 4,
    gridDimensions: { rows: 4, cols: 4 },
    playerStartPosition: { row: 3, col: 0 },
    keyPosition: { row: 0, col: 0 },
    key1Position: { row: 0, col: 0 },
    key2Position: { row: 0, col: 3 },
    doorPosition: { row: 3, col: 3 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 1, col: 3 }, direction: "down" },
      { from: { row: 1, col: 2 }, direction: "left" },
      { from: { row: 2, col: 2 }, direction: "right" },
      { from: { row: 2, col: 2 }, direction: "down" },
      { from: { row: 2, col: 1 }, direction: "up" },
      { from: { row: 2, col: 3 }, direction: "down" },
    ]
  },
  {
    id: "p3-maze-2",
    stageIdentifier: "Section 2 of 5",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 0, col: 4 },
    key1Position: { row: 0, col: 4 },
    key2Position: { row: 4, col: 4 },
    doorPosition: { row: 4, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "right" },
      { from: { row: 0, col: 2 }, direction: "right" },
      { from: { row: 1, col: 2 }, direction: "down" },
      { from: { row: 1, col: 3 }, direction: "down" },
      { from: { row: 1, col: 3 }, direction: "right" },
      { from: { row: 2, col: 4 }, direction: "left" },
      { from: { row: 3, col: 4 }, direction: "left" },
      { from: { row: 4, col: 3 }, direction: "left" },
      { from: { row: 3, col: 3 }, direction: "left" },
      { from: { row: 2, col: 2 }, direction: "left" },
      { from: { row: 3, col: 2 }, direction: "left" },
      { from: { row: 4, col: 1 }, direction: "left" },
      { from: { row: 3, col: 1 }, direction: "left" },
    ]
  },
  {
    id: "p3-maze-3",
    stageIdentifier: "Section 3 of 5",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 4, col: 0 },
    key1Position: { row: 4, col: 0 },
    key2Position: { row: 4, col: 4 },
    doorPosition: { row: 0, col: 4 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "right" },
      { from: { row: 1, col: 1 }, direction: "right" },
      { from: { row: 1, col: 1 }, direction: "down" },
      { from: { row: 2, col: 0 }, direction: "down" },
      { from: { row: 2, col: 1 }, direction: "right" },
      { from: { row: 3, col: 1 }, direction: "right" },
      { from: { row: 3, col: 1 }, direction: "down" },
      { from: { row: 4, col: 2 }, direction: "right" },
      { from: { row: 3, col: 2 }, direction: "right" },
      { from: { row: 2, col: 2 }, direction: "right" },
      { from: { row: 1, col: 2 }, direction: "right" },
      { from: { row: 0, col: 3 }, direction: "right" },
      { from: { row: 1, col: 3 }, direction: "right" },
      { from: { row: 2, col: 3 }, direction: "right" },
      { from: { row: 3, col: 3 }, direction: "right" },
    ]
  },
  {
    id: "p3-maze-4",
    stageIdentifier: "Section 4 of 5",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 4, col: 0 },
    keyPosition: { row: 0, col: 0 },
    key1Position: { row: 0, col: 0 },
    key2Position: { row: 0, col: 4 },
    doorPosition: { row: 4, col: 4 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 4, col: 0 }, direction: "right" },
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 0, col: 3 }, direction: "down" },
      { from: { row: 1, col: 4 }, direction: "left" },
      { from: { row: 2, col: 4 }, direction: "left" },
      { from: { row: 3, col: 4 }, direction: "left" },
      { from: { row: 1, col: 3 }, direction: "left" },
      { from: { row: 2, col: 3 }, direction: "left" },
      { from: { row: 3, col: 3 }, direction: "down" },
      { from: { row: 4, col: 2 }, direction: "up" },
      { from: { row: 4, col: 1 }, direction: "up" },
    ]
  },
  {
    id: "p3-maze-5",
    stageIdentifier: "Section 5 of 5",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 4, col: 4 },
    keyPosition: { row: 0, col: 4 },
    key1Position: { row: 0, col: 4 },
    key2Position: { row: 0, col: 0 },
    doorPosition: { row: 4, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 4, col: 4 }, direction: "left" },
      { from: { row: 3, col: 4 }, direction: "left" },
      { from: { row: 2, col: 4 }, direction: "left" },
      { from: { row: 1, col: 4 }, direction: "left" },
      { from: { row: 0, col: 3 }, direction: "down" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 1, col: 1 }, direction: "right" },
      { from: { row: 2, col: 1 }, direction: "right" },
      { from: { row: 3, col: 1 }, direction: "down" },
      { from: { row: 4, col: 2 }, direction: "up" },
      { from: { row: 4, col: 3 }, direction: "up" },
    ]
  }
];

export const FULL_MOCK_MEDIUM_POOL: MemoryMazeQuestion[] = [
  // Medium 0: 3x3 Two-Route Maze (Short path: 4 steps, Alternative longer path: 6 steps)
  {
    id: "fmock-med-3x3",
    stageIdentifier: "Assessment",
    difficulty: "MEDIUM",
    gridSize: 3,
    gridDimensions: { rows: 3, cols: 3 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 1, col: 1 },
    doorPosition: { row: 2, col: 2 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 1 }, direction: "right" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 2, col: 1 }, direction: "right" },
    ],
  },
  // Medium 1: 4x4 (Path length: 7, 3 turns, 1 key)
  {
    id: "fmock-med-1",
    stageIdentifier: "Assessment",
    difficulty: "MEDIUM",
    gridSize: 4,
    gridDimensions: { rows: 4, cols: 4 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 2, col: 1 },
    doorPosition: { row: 3, col: 3 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "down" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 3, col: 1 }, direction: "up" },
      { from: { row: 3, col: 2 }, direction: "up" },
      { from: { row: 2, col: 2 }, direction: "right" },
    ],
  },
  // Medium 2: 4x4 (Path length: 8, 4 turns, 1 key)
  {
    id: "fmock-med-2",
    stageIdentifier: "Assessment",
    difficulty: "MEDIUM",
    gridSize: 4,
    gridDimensions: { rows: 4, cols: 4 },
    playerStartPosition: { row: 3, col: 0 },
    keyPosition: { row: 1, col: 2 },
    doorPosition: { row: 0, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 3, col: 0 }, direction: "up" },
      { from: { row: 3, col: 1 }, direction: "up" },
      { from: { row: 2, col: 2 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "right" },
      { from: { row: 1, col: 3 }, direction: "left" },
    ],
  },
  // Medium 3: 5x5 (Path length: 8, 3 turns, 1 key)
  {
    id: "fmock-med-3",
    stageIdentifier: "Assessment",
    difficulty: "MEDIUM",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 2, col: 2 },
    doorPosition: { row: 4, col: 4 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 2 }, direction: "right" },
      { from: { row: 1, col: 3 }, direction: "down" },
      { from: { row: 2, col: 1 }, direction: "down" },
      { from: { row: 3, col: 2 }, direction: "right" },
      { from: { row: 3, col: 3 }, direction: "down" },
      { from: { row: 4, col: 1 }, direction: "up" },
      { from: { row: 4, col: 2 }, direction: "up" },
    ],
  },
  // Medium 4: 5x5 (Path length: 9, 4 turns, 1 key)
  {
    id: "fmock-med-4",
    stageIdentifier: "Assessment",
    difficulty: "MEDIUM",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 4, col: 0 },
    keyPosition: { row: 1, col: 3 },
    doorPosition: { row: 0, col: 4 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 4, col: 0 }, direction: "up" },
      { from: { row: 3, col: 1 }, direction: "left" },
      { from: { row: 3, col: 1 }, direction: "up" },
      { from: { row: 4, col: 2 }, direction: "up" },
      { from: { row: 3, col: 3 }, direction: "down" },
      { from: { row: 2, col: 2 }, direction: "right" },
      { from: { row: 1, col: 2 }, direction: "right" },
      { from: { row: 1, col: 4 }, direction: "left" },
      { from: { row: 0, col: 3 }, direction: "down" },
    ],
  },
  // Medium 5: 4x4 (Path length: 7, 3 turns, 1 key)
  {
    id: "fmock-med-5",
    stageIdentifier: "Assessment",
    difficulty: "MEDIUM",
    gridSize: 4,
    gridDimensions: { rows: 4, cols: 4 },
    playerStartPosition: { row: 0, col: 3 },
    keyPosition: { row: 3, col: 1 },
    doorPosition: { row: 3, col: 3 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 3 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 2 }, direction: "left" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 2, col: 2 }, direction: "down" },
      { from: { row: 3, col: 2 }, direction: "up" },
    ],
  },
  // Medium 6: 5x5 (Path length: 9, 4 turns, 1 key)
  {
    id: "fmock-med-6",
    stageIdentifier: "Assessment",
    difficulty: "MEDIUM",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 2, col: 0 },
    keyPosition: { row: 0, col: 4 },
    doorPosition: { row: 4, col: 2 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 2, col: 0 }, direction: "down" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 1, col: 3 }, direction: "right" },
      { from: { row: 2, col: 4 }, direction: "left" },
      { from: { row: 3, col: 3 }, direction: "right" },
      { from: { row: 4, col: 4 }, direction: "up" },
      { from: { row: 4, col: 1 }, direction: "right" },
    ],
  },
];

export const FULL_MOCK_SOMEWHAT_DIFFICULT_POOL: MemoryMazeQuestion[] = [
  // Somewhat Difficult 1: 5x5 (Path length: 11, 5 turns, 1 key)
  {
    id: "fmock-swd-1",
    stageIdentifier: "Assessment",
    difficulty: "SOMEWHAT DIFFICULT",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 4, col: 0 },
    doorPosition: { row: 0, col: 4 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 4, col: 1 }, direction: "up" },
      { from: { row: 3, col: 2 }, direction: "down" },
      { from: { row: 2, col: 2 }, direction: "right" },
      { from: { row: 1, col: 3 }, direction: "left" },
      { from: { row: 1, col: 4 }, direction: "left" },
      { from: { row: 0, col: 3 }, direction: "down" },
    ],
  },
  // Somewhat Difficult 2: 5x5 (Path length: 11, 5 turns, 1 key)
  {
    id: "fmock-swd-2",
    stageIdentifier: "Assessment",
    difficulty: "SOMEWHAT DIFFICULT",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 4, col: 4 },
    keyPosition: { row: 0, col: 2 },
    doorPosition: { row: 4, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 4, col: 4 }, direction: "left" },
      { from: { row: 3, col: 4 }, direction: "left" },
      { from: { row: 2, col: 4 }, direction: "left" },
      { from: { row: 1, col: 3 }, direction: "right" },
      { from: { row: 0, col: 3 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "left" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 3, col: 0 }, direction: "right" },
    ],
  },
  // Somewhat Difficult 3: 5x5 (Path length: 12, 6 turns, 2 keys)
  {
    id: "fmock-swd-3",
    stageIdentifier: "Assessment",
    difficulty: "SOMEWHAT DIFFICULT",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 2, col: 4 },
    key1Position: { row: 2, col: 4 },
    key2Position: { row: 4, col: 2 },
    doorPosition: { row: 0, col: 4 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 1, col: 3 }, direction: "right" },
      { from: { row: 2, col: 3 }, direction: "down" },
      { from: { row: 3, col: 4 }, direction: "left" },
      { from: { row: 4, col: 3 }, direction: "up" },
      { from: { row: 3, col: 2 }, direction: "left" },
      { from: { row: 2, col: 2 }, direction: "left" },
      { from: { row: 1, col: 4 }, direction: "down" },
    ],
  },
  // Somewhat Difficult 4: 6x6 (Path length: 12, 5 turns, 1 key)
  {
    id: "fmock-swd-4",
    stageIdentifier: "Assessment",
    difficulty: "SOMEWHAT DIFFICULT",
    gridSize: 6,
    gridDimensions: { rows: 6, cols: 6 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 5, col: 0 },
    doorPosition: { row: 0, col: 5 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 4, col: 0 }, direction: "right" },
      { from: { row: 5, col: 1 }, direction: "up" },
      { from: { row: 4, col: 2 }, direction: "down" },
      { from: { row: 3, col: 2 }, direction: "right" },
      { from: { row: 2, col: 3 }, direction: "right" },
      { from: { row: 1, col: 4 }, direction: "right" },
      { from: { row: 0, col: 4 }, direction: "down" },
    ],
  },
  // Somewhat Difficult 5: 5x5 (Path length: 10, 5 turns, 1 key)
  {
    id: "fmock-swd-5",
    stageIdentifier: "Assessment",
    difficulty: "SOMEWHAT DIFFICULT",
    gridSize: 5,
    gridDimensions: { rows: 5, cols: 5 },
    playerStartPosition: { row: 2, col: 2 },
    keyPosition: { row: 0, col: 0 },
    doorPosition: { row: 4, col: 4 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 2, col: 2 }, direction: "right" },
      { from: { row: 2, col: 1 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 3, col: 2 }, direction: "left" },
      { from: { row: 3, col: 3 }, direction: "up" },
      { from: { row: 4, col: 3 }, direction: "left" },
    ],
  },
  // Somewhat Difficult 6: 6x6 (Path length: 13, 6 turns, 2 keys)
  {
    id: "fmock-swd-6",
    stageIdentifier: "Assessment",
    difficulty: "SOMEWHAT DIFFICULT",
    gridSize: 6,
    gridDimensions: { rows: 6, cols: 6 },
    playerStartPosition: { row: 5, col: 0 },
    keyPosition: { row: 1, col: 1 },
    key1Position: { row: 1, col: 1 },
    key2Position: { row: 1, col: 5 },
    doorPosition: { row: 5, col: 5 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 5, col: 0 }, direction: "right" },
      { from: { row: 4, col: 0 }, direction: "right" },
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 2 }, direction: "down" },
      { from: { row: 0, col: 3 }, direction: "down" },
      { from: { row: 1, col: 4 }, direction: "down" },
      { from: { row: 2, col: 5 }, direction: "left" },
      { from: { row: 3, col: 5 }, direction: "left" },
      { from: { row: 4, col: 5 }, direction: "left" },
    ],
  },
];

export const FULL_MOCK_DIFFICULT_POOL: MemoryMazeQuestion[] = [
  // Difficult 1: 6x6 (Path length: 15, 7 turns, 1 key)
  {
    id: "fmock-diff-1",
    stageIdentifier: "Assessment",
    difficulty: "DIFFICULT",
    gridSize: 6,
    gridDimensions: { rows: 6, cols: 6 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 5, col: 2 },
    doorPosition: { row: 0, col: 5 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "down" },
      { from: { row: 1, col: 2 }, direction: "right" },
      { from: { row: 2, col: 2 }, direction: "right" },
      { from: { row: 3, col: 2 }, direction: "right" },
      { from: { row: 4, col: 2 }, direction: "right" },
      { from: { row: 5, col: 1 }, direction: "up" },
      { from: { row: 5, col: 3 }, direction: "up" },
      { from: { row: 4, col: 3 }, direction: "right" },
      { from: { row: 3, col: 4 }, direction: "down" },
      { from: { row: 2, col: 4 }, direction: "left" },
      { from: { row: 1, col: 5 }, direction: "left" },
      { from: { row: 0, col: 4 }, direction: "down" },
    ],
  },
  // Difficult 2: 6x6 (Path length: 16, 8 turns, 2 keys)
  {
    id: "fmock-diff-2",
    stageIdentifier: "Assessment",
    difficulty: "DIFFICULT",
    gridSize: 6,
    gridDimensions: { rows: 6, cols: 6 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 5, col: 0 },
    key1Position: { row: 5, col: 0 },
    key2Position: { row: 2, col: 5 },
    doorPosition: { row: 5, col: 5 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 4, col: 0 }, direction: "right" },
      { from: { row: 5, col: 1 }, direction: "up" },
      { from: { row: 4, col: 2 }, direction: "down" },
      { from: { row: 3, col: 2 }, direction: "right" },
      { from: { row: 2, col: 3 }, direction: "down" },
      { from: { row: 1, col: 4 }, direction: "down" },
      { from: { row: 1, col: 5 }, direction: "left" },
      { from: { row: 3, col: 5 }, direction: "left" },
      { from: { row: 4, col: 5 }, direction: "left" },
    ],
  },
  // Difficult 3: 6x6 (Path length: 17, 8 turns, 2 keys)
  {
    id: "fmock-diff-3",
    stageIdentifier: "Assessment",
    difficulty: "DIFFICULT",
    gridSize: 6,
    gridDimensions: { rows: 6, cols: 6 },
    playerStartPosition: { row: 5, col: 0 },
    keyPosition: { row: 0, col: 2 },
    key1Position: { row: 0, col: 2 },
    key2Position: { row: 5, col: 4 },
    doorPosition: { row: 0, col: 5 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 5, col: 0 }, direction: "right" },
      { from: { row: 4, col: 0 }, direction: "right" },
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 1, col: 1 }, direction: "down" },
      { from: { row: 0, col: 1 }, direction: "right" },
      { from: { row: 1, col: 2 }, direction: "down" },
      { from: { row: 2, col: 3 }, direction: "down" },
      { from: { row: 3, col: 3 }, direction: "right" },
      { from: { row: 4, col: 4 }, direction: "left" },
      { from: { row: 4, col: 5 }, direction: "left" },
      { from: { row: 3, col: 5 }, direction: "left" },
      { from: { row: 2, col: 5 }, direction: "left" },
      { from: { row: 1, col: 5 }, direction: "left" },
    ],
  },
  // Difficult 4: 6x6 (Path length: 15, 7 turns, 1 key)
  {
    id: "fmock-diff-4",
    stageIdentifier: "Assessment",
    difficulty: "DIFFICULT",
    gridSize: 6,
    gridDimensions: { rows: 6, cols: 6 },
    playerStartPosition: { row: 0, col: 5 },
    keyPosition: { row: 5, col: 5 },
    doorPosition: { row: 0, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 5 }, direction: "left" },
      { from: { row: 1, col: 5 }, direction: "left" },
      { from: { row: 2, col: 5 }, direction: "left" },
      { from: { row: 3, col: 5 }, direction: "left" },
      { from: { row: 4, col: 5 }, direction: "left" },
      { from: { row: 5, col: 4 }, direction: "up" },
      { from: { row: 4, col: 3 }, direction: "down" },
      { from: { row: 3, col: 3 }, direction: "left" },
      { from: { row: 2, col: 2 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "right" },
      { from: { row: 0, col: 1 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
    ],
  },
  // Difficult 5: 6x6 (Path length: 16, 8 turns, 2 keys)
  {
    id: "fmock-diff-5",
    stageIdentifier: "Assessment",
    difficulty: "DIFFICULT",
    gridSize: 6,
    gridDimensions: { rows: 6, cols: 6 },
    playerStartPosition: { row: 3, col: 0 },
    keyPosition: { row: 0, col: 3 },
    key1Position: { row: 0, col: 3 },
    key2Position: { row: 5, col: 3 },
    doorPosition: { row: 3, col: 5 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 3, col: 0 }, direction: "down" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 1, col: 1 }, direction: "down" },
      { from: { row: 0, col: 2 }, direction: "down" },
      { from: { row: 1, col: 3 }, direction: "left" },
      { from: { row: 2, col: 3 }, direction: "left" },
      { from: { row: 3, col: 3 }, direction: "left" },
      { from: { row: 4, col: 3 }, direction: "left" },
      { from: { row: 5, col: 4 }, direction: "up" },
      { from: { row: 4, col: 5 }, direction: "left" },
      { from: { row: 3, col: 5 }, direction: "up" },
    ],
  },
  // Difficult 6: 6x6 (Path length: 17, 9 turns, 2 keys)
  {
    id: "fmock-diff-6",
    stageIdentifier: "Assessment",
    difficulty: "DIFFICULT",
    gridSize: 6,
    gridDimensions: { rows: 6, cols: 6 },
    playerStartPosition: { row: 0, col: 0 },
    keyPosition: { row: 5, col: 1 },
    key1Position: { row: 5, col: 1 },
    key2Position: { row: 1, col: 5 },
    doorPosition: { row: 5, col: 5 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 0, col: 0 }, direction: "right" },
      { from: { row: 1, col: 0 }, direction: "right" },
      { from: { row: 2, col: 0 }, direction: "right" },
      { from: { row: 3, col: 0 }, direction: "right" },
      { from: { row: 4, col: 0 }, direction: "right" },
      { from: { row: 5, col: 1 }, direction: "right" },
      { from: { row: 4, col: 2 }, direction: "down" },
      { from: { row: 3, col: 2 }, direction: "right" },
      { from: { row: 2, col: 3 }, direction: "down" },
      { from: { row: 1, col: 4 }, direction: "down" },
      { from: { row: 1, col: 5 }, direction: "left" },
      { from: { row: 2, col: 5 }, direction: "left" },
      { from: { row: 3, col: 5 }, direction: "left" },
      { from: { row: 4, col: 5 }, direction: "left" },
    ],
  },
];

export const FULL_MEMORY_MOCK_TEST_MAZES: MemoryMazeQuestion[] = [
  // 1. Practice 1 (Fixed 3x3)
  {
    id: "mock-maze-1",
    stageIdentifier: "Question 1 of 1",
    gridSize: 3,
    gridDimensions: { rows: 3, cols: 3 },
    playerStartPosition: { row: 1, col: 1 },
    keyPosition: { row: 0, col: 0 },
    doorPosition: { row: 2, col: 2 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 1, col: 1 }, direction: "up" },
      { from: { row: 1, col: 1 }, direction: "down" },
      { from: { row: 1, col: 1 }, direction: "right" },
      { from: { row: 2, col: 1 }, direction: "right" },
    ],
  },
  // 2. Second Practice Maze (3x3, fixed)
  {
    id: "mock-maze-2",
    stageIdentifier: "Question 1 of 1",
    gridSize: 3,
    gridDimensions: { rows: 3, cols: 3 },
    playerStartPosition: { row: 2, col: 1 },
    keyPosition: { row: 0, col: 2 },
    doorPosition: { row: 1, col: 0 },
    timeLimitSeconds: 240,
    walls: [
      { from: { row: 2, col: 1 }, direction: "left" },
      { from: { row: 2, col: 1 }, direction: "up" },
      { from: { row: 1, col: 1 }, direction: "left" },
      { from: { row: 1, col: 1 }, direction: "right" },
    ],
  },
  // 3. Assessment Maze 1 (MEDIUM)
  {
    ...FULL_MOCK_MEDIUM_POOL[0],
    stageIdentifier: "Question 1 of 5",
    difficulty: "MEDIUM",
  },
  // 4. Assessment Maze 2 (SOMEWHAT DIFFICULT)
  {
    ...FULL_MOCK_SOMEWHAT_DIFFICULT_POOL[0],
    stageIdentifier: "Question 2 of 5",
    difficulty: "SOMEWHAT DIFFICULT",
  },
  // 5. Assessment Maze 3 (SOMEWHAT DIFFICULT)
  {
    ...FULL_MOCK_SOMEWHAT_DIFFICULT_POOL[1],
    stageIdentifier: "Question 3 of 5",
    difficulty: "SOMEWHAT DIFFICULT",
  },
  // 6. Assessment Maze 4 (DIFFICULT)
  {
    ...FULL_MOCK_DIFFICULT_POOL[0],
    stageIdentifier: "Question 4 of 5",
    difficulty: "DIFFICULT",
  },
  // 7. Assessment Maze 5 (DIFFICULT)
  {
    ...FULL_MOCK_DIFFICULT_POOL[1],
    stageIdentifier: "Question 5 of 5",
    difficulty: "DIFFICULT",
  },
];

/**
 * Generates a session-locked 5-question set for the Full Mock assessment:
 * - Practice 1 (fixed mock-maze-1)
 * - Practice 2 (fixed mock-maze-2)
 * - Assessment Q1: MEDIUM
 * - Assessment Q2: SOMEWHAT DIFFICULT
 * - Assessment Q3: SOMEWHAT DIFFICULT (distinct from Q2)
 * - Assessment Q4: DIFFICULT
 * - Assessment Q5: DIFFICULT (distinct from Q4)
 * Returns the full sequence including the 2 fixed practice mazes and the 5 assessment mazes.
 */
export function generateFullMockMazes(seed?: string): MemoryMazeQuestion[] {
  // Practice 1 & 2 remain fixed
  const p1 = FULL_MEMORY_MOCK_TEST_MAZES[0];
  const p2 = FULL_MEMORY_MOCK_TEST_MAZES[1];

  // Structural fingerprints of all Practice Test 1, 2, and 3 mazes
  const practiceMazes = [
    ...PRACTICE_TEST_1_MAZES,
    ...PRACTICE_TEST_2_MAZES,
    ...PRACTICE_TEST_3_MAZES,
  ];
  const excludedFingerprints = new Set<string>(
    practiceMazes.map((m) => getMazeStructuralFingerprint(m))
  );

  let medList = [...FULL_MOCK_MEDIUM_POOL];
  let swdList = [...FULL_MOCK_SOMEWHAT_DIFFICULT_POOL];
  let diffList = [...FULL_MOCK_DIFFICULT_POOL];

  if (seed) {
    // Simple deterministic pseudo-random shuffle based on seed string
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
    const pseudoRand = () => {
      h = (Math.imul(48271, h) + 1) | 0;
      return (h >>> 0) / 4294967296;
    };
    const shuffleArray = <T>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(pseudoRand() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    medList = shuffleArray(medList);
    swdList = shuffleArray(swdList);
    diffList = shuffleArray(diffList);
  }

  // Select Q1 (MEDIUM)
  let q1Candidate = seed ? generateProceduralMaze(seed, "MEDIUM", 1, excludedFingerprints) : null;
  if (!q1Candidate) {
    q1Candidate = medList.find((m) => !excludedFingerprints.has(getMazeStructuralFingerprint(m))) || medList[0];
  }
  const q1 = { ...q1Candidate, stageIdentifier: "Question 1 of 5", difficulty: "MEDIUM" as const };
  excludedFingerprints.add(getMazeStructuralFingerprint(q1));

  // Select Q2 (SOMEWHAT DIFFICULT)
  let q2Candidate = seed ? generateProceduralMaze(seed, "SOMEWHAT DIFFICULT", 2, excludedFingerprints) : null;
  if (!q2Candidate) {
    q2Candidate = swdList.find((m) => !excludedFingerprints.has(getMazeStructuralFingerprint(m))) || swdList[0];
  }
  const q2 = { ...q2Candidate, stageIdentifier: "Question 2 of 5", difficulty: "SOMEWHAT DIFFICULT" as const };
  excludedFingerprints.add(getMazeStructuralFingerprint(q2));

  // Select Q3 (SOMEWHAT DIFFICULT)
  let q3Candidate = seed ? generateProceduralMaze(seed, "SOMEWHAT DIFFICULT", 3, excludedFingerprints) : null;
  if (!q3Candidate) {
    q3Candidate = swdList.find((m) => !excludedFingerprints.has(getMazeStructuralFingerprint(m))) || swdList[1];
  }
  const q3 = { ...q3Candidate, stageIdentifier: "Question 3 of 5", difficulty: "SOMEWHAT DIFFICULT" as const };
  excludedFingerprints.add(getMazeStructuralFingerprint(q3));

  // Select Q4 (DIFFICULT)
  let q4Candidate = seed ? generateProceduralMaze(seed, "DIFFICULT", 4, excludedFingerprints) : null;
  if (!q4Candidate) {
    q4Candidate = diffList.find((m) => !excludedFingerprints.has(getMazeStructuralFingerprint(m))) || diffList[0];
  }
  const q4 = { ...q4Candidate, stageIdentifier: "Question 4 of 5", difficulty: "DIFFICULT" as const };
  excludedFingerprints.add(getMazeStructuralFingerprint(q4));

  // Select Q5 (DIFFICULT)
  let q5Candidate = seed ? generateProceduralMaze(seed, "DIFFICULT", 5, excludedFingerprints) : null;
  if (!q5Candidate) {
    q5Candidate = diffList.find((m) => !excludedFingerprints.has(getMazeStructuralFingerprint(m))) || diffList[1];
  }
  const q5 = { ...q5Candidate, stageIdentifier: "Question 5 of 5", difficulty: "DIFFICULT" as const };
  excludedFingerprints.add(getMazeStructuralFingerprint(q5));

  return [p1, p2, q1, q2, q3, q4, q5];
}

export function getMazesForVariant(variantId: string, seed?: string): MemoryMazeQuestion[] {
  switch (variantId) {
    case "practice-1":
      return PRACTICE_TEST_1_MAZES;
    case "practice-2":
      return PRACTICE_TEST_2_MAZES;
    case "practice-3":
      return PRACTICE_TEST_3_MAZES;
    case "full-memory-mock-test":
      return generateFullMockMazes(seed);
    default:
      return PRACTICE_TEST_1_MAZES;
  }
}



