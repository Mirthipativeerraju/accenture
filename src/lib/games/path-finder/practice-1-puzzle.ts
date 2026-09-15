import { PuzzleDefinition } from "./types";

/**
 * FIXED / PREDEFINED PRACTICE TEST 1 PUZZLES
 * Exactly 5 static puzzle definitions.
 */
export const PRACTICE_TEST_1_PUZZLES: PuzzleDefinition[] = [
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
        type: "T_JUNCTION",
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
        type: "CORNER",
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
        type: "CORNER",
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
        type: "CORNER",
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
        type: "T_JUNCTION",
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
        type: "STRAIGHT",
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
        type: "CROSS",
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
        type: "CORNER",
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
        type: "CORNER",
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true, arrowDirection: "RIGHT" }, { active: true, arrowDirection: "UP_RIGHT" }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
    ],
    initialTileStates: {
      T00: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T01: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T02: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T10: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T11: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T12: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T20: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T21: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T22: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
    },
  },

  // =========================================================================
  // QUESTION 2 — Unique Practice Test 1 Question 2
  // =========================================================================
  {
    id: "practice-1-q2",
    gridRows: 9,
    gridCols: 9,
    tileRows: 3,
    tileCols: 3,
    tileSize: 3,
    startPos: { row: 1, col: 0, entrySide: "LEFT" },
    destinationPos: { row: 7, col: 8, exitSide: "RIGHT" },
    tiles: [
      // Row 0: T00 = CROSS, T01 = T_JUNCTION, T02 = CORNER
      {
        id: "T00",
        gridRow: 0,
        gridCol: 0,
        type: "CROSS",
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true }, { active: true, arrowDirection: "UP" }, { active: true }],
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
        ],
      },
      {
        id: "T01",
        gridRow: 0,
        gridCol: 1,
        type: "T_JUNCTION",
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true }, { active: true, arrowDirection: "UP_LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T02",
        gridRow: 0,
        gridCol: 2,
        type: "CORNER",
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "UP_LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      // Row 1: T10 = CORNER, T11 = CROSS, T12 = STRAIGHT
      {
        id: "T10",
        gridRow: 1,
        gridCol: 0,
        type: "CORNER",
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "UP_LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T11",
        gridRow: 1,
        gridCol: 1,
        type: "CROSS",
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true }, { active: true, arrowDirection: "UP" }, { active: true }],
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
        ],
      },
      {
        id: "T12",
        gridRow: 1,
        gridCol: 2,
        type: "STRAIGHT",
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: true, arrowDirection: "LEFT" }, { active: true, arrowDirection: "LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      // Row 2: T20 = CORNER, T21 = CROSS, T22 = CORNER
      {
        id: "T20",
        gridRow: 2,
        gridCol: 0,
        type: "CORNER",
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "UP_LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
      {
        id: "T21",
        gridRow: 2,
        gridCol: 1,
        type: "CROSS",
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: true }, { active: true, arrowDirection: "UP" }, { active: true }],
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
        ],
      },
      {
        id: "T22",
        gridRow: 2,
        gridCol: 2,
        type: "CORNER",
        cells: [
          [{ active: false }, { active: true, arrowDirection: "UP" }, { active: false }],
          [{ active: false }, { active: true, arrowDirection: "UP_LEFT" }, { active: true, arrowDirection: "LEFT" }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
    ],
    initialTileStates: {
      T00: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T01: { rotation: 1, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T02: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },

      T10: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T11: { rotation: 2, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T12: { rotation: 1, flipState: 0, mode: 0, flipped: false, directionReversed: false },

      T20: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T21: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T22: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
    },
    solution: {
      minMoves: 9,
      tileStates: {
        T00: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
        T01: { rotation: 1, flipState: 0, mode: 0, flipped: false, directionReversed: false },
        T02: { rotation: 1, flipState: 0, mode: 0, flipped: false, directionReversed: false },
        T10: { rotation: 2, flipState: 0, mode: 0, flipped: false, directionReversed: false },
        T11: { rotation: 2, flipState: 0, mode: 0, flipped: false, directionReversed: false },
        T12: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
        T20: { rotation: 0, flipState: 1, mode: 1, flipped: true, directionReversed: true },
        T21: { rotation: 0, flipState: 1, mode: 1, flipped: true, directionReversed: true },
        T22: { rotation: 3, flipState: 1, mode: 1, flipped: true, directionReversed: true },
      },
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
        type: "STRAIGHT",
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
        type: "STRAIGHT",
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
        type: "STRAIGHT",
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
        type: "STRAIGHT",
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
        type: "STRAIGHT",
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
        type: "STRAIGHT",
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
        type: "STRAIGHT",
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
        type: "STRAIGHT",
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
        type: "STRAIGHT",
        cells: [
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
          [{ active: false }, { active: false }, { active: false }],
        ],
      },
    ],
    initialTileStates: {
      T00: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T01: { rotation: 2, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T02: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T10: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T11: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T12: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T20: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T21: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
      T22: { rotation: 0, flipState: 0, mode: 0, flipped: false, directionReversed: false },
    },
  },

  // =========================================================================
  // QUESTION 4 — Fixed puzzle
  // =========================================================================
  {
    "id": "practice-1-q4",
    "gridRows": 9,
    "gridCols": 9,
    "tileRows": 3,
    "tileCols": 3,
    "tileSize": 3,
    "startPos": {
      "row": 1,
      "col": 0,
      "entrySide": "LEFT"
    },
    "destinationPos": {
      "row": 7,
      "col": 8,
      "exitSide": "RIGHT"
    },
    "tiles": [
      {
        "id": "T00",
        "gridRow": 0,
        "gridCol": 0,
        "type": "CORNER",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP_LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T01",
        "gridRow": 0,
        "gridCol": 1,
        "type": "T_JUNCTION",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP_LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T02",
        "gridRow": 0,
        "gridCol": 2,
        "type": "T_JUNCTION",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP_LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T10",
        "gridRow": 1,
        "gridCol": 0,
        "type": "CROSS",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": true
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T11",
        "gridRow": 1,
        "gridCol": 1,
        "type": "CROSS",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": true
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T12",
        "gridRow": 1,
        "gridCol": 2,
        "type": "CROSS",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": true
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T20",
        "gridRow": 2,
        "gridCol": 0,
        "type": "CROSS",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": true
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T21",
        "gridRow": 2,
        "gridCol": 1,
        "type": "CROSS",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": true
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T22",
        "gridRow": 2,
        "gridCol": 2,
        "type": "CROSS",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": true
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ]
        ]
      }
    ],
    "initialTileStates": {
      "T00": {
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T01": {
        "rotation": 3,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T02": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T10": {
        "rotation": 3,
        "flipState": 7,
        "mode": 7,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 0,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T12": {
        "rotation": 2,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T20": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T21": {
        "rotation": 1,
        "flipState": 10,
        "mode": 10,
        "flipped": false,
        "directionReversed": false
      },
      "T22": {
        "rotation": 2,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 46,
      "tileStates": {
        "T00": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T02": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T10": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T11": {
          "rotation": 3,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T12": {
          "rotation": 1,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T20": {
          "rotation": 2,
          "flipState": 9,
          "mode": 9,
          "flipped": true,
          "directionReversed": true
        },
        "T21": {
          "rotation": 2,
          "flipState": 8,
          "mode": 8,
          "flipped": false,
          "directionReversed": false
        },
        "T22": {
          "rotation": 3,
          "flipState": 7,
          "mode": 7,
          "flipped": true,
          "directionReversed": true
        }
      }
    }
  },

  // =========================================================================
  // QUESTION 5 — Fixed puzzle
  // =========================================================================
  {
    "id": "practice-1-q5",
    "gridRows": 9,
    "gridCols": 9,
    "tileRows": 3,
    "tileCols": 3,
    "tileSize": 3,
    "startPos": {
      "row": 1,
      "col": 0,
      "entrySide": "LEFT"
    },
    "destinationPos": {
      "row": 4,
      "col": 8,
      "exitSide": "RIGHT"
    },
    "tiles": [
      {
        "id": "T00",
        "gridRow": 0,
        "gridCol": 0,
        "type": "STRAIGHT",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true,
              "arrowDirection": "LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T01",
        "gridRow": 0,
        "gridCol": 1,
        "type": "CORNER",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP_LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T02",
        "gridRow": 0,
        "gridCol": 2,
        "type": "CROSS",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": true
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T10",
        "gridRow": 1,
        "gridCol": 0,
        "type": "CROSS",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": true
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T11",
        "gridRow": 1,
        "gridCol": 1,
        "type": "T_JUNCTION",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP_LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T12",
        "gridRow": 1,
        "gridCol": 2,
        "type": "CORNER",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP_LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T20",
        "gridRow": 2,
        "gridCol": 0,
        "type": "T_JUNCTION",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP_LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T21",
        "gridRow": 2,
        "gridCol": 1,
        "type": "T_JUNCTION",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP_LEFT"
            },
            {
              "active": true,
              "arrowDirection": "LEFT"
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": false
            },
            {
              "active": false
            }
          ]
        ]
      },
      {
        "id": "T22",
        "gridRow": 2,
        "gridCol": 2,
        "type": "CROSS",
        "cells": [
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": true
            }
          ],
          [
            {
              "active": false
            },
            {
              "active": true,
              "arrowDirection": "UP"
            },
            {
              "active": false
            }
          ]
        ]
      }
    ],
    "initialTileStates": {
      "T00": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T01": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T02": {
        "rotation": 0,
        "flipState": 10,
        "mode": 10,
        "flipped": false,
        "directionReversed": false
      },
      "T10": {
        "rotation": 1,
        "flipState": 10,
        "mode": 10,
        "flipped": false,
        "directionReversed": false
      },
      "T11": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T12": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T20": {
        "rotation": 0,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T21": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T22": {
        "rotation": 2,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 33,
      "tileStates": {
        "T00": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T01": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T02": {
          "rotation": 1,
          "flipState": 9,
          "mode": 9,
          "flipped": true,
          "directionReversed": true
        },
        "T10": {
          "rotation": 3,
          "flipState": 10,
          "mode": 10,
          "flipped": false,
          "directionReversed": false
        },
        "T11": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T12": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T20": {
          "rotation": 1,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T21": {
          "rotation": 0,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T22": {
          "rotation": 2,
          "flipState": 8,
          "mode": 8,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  },
];

export const PRACTICE_1_PUZZLE = PRACTICE_TEST_1_PUZZLES[0];

/**
 * Returns a randomly shuffled copy of the 5 fixed Practice Test 1 puzzles.
 * Uses the Fisher-Yates algorithm for unbiased shuffling without mutating
 * the original static array.
 */
export function getPractice1Questions(): PuzzleDefinition[] {
   return [...PRACTICE_TEST_1_PUZZLES];
}
