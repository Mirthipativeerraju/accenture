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
import { PathFinderBoard } from "./PathFinderBoard";
import { PathFinderControls } from "./PathFinderControls";
import { PathFinderTimer } from "./PathFinderTimer";

import {
  PRACTICE_TEST_1_PUZZLES,
} from "@/lib/games/path-finder/practice-1-puzzle";

import {
  generatePractice2Questions,
} from "@/lib/games/path-finder/practice-2-puzzle";

import {
  PuzzleDefinition,
  TileState,
} from "@/lib/games/path-finder/types";

import {
  validateRoute,
} from "@/lib/games/path-finder/validator";

import {
  getEffectiveTileCells,
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
// MAIN GAME
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
      if (
        variant ===
        "practice-2"
      ) {
        return generatePractice2Questions(
          5
        );
      }

      return PRACTICE_TEST_1_PUZZLES;
    }, [variant]);

  const testTitle =
    variant ===
    "practice-2"
      ? "Practice Test 2"
      : "Practice Test 1";

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

      if (
        !validationResult.isValid
      ) {
        console.log(
          "[PATHFINDER] INVALID ROUTE"
        );

        setFeedback({
          type: "error",
          message:
            "Invalid Route",
        });

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
  // INSTRUCTIONS
  // ==========================================================================

  if (
    stage ===
    "INSTRUCTIONS"
  ) {
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
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full min-h-[calc(100vh-4rem)] bg-[#f8f9fa] dark:bg-slate-950">
      <div className="flex flex-col items-center gap-5 w-full max-w-lg">

        {/* ================================================================== */}
        {/* FEEDBACK                                                           */}
        {/* ================================================================== */}

        {feedback && (
          <div
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              feedback.type ===
              "success"
                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {
              feedback.message
            }
          </div>
        )}

        {/* ================================================================== */}
        {/* BOARD                                                              */}
        {/* ================================================================== */}

        <PathFinderBoard
          puzzle={
            currentPuzzle
          }
          tileStates={
            tileStates
          }
          selectedTileId={
            selectedTileId
          }
          animatingRocket={
            animatingRocket
          }
          onSelectTile={(
            id
          ) => {
            if (
              isSubmitting
            ) {
              return;
            }

            setSelectedTileId(
              (previous) =>
                previous ===
                id
                  ? null
                  : id
            );

            setFeedback(
              null
            );
          }}
        />

        {/* ================================================================== */}
        {/* TIMER + CONTROLS                                                   */}
        {/* ================================================================== */}

        <div className="flex flex-col items-center gap-3 pt-2">

          <div className="flex items-center justify-center gap-6 sm:gap-8">

            <PathFinderTimer
              timeRemaining={
                timeRemaining
              }
              totalTime={
                240
              }
              onTimeout={() =>
                setStage(
                  "TIMEOUT"
                )
              }
              isRunning={
                stage ===
                  "PLAYING" &&
                !isSubmitting
              }
            />

            <PathFinderControls
              onRotate={
                handleRotate
              }
              onChangeDirection={
                handleChangeDirection
              }
              onCheck={
                handleCheck
              }
              hasSelection={
                selectedTileId !==
                null
              }
              disabled={
                isSubmitting
              }
            />

          </div>

          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
            Moves:{" "}
            {moves}
          </div>

        </div>
      </div>
    </div>
  );
}