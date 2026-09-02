"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useGameSessionStore } from "@/lib/store/game-session";
import { PathFinderState, PathFinderConfig, PathFinderQuestion } from "@/lib/games/path-finder/types";
import { validateRoute } from "@/lib/games/path-finder/validator";
import { PathFinderBoard } from "./PathFinderBoard";
import { PathFinderControls } from "./PathFinderControls";
import { PathFinderResult } from "./PathFinderResult";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function PathFinderGame() {
  const { currentSession, controller, timer, recordAction, advanceQuestion } = useGameSessionStore();

  const state = currentSession?.gameState as PathFinderState | undefined;
  const config = currentSession ? (controller as unknown as { config: PathFinderConfig })?.config : undefined;

  const currentItemIndex = currentSession?.currentItemIndex ?? 0;
  const currentQ: PathFinderQuestion | undefined = state?.questions?.[currentItemIndex];

  const [rotations, setRotations] = useState<number[][]>(() => {
    if (currentQ?.initialRotations) {
      return currentQ.initialRotations.map((row) => [...row]);
    }
    return [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  });
  const [selectedBlock, setSelectedBlock] = useState<{ br: number; bc: number } | null>({ br: 0, bc: 0 });
  const [direction, setDirection] = useState<"FORWARD" | "REVERSE">("FORWARD");
  const [moves, setMoves] = useState<number>(0);
  const [highlightedPath, setHighlightedPath] = useState<{ r: number; c: number }[]>([]);
  const [rocketState, setRocketState] = useState<{ x: number; y: number; angle: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(240);
  const questionStartTime = useRef<number>(Date.now());
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasCommittedRef = useRef<boolean>(false);
  const lastQuestionIdRef = useRef<string | null>(null);
  const animationTokenRef = useRef<number>(0);
  const isUnmountedRef = useRef<boolean>(false);

  const clearPendingTimers = useCallback(() => {
    animationTokenRef.current++; // Invalidate running async animation loop
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  // Initialize question state ONLY when question ID genuinely changes
  useEffect(() => {
    if (!currentQ) return;
    if (lastQuestionIdRef.current === currentQ.id) return; // Same question, never overwrite rotations or selection!

    lastQuestionIdRef.current = currentQ.id;
    clearPendingTimers();
    hasCommittedRef.current = false;
    setRotations(currentQ.initialRotations.map((row) => [...row]));
    setSelectedBlock({ br: 0, bc: 0 });
    setDirection("FORWARD");
    setHighlightedPath([]);
    setRocketState(null);
    setIsSubmitting(false);
    setFeedbackError(null);
    questionStartTime.current = Date.now();

    timer?.reset();
    timer?.start();
  }, [currentQ?.id, timer, clearPendingTimers]);

  // Clean up all timers on unmount
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
      clearPendingTimers();
    };
  }, [clearPendingTimers]);

  // Sync timer
  useEffect(() => {
    if (currentSession?.status === "PLAYING") {
      const interval = setInterval(() => {
        if (timer) {
          const sec = timer.getRemainingSeconds();
          setRemainingSeconds(sec);

          if (sec <= 0 && !hasCommittedRef.current && currentQ) {
            handleTimeout();
          }
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentSession?.status, timer, currentQ]);

  // Handle Timeout (Per-question guarded against race with Submit)
  const handleTimeout = useCallback(() => {
    if (hasCommittedRef.current || !currentQ) return;
    hasCommittedRef.current = true;
    setIsSubmitting(true);
    timer?.stop();
    clearPendingTimers();

    const responseTimeMs = Date.now() - questionStartTime.current;
    const freshState = useGameSessionStore.getState();

    if (freshState.currentSession?.status === "PLAYING") {
      recordAction(
        {
          rotations,
          direction,
          isTimeout: true,
          moves,
        },
        responseTimeMs
      );
    }

    advanceTimeoutRef.current = setTimeout(() => {
      const fresh = useGameSessionStore.getState();
      if (fresh.currentSession?.status === "PLAYING") {
        advanceQuestion();
      }
      setIsSubmitting(false);
    }, 400);
  }, [currentQ, timer, clearPendingTimers, recordAction, rotations, direction, moves, advanceQuestion]);

  // 1. Rotate Action (Rotates ONLY selected block 90° clockwise: 0 -> 90 -> 180 -> 270 -> 0)
  const handleRotate = () => {
    if (!selectedBlock || isSubmitting || hasCommittedRef.current || !currentQ) return;
    const { br, bc } = selectedBlock;

    setRotations((prev) => {
      const base =
        prev && prev.length === currentQ.blockGridSize
          ? prev
          : currentQ.initialRotations;
      const next = base.map((row) => [...row]);
      if (next[br] && typeof next[br][bc] === "number") {
        next[br][bc] = (next[br][bc] + 90) % 360;
      }
      return next;
    });
    setMoves((m) => m + 1);
    setFeedbackError(null);
  };

  // 2. Toggle Route Direction Action (FORWARD ↔ REVERSE)
  const handleToggleDirection = () => {
    if (isSubmitting || hasCommittedRef.current) return;
    setDirection((d) => (d === "FORWARD" ? "REVERSE" : "FORWARD"));
    setMoves((m) => m + 1);
    setFeedbackError(null);
  };

  // 3. Submit Action (Validates route, commits action immediately, animates rocket physically, then advances)
  const handleSubmit = async () => {
    if (!currentQ || isSubmitting || hasCommittedRef.current) return;

    const validation = validateRoute(currentQ, rotations, direction);

    if (validation.isValid) {
      // 1. Atomically lock interaction and mark as committed
      hasCommittedRef.current = true;
      setIsSubmitting(true);
      timer?.stop();
      clearPendingTimers();

      const responseTimeMs = Date.now() - questionStartTime.current;
      const freshState = useGameSessionStore.getState();

      // 2. Commit action immediately while session is guaranteed PLAYING
      if (freshState.currentSession?.status === "PLAYING") {
        recordAction(
          {
            rotations,
            direction,
            isTimeout: false,
            moves,
          },
          responseTimeMs
        );
      }

      // 3. Sequential physical rocket traversal along validation.visitedCells
      const visited = validation.visitedCells;
      const totalG = currentQ.totalGridSize;
      const token = ++animationTokenRef.current;
      const prefersReducedMotion =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Calculate initial heading angle from first step vector
      let currentAngle = 0;
      if (visited.length > 1) {
        const dr = visited[1].r - visited[0].r;
        const dc = visited[1].c - visited[0].c;
        currentAngle = Math.atan2(dr, dc) * (180 / Math.PI);
      }

      if (prefersReducedMotion || visited.length <= 1) {
        setHighlightedPath(visited);
        const lastCell = visited[visited.length - 1];
        setRocketState({
          x: ((lastCell.c + 0.5) / totalG) * 100,
          y: ((lastCell.r + 0.5) / totalG) * 100,
          angle: currentAngle,
        });
        await delay(300);
        if (animationTokenRef.current === token && !isUnmountedRef.current) {
          const fresh = useGameSessionStore.getState();
          if (fresh.currentSession?.status === "PLAYING") {
            advanceQuestion();
          }
          setIsSubmitting(false);
        }
        return;
      }

      // Step 0: Place rocket at origin
      setHighlightedPath([visited[0]]);
      setRocketState({
        x: ((visited[0].c + 0.5) / totalG) * 100,
        y: ((visited[0].r + 0.5) / totalG) * 100,
        angle: currentAngle,
      });
      await delay(100);

      // Sequential Async Traversal for each subsequent cell
      for (let k = 1; k < visited.length; k++) {
        if (animationTokenRef.current !== token || isUnmountedRef.current) return;

        const cell = visited[k];
        const prev = visited[k - 1];
        const dr = cell.r - prev.r;
        const dc = cell.c - prev.c;
        if (dr !== 0 || dc !== 0) {
          const targetHeading = Math.atan2(dr, dc) * (180 / Math.PI);
          // Shortest angular turn unwrapping (avoids 270° backward spins)
          const delta = ((targetHeading - currentAngle + 540) % 360) - 180;
          currentAngle += delta;
        }

        setHighlightedPath(visited.slice(0, k + 1));
        setRocketState({
          x: ((cell.c + 0.5) / totalG) * 100,
          y: ((cell.r + 0.5) / totalG) * 100,
          angle: currentAngle,
        });

        // Yield to browser and wait for CSS transition to paint
        await delay(100);
      }

      // Final pause at destination before advancing
      await delay(250);
      if (animationTokenRef.current === token && !isUnmountedRef.current) {
        const fresh = useGameSessionStore.getState();
        if (fresh.currentSession?.status === "PLAYING") {
          advanceQuestion();
        }
        setIsSubmitting(false);
      }
    } else {
      // Incorrect attempt: keep state, allow player to continue solving
      setFeedbackError("Path is incomplete or blocked. Adjust block rotations.");
      setIsSubmitting(false);
    }
  };

  if (currentSession?.status === "COMPLETED") {
    return <PathFinderResult />;
  }

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 font-medium">Loading Path Finder assessment...</p>
      </div>
    );
  }

  const totalQuestions = currentSession?.totalItems || 10;
  const currentItemNum = currentItemIndex + 1;
  const timeLimitSeconds = config?.timeLimitSeconds || 240;

  // Format timer MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-100/70">
      {/* 1. Accenture Top Header */}
      <header className="w-full bg-[#111111] text-white px-6 sm:px-10 h-14 flex items-center justify-between border-b border-neutral-800 shadow-sm shrink-0 select-none">
        <div className="flex items-center gap-1.5 font-bold tracking-tighter text-xl text-white">
          <span className="text-white font-black text-2xl tracking-tight">accenture</span>
          <span className="text-[#a100ff] text-2xl font-black leading-none">&gt;</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium hidden sm:inline-block">
            Assessment Simulator
          </span>
          <span className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-1 rounded font-semibold tracking-wide border border-neutral-700">
            Path Finder
          </span>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 w-full max-w-[640px] mx-auto px-4 py-6 flex flex-col justify-between items-center">
        {/* Top Board Card */}
        <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-6 flex flex-col items-center">
          {/* Board with direction and animated rocket layer */}
          <PathFinderBoard
            question={currentQ}
            rotations={rotations}
            selectedBlock={selectedBlock}
            onSelectBlock={(br, bc) => setSelectedBlock({ br, bc })}
            highlightedPath={highlightedPath}
            disabled={isSubmitting}
            direction={direction}
            rocketState={rocketState}
          />

          {feedbackError && (
            <p className="text-xs font-semibold text-rose-600 mt-2 text-center">{feedbackError}</p>
          )}

          {/* Bottom Area: Timer + Controls */}
          <div className="w-full flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
            {/* Circular Timer */}
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0 select-none">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-neutral-900 transition-all duration-1000 ease-linear"
                  strokeDasharray={`${((remainingSeconds / timeLimitSeconds) * 100).toFixed(2)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <span className="text-xs font-bold text-neutral-900 font-mono">
                {formatTime(remainingSeconds)}
              </span>
            </div>

            {/* Controls */}
            <PathFinderControls
              onRotate={handleRotate}
              onToggleDirection={handleToggleDirection}
              onSubmit={handleSubmit}
              disabled={isSubmitting}
              direction={direction}
            />
          </div>

          {/* Question / Section Dots indicator */}
          <div className="flex flex-col items-center gap-1.5 mt-4 select-none">
            <span className="text-xs text-neutral-500 font-medium">
              Section {currentItemNum} of {totalQuestions}
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <div
                  key={`dot-${idx}`}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    idx === currentItemNum - 1
                      ? "bg-neutral-800 scale-125"
                      : idx < currentItemNum - 1
                      ? "bg-neutral-400"
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
