"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useGameSessionStore } from "@/lib/store/game-session";
import {
  MemoryMazeState,
  MemoryMazeQuestion,
  MemoryMazeConfig,
  Position,
  Direction,
  isWallBetween,
} from "@/lib/games/memory-maze/types";
import { MemoryMazeInstructions } from "./MemoryMazeInstructions";
import { MemoryMazeTutorial } from "./MemoryMazeTutorial";
import { MemoryMazeResult } from "./MemoryMazeResult";
import { MemoryMazeGrid } from "./MemoryMazeGrid";
import { cn } from "@/lib/utils";

const MEMORY_MAZE_TOTAL_SECONDS = 240; // 4 minutes = 240s = 240000ms

export function MemoryMazeGame() {
  const { currentSession, controller, startSession, recordAction, advanceQuestion } = useGameSessionStore();

  const state = currentSession?.gameState as MemoryMazeState | undefined;
  const config = currentSession ? (controller as unknown as { config: MemoryMazeConfig }).config : undefined;

  const variantId = currentSession?.variantId || config?.variantId;
  const isFullMockPractice = variantId === "full-memory-mock-test";

  // Full Mock Tutorial & Practice progression flow state
  const [fullMockStage, setFullMockStage] = useState<"intro" | "tutorial" | "playing" | "pre_results" | "results">("intro");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [overlayState, setOverlayState] = useState<"success" | "timeout" | null>(null);
  const [tutorialKey, setTutorialKey] = useState<number>(0);
  const [attemptHistory, setAttemptHistory] = useState<
    Array<{
      mazeId: string;
      questionNumber: number;
      isPractice: boolean;
      escaped: boolean;
      isTimeout: boolean;
      movesCount: number;
      timeUsedSeconds: number;
      gridSize: number;
    }>
  >([]);

  // Active question based on practice state
  const questionIndex = isFullMockPractice
    ? activeQuestionIndex
    : (currentSession?.currentItemIndex ?? 0);

  const currentQ: MemoryMazeQuestion | undefined = state?.questions[questionIndex];

  // Local maze player and state
  const [playerPosition, setPlayerPosition] = useState<Position>({ row: 1, col: 1 });
  const [key1Collected, setKey1Collected] = useState(false);
  const [key2Collected, setKey2Collected] = useState(false);
  const [movesCount, setMovesCount] = useState(0);
  const [visitedCells, setVisitedCells] = useState<Position[]>([]);
  const [collisionDirection, setCollisionDirection] = useState<Direction | null>(null);
  const [status, setStatus] = useState<
    "ready" | "playing" | "keyCollected" | "openingDoor" | "success" | "timeout"
  >("ready");
  const [doorPhase, setDoorPhase] = useState<"entering" | "opened" | null>(null);

  const questionStartTime = useRef<number>(0);
  const sessionStartTime = useRef<number>(0);
  const isTransitioning = useRef(false);
  const [remainingSec, setRemainingSec] = useState<number>(MEMORY_MAZE_TOTAL_SECONDS);

  // Synchronize initial state whenever question index changes (for standard non-mock multi-question mode)
  useEffect(() => {
    if (currentQ && !isFullMockPractice) {
      setPlayerPosition(currentQ.playerStartPosition);
      setKey1Collected(false);
      setKey2Collected(false);
      setMovesCount(0);
      setVisitedCells([currentQ.playerStartPosition]);
      setCollisionDirection(null);
      setDoorPhase(null);
      setStatus("playing");
      isTransitioning.current = false;
      questionStartTime.current = Date.now();
      setRemainingSec(MEMORY_MAZE_TOTAL_SECONDS);

      if (currentSession?.currentItemIndex === 0 && sessionStartTime.current === 0) {
        sessionStartTime.current = Date.now();
      }
    }
  }, [currentSession?.currentItemIndex, currentQ, isFullMockPractice]);

  // Start Practice 1 from Tutorial
  const handleStartPractice1 = useCallback(() => {
    setActiveQuestionIndex(0);
    const q1 = state?.questions[0];
    if (q1) {
      setPlayerPosition(q1.playerStartPosition);
      setKey1Collected(false);
      setKey2Collected(false);
      setMovesCount(0);
      setVisitedCells([q1.playerStartPosition]);
      setCollisionDirection(null);
      setDoorPhase(null);
      setStatus("playing");
      setOverlayState(null);
      isTransitioning.current = false;
      questionStartTime.current = Date.now();
      sessionStartTime.current = Date.now();
      setRemainingSec(MEMORY_MAZE_TOTAL_SECONDS);
    }
    setFullMockStage("playing");
    if (currentSession?.status === "IDLE") {
      startSession();
    }
  }, [state?.questions, currentSession?.status, startSession]);

  // Replay Tutorial from Completion Overlay
  const handleReplayTutorial = useCallback(() => {
    setTutorialKey((prev) => prev + 1);
    setFullMockStage("tutorial");
    setOverlayState(null);
    setStatus("ready");
    isTransitioning.current = false;
  }, []);

  // Continue Handler for Multi-step Practice progression
  const handleContinue = useCallback(() => {
    if (!state?.questions) return;
    setOverlayState(null);
    isTransitioning.current = false;

    const nextIndex = activeQuestionIndex + 1;
    if (nextIndex < state.questions.length) {
      setActiveQuestionIndex(nextIndex);
      const nextQ = state.questions[nextIndex];
      setPlayerPosition(nextQ.playerStartPosition);
      setKey1Collected(false);
      setKey2Collected(false);
      setMovesCount(0);
      setVisitedCells([nextQ.playerStartPosition]);
      setCollisionDirection(null);
      setDoorPhase(null);
      setStatus("playing");
      questionStartTime.current = Date.now();
      setRemainingSec(MEMORY_MAZE_TOTAL_SECONDS);
    } else {
      // Completed all questions in the mock session -> Show Final Saved Screen
      setFullMockStage("pre_results");
    }
  }, [activeQuestionIndex, state?.questions]);

  // Restart / Reset active practice test
  const handleRestart = useCallback(() => {
    if (!currentQ) return;
    setPlayerPosition(currentQ.playerStartPosition);
    setKey1Collected(false);
    setKey2Collected(false);
    setMovesCount(0);
    setVisitedCells([currentQ.playerStartPosition]);
    setCollisionDirection(null);
    setDoorPhase(null);
    setStatus("playing");
    setOverlayState(null);
    isTransitioning.current = false;
    questionStartTime.current = Date.now();
    setRemainingSec(MEMORY_MAZE_TOTAL_SECONDS);
  }, [currentQ]);

  // Advance on success for standard multi-question mode
  const handleStandardAdvance = useCallback(() => {
    advanceQuestion();
    setPlayerPosition({ row: 1, col: 1 });
    setKey1Collected(false);
    setKey2Collected(false);
    setMovesCount(0);
    setVisitedCells([]);
    setCollisionDirection(null);
    setDoorPhase(null);
    setStatus("playing");
    isTransitioning.current = false;
    questionStartTime.current = Date.now();
    setRemainingSec(MEMORY_MAZE_TOTAL_SECONDS);
  }, [advanceQuestion]);

  // Timeout handler
  const handleTimeout = useCallback(() => {
    if (isTransitioning.current || !currentQ) return;
    isTransitioning.current = true;
    setStatus("timeout");

    const hasTwoKeys = Boolean(currentQ.key2Position);
    const allCollected = hasTwoKeys ? (key1Collected && key2Collected) : key1Collected;
    const responseTimeMs = Date.now() - questionStartTime.current;
    recordAction(
      {
        mazeId: currentQ.id,
        completed: false,
        keyCollected: allCollected,
        key1Collected,
        key2Collected: hasTwoKeys ? key2Collected : undefined,
        movesCount,
        path: visitedCells,
        isTimeout: true,
      },
      responseTimeMs
    );

    if (isFullMockPractice) {
      setAttemptHistory((prev) => [
        ...prev.filter((item) => item.mazeId !== currentQ.id),
        {
          mazeId: currentQ.id,
          questionNumber: activeQuestionIndex < 2 ? activeQuestionIndex + 1 : activeQuestionIndex - 1,
          isPractice: activeQuestionIndex < 2,
          escaped: false,
          isTimeout: true,
          movesCount,
          timeUsedSeconds: 240,
          gridSize: currentQ.gridSize || 3,
        },
      ]);

      if (activeQuestionIndex >= (state?.questions?.length || 5) - 1) {
        setTimeout(() => {
          setFullMockStage("pre_results");
          isTransitioning.current = false;
        }, 700);
      } else {
        setOverlayState("timeout");
        isTransitioning.current = false;
      }
    } else {
      setTimeout(() => {
        advanceQuestion();
      }, 400);
    }
  }, [currentQ, key1Collected, key2Collected, movesCount, visitedCells, recordAction, advanceQuestion, isFullMockPractice, activeQuestionIndex, state?.questions?.length]);

  // Per-maze independent countdown timer (4:00 per question, never resets on collision)
  useEffect(() => {
    const isActivePlaying =
      (currentSession?.status === "PLAYING" || isFullMockPractice) &&
      (status === "playing" || status === "keyCollected" || status === "openingDoor") &&
      (!isFullMockPractice || (fullMockStage === "playing" && overlayState === null));

    if (isActivePlaying) {
      if (questionStartTime.current === 0) {
        questionStartTime.current = Date.now();
      }

      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - questionStartTime.current) / 1000);
        const rem = Math.max(0, MEMORY_MAZE_TOTAL_SECONDS - elapsed);
        setRemainingSec(rem);

        if (rem <= 0 && !isTransitioning.current) {
          handleTimeout();
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [currentSession?.status, currentSession?.currentItemIndex, status, handleTimeout, isFullMockPractice, fullMockStage, overlayState]);

  // Central movement engine: attemptMove
  const attemptMove = useCallback(
    (direction: Direction | "UP" | "DOWN" | "LEFT" | "RIGHT") => {
      // 1. Check game status
      if (
        (status !== "playing" && status !== "keyCollected") ||
        isTransitioning.current ||
        !currentQ ||
        (isFullMockPractice && overlayState !== null)
      ) {
        return;
      }

      const dir = direction.toLowerCase() as Direction;

      // 2. Calculate target cell
      let nextRow = playerPosition.row;
      let nextCol = playerPosition.col;

      if (dir === "up") nextRow -= 1;
      else if (dir === "down") nextRow += 1;
      else if (dir === "left") nextCol -= 1;
      else if (dir === "right") nextCol += 1;

      // 3. Grid boundary check: 0 <= row < gSize, 0 <= col < gSize
      const gSize = currentQ.gridSize || 3;
      if (nextRow < 0 || nextRow >= gSize || nextCol < 0 || nextCol >= gSize) {
        return; // Target outside physical grid: do nothing
      }

      // 4. Check invisible wall
      if (isWallBetween(currentQ.walls, playerPosition, dir)) {
        // Hidden-wall collision detected
        setCollisionDirection(dir);
        isTransitioning.current = true;

        setTimeout(() => {
          // 1. Reset player position to ORIGINAL start position
          setPlayerPosition(currentQ.playerStartPosition);
          // 2. Clear visited path: ONLY start position remains visited (all other cells return to white)
          setVisitedCells([currentQ.playerStartPosition]);
          // 3. Clear collision feedback
          setCollisionDirection(null);
          // 4. Reset keys back to uncollected
          setKey1Collected(false);
          setKey2Collected(false);
          // 5. Reset current attempt step count to 0
          setMovesCount(0);
          setStatus("playing");
          isTransitioning.current = false;
          // 6. TIMER DOES NOT RESET - continues uninterrupted!
        }, 350);
        return;
      }

      // 5. Valid movement: move exactly one cell
      const newPos: Position = { row: nextRow, col: nextCol };
      setPlayerPosition(newPos);
      setMovesCount((prev) => prev + 1);

      // Record visited cell (prevents duplicates)
      setVisitedCells((prev) => {
        if (prev.some((p) => p.row === newPos.row && p.col === newPos.col)) {
          return prev;
        }
        return [...prev, newPos];
      });

      // 6. Check key collection
      const k1Pos = currentQ.key1Position || currentQ.keyPosition;
      const k2Pos = currentQ.key2Position;
      const hasTwoKeys = Boolean(k2Pos);

      let curK1 = key1Collected;
      let curK2 = key2Collected;

      if (!key1Collected && k1Pos && newPos.row === k1Pos.row && newPos.col === k1Pos.col) {
        curK1 = true;
        setKey1Collected(true);
      }

      if (!key2Collected && k2Pos && newPos.row === k2Pos.row && newPos.col === k2Pos.col) {
        curK2 = true;
        setKey2Collected(true);
      }

      const allKeysCollected = hasTwoKeys ? (curK1 && curK2) : curK1;

      if (allKeysCollected && status === "playing") {
        setStatus("keyCollected");
      }

      // 7. Check door reach
      if (newPos.row === currentQ.doorPosition.row && newPos.col === currentQ.doorPosition.col) {
        if (allKeysCollected) {
          // All keys were collected: begin door opening sequence
          isTransitioning.current = true;
          setStatus("openingDoor");
          setDoorPhase("entering");

          const responseTimeMs = Date.now() - questionStartTime.current;

          // Phase 1: Key entering doorway (~350ms)
          setTimeout(() => {
            // Phase 2: Door swings open with key inside (~400ms)
            setDoorPhase("opened");

            setTimeout(() => {
              // Phase 3: Mark success
              setStatus("success");
              recordAction(
                {
                  mazeId: currentQ.id,
                  completed: true,
                  keyCollected: true,
                  key1Collected: true,
                  key2Collected: hasTwoKeys ? true : undefined,
                  movesCount: movesCount + 1,
                  path: [...visitedCells, newPos],
                  isTimeout: false,
                },
                responseTimeMs
              );

              if (isFullMockPractice) {
                const totalMoves = movesCount + 1;
                const timeUsed = Math.min(240, Math.max(1, Math.floor(responseTimeMs / 1000)));

                setAttemptHistory((prev) => [
                  ...prev.filter((item) => item.mazeId !== currentQ.id),
                  {
                    mazeId: currentQ.id,
                    questionNumber: activeQuestionIndex < 2 ? activeQuestionIndex + 1 : activeQuestionIndex - 1,
                    isPractice: activeQuestionIndex < 2,
                    escaped: true,
                    isTimeout: false,
                    movesCount: totalMoves,
                    timeUsedSeconds: timeUsed,
                    gridSize: currentQ.gridSize || 3,
                  },
                ]);

                if (activeQuestionIndex >= (state?.questions?.length || 5) - 1) {
                  // Final assessment maze: pause to show completed maze opened then transition to final saved screen
                  setTimeout(() => {
                    setFullMockStage("pre_results");
                    isTransitioning.current = false;
                  }, 700);
                } else {
                  // Show completion overlay on top of completed maze
                  setOverlayState("success");
                  isTransitioning.current = false;
                }
              } else {
                setTimeout(() => {
                  advanceQuestion();
                }, 300);
              }
            }, 400);
          }, 350);
        }
      }
    },
    [status, currentQ, playerPosition, key1Collected, key2Collected, movesCount, visitedCells, recordAction, advanceQuestion, isFullMockPractice, overlayState, activeQuestionIndex, state?.questions?.length]
  );

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (status !== "playing" && status !== "keyCollected") ||
        isTransitioning.current ||
        (isFullMockPractice && overlayState !== null)
      ) {
        return;
      }

      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        attemptMove("up");
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        attemptMove("down");
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        attemptMove("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        attemptMove("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [attemptMove, status, isFullMockPractice, overlayState]);

  if (!currentSession || !controller || !config || !state) {
    return <div className="flex h-[400px] items-center justify-center">Loading...</div>;
  }

  // Full Mock Starting Screen (Intro Screen)
  if (isFullMockPractice && fullMockStage === "intro") {
    return (
      <div className="w-full min-h-[520px] flex flex-col items-center justify-center py-6 px-4 bg-white text-black select-none">
        <div className="w-full max-w-[650px] min-h-[580px] flex flex-col border border-[#b8b8b8] rounded-[6px] overflow-hidden bg-[#f3f3f3] shadow-none relative">
          <div className="w-full h-[48px] bg-black flex items-center justify-between px-5 shrink-0 z-10">
            <span className="text-white text-sm sm:text-base font-semibold tracking-tight">
              Memory Maze - Full Memory Mock Test
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 space-y-8">
            <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-[500px]">
              <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                Are you ready to start the Full Mock Test?
              </h2>

              <div className="flex flex-col items-start bg-white border border-[#b8b8b8]/60 rounded-[6px] p-5 sm:p-6 w-full space-y-3 text-left">
                <span className="text-sm sm:text-base font-bold text-red-600 uppercase tracking-wide">
                  Do not:
                </span>
                <ol className="list-none space-y-2 text-sm sm:text-[15px] font-medium text-neutral-800">
                  <li className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">1.</span>
                    <span>Do not refresh the website</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">2.</span>
                    <span>Do not press or use the back buttons</span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-center w-full max-w-[300px]">
              <button
                onClick={() => setFullMockStage("tutorial")}
                className="w-full h-11 px-8 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-bold text-sm tracking-wider uppercase rounded-[4px] shadow-sm transition-all cursor-pointer text-center"
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Mock Tutorial Presentation
  if (isFullMockPractice && fullMockStage === "tutorial") {
    return <MemoryMazeTutorial key={tutorialKey} onStart={handleStartPractice1} />;
  }

  // Full Mock Final Screen (Response Saved Screen before Results)
  if (isFullMockPractice && fullMockStage === "pre_results") {
    return (
      <div className="w-full min-h-[520px] flex flex-col items-center justify-center py-6 px-4 bg-white text-black select-none">
        <div className="w-full max-w-[650px] min-h-[580px] flex flex-col border border-[#b8b8b8] rounded-[6px] overflow-hidden bg-[#f3f3f3] shadow-none relative">
          <div className="w-full h-[48px] bg-black flex items-center justify-between px-5 shrink-0 z-10">
            <span className="text-white text-sm sm:text-base font-semibold tracking-tight">
              Memory Maze - Full Memory Mock Test
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 space-y-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-[500px]">
              <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                Your response has been saved.
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 font-normal">
                To submit your results, click the CONTINUE button below.
              </p>
            </div>

            <div className="flex items-center justify-center w-full max-w-[300px]">
              <button
                onClick={() => setFullMockStage("results")}
                className="w-full h-11 px-8 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-bold text-sm tracking-wider uppercase rounded-[4px] shadow-sm transition-all cursor-pointer text-center"
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard non-mock instructions
  if (!isFullMockPractice && currentSession.status === "IDLE") {
    return (
      <MemoryMazeInstructions
        onStart={() => {
          sessionStartTime.current = Date.now();
          startSession();
        }}
      />
    );
  }

  if (["COMPLETED", "TIMEOUT", "FAILED", "ABORTED"].includes(currentSession.status) && !isFullMockPractice) {
    return <MemoryMazeResult />;
  }

  if (!currentQ) return null;

  const totalQuestions = state?.questions?.length || currentSession.totalItems || 5;
  const currentItemIndex = currentSession.currentItemIndex;

  const getVariantTitle = (vId?: string) => {
    switch (vId) {
      case "practice-1":
        return "Memory Maze - Practice Test 1";
      case "practice-2":
        return "Memory Maze - Practice Test 2";
      case "practice-3":
        return "Memory Maze - Practice Test 3";
      case "full-memory-mock-test":
        return "Memory Maze - Full Memory Mock Test";
      default:
        if (vId?.startsWith("practice-")) {
          const num = vId.replace("practice-", "");
          return `Memory Maze - Practice Test ${num}`;
        }
        return "Memory Maze - Practice Test 1";
    }
  };
  const variantTitle = getVariantTitle(variantId);

  // Dynamic Question Counter based on practice state
  let questionHeaderText: string | null = `Question ${currentItemIndex + 1} of ${totalQuestions}`;
  if (isFullMockPractice) {
    if (overlayState !== null || fullMockStage === "intro" || fullMockStage === "tutorial" || fullMockStage === "pre_results" || fullMockStage === "results") {
      questionHeaderText = null; // No question counter on intro, tutorial, pre_results, overlays, or results screen
    } else if (activeQuestionIndex === 0 || activeQuestionIndex === 1) {
      questionHeaderText = "Question 1 of 1";
    } else {
      const assessmentNumber = activeQuestionIndex - 1; // Index 2 -> Q1, Index 3 -> Q2, Index 4 -> Q3, Index 5 -> Q4, Index 6 -> Q5
      questionHeaderText = `Question ${assessmentNumber} of ${assessmentNumber}`;
    }
  }

  // Format timer as m:ss
  const minutes = Math.floor(Math.max(0, remainingSec) / 60);
  const seconds = Math.floor(Math.max(0, remainingSec) % 60);
  const formattedTimer = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const hasTwoKeys = Boolean(currentQ.key2Position);
  const allKeysCollected = hasTwoKeys ? (key1Collected && key2Collected) : key1Collected;

  // Circular countdown timer progress calculations
  const timerRadius = 21;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerProgress = Math.max(0, Math.min(1, remainingSec / MEMORY_MAZE_TOTAL_SECONDS));
  const strokeDashoffset = timerCircumference * (1 - timerProgress);

  // Full Mock Results Screen
  if (isFullMockPractice && fullMockStage === "results") {
    const assessmentRecords = attemptHistory.filter((r) => !r.isPractice);
    const totalAssessmentQuestions = assessmentRecords.length;
    const escapedCount = assessmentRecords.filter((r) => r.escaped).length;
    const failedCount = assessmentRecords.filter((r) => !r.escaped).length;
    const scorePercent =
      totalAssessmentQuestions > 0
        ? Math.round((escapedCount / totalAssessmentQuestions) * 100)
        : 0;
    const totalTimeSec = assessmentRecords.reduce((acc, r) => acc + r.timeUsedSeconds, 0);
    const avgTimeSec =
      totalAssessmentQuestions > 0
        ? (totalTimeSec / totalAssessmentQuestions).toFixed(1)
        : "0.0";

    return (
      <div className="w-full min-h-[520px] flex flex-col items-center justify-center py-6 px-4 bg-white text-black select-none">
        <div className="w-full max-w-[650px] min-h-[580px] flex flex-col border border-[#b8b8b8] rounded-[6px] overflow-hidden bg-[#f3f3f3] shadow-none relative">
          <div className="w-full h-[48px] bg-black flex items-center justify-between px-5 shrink-0 z-10">
            <span className="text-white text-sm sm:text-base font-semibold tracking-tight">
              Memory Maze Results
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-500">
                Assessment Score
              </span>
              <span className="text-5xl sm:text-6xl font-black text-black">
                {scorePercent}%
              </span>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-[500px]">
              <div className="flex flex-col items-center p-3 rounded bg-white border border-[#b8b8b8]/60 shadow-none text-center">
                <span className="text-xs text-neutral-500 font-semibold uppercase">Questions</span>
                <span className="text-2xl font-bold text-black mt-1">{totalAssessmentQuestions}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded bg-white border border-[#b8b8b8]/60 shadow-none text-center">
                <span className="text-xs text-neutral-500 font-semibold uppercase">Escaped</span>
                <span className="text-2xl font-bold text-green-600 mt-1">{escapedCount}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded bg-white border border-[#b8b8b8]/60 shadow-none text-center">
                <span className="text-xs text-neutral-500 font-semibold uppercase">Failed</span>
                <span className="text-2xl font-bold text-red-600 mt-1">{failedCount}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded bg-white border border-[#b8b8b8]/60 shadow-none text-center">
                <span className="text-xs text-neutral-500 font-semibold uppercase">Avg Time</span>
                <span className="text-2xl font-bold text-black mt-1">{avgTimeSec}s</span>
              </div>
            </div>

            {/* Assessment Questions Breakdown */}
            {assessmentRecords.length > 0 && (
              <div className="w-full max-w-[500px] bg-white border border-[#b8b8b8]/60 rounded p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block mb-2">
                  Assessment Question Breakdown
                </span>
                <div className="divide-y divide-neutral-100 text-xs sm:text-sm">
                  {assessmentRecords.map((rec) => (
                    <div
                      key={rec.mazeId}
                      className="py-2 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">
                          Question {rec.questionNumber}
                        </span>
                        <span className="text-xs text-neutral-500">
                          ({rec.gridSize}x{rec.gridSize})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-500">
                          {rec.timeUsedSeconds}s
                        </span>
                        <span
                          className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded",
                            rec.escaped
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {rec.escaped ? "Escaped" : "Timed Out"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-[400px] mt-2">
              
              <a
                href="/practice/memory-maze"
                className="w-full sm:w-auto h-10 px-7 flex items-center justify-center bg-white border border-[#b8b8b8] hover:bg-neutral-100 active:scale-[0.99] text-black font-bold text-xs sm:text-sm tracking-wider uppercase rounded-[4px] shadow-sm transition-all cursor-pointer text-center"
              >
                Back to Practice
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[520px] flex flex-col items-center justify-center py-6 px-4 bg-white text-black select-none">
      {/* Outer Game Container Card - Exact same outer dimensions as production Memory Maze */}
      <div className="w-full max-w-[650px] min-h-[650px] flex flex-col border border-[#b8b8b8] rounded-[6px] overflow-hidden bg-[#f3f3f3] shadow-none relative">
        {/* 1. Black Question Header */}
        <div className="w-full h-[48px] bg-black flex items-center justify-between px-5 shrink-0 z-10">
          <span className="text-white text-sm sm:text-base font-semibold tracking-tight">
            {variantTitle}
          </span>
          {questionHeaderText && (
            <span className="text-white text-sm sm:text-base font-semibold tracking-tight">
              {questionHeaderText}
            </span>
          )}
        </div>

        {/* 2. Active Game Content Area (Maze stays fixed base layer) */}
        <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-6 relative bg-[#f3f3f3] overflow-hidden">
          <div className="flex flex-col items-center w-[300px] sm:w-[340px] mx-auto my-auto">
            {/* Grid Board */}
            <div className="flex justify-center items-center w-full">
              <MemoryMazeGrid
                playerPosition={playerPosition}
                keyPosition={currentQ.keyPosition}
                key1Position={currentQ.key1Position || currentQ.keyPosition}
                key2Position={currentQ.key2Position}
                doorPosition={currentQ.doorPosition}
                keyCollected={allKeysCollected || overlayState === "success"}
                key1Collected={key1Collected || overlayState === "success"}
                key2Collected={key2Collected}
                isDoorOpen={status === "openingDoor" || status === "success" || overlayState === "success"}
                doorPhase={doorPhase || (overlayState === "success" ? "opened" : null)}
                visitedCells={visitedCells}
                collisionDirection={collisionDirection}
                onMove={attemptMove}
                disabled={
                  (status !== "playing" && status !== "keyCollected") ||
                  isTransitioning.current ||
                  overlayState !== null
                }
                showArrows={overlayState === null && status !== "timeout"}
                gridSize={currentQ.gridSize || 3}
              />
            </div>

            {/* Compact Timer & Objective Row directly below the grid, matching grid width */}
            <div className="flex items-center justify-between w-full mt-3 px-1">
              {/* Circular Countdown Progress Indicator */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 48 48">
                  {/* Subtle Background Track Circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r={timerRadius}
                    fill="white"
                    stroke="#e5e5e5"
                    strokeWidth="2.5"
                  />
                  {/* Black Countdown Progress Ring */}
                  <circle
                    cx="24"
                    cy="24"
                    r={timerRadius}
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeDasharray={timerCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-[stroke-dashoffset] duration-300 ease-linear"
                  />
                </svg>
                <span className="absolute font-sans font-bold text-xs sm:text-sm text-black tracking-tight select-none">
                  {formattedTimer}
                </span>
              </div>

              {/* Objective Text */}
              <div className="flex flex-col text-[11px] sm:text-xs font-sans font-semibold text-black leading-tight text-right tracking-tight">
                <span>Collect {hasTwoKeys ? "2 KEYS" : "1 KEY"}</span>
                <span>then get to the DOOR</span>
              </div>
            </div>
          </div>

          {/* Maze Completion / Failure Overlay (Layered on top of the completed/timed-out maze) */}
          {isFullMockPractice && overlayState !== null && (
            <>
              {/* Practice Maze 1 Success Overlay (Keeps existing wide instruction structure) */}
              {overlayState === "success" && activeQuestionIndex === 0 && (
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full bg-white border-y border-[#b8b8b8] px-4 sm:px-8 py-6 sm:py-7 z-30 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center space-y-2 sm:space-y-2.5">
                    <p className="text-base sm:text-lg text-neutral-900 font-semibold leading-snug tracking-tight">
                      You completed the first practice maze.
                    </p>
                    <p className="text-xs sm:text-[13px] text-neutral-800 leading-snug sm:leading-relaxed font-normal">
                      To repeat the instructions, select REPLAY.
                    </p>
                    <p className="text-xs sm:text-[13px] text-neutral-800 leading-snug sm:leading-relaxed font-normal">
                      To continue to the next practice maze, select START.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-5">
                    <button
                      onClick={handleContinue}
                      className="h-10 px-8 sm:px-10 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-[4px] shadow-sm transition-all cursor-pointer"
                      aria-label="Start next practice maze"
                    >
                      START
                    </button>
                    <button
                      onClick={handleReplayTutorial}
                      className="h-10 px-7 sm:px-8 bg-white border border-[#b8b8b8] hover:bg-neutral-100 active:scale-[0.99] text-black font-bold text-xs sm:text-sm tracking-wider uppercase rounded-[4px] shadow-sm transition-all cursor-pointer"
                      aria-label="Replay tutorial"
                    >
                      REPLAY
                    </button>
                  </div>
                </div>
              )}

              {/* Practice Maze 2 and Assessment Mazes Success Overlay (Compact small centered white box) */}
              {overlayState === "success" && activeQuestionIndex >= 1 && (
                <div className="absolute inset-0 flex items-center justify-center p-4 z-30 pointer-events-none">
                  <div className="bg-white border border-[#b8b8b8] rounded-[6px] px-6 sm:px-8 py-5 sm:py-6 shadow-md flex flex-col items-center justify-center text-center space-y-4 max-w-[260px] sm:max-w-[300px] w-auto pointer-events-auto">
                    <p className="text-base sm:text-lg text-neutral-900 font-semibold leading-snug tracking-tight">
                      You escaped!
                    </p>
                    <button
                      onClick={handleContinue}
                      className="h-10 px-8 sm:px-10 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-[4px] shadow-sm transition-all cursor-pointer"
                      aria-label="Continue to next maze challenge"
                    >
                      CONTINUE
                    </button>
                  </div>
                </div>
              )}

              {/* Timeout Failure Overlay (Compact small centered white box) */}
              {overlayState === "timeout" && (
                <div className="absolute inset-0 flex items-center justify-center p-4 z-30 pointer-events-none">
                  <div className="bg-white border border-[#b8b8b8] rounded-[6px] px-6 sm:px-8 py-5 sm:py-6 shadow-md flex flex-col items-center justify-center text-center space-y-4 max-w-[280px] sm:max-w-[320px] w-auto pointer-events-auto">
                    <p className="text-base sm:text-lg text-neutral-900 font-semibold leading-snug tracking-tight">
                      You failed to escape the maze.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={handleContinue}
                        className="h-10 px-8 sm:px-10 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-[4px] shadow-sm transition-all cursor-pointer"
                        aria-label="Continue to next maze challenge"
                      >
                        CONTINUE
                      </button>
                      {activeQuestionIndex === 0 && (
                        <button
                          onClick={handleReplayTutorial}
                          className="h-10 px-7 sm:px-8 bg-white border border-[#b8b8b8] hover:bg-neutral-100 active:scale-[0.99] text-black font-bold text-xs sm:text-sm tracking-wider uppercase rounded-[4px] shadow-sm transition-all cursor-pointer"
                          aria-label="Replay tutorial"
                        >
                          REPLAY
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}




