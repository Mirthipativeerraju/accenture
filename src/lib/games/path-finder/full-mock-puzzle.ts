import { PuzzleDefinition } from "./types";

/**
 * DEDICATED FULL MOCK TEST PUZZLES
 *
 * Contains distinct 3x3 and 4x4 selectable-tile puzzles that are completely
 * separate from Practice Test 1, Practice Test 2, and Practice Test 3.
 *
 * Full Mock Test requirements:
 * - Exactly 5 questions per attempt.
 * - Exactly 3 questions from the 3x3 puzzle pool (9x9 grid).
 * - Exactly 2 questions from the 4x4 puzzle pool (12x12 grid).
 * - 0 duplicate questions within a single test attempt.
 * - Independent selection and randomized ordering.
 */

export const FULL_MOCK_3X3_PUZZLES: PuzzleDefinition[] = [
  {
    "id": "full-mock-3x3-q1",
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
      "row": 4,
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
        "flipState": 1,
        "mode": 1,
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
        "rotation": 1,
        "flipState": 5,
        "mode": 5,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 2,
        "flipState": 2,
        "mode": 2,
        "flipped": false,
        "directionReversed": false
      },
      "T11": {
        "rotation": 3,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T12": {
        "rotation": 3,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T20": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T21": {
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T22": {
        "rotation": 3,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      }
    },
    "solution": {
      "minMoves": 36,
      "tileStates": {
        "T00": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 3,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 3,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T10": {
          "rotation": 0,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T11": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T12": {
          "rotation": 1,
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
          "rotation": 1,
          "flipState": 2,
          "mode": 2,
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
      }
    }
  },
  {
    "id": "full-mock-3x3-q2",
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
      "T10": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T12": {
        "rotation": 1,
        "flipState": 5,
        "mode": 5,
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
        "rotation": 1,
        "flipState": 7,
        "mode": 7,
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
    },
    "solution": {
      "minMoves": 29,
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
          "rotation": 2,
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
          "rotation": 3,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T20": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T21": {
          "rotation": 1,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T22": {
          "rotation": 1,
          "flipState": 9,
          "mode": 9,
          "flipped": true,
          "directionReversed": true
        }
      }
    }
  },
  {
    "id": "full-mock-3x3-q3",
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
      "row": 1,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
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
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 3,
        "flipState": 9,
        "mode": 9,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 1,
        "flipState": 2,
        "mode": 2,
        "flipped": false,
        "directionReversed": false
      },
      "T12": {
        "rotation": 1,
        "flipState": 5,
        "mode": 5,
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
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T22": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 30,
      "tileStates": {
        "T00": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
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
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T10": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T11": {
          "rotation": 3,
          "flipState": 7,
          "mode": 7,
          "flipped": true,
          "directionReversed": true
        },
        "T12": {
          "rotation": 3,
          "flipState": 6,
          "mode": 6,
          "flipped": false,
          "directionReversed": false
        },
        "T20": {
          "rotation": 2,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T21": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
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
    "id": "full-mock-3x3-q4",
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T01": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T02": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T11": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T12": {
        "rotation": 0,
        "flipState": 5,
        "mode": 5,
        "flipped": true,
        "directionReversed": true
      },
      "T20": {
        "rotation": 1,
        "flipState": 5,
        "mode": 5,
        "flipped": true,
        "directionReversed": true
      },
      "T21": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T22": {
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 43,
      "tileStates": {
        "T00": {
          "rotation": 0,
          "flipState": 5,
          "mode": 5,
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
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T10": {
          "rotation": 0,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T11": {
          "rotation": 0,
          "flipState": 11,
          "mode": 11,
          "flipped": true,
          "directionReversed": true
        },
        "T12": {
          "rotation": 0,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T20": {
          "rotation": 3,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T21": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
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
      }
    }
  },
  {
    "id": "full-mock-3x3-q5",
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "flipState": 3,
        "mode": 3,
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
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T10": {
        "rotation": 3,
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
        "flipState": 8,
        "mode": 8,
        "flipped": false,
        "directionReversed": false
      },
      "T20": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T21": {
        "rotation": 1,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T22": {
        "rotation": 0,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      }
    },
    "solution": {
      "minMoves": 30,
      "tileStates": {
        "T00": {
          "rotation": 3,
          "flipState": 8,
          "mode": 8,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 3,
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
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T11": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T12": {
          "rotation": 0,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T20": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T21": {
          "rotation": 1,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T22": {
          "rotation": 0,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        }
      }
    }
  },
  {
    "id": "full-mock-3x3-q6",
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "flipState": 2,
        "mode": 2,
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
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 3,
        "flipState": 9,
        "mode": 9,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 3,
        "flipState": 2,
        "mode": 2,
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
      "T20": {
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T21": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
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
      "minMoves": 58,
      "tileStates": {
        "T00": {
          "rotation": 0,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 0,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T10": {
          "rotation": 0,
          "flipState": 6,
          "mode": 6,
          "flipped": false,
          "directionReversed": false
        },
        "T11": {
          "rotation": 2,
          "flipState": 10,
          "mode": 10,
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
        "T20": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T21": {
          "rotation": 1,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T22": {
          "rotation": 3,
          "flipState": 8,
          "mode": 8,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  }
];

export const FULL_MOCK_4X4_PUZZLES: PuzzleDefinition[] = [
  {
    "id": "full-mock-4x4-q1",
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T03",
        "gridRow": 0,
        "gridCol": 3,
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
        "id": "T13",
        "gridRow": 1,
        "gridCol": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
      },
      {
        "id": "T23",
        "gridRow": 2,
        "gridCol": 3,
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
        "id": "T30",
        "gridRow": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T32",
        "gridRow": 3,
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
        "id": "T33",
        "gridRow": 3,
        "gridCol": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "flipState": 7,
        "mode": 7,
        "flipped": true,
        "directionReversed": true
      },
      "T01": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T02": {
        "rotation": 3,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T03": {
        "rotation": 3,
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
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T12": {
        "rotation": 3,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T13": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T20": {
        "rotation": 3,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T21": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T22": {
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T23": {
        "rotation": 0,
        "flipState": 5,
        "mode": 5,
        "flipped": true,
        "directionReversed": true
      },
      "T30": {
        "rotation": 0,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T31": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T32": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T33": {
        "rotation": 0,
        "flipState": 9,
        "mode": 9,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 70,
      "tileStates": {
        "T00": {
          "rotation": 0,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T01": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 0,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T03": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T10": {
          "rotation": 3,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T11": {
          "rotation": 3,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T12": {
          "rotation": 1,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T13": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T20": {
          "rotation": 0,
          "flipState": 10,
          "mode": 10,
          "flipped": false,
          "directionReversed": false
        },
        "T21": {
          "rotation": 2,
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
          "rotation": 1,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T30": {
          "rotation": 1,
          "flipState": 11,
          "mode": 11,
          "flipped": true,
          "directionReversed": true
        },
        "T31": {
          "rotation": 3,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T32": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T33": {
          "rotation": 3,
          "flipState": 8,
          "mode": 8,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  },
  {
    "id": "full-mock-4x4-q2",
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T13",
        "gridRow": 1,
        "gridCol": 3,
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
      },
      {
        "id": "T23",
        "gridRow": 2,
        "gridCol": 3,
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
        "id": "T32",
        "gridRow": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
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
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T03": {
        "rotation": 3,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T11": {
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T12": {
        "rotation": 1,
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
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T21": {
        "rotation": 1,
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
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T30": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T31": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T32": {
        "rotation": 1,
        "flipState": 9,
        "mode": 9,
        "flipped": true,
        "directionReversed": true
      },
      "T33": {
        "rotation": 0,
        "flipState": 6,
        "mode": 6,
        "flipped": false,
        "directionReversed": false
      }
    },
    "solution": {
      "minMoves": 41,
      "tileStates": {
        "T00": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T03": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
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
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T12": {
          "rotation": 0,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T13": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
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
          "rotation": 2,
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
        },
        "T23": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T30": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T31": {
          "rotation": 3,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T32": {
          "rotation": 3,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T33": {
          "rotation": 3,
          "flipState": 8,
          "mode": 8,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  },
  {
    "id": "full-mock-4x4-q3",
    "gridRows": 12,
    "gridCols": 12,
    "tileRows": 4,
    "tileCols": 4,
    "tileSize": 3,
    "startPos": {
      "row": 4,
      "col": 0,
      "entrySide": "LEFT"
    },
    "destinationPos": {
      "row": 1,
      "col": 11,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T13",
        "gridRow": 1,
        "gridCol": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T32",
        "gridRow": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "rotation": 2,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T01": {
        "rotation": 3,
        "flipState": 6,
        "mode": 6,
        "flipped": false,
        "directionReversed": false
      },
      "T02": {
        "rotation": 2,
        "flipState": 5,
        "mode": 5,
        "flipped": true,
        "directionReversed": true
      },
      "T03": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T10": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T11": {
        "rotation": 0,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T12": {
        "rotation": 1,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T13": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T20": {
        "rotation": 3,
        "flipState": 7,
        "mode": 7,
        "flipped": true,
        "directionReversed": true
      },
      "T21": {
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T22": {
        "rotation": 3,
        "flipState": 7,
        "mode": 7,
        "flipped": true,
        "directionReversed": true
      },
      "T23": {
        "rotation": 2,
        "flipState": 2,
        "mode": 2,
        "flipped": false,
        "directionReversed": false
      },
      "T30": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T31": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
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
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 73,
      "tileStates": {
        "T00": {
          "rotation": 1,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 0,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 0,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T03": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T10": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T11": {
          "rotation": 0,
          "flipState": 4,
          "mode": 4,
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
        "T13": {
          "rotation": 3,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T20": {
          "rotation": 3,
          "flipState": 7,
          "mode": 7,
          "flipped": true,
          "directionReversed": true
        },
        "T21": {
          "rotation": 2,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T22": {
          "rotation": 2,
          "flipState": 9,
          "mode": 9,
          "flipped": true,
          "directionReversed": true
        },
        "T23": {
          "rotation": 1,
          "flipState": 10,
          "mode": 10,
          "flipped": false,
          "directionReversed": false
        },
        "T30": {
          "rotation": 2,
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
          "rotation": 1,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T33": {
          "rotation": 0,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        }
      }
    }
  },
  {
    "id": "full-mock-4x4-q4",
    "gridRows": 12,
    "gridCols": 12,
    "tileRows": 4,
    "tileCols": 4,
    "tileSize": 3,
    "startPos": {
      "row": 10,
      "col": 0,
      "entrySide": "LEFT"
    },
    "destinationPos": {
      "row": 4,
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
        "id": "T03",
        "gridRow": 0,
        "gridCol": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T13",
        "gridRow": 1,
        "gridCol": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
      },
      {
        "id": "T23",
        "gridRow": 2,
        "gridCol": 3,
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
        "id": "T30",
        "gridRow": 3,
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
        "id": "T31",
        "gridRow": 3,
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
        "rotation": 0,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T01": {
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T02": {
        "rotation": 3,
        "flipState": 5,
        "mode": 5,
        "flipped": true,
        "directionReversed": true
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
        "flipState": 2,
        "mode": 2,
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
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T13": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T20": {
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T21": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T22": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T23": {
        "rotation": 0,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T30": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T31": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T32": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T33": {
        "rotation": 1,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 59,
      "tileStates": {
        "T00": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T02": {
          "rotation": 2,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T03": {
          "rotation": 0,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T10": {
          "rotation": 3,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T11": {
          "rotation": 1,
          "flipState": 4,
          "mode": 4,
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
        "T13": {
          "rotation": 0,
          "flipState": 3,
          "mode": 3,
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
          "rotation": 3,
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
          "rotation": 3,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T30": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T31": {
          "rotation": 0,
          "flipState": 4,
          "mode": 4,
          "flipped": false,
          "directionReversed": false
        },
        "T32": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T33": {
          "rotation": 0,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  },
  {
    "id": "full-mock-4x4-q5",
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
      "row": 1,
      "col": 11,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T21",
        "gridRow": 2,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T32",
        "gridRow": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T03": {
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T10": {
        "rotation": 2,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T11": {
        "rotation": 2,
        "flipState": 6,
        "mode": 6,
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
      "T13": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T20": {
        "rotation": 3,
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
        "rotation": 2,
        "flipState": 9,
        "mode": 9,
        "flipped": true,
        "directionReversed": true
      },
      "T23": {
        "rotation": 3,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T30": {
        "rotation": 0,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T31": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T32": {
        "rotation": 1,
        "flipState": 8,
        "mode": 8,
        "flipped": false,
        "directionReversed": false
      },
      "T33": {
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 58,
      "tileStates": {
        "T00": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T01": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 2,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T03": {
          "rotation": 1,
          "flipState": 0,
          "mode": 0,
          "flipped": false,
          "directionReversed": false
        },
        "T10": {
          "rotation": 2,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T11": {
          "rotation": 0,
          "flipState": 4,
          "mode": 4,
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
          "rotation": 3,
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
          "rotation": 0,
          "flipState": 11,
          "mode": 11,
          "flipped": true,
          "directionReversed": true
        },
        "T23": {
          "rotation": 0,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T30": {
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
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
          "flipState": 7,
          "mode": 7,
          "flipped": true,
          "directionReversed": true
        },
        "T33": {
          "rotation": 3,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        }
      }
    }
  },
  {
    "id": "full-mock-4x4-q6",
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
      "row": 1,
      "col": 11,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T03",
        "gridRow": 0,
        "gridCol": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T21",
        "gridRow": 2,
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
      },
      {
        "id": "T23",
        "gridRow": 2,
        "gridCol": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "id": "T31",
        "gridRow": 3,
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
        "id": "T32",
        "gridRow": 3,
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
              "active": true,
              "arrowDirection": "LEFT"
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
              "active": true,
              "arrowDirection": "DOWN"
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
        "flipState": 6,
        "mode": 6,
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
        "rotation": 3,
        "flipState": 3,
        "mode": 3,
        "flipped": true,
        "directionReversed": true
      },
      "T03": {
        "rotation": 1,
        "flipState": 2,
        "mode": 2,
        "flipped": false,
        "directionReversed": false
      },
      "T10": {
        "rotation": 0,
        "flipState": 6,
        "mode": 6,
        "flipped": false,
        "directionReversed": false
      },
      "T11": {
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T12": {
        "rotation": 2,
        "flipState": 4,
        "mode": 4,
        "flipped": false,
        "directionReversed": false
      },
      "T13": {
        "rotation": 1,
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
        "rotation": 2,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T22": {
        "rotation": 1,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T23": {
        "rotation": 1,
        "flipState": 9,
        "mode": 9,
        "flipped": true,
        "directionReversed": true
      },
      "T30": {
        "rotation": 3,
        "flipState": 0,
        "mode": 0,
        "flipped": false,
        "directionReversed": false
      },
      "T31": {
        "rotation": 3,
        "flipState": 1,
        "mode": 1,
        "flipped": true,
        "directionReversed": true
      },
      "T32": {
        "rotation": 2,
        "flipState": 10,
        "mode": 10,
        "flipped": false,
        "directionReversed": false
      },
      "T33": {
        "rotation": 3,
        "flipState": 5,
        "mode": 5,
        "flipped": true,
        "directionReversed": true
      }
    },
    "solution": {
      "minMoves": 77,
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
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
        },
        "T02": {
          "rotation": 2,
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
          "rotation": 3,
          "flipState": 5,
          "mode": 5,
          "flipped": true,
          "directionReversed": true
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
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T13": {
          "rotation": 3,
          "flipState": 4,
          "mode": 4,
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
          "rotation": 2,
          "flipState": 1,
          "mode": 1,
          "flipped": true,
          "directionReversed": true
        },
        "T22": {
          "rotation": 1,
          "flipState": 3,
          "mode": 3,
          "flipped": true,
          "directionReversed": true
        },
        "T23": {
          "rotation": 1,
          "flipState": 10,
          "mode": 10,
          "flipped": false,
          "directionReversed": false
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
          "rotation": 1,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        },
        "T33": {
          "rotation": 1,
          "flipState": 2,
          "mode": 2,
          "flipped": false,
          "directionReversed": false
        }
      }
    }
  }
];

export const FULL_MOCK_PUZZLES: PuzzleDefinition[] = [
  ...FULL_MOCK_3X3_PUZZLES,
  ...FULL_MOCK_4X4_PUZZLES,
];

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Selects and returns exactly 5 distinct Full Mock questions:
 * - Exactly 3 questions of 3x3 selectable tiles.
 * - Exactly 2 questions of 4x4 selectable tiles.
 * - Shuffled order so 3x3 and 4x4 questions appear naturally mixed.
 * - Throws an error if insufficient puzzles are available.
 */
export function getFullMockQuestions(): PuzzleDefinition[] {
  const pool3x3 = FULL_MOCK_PUZZLES.filter(
    (p) => p.tileRows === 3 && p.tileCols === 3
  );
  const pool4x4 = FULL_MOCK_PUZZLES.filter(
    (p) => p.tileRows === 4 && p.tileCols === 4
  );

  if (pool3x3.length < 3) {
    throw new Error(
      `Insufficient 3x3 puzzles available for Full Mock Test (need at least 3, found ${pool3x3.length})`
    );
  }

  if (pool4x4.length < 2) {
    throw new Error(
      `Insufficient 4x4 puzzles available for Full Mock Test (need at least 2, found ${pool4x4.length})`
    );
  }

  const selected3x3 = shuffleArray(pool3x3).slice(0, 3);
  const selected4x4 = shuffleArray(pool4x4).slice(0, 2);

  // Combine and shuffle the 5 selected questions
  const combined = shuffleArray([...selected3x3, ...selected4x4]);

  // Deep clone to ensure isolated game session state
  return JSON.parse(JSON.stringify(combined));
}
