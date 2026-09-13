"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PathFinderInstructions } from "./PathFinderInstructions";
import { PathFinderBoard } from "./PathFinderBoard";
import { PathFinderControls } from "./PathFinderControls";
import { PathFinderTimer } from "./PathFinderTimer";
import {
  PRACTICE_TEST_1_PUZZLES,
} from "@/lib/games/path-finder/practice-1-puzzle";
import {
  PRACTICE_TEST_2_PUZZLES,
  generatePractice2Questions,
} from "@/lib/games/path-finder/practice-2-puzzle";
import {
  PuzzleDefinition,
  TileState,
} from "@/lib/games/path-finder/types";
import { validateRoute } from "@/lib/games/path-finder/validator";
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

interface PathFinderGameProps {
  variant?: string;
}

function getHeadingAngle(
  from: { r: number; c: number },
  to: { r: number; c: number }
): number {
  const dr = to.r - from.r;
  const dc = to.c - from.c;

  if (dr === 0 && dc === 1) return 0;
  if (dr === 1 && dc === 1) return 45;
  if (dr === 1 && dc === 0) return 90;
  if (dr === 1 && dc === -1) return 135;
  if (dr === 0 && dc === -1) return 180;
  if (dr === -1 && dc === -1) return 225;
  if (dr === -1 && dc === 0) return 270;
  if (dr === -1 && dc === 1) return 315;

  return 0;
}

export function PathFinderGame({
  variant = "practice-1",
}: PathFinderGameProps) {
  const router = useRouter();

  // ============================================================================
  // PUZZLE DATA
  // ============================================================================

  // For Practice Test 2, generate 5 random guaranteed-solvable questions per session.
  // Practice Test 1 continues to use the fixed puzzle set.
  const puzzles: PuzzleDefinition[] = useMemo(() => {
    if (variant === "practice-2") {
      return generatePractice2Questions(5);
    }

    return PRACTICE_TEST_1_PUZZLES;
  }, [variant]);

  const testTitle =
    variant === "practice-2"
      ? "Practice Test 2"
      : "Practice Test 1";

  // ============================================================================
  // GAME STATE
  // ============================================================================

  const [stage, setStage] = useState<
    "INSTRUCTIONS" | "PLAYING" | "COMPLETED" | "TIMEOUT"
  >("INSTRUCTIONS");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentPuzzle =
    puzzles[currentQuestionIndex] || puzzles[0];

  const [tileStates, setTileStates] = useState<
    Record<string, TileState>
  >({
    ...currentPuzzle.initialTileStates,
  });

  const [selectedTileId, setSelectedTileId] =
    useState<string | null>(null);

  const [moves, setMoves] = useState(0);

  const [totalMoves, setTotalMoves] = useState(0);

  const [timeRemaining, setTimeRemaining] = useState(240);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ============================================================================
  // ROCKET ANIMATION STATE
  // ============================================================================

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [animatingRocket, setAnimatingRocket] =
    useState<{
      x: number;
      y: number;
      angle: number;
    } | null>(null);

  // ============================================================================
  // LOAD QUESTION
  // ============================================================================

  const loadQuestion = useCallback(
    (index: number) => {
      const puzzle = puzzles[index] || puzzles[0];

      console.log(
        `[PATHFINDER] Loaded Question ${index + 1}/${puzzles.length}: ${puzzle.id}`
      );

      console.log(
        `[PATHFINDER] Start: (${puzzle.startPos.row}, ${puzzle.startPos.col}), Destination: (${puzzle.destinationPos.row}, ${puzzle.destinationPos.col})`
      );

      setCurrentQuestionIndex(index);

      setTileStates({
        ...puzzle.initialTileStates,
      });

      setSelectedTileId(null);

      setMoves(0);

      setTimeRemaining(240);

      setFeedback(null);

      setIsSubmitting(false);

      setAnimatingRocket(null);
    },
    [puzzles]
  );

  // ============================================================================
  // START GAME
  // ============================================================================

  const handleStartGame = () => {
    setTotalMoves(0);

    loadQuestion(0);

    setStage("PLAYING");
  };

  // ============================================================================
  // TIMER
  // ============================================================================

  // Timer countdown:
  // - Runs only while PLAYING.
  // - Pauses while the success rocket animation is running.
  // - Decrements once per second.
  useEffect(() => {
    if (stage !== "PLAYING" || isSubmitting) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          setStage("TIMEOUT");

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, isSubmitting]);

  // ============================================================================
  // BUTTON 1 — ROTATE SELECTED TILE
  // ============================================================================

  // Rotates the selected tile 90° clockwise.
  //
  // Rotation is PHYSICAL rotation:
  // - Cell positions rotate.
  // - Arrow directions rotate with the cells.
  //
  // Sequence:
  // 0° -> 90° -> 180° -> 270° -> 0°
  const handleRotate = useCallback(() => {
    if (
      !selectedTileId ||
      isSubmitting
    ) {
      return;
    }

    const tileDef = currentPuzzle.tiles.find(
      (t) => t.id === selectedTileId
    );

    const beforeState =
      tileStates[selectedTileId] || {
        rotation: 0,
        flipped: false,
        mode: 0,
      };

    const beforeCells = tileDef
      ? getEffectiveTileCells(tileDef, beforeState)
      : [];

    const curNormRot = normalizeRotation(
      beforeState.rotation
    );

    const nextRotation =
      (((curNormRot + 1) % 4) as 0 | 1 | 2 | 3);

    const afterState: TileState = {
      ...beforeState,
      rotation: nextRotation,
    };

    const afterCells = tileDef
      ? getEffectiveTileCells(tileDef, afterState)
      : [];

    console.log(
      `[PATHFINDER] Button 1 (ROTATE) on block: ${selectedTileId}`
    );

    console.log("Before State:", beforeState);

    if (tileDef) {
      console.log(
        "Before Cells (active/arrows):",
        beforeCells.flatMap((row, r) =>
          row
            .map((c, col) =>
              c.active
                ? `R${r + 1}C${col + 1}=${
                    c.arrowDirection || "NO_ARROW"
                  }`
                : null
            )
            .filter(Boolean)
        )
      );
    }

    console.log("After State:", afterState);

    if (tileDef) {
      console.log(
        "After Cells (active/arrows):",
        afterCells.flatMap((row, r) =>
          row
            .map((c, col) =>
              c.active
                ? `R${r + 1}C${col + 1}=${
                    c.arrowDirection || "NO_ARROW"
                  }`
                : null
            )
            .filter(Boolean)
        )
      );
    }

    setTileStates((prev) => ({
      ...prev,
      [selectedTileId]: afterState,
    }));

    setMoves((m) => m + 1);

    setTotalMoves((tm) => tm + 1);

    setFeedback(null);
  }, [
    selectedTileId,
    isSubmitting,
    currentPuzzle.tiles,
    tileStates,
  ]);

  // ============================================================================
  // BUTTON 2 — CHANGE ROUTE DIRECTION / CANONICAL FLIP STATE
  // ============================================================================

  // IMPORTANT:
  //
  // This button cycles through the CANONICAL states defined in
  // transformations.ts.
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
  // CROSS / PLUS:
  //   0 -> 1 -> 2 -> ... -> 11 -> 0
  //
  // DO NOT derive directionReversed from flipState.
  //
  // Previously this code did:
  //
  //   directionReversed: nextFlip % 2 === 1
  //
  // That caused the transformation layer to reverse odd-numbered
  // canonical states again. For T-JUNCTION this effectively collapsed
  // the six canonical states into three visible states.
  //
  // flipState and directionReversed are independent concepts.
  const handleChangeDirection = useCallback(() => {
    if (
      !selectedTileId ||
      isSubmitting
    ) {
      return;
    }

    const tileDef = currentPuzzle.tiles.find(
      (t) => t.id === selectedTileId
    );

    const beforeState =
      tileStates[selectedTileId] || {
        rotation: 0,
        flipped: false,
        mode: 0,
      };

    const beforeCells = tileDef
      ? getEffectiveTileCells(tileDef, beforeState)
      : [];

    const type = tileDef?.type || "STRAIGHT";

    // Get the number of canonical states for this tile type.
    //
    // STRAIGHT   = 2
    // CORNER     = 2
    // T_JUNCTION = 6
    // CROSS      = 12
    const max =
      SHAPE_FLIP_STATES_COUNT[type] || 2;

    const currentFlip =
      getTileFlipState(type, beforeState);

    const nextFlip =
      (currentFlip + 1) % max;

    // IMPORTANT:
    // Only update the canonical flip state here.
    //
    // Do NOT set:
    //   flipped: nextFlip % 2 === 1
    //   directionReversed: nextFlip % 2 === 1
    //
    // Those values must not be derived from the canonical state.
    const afterState: TileState = {
      ...beforeState,

      flipState: nextFlip,

      mode: nextFlip,
    };

    const afterCells = tileDef
      ? getEffectiveTileCells(tileDef, afterState)
      : [];

    console.log(
      `[PATHFINDER] Button 2 (CHANGE ROUTE DIRECTION) on block: ${selectedTileId}`
    );

    console.log(
      `[PATHFINDER] Tile Type: ${type}`
    );

    console.log(
      `[PATHFINDER] Canonical State: ${currentFlip} -> ${nextFlip} / ${max}`
    );

    console.log("Before State:", beforeState);

    if (tileDef) {
      console.log(
        "Before Cells (active/arrows):",
        beforeCells.flatMap((row, r) =>
          row
            .map((c, col) =>
              c.active
                ? `R${r + 1}C${col + 1}=${
                    c.arrowDirection || "NO_ARROW"
                  }`
                : null
            )
            .filter(Boolean)
        )
      );
    }

    console.log("After State:", afterState);

    if (tileDef) {
      console.log(
        "After Cells (active/arrows):",
        afterCells.flatMap((row, r) =>
          row
            .map((c, col) =>
              c.active
                ? `R${r + 1}C${col + 1}=${
                    c.arrowDirection || "NO_ARROW"
                  }`
                : null
            )
            .filter(Boolean)
        )
      );
    }

    setTileStates((prev) => ({
      ...prev,
      [selectedTileId]: afterState,
    }));

    setMoves((m) => m + 1);

    setTotalMoves((tm) => tm + 1);

    setFeedback(null);
  }, [
    selectedTileId,
    isSubmitting,
    currentPuzzle.tiles,
    tileStates,
  ]);

  // ============================================================================
  // BUTTON 3 — CHECK PATH
  // ============================================================================

  // Checking does NOT increment moves.
  const handleCheck = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    const result = validateRoute(
      currentPuzzle,
      tileStates
    );

    if (
      result.isValid &&
      result.visitedPath.length > 0
    ) {
      setIsSubmitting(true);

      setSelectedTileId(null);

      // Rocket animation cell-by-cell.
      const path = result.visitedPath;

      let stepIndex = 0;

      const animateStep = () => {
        if (stepIndex >= path.length) {
          // Rocket reached destination.
          setFeedback({
            type: "success",
            message: "Correct! Path connected.",
          });

          setTimeout(() => {
            if (
              currentQuestionIndex + 1 <
              puzzles.length
            ) {
              loadQuestion(
                currentQuestionIndex + 1
              );
            } else {
              setStage("COMPLETED");
            }
          }, 800);

          return;
        }

        const currentCell =
          path[stepIndex];

        const nextCell =
          stepIndex + 1 < path.length
            ? path[stepIndex + 1]
            : path[stepIndex];

        const angle =
          stepIndex + 1 < path.length
            ? getHeadingAngle(
                currentCell,
                nextCell
              )
            : 0;

        setAnimatingRocket({
          x: currentCell.c * 42 + 21,
          y: currentCell.r * 42 + 21,
          angle,
        });

        stepIndex++;

        setTimeout(animateStep, 90);
      };

      animateStep();
    } else {
      setFeedback({
        type: "error",
        message:
          "Path is not connected. Keep trying!",
      });

      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  }, [
    currentPuzzle,
    tileStates,
    currentQuestionIndex,
    loadQuestion,
    puzzles.length,
    isSubmitting,
  ]);

  // ============================================================================
  // INSTRUCTIONS
  // ============================================================================

  if (stage === "INSTRUCTIONS") {
    return (
      <PathFinderInstructions
        onNext={handleStartGame}
      />
    );
  }

  // ============================================================================
  // COMPLETED
  // ============================================================================

  if (stage === "COMPLETED") {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center p-6 space-y-6">
          <CardHeader className="space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <CardTitle className="text-2xl font-bold">
              {testTitle} Completed!
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              You solved all{" "}
              {puzzles.length} puzzle
              {puzzles.length > 1 ? "s" : ""} in{" "}
              <strong className="text-foreground">
                {totalMoves} total moves
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

  // ============================================================================
  // TIMEOUT
  // ============================================================================

  if (stage === "TIMEOUT") {
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
              The 4:00 time limit for this question
              has elapsed.
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

  // ============================================================================
  // PLAYING
  // ============================================================================

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full min-h-[calc(100vh-4rem)] bg-[#f8f9fa] dark:bg-slate-950">
      <div className="flex flex-col items-center gap-5 w-full max-w-lg">

        {/* ================================================================== */}
        {/* FEEDBACK                                                           */}
        {/* ================================================================== */}

        {feedback && (
          <div
            className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${
              feedback.type === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* ================================================================== */}
        {/* 9x9 PATH FINDER BOARD                                             */}
        {/* ================================================================== */}

        <PathFinderBoard
          puzzle={currentPuzzle}
          tileStates={tileStates}
          selectedTileId={selectedTileId}
          animatingRocket={animatingRocket}
          onSelectTile={(id) => {
            if (isSubmitting) {
              return;
            }

            setSelectedTileId(
              (prev) =>
                prev === id ? null : id
            );

            setFeedback(null);
          }}
        />

        {/* ================================================================== */}
        {/* TIMER + CONTROLS                                                  */}
        {/* ================================================================== */}

        <div className="flex flex-col items-center gap-3 pt-2">

          <div className="flex items-center justify-center gap-6 sm:gap-8">

            {/* Timer */}

            <PathFinderTimer
              timeRemaining={timeRemaining}
              totalTime={240}
              onTimeout={() =>
                setStage("TIMEOUT")
              }
              isRunning={
                stage === "PLAYING" &&
                !isSubmitting
              }
            />

            {/* Controls */}

            <PathFinderControls
              onRotate={handleRotate}
              onChangeDirection={
                handleChangeDirection
              }
              onCheck={handleCheck}
              hasSelection={
                selectedTileId !== null
              }
              disabled={isSubmitting}
            />
          </div>

          {/* Moves Counter */}

          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
            Moves: {moves}
          </div>
        </div>
      </div>
    </div>
  );
}