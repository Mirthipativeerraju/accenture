import { PuzzleDefinition } from "./types";

export const PRACTICE_TEST_1_PUZZLES: PuzzleDefinition[] = [
  // =========================================================================
  // QUESTION 1 — Exact 9x9 arrangement from user specification
  // =========================================================================
  {
    id: "practice-1-q1",
    gridRows: 9,
    gridCols: 9,
    tileRows: 3,
    tileCols: 3,
    tileSize: 3,
    startPos: { row: 1, col: 0, entrySide: "LEFT" },
    destinationPos: { row: 1, col: 7, exitSide: "RIGHT" },
    tiles: [
      // T00 (Rows 0-2, Cols 0-2)
      {
        id: "T00",
        gridRow: 0,
        gridCol: 0,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true }, { active: true, arrowDirection: "UP_LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      // T01 (Rows 0-2, Cols 3-5)
      {
        id: "T01",
        gridRow: 0,
        gridCol: 1,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "DOWN_RIGHT" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
        ],
      },
      // T02 (Rows 0-2, Cols 6-8)
      {
        id: "T02",
        gridRow: 0,
        gridCol: 2,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "DOWN_RIGHT" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
        ],
      },
      // T10 (Rows 3-5, Cols 0-2)
      {
        id: "T10",
        gridRow: 1,
        gridCol: 0,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "DOWN_RIGHT" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
        ],
      },
      // T11 (Rows 3-5, Cols 3-5)
      {
        id: "T11",
        gridRow: 1,
        gridCol: 1,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "UP_LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: true }, { active: false }],
        ],
      },
      // T12 (Rows 3-5, Cols 6-8)
      {
        id: "T12",
        gridRow: 1,
        gridCol: 2,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
        ],
      },
      // T20 (Rows 6-8, Cols 0-2)
      {
        id: "T20",
        gridRow: 2,
        gridCol: 0,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true }, { active: true, arrowDirection: "UP" }, { active: true }],
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
        ],
      },
      // T21 (Rows 6-8, Cols 3-5)
      {
        id: "T21",
        gridRow: 2,
        gridCol: 1,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN_RIGHT" }, { active: true, arrowDirection: "RIGHT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      // T22 (Rows 6-8, Cols 6-8)
      {
        id: "T22",
        gridRow: 2,
        gridCol: 2,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "UP_RIGHT" }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
    ],
    initialTileStates: {
      T00: { rotation: 0, directionReversed: false },
      T01: { rotation: 0, directionReversed: false },
      T02: { rotation: 0, directionReversed: false },
      T10: { rotation: 0, directionReversed: false },
      T11: { rotation: 0, directionReversed: false },
      T12: { rotation: 0, directionReversed: false },
      T20: { rotation: 0, directionReversed: false },
      T21: { rotation: 0, directionReversed: false },
      T22: { rotation: 0, directionReversed: false },
    },
  },

  // =========================================================================
  // QUESTION 2 — Exact 9x9 arrangement from user specification (Section 6)
  // =========================================================================
  {
    id: "practice-1-q2",
    gridRows: 9,
    gridCols: 9,
    tileRows: 3,
    tileCols: 3,
    tileSize: 3,
    startPos: { row: 1, col: 0, entrySide: "LEFT" },
    destinationPos: { row: 1, col: 8, exitSide: "RIGHT" },
    tiles: [
      // T00 / B1 (Rows 0-2, Cols 0-2)
      {
        id: "T00",
        gridRow: 0,
        gridCol: 0,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true }, { active: true, arrowDirection: "UP_LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      // T01 / B2 (Rows 0-2, Cols 3-5)
      {
        id: "T01",
        gridRow: 0,
        gridCol: 1,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "DOWN_RIGHT" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
        ],
      },
      // T02 / B3 (Rows 0-2, Cols 6-8)
      {
        id: "T02",
        gridRow: 0,
        gridCol: 2,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "DOWN_RIGHT" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
        ],
      },
      // T10 / B4 (Rows 3-5, Cols 0-2)
      {
        id: "T10",
        gridRow: 1,
        gridCol: 0,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "DOWN_RIGHT" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
        ],
      },
      // T11 / B5 (Rows 3-5, Cols 3-5)
      {
        id: "T11",
        gridRow: 1,
        gridCol: 1,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "UP_LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: true }, { active: false }],
        ],
      },
      // T12 / B6 (Rows 3-5, Cols 6-8)
      {
        id: "T12",
        gridRow: 1,
        gridCol: 2,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
        ],
      },
      // T20 / B7 (Rows 6-8, Cols 0-2)
      {
        id: "T20",
        gridRow: 2,
        gridCol: 0,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true }, { active: true, arrowDirection: "UP" }, { active: true }],
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
        ],
      },
      // T21 / B8 (Rows 6-8, Cols 3-5)
      {
        id: "T21",
        gridRow: 2,
        gridCol: 1,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "DOWN" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "DOWN_RIGHT" }, { active: true, arrowDirection: "RIGHT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      // T22 / B9 (Rows 6-8, Cols 6-8)
      {
        id: "T22",
        gridRow: 2,
        gridCol: 2,
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "UP_RIGHT" }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
    ],
    initialTileStates: {
      T00: { rotation: 0, directionReversed: false },
      T01: { rotation: 0, directionReversed: false },
      T02: { rotation: 0, directionReversed: false },
      T10: { rotation: 0, directionReversed: false },
      T11: { rotation: 0, directionReversed: false },
      T12: { rotation: 0, directionReversed: false },
      T20: { rotation: 0, directionReversed: false },
      T21: { rotation: 0, directionReversed: false },
      T22: { rotation: 0, directionReversed: false },
    },
  },

  // =========================================================================
  // QUESTION 3 — Deterministic puzzle
  // =========================================================================
  {
    id: "practice-1-q3",
    gridRows: 9,
    gridCols: 9,
    tileRows: 3,
    tileCols: 3,
    tileSize: 3,
    startPos: { row: 1, col: 0, entrySide: "LEFT" },
    destinationPos: { row: 1, col: 8, exitSide: "RIGHT" },
    tiles: [
      {
        id: "T00",
        gridRow: 0,
        gridCol: 0,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "RIGHT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T01",
        gridRow: 0,
        gridCol: 1,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "RIGHT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T02",
        gridRow: 0,
        gridCol: 2,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "RIGHT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T10",
        gridRow: 1,
        gridCol: 0,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T11",
        gridRow: 1,
        gridCol: 1,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T12",
        gridRow: 1,
        gridCol: 2,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T20",
        gridRow: 2,
        gridCol: 0,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T21",
        gridRow: 2,
        gridCol: 1,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T22",
        gridRow: 2,
        gridCol: 2,
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
    ],
    initialTileStates: {
      T00: { rotation: 0, directionReversed: false },
      T01: { rotation: 2, directionReversed: false },
      T02: { rotation: 0, directionReversed: false },
      T10: { rotation: 0, directionReversed: false },
      T11: { rotation: 0, directionReversed: false },
      T12: { rotation: 0, directionReversed: false },
      T20: { rotation: 0, directionReversed: false },
      T21: { rotation: 0, directionReversed: false },
      T22: { rotation: 0, directionReversed: false },
    },
  },
];

export const PRACTICE_1_PUZZLE = PRACTICE_TEST_1_PUZZLES[0];
