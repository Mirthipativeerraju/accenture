import { PuzzleDefinition } from "./types";

/**
 * FIXED / PREDEFINED PRACTICE TEST 3 PUZZLES
 * Exactly 5 static puzzle definitions of medium-to-difficult progression.
 * Q1: 14 moves (Moderately difficult warm-up)
 * Q2: 18 moves (Medium difficulty with misleading branches)
 * Q3: 21 moves (Medium-hard T-junction/Cross interactions)
 * Q4: 24 moves (Medium-hard rotation & direction-state coordination)
 * Q5: 27 moves (Hardest labyrinth of Practice Test 3, comfortably solvable)
 */
export const PRACTICE_TEST_3_PUZZLES: PuzzleDefinition[] = [
  {
    "id": "practice-3-q1",
    "gridRows": 12,
    "gridCols": 12,
    "tileRows": 4,
    "tileCols": 4,
    "tileSize": 3,
    "startPos": {
      "row": 1,
      "col": 0,
      "entrySide": "LEFT"
    },
    "destinationPos": {
      "row": 10,
      "col": 11,
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
        "id": "T02",
        "gridRow": 0,
        "gridCol": 2,
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
        "id": "T03",
        "gridRow": 0,
        "gridCol": 3,
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
        "id": "T10",
        "gridRow": 1,
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
              "arrowDirection":"UP"
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
              "arrowDirection": "UP"
            },
            {
              "active": true,
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
        "id": "T13",
        "gridRow": 1,
        "gridCol": 3,
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
              "active": true
            },
            {
              "active": false
            }
          ],
          [
            {
              "active": true,
              "arrowDirection": "RIGHT"
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
        "id": "T22",
        "gridRow": 2,
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
              "active": true,
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
        "id": "T23",
        "gridRow": 2,
        "gridCol": 3,
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
        "id": "T30",
        "gridRow": 3,
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
        "id": "T31",
        "gridRow": 3,
        "gridCol": 1,
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
        "id": "T32",
        "gridRow": 3,
        "gridCol": 2,
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
        "id": "T33",
        "gridRow": 3,
        "gridCol": 3,
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
      }
    ],
    "initialTileStates": {
      "T00": {
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T01": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
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
      "T03": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T12": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T13": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T20": {
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T21": {
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T22": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T23": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T30": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T31": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T32": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T33": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      }
    },
    "solution": {
      "minMoves": 18,
      "tileStates": {
        "T00": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 0,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T02": {
          "rotation": 0,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T03": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T10": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T11": {
          "rotation": 0,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T12": {
          "rotation": 0,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T13": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T20": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T21": {
          "rotation": 0,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T22": {
          "rotation": 0,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T23": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T30": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T31": {
          "rotation": 0,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T32": {
          "rotation": 0,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T33": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  },
  {
    "id": "practice-3-q2",
    "gridRows": 9,
    "gridCols": 9,
    "tileRows": 3,
    "tileCols": 3,
    "tileSize": 3,
    "startPos": {
      "row": 7,
      "col": 0,
      "entrySide": "LEFT"
    },
    "destinationPos": {
      "row": 1,
      "col": 8,
      "exitSide": "RIGHT"
    },
    "tiles": [
      {
        "id": "T00",
        "gridRow": 0,
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
        "id": "T01",
        "gridRow": 0,
        "gridCol": 1,
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
        "id": "T02",
        "gridRow": 0,
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
        "id": "T12",
        "gridRow": 1,
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
      }
    ],
    "initialTileStates": {
      "T00": {
        "rotation": 3,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T01": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T02": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 0,
        "flipState": 11,
        "mode": 11,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T12": {
        "rotation": 1,
        "flipState": 2,
        "mode": 2,
        "flipped": false,
        "directionReversed": false
      },
      "T20": {
        "rotation": 0,
        "flipState": 2,
        "mode": 2,
        "flipped": false,
        "directionReversed": false
      },
      "T21": {
        "rotation": 3,
        "flipState": 2,
        "mode": 2,
        "flipped": false,
        "directionReversed": false
      },
      "T22": {
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      }
    },
    "solution": {
      "minMoves": 18,
      "tileStates": {
        "T00": {
          "rotation": 1,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 0,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T10": {
          "rotation": 0,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T11": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T12": {
          "rotation": 0,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T20": {
          "rotation": 0,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T21": {
          "rotation": 3,
          "flipState": 6,
          "mode": 6,
          "flipped": false,
          "directionReversed": false
        },
        "T22": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  },
  {
    "id": "practice-3-q3",
    "gridRows": 9,
    "gridCols": 9,
    "tileRows": 3,
    "tileCols": 3,
    "tileSize": 3,
    "startPos": {
      "row": 4,
      "col": 0,
      "entrySide": "LEFT"
    },
    "destinationPos": {
      "row": 1,
      "col": 8,
      "exitSide": "RIGHT"
    },
    "tiles": [
      {
        "id": "T00",
        "gridRow": 0,
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
        "id": "T01",
        "gridRow": 0,
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
        "id": "T12",
        "gridRow": 1,
        "gridCol": 2,
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
        "id": "T20",
        "gridRow": 2,
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
      }
    ],
    "initialTileStates": {
      "T00": {
        "rotation": 1,
        "flipState": 5,
        "mode": 5,
        "flipped": true,
        "directionReversed": true
      },
      "T01": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T02": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 0,
        "flipState": 7,
        "mode": 7,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T12": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T20": {
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T21": {
        "rotation": 0,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T22": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      }
    },
    "solution": {
      "minMoves": 21,
      "tileStates": {
        "T00": {
          "rotation": 1,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T01": {
          "rotation": 0,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T02": {
          "rotation": 1,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T10": {
          "rotation": 2,
          "flipState": 8,
          "mode": 8,
          "flipped": false,
          "directionReversed": false
        },
        "T11": {
          "rotation": 3,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T12": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T20": {
          "rotation": 0,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T21": {
          "rotation": 2,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T22": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        }
      }
    }
  },
  {
    "id": "practice-3-q4",
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
        "id": "T12",
        "gridRow": 1,
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
        "id": "T20",
        "gridRow": 2,
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
      }
    ],
    "initialTileStates": {
      "T00": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T01": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T02": {
        "rotation": 2,
        "flipState": 8,
        "mode": 8,
        "flipped": false,
        "directionReversed": false
      },
      "T10": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T12": {
        "rotation": 2,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T20": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T21": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T22": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      }
    },
    "solution": {
      "minMoves": 24,
      "tileStates": {
        "T00": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T01": {
          "rotation": 0,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 2,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T10": {
          "rotation": 1,
          "flipState": 4,
          "mode": 4,
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
          "rotation": 3,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T20": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T21": {
          "rotation": 1,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T22": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  },
  {
    "id": "practice-3-q5",
    "gridRows": 9,
    "gridCols": 9,
    "tileRows": 3,
    "tileCols": 3,
    "tileSize": 3,
    "startPos": {
      "row": 7,
      "col": 0,
      "entrySide": "LEFT"
    },
    "destinationPos": {
      "row": 1,
      "col": 8,
      "exitSide": "RIGHT"
    },
    "tiles": [
      {
        "id": "T00",
        "gridRow": 0,
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
        "id": "T01",
        "gridRow": 0,
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
        "id": "T11",
        "gridRow": 1,
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
      }
    ],
    "initialTileStates": {
      "T00": {
        "rotation": 1,
        "flipState": 11,
        "mode": 11,
        "flipped": true,
        "directionReversed": true
      },
      "T01": {
        "rotation": 3,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T02": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T12": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T20": {
        "rotation": 0,
        "flipState": 7,
        "mode": 7,
        "flipped": true,
        "directionReversed": true
      },
      "T21": {
        "rotation": 0,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T22": {
        "rotation": 0,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 27,
      "tileStates": {
        "T00": {
          "rotation": 2,
          "flipState": 7,
          "mode": 7,
          "flipped": true,
          "directionReversed": true
        },
        "T01": {
          "rotation": 1,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 1,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T10": {
          "rotation": 0,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T11": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T12": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T20": {
          "rotation": 1,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T21": {
          "rotation": 0,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T22": {
          "rotation": 0,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  }
];

export const PRACTICE_3_PUZZLE = PRACTICE_TEST_3_PUZZLES[0];

/**
 * Returns the 5 fixed Practice Test 3 puzzles in deterministic order.
 */
export function getPractice3Questions(): PuzzleDefinition[] {
  return [...PRACTICE_TEST_3_PUZZLES];
}
