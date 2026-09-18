"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { useRouter } from "next/navigation";

import { PathFinderInstructions } from "./PathFinderInstructions";
import { PathFinderTutorial } from "./PathFinderTutorial";
import { PathFinderBoard } from "./PathFinderBoard";
import { PathFinderControls } from "./PathFinderControls";
import { PathFinderTimer } from "./PathFinderTimer";

import {
  getPractice1Questions,
} from "@/lib/games/path-finder/practice-1-puzzle";

import {
  generatePractice2Questions,
  PRACTICE_TEST_2_PUZZLES,
} from "@/lib/games/path-finder/practice-2-puzzle";

import {
  PRACTICE_TEST_3_PUZZLES,
} from "@/lib/games/path-finder/practice-3-puzzle";

import {
  PuzzleDefinition,
  TileState,
  ArrowDirection,
} from "@/lib/games/path-finder/types";

import {
  validateRoute,
} from "@/lib/games/path-finder/validator";

import {
  getEffectiveTileCells,
  getEffectivePorts,
  normalizeRotation,
  getTileFlipState,
  SHAPE_FLIP_STATES_COUNT,
} from "@/lib/games/path-finder/transformations";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ============================================================================
// PROPS
// ============================================================================

interface PathFinderGameProps {
  variant?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BOARD_SIZE = 378;
const CELL_SIZE = 42;
const CELL_CENTER = 21;

// Time for the rocket to move from one cell center to the next.
const ROCKET_SEGMENT_DURATION = 180;

// ============================================================================
// CELL -> PIXEL
// ============================================================================
//
// IMPORTANT:
//
// The coordinate represents the CENTER of the cell.
//
// Cell 0:
//
//     0 -------- 42
//          21
//
// Therefore:
//
//     x = column * 42 + 21
//     y = row    * 42 + 21
//
// ============================================================================

function cellToPixel(
  cell: {
    r: number;
    c: number;
  }
) {
  return {
    x:
      cell.c *
        CELL_SIZE +
      CELL_CENTER,

    y:
      cell.r *
        CELL_SIZE +
      CELL_CENTER,
  };
}

// ============================================================================
// START ROCKET POSITION
// ============================================================================
//
// The existing large rocket starts outside the LEFT side of the board.
//
// Its center is horizontally aligned with the starting row center.
//
// ============================================================================

function getStartRocketPosition(
  row: number
) {
  return {
    x: -CELL_CENTER,

    y:
      row *
        CELL_SIZE +
      CELL_CENTER,
  };
}

// ============================================================================
// EASING
// ============================================================================

function easeInOut(
  progress: number
): number {
  if (
    progress < 0.5
  ) {
    return (
      2 *
      progress *
      progress
    );
  }

  return (
    1 -
    Math.pow(
      -2 *
        progress +
        2,
      2
    ) /
      2
  );
}

// ============================================================================
// SHORTEST ROTATION
// ============================================================================
//
// Keeps the rocket from doing a 270° reverse spin.
//
// Example:
//
//     180° -> 270°
//
// becomes:
//
//     +90°
//
// rather than:
//
//     -270°
//
// ============================================================================

function getShortestTurn(
  currentAngle: number,
  targetAngle: number
): number {
  let delta =
    targetAngle -
    currentAngle;

  while (
    delta > 180
  ) {
    delta -= 360;
  }

  while (
    delta < -180
  ) {
    delta += 360;
  }

  return (
    currentAngle +
    delta
  );
}

// ============================================================================
// INVALID-ROUTE ANIMATION PATH
// ============================================================================
//
// The invalid animation must use the SAME physical route geometry as the
// valid animation.  It must NOT treat a diagonal arrow (↖ ↗ ↘ ↙) as a
// diagonal movement vector.
//
// In Practice Test 2, a tile is a 3x3 piece.  The route inside a CORNER,
// T-JUNCTION or CROSS is represented by active cells.  The diagonal arrow in
// the middle is a TURN marker.  Therefore the safest way to animate an
// invalid route is:
//
//   1. Follow the same tile enter/exit ports used by validateTileRoute().
//   2. Inside each tile, find the actual 4-neighbour active-cell path from
//      the entered edge cell to the exited edge cell.
//   3. Move to the next tile only through the selected exit port.
//   4. Stop exactly where the validator's route breaks.
//
// This makes a curve behave like:
//
//       ←  ↖
//          ↑
//
//   LEFT -> CENTER -> TOP
//
// rather than LEFT -> diagonal TOP-LEFT.
// ============================================================================

function getGlobalEffectiveCellsForInvalidAnimation(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): Map<
  string,
  {
    active: boolean;
    arrowDirection?: ArrowDirection;
  }
> {
  const cells = new Map<
    string,
    {
      active: boolean;
      arrowDirection?: ArrowDirection;
    }
  >();

  for (const tile of puzzle.tiles) {
    const state = tileStates[tile.id] || {
      rotation: 0,
      flipped: false,
      mode: 0,
    };

    const effectiveCells = getEffectiveTileCells(tile, state);
    const startRow = tile.gridRow * puzzle.tileSize;
    const startCol = tile.gridCol * puzzle.tileSize;

    for (let r = 0; r < puzzle.tileSize; r++) {
      for (let c = 0; c < puzzle.tileSize; c++) {
        const cell = effectiveCells[r]?.[c];
        if (!cell) continue;

        cells.set(`${startRow + r},${startCol + c}`, {
          active: Boolean(cell.active),
          arrowDirection: cell.arrowDirection as ArrowDirection | undefined,
        });
      }
    }
  }

  return cells;
}

function getLocalPortCell(port: string): { r: number; c: number } {
  switch (port) {
    case "TOP":
      return { r: 0, c: 1 };
    case "RIGHT":
      return { r: 1, c: 2 };
    case "BOTTOM":
      return { r: 2, c: 1 };
    case "LEFT":
    default:
      return { r: 1, c: 0 };
  }
}

function getOppositePort(port: string): string {
  switch (port) {
    case "TOP":
      return "BOTTOM";
    case "RIGHT":
      return "LEFT";
    case "BOTTOM":
      return "TOP";
    case "LEFT":
    default:
      return "RIGHT";
  }
}

/**
 * Find the physical route through one 3x3 tile.
 *
 * Only 4-neighbour moves are allowed.  This is intentional: diagonal arrows
 * are visual turn indicators, while the rocket travels through the active
 * cells that form the route.
 */
function findTileRouteCells(
  cells: ReturnType<typeof getEffectiveTileCells>,
  enterPort: string,
  exitPort: string
): { r: number; c: number }[] | null {
  const start = getLocalPortCell(enterPort);
  const target = getLocalPortCell(exitPort);

  if (!cells[start.r]?.[start.c]?.active) return null;
  if (!cells[target.r]?.[target.c]?.active) return null;

  const queue: { r: number; c: number }[] = [start];
  const visited = new Set<string>([`${start.r},${start.c}`]);
  const previous = new Map<string, string>();

  const directions = [
    { dr: -1, dc: 0 },
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentKey = `${current.r},${current.c}`;

    if (current.r === target.r && current.c === target.c) {
      const result: { r: number; c: number }[] = [];
      let key: string | undefined = currentKey;

      while (key) {
        const [r, c] = key.split(",").map(Number);
        result.push({ r, c });
        key = previous.get(key);
      }

      result.reverse();
      return result;
    }

    for (const direction of directions) {
      const nextR = current.r + direction.dr;
      const nextC = current.c + direction.dc;

      if (
        nextR < 0 ||
        nextR >= cells.length ||
        nextC < 0 ||
        nextC >= cells[0].length
      ) {
        continue;
      }

      if (!cells[nextR]?.[nextC]?.active) continue;

      const nextKey = `${nextR},${nextC}`;
      if (visited.has(nextKey)) continue;

      visited.add(nextKey);
      previous.set(nextKey, currentKey);
      queue.push({ r: nextR, c: nextC });
    }
  }

  return null;
}

function getNextTileFromExit(
  tileRow: number,
  tileCol: number,
  exitPort: string
): {
  row: number;
  col: number;
  enterPort: string;
} | null {
  switch (exitPort) {
    case "TOP":
      return {
        row: tileRow - 1,
        col: tileCol,
        enterPort: "BOTTOM",
      };
    case "RIGHT":
      return {
        row: tileRow,
        col: tileCol + 1,
        enterPort: "LEFT",
      };
    case "BOTTOM":
      return {
        row: tileRow + 1,
        col: tileCol,
        enterPort: "TOP",
      };
    case "LEFT":
      return {
        row: tileRow,
        col: tileCol - 1,
        enterPort: "RIGHT",
      };
    default:
      return null;
  }
}

function buildInvalidArrowAnimationPath(
  puzzle: PuzzleDefinition,
  tileStates: Record<string, TileState>
): {
  path: { r: number; c: number }[];
} {
  const globalCells = getGlobalEffectiveCellsForInvalidAnimation(
    puzzle,
    tileStates
  );

  const path: { r: number; c: number }[] = [];
  const visitedTiles = new Set<string>();

  let tileRow = Math.floor(puzzle.startPos.row / puzzle.tileSize);
  let tileCol = Math.floor(puzzle.startPos.col / puzzle.tileSize);
  let enterPort: string = puzzle.startPos.entrySide || "LEFT";

  const appendGlobalCell = (row: number, col: number) => {
    const key = `${row},${col}`;
    if (!globalCells.get(key)?.active) return;

    const last = path[path.length - 1];
    if (!last || last.r !== row || last.c !== col) {
      path.push({ r: row, c: col });
    }
  };

  // Always include the actual start cell if it is active.
  appendGlobalCell(puzzle.startPos.row, puzzle.startPos.col);

  const maxTiles = puzzle.tileRows * puzzle.tileCols;

  for (let step = 0; step < maxTiles; step++) {
    if (
      tileRow < 0 ||
      tileRow >= puzzle.tileRows ||
      tileCol < 0 ||
      tileCol >= puzzle.tileCols
    ) {
      break;
    }

    const tile = puzzle.tiles.find(
      (candidate) =>
        candidate.gridRow === tileRow &&
        candidate.gridCol === tileCol
    );

    if (!tile) break;

    const tileKey = `${tileRow},${tileCol}`;
    if (visitedTiles.has(tileKey)) break;
    visitedTiles.add(tileKey);

    const state = tileStates[tile.id] || {
      rotation: 0,
      flipped: false,
      mode: 0,
    };

    const effectiveCells = getEffectiveTileCells(tile, state);

    // Use the SAME effective ports that the validator uses.
    // This is critical: the animation and validation must agree on which
    // side of the tile is the entry and which side is the exit.
    const effectivePorts = getEffectivePorts(tile, state);

    const actualEnter = effectivePorts.enter;
    const actualExit = effectivePorts.exit;

    if (!actualEnter || !actualExit) {
      break;
    }

    // The current tile can only be entered if its effective entry port
    // matches the direction from which the rocket arrived.
    if (actualEnter !== enterPort) {
      break;
    }

    const tileRoute = findTileRouteCells(
      effectiveCells,
      actualEnter,
      actualExit
    );

    if (!tileRoute || tileRoute.length === 0) {
      break;
    }

    for (const localCell of tileRoute) {
      appendGlobalCell(
        tile.gridRow * puzzle.tileSize + localCell.r,
        tile.gridCol * puzzle.tileSize + localCell.c
      );
    }

    // If this is the destination tile and the exit matches the destination,
    // the validator would have accepted the route.  Since this helper is only
    // used for invalid routes, continue normally only when the validator would
    // not yet have stopped.
    if (
      tileRow === Math.floor(puzzle.destinationPos.row / puzzle.tileSize) &&
      tileCol === Math.floor(puzzle.destinationPos.col / puzzle.tileSize) &&
      actualExit === (puzzle.destinationPos.exitSide || "RIGHT")
    ) {
      break;
    }

    const next = getNextTileFromExit(
      tileRow,
      tileCol,
      actualExit
    );

    if (!next) break;

    tileRow = next.row;
    tileCol = next.col;
    enterPort = next.enterPort;

    // Do not fabricate movement into another tile here.  The next iteration
    // will add its entry cell only if that tile actually accepts the route.
    // This is exactly where an invalid connection stops.
  }

  return { path };
}

// ============================================================================
// MAIN GAME
// ============================================================================

// ============================================================================

export function PathFinderGame({
  variant = "practice-1",
}: PathFinderGameProps) {
  const router =
    useRouter();

  // ==========================================================================
  // PUZZLES
  // ==========================================================================

  const puzzles:
    PuzzleDefinition[] =
    useMemo(() => {
      if (variant === "practice-1") {
        return getPractice1Questions();
      }

      if (variant === "practice-2") {
        return PRACTICE_TEST_2_PUZZLES;
      }

      if (variant === "practice-3") {
        return PRACTICE_TEST_3_PUZZLES;
      }

      return generatePractice2Questions(
        5
      );
    }, [variant]);

  const isFullMock = useMemo(() => {
    return (
      variant === "full-mock-test" ||
      variant === "full-mock" ||
      variant === "mock"
    );
  }, [variant]);

  const testTitle = useMemo(() => {
    switch (variant) {
      case "practice-2":
        return "Practice Test 2";
      case "practice-3":
        return "Practice Test 3";
      case "full-mock-test":
      case "full-mock":
      case "mock":
        return "Full Mock Test";
      case "practice-1":
      default:
        return "Practice Test 1";
    }
  }, [variant]);

  // ==========================================================================
  // GAME STATE
  // ==========================================================================

  const [
    stage,
    setStage,
  ] = useState<
    | "INSTRUCTIONS"
    | "PLAYING"
    | "COMPLETED"
    | "TIMEOUT"
  >("INSTRUCTIONS");

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const currentPuzzle =
    puzzles[
      currentQuestionIndex
    ] ||
    puzzles[0];

  const [
    tileStates,
    setTileStates,
  ] =
    useState<
      Record<
        string,
        TileState
      >
    >({
      ...currentPuzzle.initialTileStates,
    });

  const [
    selectedTileId,
    setSelectedTileId,
  ] =
    useState<
      string | null
    >(null);

  const [
    moves,
    setMoves,
  ] = useState(0);

  const [
    totalMoves,
    setTotalMoves,
  ] = useState(0);

  const [
    timeRemaining,
    setTimeRemaining,
  ] = useState(240);

  const [
    feedback,
    setFeedback,
  ] =
    useState<{
      type:
        | "success"
        | "error";

      message: string;
    } | null>(null);

  // ==========================================================================
  // ROCKET
  // ==========================================================================

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    animatingRocket,
    setAnimatingRocket,
  ] =
    useState<{
      x: number;
      y: number;
      angle: number;
    } | null>(null);

  const animationFrameRef =
    useRef<
      number | null
    >(null);

  const animationTimeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  // ==========================================================================
  // ANIMATION CLEANUP
  // ==========================================================================

  const stopRocketAnimation =
    useCallback(() => {
      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }

      if (
        animationTimeoutRef.current !==
        null
      ) {
        clearTimeout(
          animationTimeoutRef.current
        );

        animationTimeoutRef.current =
          null;
      }
    }, []);

  // ==========================================================================
  // LOAD QUESTION
  // ==========================================================================

  const loadQuestion =
    useCallback(
      (
        index: number
      ) => {
        stopRocketAnimation();

        const puzzle =
          puzzles[index] ||
          puzzles[0];

        console.log(
          `[PATHFINDER] Loaded Question ${
            index + 1
          }/${puzzles.length}: ${
            puzzle.id
          }`
        );

        console.log(
          `[PATHFINDER] Start: (${
            puzzle.startPos.row
          }, ${
            puzzle.startPos.col
          })`
        );

        console.log(
          `[PATHFINDER] Destination: (${
            puzzle.destinationPos.row
          }, ${
            puzzle.destinationPos.col
          })`
        );

        setCurrentQuestionIndex(
          index
        );

        setTileStates({
          ...puzzle.initialTileStates,
        });

        setSelectedTileId(
          null
        );

        setMoves(0);

        setTimeRemaining(
          240
        );

        setFeedback(null);

        setIsSubmitting(
          false
        );

        setAnimatingRocket(
          null
        );
      },
      [
        puzzles,
        stopRocketAnimation,
      ]
    );

  // ==========================================================================
  // START GAME
  // ==========================================================================

  const handleStartGame =
    useCallback(() => {
      setTotalMoves(0);

      loadQuestion(0);

      setStage(
        "PLAYING"
      );
    }, [
      loadQuestion,
    ]);

  // ==========================================================================
  // TIMER
  // ==========================================================================

  useEffect(() => {
    if (
      stage !==
        "PLAYING" ||
      isSubmitting
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setTimeRemaining(
          (previous) => {
            if (
              previous <= 1
            ) {
              clearInterval(
                interval
              );

              setStage(
                "TIMEOUT"
              );

              return 0;
            }

            return (
              previous - 1
            );
          }
        );
      }, 1000);

    return () =>
      clearInterval(
        interval
      );
  }, [
    stage,
    isSubmitting,
  ]);

  // ==========================================================================
  // CLEANUP
  // ==========================================================================

  useEffect(() => {
    return () => {
      stopRocketAnimation();
    };
  }, [
    stopRocketAnimation,
  ]);

  // ==========================================================================
  // BUTTON 1 — ROTATE
  // ==========================================================================

  const handleRotate =
    useCallback(() => {
      if (
        !selectedTileId ||
        isSubmitting
      ) {
        return;
      }

      const tileDef =
        currentPuzzle.tiles.find(
          (tile) =>
            tile.id ===
            selectedTileId
        );

      const beforeState =
        tileStates[
          selectedTileId
        ] || {
          rotation: 0,
          flipped: false,
          mode: 0,
        };

      const currentRotation =
        normalizeRotation(
          beforeState.rotation
        );

      const nextRotation =
        (((currentRotation +
          1) %
          4) as
          | 0
          | 1
          | 2
          | 3);

      const afterState:
        TileState = {
        ...beforeState,

        rotation:
          nextRotation,
      };

      console.log(
        `[PATHFINDER] ROTATE: ${selectedTileId}`
      );

      if (tileDef) {
        console.log(
          "[PATHFINDER] Before:",
          getEffectiveTileCells(
            tileDef,
            beforeState
          )
        );

        console.log(
          "[PATHFINDER] After:",
          getEffectiveTileCells(
            tileDef,
            afterState
          )
        );
      }

      setTileStates(
        (previous) => ({
          ...previous,

          [selectedTileId]:
            afterState,
        })
      );

      setMoves(
        (value) =>
          value + 1
      );

      setTotalMoves(
        (value) =>
          value + 1
      );

      setFeedback(null);
    }, [
      selectedTileId,
      isSubmitting,
      currentPuzzle.tiles,
      tileStates,
    ]);

  // ==========================================================================
  // BUTTON 2 — CHANGE ROUTE DIRECTION
  // ==========================================================================
  //
  // IMPORTANT:
  //
  // The button cycles canonical states.
  //
  // STRAIGHT:
  //   0 -> 1 -> 0
  //
  // CORNER:
  //   0 -> 1 -> 0
  //
  // T-JUNCTION:
  //   0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0
  //
  // CROSS:
  //   0 -> 1 -> ... -> 11 -> 0
  //
  // Do NOT derive directionReversed from flipState.
  //
  // ==========================================================================

  const handleChangeDirection =
    useCallback(() => {
      if (
        !selectedTileId ||
        isSubmitting
      ) {
        return;
      }

      const tileDef =
        currentPuzzle.tiles.find(
          (tile) =>
            tile.id ===
            selectedTileId
        );

      const beforeState =
        tileStates[
          selectedTileId
        ] || {
          rotation: 0,
          flipped: false,
          mode: 0,
        };

      const type =
        tileDef?.type ||
        "STRAIGHT";

      const max =
        SHAPE_FLIP_STATES_COUNT[
          type
        ] || 2;

      const currentFlip =
        getTileFlipState(
          type,
          beforeState
        );

      const nextFlip =
        (currentFlip + 1) %
        max;

      const afterState:
        TileState = {
        ...beforeState,

        flipState:
          nextFlip,

        mode:
          nextFlip,
      };

      console.log(
        `[PATHFINDER] CHANGE DIRECTION: ${selectedTileId}`
      );

      console.log(
        `[PATHFINDER] ${type}: ${currentFlip} -> ${nextFlip}`
      );

      setTileStates(
        (previous) => ({
          ...previous,

          [selectedTileId]:
            afterState,
        })
      );

      setMoves(
        (value) =>
          value + 1
      );

      setTotalMoves(
        (value) =>
          value + 1
      );

      setFeedback(null);
    }, [
      selectedTileId,
      isSubmitting,
      currentPuzzle.tiles,
      tileStates,
    ]);

  // ==========================================================================
  // BUTTON 3 — CHECK
  // ==========================================================================
  //
  // The validator now returns the ACTUAL visual traversal path:
  //
  //     ENTER
  //       ↓
  //     CENTER
  //       ↓
  //      EXIT
  //
  // Therefore we animate result.visitedPath directly.
  //
  // ==========================================================================

  const handleCheck =
    useCallback(() => {
      if (
        isSubmitting
      ) {
        return;
      }

      console.log(
        "[PATHFINDER] CHECK clicked"
      );

      stopRocketAnimation();

      // ------------------------------------------------------------------------
      // VALIDATE
      // ------------------------------------------------------------------------

      let validationResult:
        ReturnType<
          typeof validateRoute
        >;

      try {
        validationResult =
          validateRoute(
            currentPuzzle,
            tileStates
          );

        console.log(
          "[PATHFINDER] Validation:",
          validationResult
        );
      } catch (
        error
      ) {
        console.error(
          "[PATHFINDER] Validator error:",
          error
        );

        setFeedback({
          type: "error",
          message:
            "Invalid Route",
        });

        return;
      }

      // ------------------------------------------------------------------------
      // INVALID
      // ------------------------------------------------------------------------
      //
      // IMPORTANT:
      // Do NOT show "Invalid Route" here immediately.
      //
      // First animate the rocket through every active cell that the current
      // arrows can actually reach. The animation stops at the exact point
      // where the route breaks. Only after that animation finishes do we show
      // "Invalid Route".
      //
      // The VALID branch below is intentionally left unchanged.
      // ------------------------------------------------------------------------

      if (
        !validationResult.isValid
      ) {
        console.log(
          "[PATHFINDER] INVALID ROUTE - tracing reachable path first"
        );

        const invalidPath =
          buildInvalidArrowAnimationPath(
            currentPuzzle,
            tileStates
          ).path;

        if (
          invalidPath.length === 0
        ) {
          setFeedback({
            type: "error",
            message:
              "Invalid Route",
          });
          return;
        }

        setIsSubmitting(
          true
        );

        setSelectedTileId(
          null
        );

        // Make sure the old feedback is hidden while the rocket is moving.
        setFeedback(null);

        const startPosition =
          getStartRocketPosition(
            currentPuzzle.startPos.row
          );

        const animationPoints = [
          startPosition,
          ...invalidPath.map(
            cellToPixel
          ),
        ];

        const headings =
          animationPoints.map(
            (
              point,
              index
            ) => {
              if (
                index === 0
              ) {
                return 0;
              }

              const previous =
                animationPoints[
                  index - 1
                ];

              const dx =
                point.x -
                previous.x;

              const dy =
                point.y -
                previous.y;

              if (
                Math.abs(dx) > 0 &&
                Math.abs(dy) < 0.01
              ) {
                return dx >= 0
                  ? 0
                  : 180;
              }

              if (
                Math.abs(dy) > 0 &&
                Math.abs(dx) < 0.01
              ) {
                return dy >= 0
                  ? 90
                  : 270;
              }

              if (
                dx > 0 &&
                dy > 0
              ) {
                return 45;
              }

              if (
                dx < 0 &&
                dy > 0
              ) {
                return 135;
              }

              if (
                dx < 0 &&
                dy < 0
              ) {
                return 225;
              }

              if (
                dx > 0 &&
                dy < 0
              ) {
                return 315;
              }

              return 0;
            }
          );

        let segmentIndex = 0;
        let segmentStartTime:
          | number
          | null = null;
        let currentAngle =
          headings[0] ?? 0;

        const animateInvalid =
          (
            timestamp: number
          ) => {
            if (
              segmentIndex >=
              animationPoints.length - 1
            ) {
              const finalPoint =
                animationPoints[
                  animationPoints.length - 1
                ];

              setAnimatingRocket({
                x: finalPoint.x,
                y: finalPoint.y,
                angle: currentAngle,
              });

              // The route result is reported ONLY after the rocket reaches
              // the last reachable active cell.
              setFeedback({
                type: "error",
                message:
                  "Invalid Route",
              });

              // Keep the question locked until CONTINUE is pressed.
              setIsSubmitting(
                true
              );

              animationFrameRef.current =
                null;

              return;
            }

            if (
              segmentStartTime === null
            ) {
              segmentStartTime =
                timestamp;
            }

            const elapsed =
              timestamp -
              segmentStartTime;

            const progress =
              Math.min(
                elapsed /
                  ROCKET_SEGMENT_DURATION,
                1
              );

            const eased =
              easeInOut(
                progress
              );

            const from =
              animationPoints[
                segmentIndex
              ];

            const to =
              animationPoints[
                segmentIndex + 1
              ];

            const x =
              from.x +
              (to.x - from.x) *
                eased;

            const y =
              from.y +
              (to.y - from.y) *
                eased;

            const targetAngle =
              headings[
                segmentIndex + 1
              ] ?? currentAngle;

            const targetContinuousAngle =
              getShortestTurn(
                currentAngle,
                targetAngle
              );

            currentAngle =
              currentAngle +
              (targetContinuousAngle -
                currentAngle) *
                0.18;

            if (
              Math.abs(
                targetContinuousAngle -
                  currentAngle
              ) < 0.5
            ) {
              currentAngle =
                targetContinuousAngle;
            }

            setAnimatingRocket({
              x,
              y,
              angle: currentAngle,
            });

            if (
              progress >= 1
            ) {
              currentAngle =
                targetAngle;
              segmentIndex += 1;
              segmentStartTime =
                null;
            }

            animationFrameRef.current =
              requestAnimationFrame(
                animateInvalid
              );
          };

        animationFrameRef.current =
          requestAnimationFrame(
            animateInvalid
          );

        return;
      }

      const path =
        validationResult.visitedPath;

      console.log(
        "[PATHFINDER] REAL VISUAL PATH:",
        path
      );

      if (
        path.length === 0
      ) {
        console.error(
          "[PATHFINDER] Valid route returned an empty path."
        );

        setFeedback({
          type: "error",
          message:
            "Invalid Route",
        });

        return;
      }

      // ------------------------------------------------------------------------
      // START ANIMATION
      // ------------------------------------------------------------------------

      setIsSubmitting(
        true
      );

      setSelectedTileId(
        null
      );

      // ------------------------------------------------------------------------
      // ANIMATION POINTS
      // ------------------------------------------------------------------------
      //
      // Start:
      //
      //     Existing large rocket outside left side
      //
      // Then:
      //
      //     tile entry center
      //     tile center
      //     tile exit center
      //     next tile entry center
      //     ...
      //
      // Finally:
      //
      //     final tile exit center
      //
      // ------------------------------------------------------------------------

      const startPosition =
        getStartRocketPosition(
          currentPuzzle.startPos
            .row
        );

      const animationPoints = [
        startPosition,

        ...path.map(
          cellToPixel
        ),
      ];

      console.log(
        "[PATHFINDER] Animation points:",
        animationPoints
      );

      // ------------------------------------------------------------------------
      // PRE-COMPUTE HEADINGS
      // ------------------------------------------------------------------------

      const headings =
        animationPoints.map(
          (
            point,
            index
          ) => {
            if (
              index ===
              0
            ) {
              return 0;
            }

            const previous =
              animationPoints[
                index - 1
              ];

            const dx =
              point.x -
              previous.x;

            const dy =
              point.y -
              previous.y;

            if (
              Math.abs(dx) >
                0 &&
              Math.abs(dy) <
                0.01
            ) {
              return dx >=
                0
                ? 0
                : 180;
            }

            if (
              Math.abs(dy) >
                0 &&
              Math.abs(dx) <
                0.01
            ) {
              return dy >=
                0
                ? 90
                : 270;
            }

            if (
              dx > 0 &&
              dy > 0
            ) {
              return 45;
            }

            if (
              dx < 0 &&
              dy > 0
            ) {
              return 135;
            }

            if (
              dx < 0 &&
              dy < 0
            ) {
              return 225;
            }

            if (
              dx > 0 &&
              dy < 0
            ) {
              return 315;
            }

            return 0;
          }
        );

      // ------------------------------------------------------------------------
      // ROCKET ANIMATION
      // ------------------------------------------------------------------------

      let segmentIndex = 0;

      let segmentStartTime:
        | number
        | null = null;

      let currentAngle =
        headings[0] ??
        0;

      const animate =
        (
          timestamp: number
        ) => {
          // --------------------------------------------------------------------
          // FINISHED
          // --------------------------------------------------------------------

          if (
            segmentIndex >=
            animationPoints.length -
              1
          ) {
            const finalPoint =
              animationPoints[
                animationPoints.length -
                  1
              ];

            const finalAngle =
              currentAngle;

            setAnimatingRocket(
              {
                x: finalPoint.x,
                y: finalPoint.y,
                angle:
                  finalAngle,
              }
            );

            setFeedback({
              type: "success",
              message:
                "Valid Route",
            });

            animationTimeoutRef.current =
              setTimeout(() => {
                setAnimatingRocket(
                  null
                );

                if (
                  currentQuestionIndex +
                    1 <
                  puzzles.length
                ) {
                  loadQuestion(
                    currentQuestionIndex +
                      1
                  );

                  return;
                }

                setStage(
                  "COMPLETED"
                );

                setIsSubmitting(
                  false
                );
              }, 1000);

            return;
          }

          // --------------------------------------------------------------------
          // Start segment timer.
          // --------------------------------------------------------------------

          if (
            segmentStartTime ===
            null
          ) {
            segmentStartTime =
              timestamp;
          }

          const elapsed =
            timestamp -
            segmentStartTime;

          const progress =
            Math.min(
              elapsed /
                ROCKET_SEGMENT_DURATION,
              1
            );

          const eased =
            easeInOut(
              progress
            );

          const from =
            animationPoints[
              segmentIndex
            ];

          const to =
            animationPoints[
              segmentIndex + 1
            ];

          const x =
            from.x +
            (to.x -
              from.x) *
              eased;

          const y =
            from.y +
            (to.y -
              from.y) *
              eased;

          // --------------------------------------------------------------------
          // TURN ROCKET AT CORNERS
          // --------------------------------------------------------------------
          //
          // We calculate the desired direction for the CURRENT segment.
          //
          // At:
          //
          //     RIGHT -> DOWN
          //
          // the rocket smoothly turns:
          //
          //     0° -> 90°
          //
          // At:
          //
          //     DOWN -> LEFT
          //
          // it turns:
          //
          //     90° -> 180°
          //
          // using the shortest angular path.
          // --------------------------------------------------------------------

          const targetAngle =
            headings[
              segmentIndex + 1
            ] ??
            currentAngle;

          const targetContinuousAngle =
            getShortestTurn(
              currentAngle,
              targetAngle
            );

          currentAngle =
            currentAngle +
            (
              targetContinuousAngle -
              currentAngle
            ) *
              0.18;

          // Snap very close values.
          if (
            Math.abs(
              targetContinuousAngle -
                currentAngle
            ) <
            0.5
          ) {
            currentAngle =
              targetContinuousAngle;
          }

          setAnimatingRocket(
            {
              x,
              y,
              angle:
                currentAngle,
            }
          );

          // --------------------------------------------------------------------
          // SEGMENT COMPLETE
          // --------------------------------------------------------------------

          if (
            progress >= 1
          ) {
            currentAngle =
              targetAngle;

            segmentIndex +=
              1;

            segmentStartTime =
              null;
          }

          animationFrameRef.current =
            requestAnimationFrame(
              animate
            );
        };

      animationFrameRef.current =
        requestAnimationFrame(
          animate
        );
    }, [
      isSubmitting,
      currentPuzzle,
      tileStates,
      currentQuestionIndex,
      puzzles.length,
      loadQuestion,
      stopRocketAnimation,
    ]);

  // ==========================================================================
  // RESULT MODAL — CONTINUE
  // ==========================================================================

  const handleContinue =
    useCallback(() => {
      stopRocketAnimation();

      setFeedback(null);
      setAnimatingRocket(null);

      if (
        currentQuestionIndex + 1 <
        puzzles.length
      ) {
        loadQuestion(
          currentQuestionIndex + 1
        );
        return;
      }

      setIsSubmitting(false);
      setStage("COMPLETED");
    }, [
      currentQuestionIndex,
      puzzles.length,
      loadQuestion,
      stopRocketAnimation,
    ]);

  // ==========================================================================
  // INSTRUCTIONS
  // ==========================================================================

  if (
    stage ===
    "INSTRUCTIONS"
  ) {
    if (isFullMock) {
      return (
        <PathFinderTutorial
          onComplete={
            handleStartGame
          }
        />
      );
    }

    return (
      <PathFinderInstructions
        onNext={
          handleStartGame
        }
      />
    );
  }

  // ==========================================================================
  // COMPLETED
  // ==========================================================================

  if (
    stage ===
    "COMPLETED"
  ) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center p-6 space-y-6">
          <CardHeader className="space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <CardTitle className="text-2xl font-bold">
              {testTitle}{" "}
              Completed!
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              You solved all{" "}
              {puzzles.length}{" "}
              puzzle
              {puzzles.length >
              1
                ? "s"
                : ""}{" "}
              in{" "}
              <strong className="text-foreground">
                {totalMoves}{" "}
                total moves
              </strong>
              .
            </p>

            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={() =>
                router.push(
                  "/practice/path-finder"
                )
              }
            >
              Back to Test Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================================================
  // TIMEOUT
  // ==========================================================================

  if (
    stage ===
    "TIMEOUT"
  ) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center p-6 space-y-6">
          <CardHeader className="space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>

            <CardTitle className="text-2xl font-bold">
              Time Expired
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              The 4:00 time
              limit for this
              question has
              elapsed.
            </p>

            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={() =>
                router.push(
                  "/practice/path-finder"
                )
              }
            >
              Back to Test Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================================================
  // PLAYING
  // ==========================================================================

  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-white text-black select-none px-2 sm:px-4 py-2 sm:pt-10">
      <div className="w-full max-w-[650px] min-h-[580px] sm:min-h-[650px] flex flex-col border border-[#b8b8b8] rounded-[6px] overflow-hidden bg-[#f3f3f3] relative">

        {/* QUESTION HEADER */}
        <div className="w-full h-[48px] bg-black flex items-center justify-between px-3 sm:px-5 shrink-0">
          <span className="text-white text-xs sm:text-base font-semibold tracking-tight">
            Path Finder - {testTitle}
          </span>
          <span className="text-white text-xs sm:text-base font-semibold tracking-tight">
            Question {currentQuestionIndex + 1} of {puzzles.length}
          </span>
        </div>

        {/* GAME AREA */}
        <div className="flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-4 py-4 sm:py-8 relative">

          {/* BOARD + RESULT MODAL */}
          <div className="relative shrink-0 w-full flex items-center justify-center">
            <PathFinderBoard
              puzzle={currentPuzzle}
              tileStates={tileStates}
              selectedTileId={stage === "PLAYING" ? selectedTileId : null}
              animatingRocket={animatingRocket}
              onSelectTile={(id) => {
                if (stage !== "PLAYING" || isSubmitting) return;

                setSelectedTileId((previous) =>
                  previous === id ? null : id
                );

                setFeedback(null);
              }}
            />

            {feedback && (
              <div className="absolute inset-0 z-50 flex items-start justify-center pt-4">
                <div className="w-[calc(100%-24px)] max-w-[330px] rounded-md border border-slate-300 bg-white px-6 py-5 text-center shadow-lg">
                  <div className="text-sm font-medium text-slate-700">
                    {feedback.type === "success"
                      ? "Valid route - well done!"
                      : "Invalid route"}
                  </div>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="mt-4 inline-flex min-w-[92px] items-center justify-center rounded-md bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800 active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TIMER + CONTROLS */}
          <div className="flex flex-col items-center gap-3 pt-6">
            <div className="flex items-center justify-center gap-6 sm:gap-8">
              <PathFinderTimer
                timeRemaining={timeRemaining}
                totalTime={240}
                onTimeout={() => setStage("TIMEOUT")}
                isRunning={stage === "PLAYING" && !isSubmitting}
              />

              <PathFinderControls
                onRotate={handleRotate}
                onChangeDirection={handleChangeDirection}
                onCheck={handleCheck}
                hasSelection={stage === "PLAYING" && selectedTileId !== null}
                disabled={stage !== "PLAYING" || isSubmitting}
              />
            </div>

            <div className="text-xs font-medium text-slate-500 select-none">
              Moves: {moves}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
