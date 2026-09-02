"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useGameSessionStore } from "@/lib/store/game-session";
import {
  BubbleMathState,
  BubbleMathQuestion,
} from "@/lib/games/bubble-math/types";
import { generateGameResult } from "@/lib/games/core/scoring";
import { persistence } from "@/lib/games/core/persistence";
import { MathBubble } from "./MathBubble";
import { BubbleMathInstructions } from "./BubbleMathInstructions";
import { BubbleMathResult } from "./BubbleMathResult";
import { GameResult } from "@/lib/games/core/types";
import { AssessmentTimer } from "@/components/game/AssessmentTimer";

// ─────────────────────────────────────────────────────────────────────────────
// Top-level component
// ─────────────────────────────────────────────────────────────────────────────

export function BubbleMathGame() {
  const {
    currentSession,
    controller,
    remainingSeconds,
    startSession,
    recordAction,
    advanceQuestion,
    timer,
  } = useGameSessionStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<GameResult | null>(() => {
    if (typeof window !== "undefined" && currentSession?.variantId?.startsWith("practice-")) {
      return persistence.getLatestResult(currentSession.variantId);
    }
    return null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackState, setFeedbackState] = useState<
    "correct" | "incorrect" | null
  >(null);

  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTime = useRef<number>(0);

  // Restore saved result on variant change if idle
  useEffect(() => {
    if (currentSession?.variantId?.startsWith("practice-") && currentSession.status === "IDLE") {
      const savedResult = persistence.getLatestResult(currentSession.variantId);
      if (savedResult) {
        setResult(savedResult);
      }
    }
  }, [currentSession?.variantId, currentSession?.status]);

  // ───────────────────────────────────────────────────────────────────────────
  // Cleanup
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      timer?.stop();

      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, [timer]);

  // ───────────────────────────────────────────────────────────────────────────
  // Timeout handling
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (
      currentSession?.status === "PLAYING" &&
      remainingSeconds <= 0 &&
      !isSubmitting
    ) {
      if (selectedIds.length < 3) {
        setIsSubmitting(true);
        timer?.stop();

        const responseTimeMs =
          Date.now() - questionStartTime.current;

        recordAction(
          {
            selectedOrderIds: [...selectedIds],
            isTimeout: true,
          },
          responseTimeMs
        );

        const isLastQuestion = (currentSession?.currentItemIndex ?? 0) >= (currentSession?.totalItems || 10) - 1;

        submitTimeoutRef.current = setTimeout(() => {
          setSelectedIds([]);
          setIsSubmitting(false);

          if (!isLastQuestion) {
            advanceQuestion();
            questionStartTime.current = Date.now();
            timer?.reset();
            timer?.start();
          }
        }, 800);
      }
    }
  }, [
    remainingSeconds,
    currentSession?.status,
    currentSession?.currentItemIndex,
    currentSession?.totalItems,
    selectedIds,
    recordAction,
    advanceQuestion,
    timer,
    isSubmitting,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Generate result when session finishes
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (
      currentSession &&
      ["COMPLETED", "TIMEOUT", "FAILED", "ABORTED"].includes(
        currentSession.status
      )
    ) {
      if (!result && controller) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ctrlConfig = (controller as any)?.getConfig?.() || (controller as any)?.config;
        const scoringConfig = ctrlConfig?.scoringConfig || {
          mode: "TIMED_PRACTICE",
          weights: { accuracy: 1, speed: 1, completion: 1 },
        };

        const generatedResult = generateGameResult(
          currentSession,
          scoringConfig
        );

        persistence.saveResult(generatedResult);
        if (currentSession.variantId?.startsWith("practice-")) {
          persistence.saveLatestResult(currentSession.variantId, generatedResult);
        }
        setResult(generatedResult);
      }
    }
  }, [currentSession, controller, result]);

  // ───────────────────────────────────────────────────────────────────────────
  // Guards
  // ───────────────────────────────────────────────────────────────────────────

  if (!currentSession || !controller) {
    return <div>Initializing...</div>;
  }

  const isPracticeVariant = currentSession.variantId?.startsWith("practice-");
  const isFullChallenge = currentSession.variantId === "full-challenge";
  const isFullMockTest = currentSession.variantId === "full-mock-test";
  const isFullBubbleMockTest = currentSession.variantId === "full-bubble-mock-test";

  const state = currentSession.gameState as BubbleMathState;

  const currentQ: BubbleMathQuestion | undefined =
    state.questions[currentSession.currentItemIndex];

  // ───────────────────────────────────────────────────────────────────────────
  // Completed state (or restored practice result)
  // ───────────────────────────────────────────────────────────────────────────

  if (
    ["COMPLETED", "TIMEOUT", "FAILED", "ABORTED"].includes(
      currentSession.status
    ) || (isPracticeVariant && result)
  ) {
    if (result) {
      return (
        <BubbleMathResult
          result={result}
          onRestart={() => {
            if (currentSession.variantId?.startsWith("practice-")) {
              persistence.clearLatestResult(currentSession.variantId);
            }
            setResult(null);
            window.location.reload();
          }}
        />
      );
    }

    return <div>Generating results...</div>;
  }

  // ───────────────────────────────────────────────────────────────────────────

  if (currentSession.status === "IDLE" && !isFullMockTest && !isFullBubbleMockTest && !isFullChallenge) {
    return (
      <BubbleMathInstructions
        onStart={() => {
          if (currentSession.variantId?.startsWith("practice-")) {
            persistence.clearLatestResult(currentSession.variantId);
          }
          setResult(null);
          startSession();
          questionStartTime.current = Date.now();
        }}
      />
    );
  }

  if (!currentQ) {
    return <div>Loading question...</div>;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Bubble click handler
  // ───────────────────────────────────────────────────────────────────────────

  const handleBubbleClick = (id: string) => {
    if (isSubmitting) return;

    // Allow deselecting an already-selected bubble
    if (selectedIds.includes(id)) {
      setSelectedIds(
        selectedIds.filter((selectedId) => selectedId !== id)
      );
      return;
    }

    const newSelections = [...selectedIds, id];

    setSelectedIds(newSelections);

    // Submit after all 3 bubbles are selected
    if (newSelections.length === 3) {
      setIsSubmitting(true);
      timer?.stop();

      const responseTimeMs =
        Date.now() - questionStartTime.current;

      const isCorrect = recordAction(
        {
          selectedOrderIds: newSelections,
          isTimeout: false,
        },
        responseTimeMs
      );

      // Only show immediate feedback on Practice variants, not in Full Challenge or Full Mock Test
      const isChallengeOrMock = isFullChallenge || isFullMockTest || isFullBubbleMockTest;
      if (!isChallengeOrMock) {
        setFeedbackState(
          isCorrect ? "correct" : "incorrect"
        );
      }

      const isLastQuestion = (currentSession?.currentItemIndex ?? 0) >= (currentSession?.totalItems || 10) - 1;

      submitTimeoutRef.current = setTimeout(() => {
        setSelectedIds([]);
        setIsSubmitting(false);
        setFeedbackState(null);

        if (!isLastQuestion) {
          advanceQuestion();
          questionStartTime.current = Date.now();
          timer?.reset();
          timer?.start();
        }
      }, isChallengeOrMock ? 450 : 1000);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Variant selection
  // ───────────────────────────────────────────────────────────────────────────

  // Shared Practice UI for all practice-* variants
  if (isPracticeVariant) {
    return (
      <PracticeUI
        currentSession={currentSession}
        controller={controller}
        currentQ={currentQ}
        selectedIds={selectedIds}
        isSubmitting={isSubmitting}
        feedbackState={feedbackState}
        remainingSeconds={remainingSeconds}
        onBubbleClick={handleBubbleClick}
      />
    );
  }

  // Dedicated Full Challenge UI (PROTECTED & FINALIZED)
  if (isFullChallenge) {
    return (
      <FullChallengeUI
        currentSession={currentSession}
        controller={controller}
        currentQ={currentQ}
        selectedIds={selectedIds}
        isSubmitting={isSubmitting}
        feedbackState={feedbackState}
        remainingSeconds={remainingSeconds}
        onBubbleClick={handleBubbleClick}
      />
    );
  }

  // Dedicated Full Mock Test UI (EXPERIMENTAL & SAFE TO MODIFY)
  if (isFullMockTest) {
    return (
      <FullMockTestUI
        currentSession={currentSession}
        controller={controller}
        currentQ={currentQ}
        selectedIds={selectedIds}
        isSubmitting={isSubmitting}
        feedbackState={feedbackState}
        remainingSeconds={remainingSeconds}
        onBubbleClick={handleBubbleClick}
        onStartSession={() => {
          startSession();
          questionStartTime.current = Date.now();
        }}
        timer={timer}
      />
    );
  }

  // Dedicated Full Bubble Mock Test UI
  if (isFullBubbleMockTest) {
    return (
      <FullBubbleMockTestUI
        currentSession={currentSession}
        controller={controller}
        currentQ={currentQ}
        selectedIds={selectedIds}
        isSubmitting={isSubmitting}
        feedbackState={feedbackState}
        remainingSeconds={remainingSeconds}
        onBubbleClick={handleBubbleClick}
        onStartSession={() => {
          if (currentSession.status === "IDLE") {
            startSession();
          }
          questionStartTime.current = Date.now();
          timer?.reset();
          timer?.start();
        }}
        timer={timer}
      />
    );
  }

  // Other variants
  return (
    <GenericGridUI
      currentSession={currentSession}
      currentQ={currentQ}
      selectedIds={selectedIds}
      isSubmitting={isSubmitting}
      remainingSeconds={remainingSeconds}
      onBubbleClick={handleBubbleClick}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────────────────────

interface BubbleUIProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentSession: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controller: any;

  currentQ: BubbleMathQuestion;

  selectedIds: string[];

  isSubmitting: boolean;

  feedbackState: "correct" | "incorrect" | null;

  remainingSeconds: number;

  onBubbleClick: (id: string) => void;

  onStartSession?: () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timer?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// Practice Test 1
// Existing reference-matched UI
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Shared Practice UI
// Used by all practice-* variants
// ─────────────────────────────────────────────────────────────────────────────

function PracticeUI({
  currentSession,
  controller,
  currentQ,
  selectedIds,
  isSubmitting,
  feedbackState,
  remainingSeconds,
  onBubbleClick,
}: BubbleUIProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeLimitSeconds =
    (controller as any)?.config?.timeLimitSeconds || 15;

  const patternA = [
    "top-[4%] left-[60%] -translate-x-1/2",
    "top-[30%] left-[25%]",
    "top-[58%] right-[28%]",
  ];

const patternB = [
  "top-[4%] left-[30%]",
  "top-[32%] left-[60%] -translate-x-1/2",
  "top-[60%] left-[30%]",
];

  const positions =
    currentQ.layoutPattern === "B"
      ? patternB
      : patternA;

  const variantId: string = currentSession.variantId || "";
  const testNumber = variantId.startsWith("practice-")
    ? variantId.replace(/^practice-/, "")
    : "1";

  return (
    <div className="flex w-full justify-center items-start py-6 px-4 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-[720px] bg-white border border-slate-300 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="h-14 bg-black text-white px-5 sm:px-6 flex items-center justify-between select-none shrink-0">
          <span className="font-semibold text-base sm:text-lg tracking-tight">
            Bubble Math Practice Test {testNumber}
          </span>

          <span className="font-bold text-base sm:text-lg font-mono">
            {currentSession.currentItemIndex + 1}/
            {currentSession.totalItems}
          </span>
        </div>

        {/* Game panel */}
        <div className="m-5 sm:m-7 border border-slate-200 rounded-sm flex flex-col">

          {/* Bubble area */}
          <div className="relative w-full h-[360px] sm:h-[400px]">

            {currentQ.displayOrderIds.map((id, index) => {
              const expr =
                currentQ.expressions.find(
                  (e) => e.id === id
                )!;

              const isSelected =
                selectedIds.includes(id);

              const selectionIndex =
                selectedIds.indexOf(id);

              const bubbleFeedback =
                isSelected && feedbackState
                  ? feedbackState
                  : undefined;

              return (
                <div
                  key={id}
                  className={`absolute ${positions[index]}`}
                >
                  <MathBubble
                    expression={expr.display}
                    selected={isSelected}
                    selectionOrder={
                      isSelected
                        ? selectionIndex + 1
                        : undefined
                    }
                    feedbackType={bubbleFeedback}
                    onClick={() => onBubbleClick(id)}
                    disabled={isSubmitting}
                    aria-label={`Bubble ${expr.display}`}
                  />
                </div>
              );
            })}

            {feedbackState && (
              <div
                className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none z-10"
                role="status"
                aria-live="polite"
              >
                <div
                  className={[
                    "px-6 py-2 rounded-full text-xl sm:text-2xl",
                    "font-bold tracking-wide",
                    "animate-in fade-in zoom-in-95 duration-200",
                    feedbackState === "correct"
                      ? "text-green-600"
                      : "text-red-600",
                  ].join(" ")}
                >
                  {feedbackState === "correct"
                    ? "✓ Correct!"
                    : "✗ Wrong!"}
                </div>
              </div>
            )}
          </div>

          {/* Bottom area */}
          <div className="flex items-center gap-4 sm:gap-5 px-5 sm:px-7 py-5 border-t border-slate-100">

            {/* Timer */}
            <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0">

              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 36 36"
                aria-hidden="true"
              >
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />

                <path
                  className="text-black transition-all duration-1000 ease-linear"
                  strokeDasharray={`${(
                    (remainingSeconds /
                      timeLimitSeconds) *
                    100
                  ).toFixed(2)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
              </svg>

              <span className="text-base sm:text-lg font-bold text-black font-mono">
                {remainingSeconds}
              </span>
            </div>

            {/* Instruction */}
            <p className="text-sm sm:text-[15px] text-slate-800 leading-snug">
              Some bubbles are displayed. Select the bubbles in order from the{" "}
              <strong className="font-bold text-black">
                LOWEST
              </strong>{" "}
              to the{" "}
              <strong className="font-bold text-black">
                HIGHEST
              </strong>{" "}
              value
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Full Challenge UI
// Dedicated reference-matched Full Challenge experience
// Features:
// - Accenture-branded dark top bar with logo wordmark
// - Dark horizontal challenge bar with question progression (Question X of 28)
// - Constrained, centered light play area (max-w-[540px])
// - White bubbles with dark text before selection
// - Dark/black oval bubbles with white text upon selection (no 1/2/3 indicators)
// - No immediate Correct/Wrong feedback exposed
// - Smooth upward exit animation upon 3rd selection
// - Staged entrance animation for next question
// - 4 distinct non-overlapping spatial layouts (Pattern A, B, C, D)
// - Integrated timer and instruction area
// ─────────────────────────────────────────────────────────────────────────────

function FullChallengeUI({
  currentSession,
  controller,
  currentQ,
  selectedIds,
  isSubmitting,
  remainingSeconds,
  onBubbleClick,
}: BubbleUIProps) {
  const timeLimitSeconds = controller?.config?.timeLimitSeconds || 15;

  const [revealedCount, setRevealedCount] = useState(0);

  // Staged sequential reveal per question
  useEffect(() => {
    const timer0 = setTimeout(() => setRevealedCount(0), 0);
    const timer1 = setTimeout(() => setRevealedCount(1), 60);
    const timer2 = setTimeout(() => setRevealedCount(2), 180);
    const timer3 = setTimeout(() => setRevealedCount(3), 300);

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentSession.currentItemIndex]);

  // Constrained layout patterns designed specifically for the max-w-[540px] play area
  const patternA = [
    "top-[4%] left-[60%] -translate-x-1/2",
    "top-[30%] left-[25%]",
    "top-[58%] right-[28%]",
  ];

  const patternB = [
    "top-[5%] left-[28%]",
    "top-[32%] left-[65%] -translate-x-1/2",
    "top-[58%] left-[28%]",
  ];

  const patternC = [
    "top-[7%] right-[16%]",
    "top-[34%] left-[14%]",
    "top-[60%] left-[46%] -translate-x-1/2",
  ];

  const patternD = [
    "top-[7%] left-[14%]",
    "top-[34%] right-[14%]",
    "top-[60%] left-[54%] -translate-x-1/2",
  ];

  let positions = patternA;
  if (currentQ.layoutPattern === "B") positions = patternB;
  else if (currentQ.layoutPattern === "C") positions = patternC;
  else if (currentQ.layoutPattern === "D") positions = patternD;

  const totalQuestions = currentSession.totalItems || 28;
  const currentItemNum = currentSession.currentItemIndex + 1;

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-100/70">

      {/* 1. Accenture-Branded Dark Top Area */}
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
            Full Challenge
          </span>
        </div>
      </header>

      {/* Main Challenge Stage Area - Constrained and Centered */}
      <main className="flex-1 w-full max-w-[800px] mx-auto px-4 py-6 flex flex-col justify-start items-center">

        {/* 2. Dark Horizontal Challenge Bar */}
        <div className="w-full bg-neutral-900 text-white px-5 py-3 rounded-t-lg flex items-center justify-between shadow-md select-none border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base text-neutral-100 tracking-wide">
              Question {currentItemNum} of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono tracking-wider">
              {Math.round((currentItemNum / totalQuestions) * 100)}% COMPLETED
            </span>
          </div>
        </div>

        {/* 3. Constrained Light Play Area */}
        <div className="w-full bg-slate-100 border-x border-b border-slate-200 rounded-b-lg shadow-sm flex flex-col min-h-[480px] p-5 justify-between relative overflow-hidden">

          {/* Bubble Play Area Canvas with Upward Exit Animation */}
          <div className="relative w-full h-[460px] sm:h-[500px] my-1 select-none overflow-hidden">

            {currentQ.displayOrderIds.map((id, index) => {
              const expr = currentQ.expressions.find((e) => e.id === id)!;
              const isSelected = selectedIds.includes(id);
              const isRevealed = index < revealedCount;

              let animationClass = "translate-y-6 opacity-0 pointer-events-none";
              if (isSubmitting) {
                animationClass = "-translate-y-24 opacity-0 transition-all duration-400 ease-in pointer-events-none";
              } else if (isRevealed) {
                animationClass = "translate-y-0 opacity-100 transition-all duration-300 ease-out";
              }

              const bubbleStyleClass = isSelected
                ? "w-32 h-36 sm:w-40 sm:h-40 rounded-full bg-neutral-900 border-2 border-neutral-900 text-white shadow-md transition-all duration-300 ease-out"
                : "w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white border-2 border-slate-300 text-neutral-900 shadow-sm transition-all duration-300 ease-out";

              return (
                <div
                  key={id}
                  className={`absolute ${positions[index]} ${animationClass}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isRevealed && revealedCount === 3 && !isSubmitting) {
                        onBubbleClick(id);
                      }
                    }}
                    disabled={isSubmitting || revealedCount < 3}
                    aria-label={`Bubble ${expr.display}`}
                    className={`relative flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none ${bubbleStyleClass}`}
                  >
                    <span>{expr.display}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* 4. Bottom Timer & Instruction Bar */}
          <div className="flex items-center justify-center gap-3 pt-4 pb-1 px-2 border-t border-slate-100">

            {/* Timer */}
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 36 36"
                aria-hidden="true"
              >
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />

                <path
                  className="text-neutral-900 transition-all duration-1000 ease-linear"
                  strokeDasharray={`${(
                    (remainingSeconds / timeLimitSeconds) *
                    100
                  ).toFixed(2)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>

              <span className="text-lg font-bold text-neutral-900 font-mono">
                {remainingSeconds}
              </span>
            </div>

            {/* Instruction */}
            <p className="text-lg sm:text-sm text-slate-700 leading-snug text-center">
              <span className="block">
                Some bubbles are displayed. Select the bubbles in order from the
              </span>
              <span className="block">
                <strong className="font-bold text-neutral-900">
                  LOWEST
                </strong>{" "}
                value to{" "}
                <strong className="font-bold text-neutral-900">
                  HIGHEST
                </strong>{" "}
                value
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Full Bubble Mock Test UI
// ─────────────────────────────────────────────────────────────────────────────

const FIXED_PRACTICE_QUESTIONS: BubbleMathQuestion[] = [
  {
    expressions: [
      { id: "pq1-1", display: "15 - 6", value: 9 },
      { id: "pq1-2", display: "4 + 3", value: 7 },
      { id: "pq1-3", display: "8", value: 8 },
    ],
    correctOrderIds: ["pq1-2", "pq1-3", "pq1-1"],
    displayOrderIds: ["pq1-1", "pq1-2", "pq1-3"],
    layoutPattern: "A",
  },
  {
    expressions: [
      { id: "pq2-1", display: "11 - 4", value: 7 },
      { id: "pq2-2", display: "2 x 4", value: 8 },
      { id: "pq2-3", display: "6", value: 6 },
    ],
    correctOrderIds: ["pq2-3", "pq2-1", "pq2-2"],
    displayOrderIds: ["pq2-1", "pq2-2", "pq2-3"],
    layoutPattern: "B",
  },
];

function FullBubbleMockTestUI({
  currentSession,
  controller,
  currentQ,
  selectedIds,
  isSubmitting,
  remainingSeconds,
  onBubbleClick,
  onStartSession,
  timer,
}: BubbleUIProps) {
  const timeLimitSeconds = controller?.config?.timeLimitSeconds || 15;

  const [phase, setPhase] = useState<"intro" | "practice" | "practice-completed" | "playing">("intro");
  const [tutorialStep, setTutorialStep] = useState(1);
  const [demoSelected, setDemoSelected] = useState(false);

  // Practice state
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceSelectedIds, setPracticeSelectedIds] = useState<string[]>([]);
  const [practiceIsSubmitting, setPracticeIsSubmitting] = useState(false);
  const [practiceRemainingSeconds, setPracticeRemainingSeconds] = useState(timeLimitSeconds);

  const [revealedCount, setRevealedCount] = useState(0);
  const isAdvancingRef = useRef(false);
  const practiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if ((phase === "intro" || phase === "practice-completed") && timer) {
      timer.stop();
    }
  }, [phase, timer]);

  // Clean up any pending timeouts on unmount or phase change
  useEffect(() => {
    return () => {
      if (practiceTimeoutRef.current) {
        clearTimeout(practiceTimeoutRef.current);
      }
    };
  }, [phase]);

  // Staged sequential reveal per question
  useEffect(() => {
    const timer0 = setTimeout(() => setRevealedCount(0), 0);
    const timer1 = setTimeout(() => setRevealedCount(1), 60);
    const timer2 = setTimeout(() => setRevealedCount(2), 180);
    const timer3 = setTimeout(() => setRevealedCount(3), 300);

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentSession.currentItemIndex, phase, practiceIndex]);

  // Demo selection toggle for instruction 3
  useEffect(() => {
    if (phase === "intro" && tutorialStep === 3) {
      const interval = setInterval(() => setDemoSelected((prev) => !prev), 1000);
      return () => clearInterval(interval);
    }
  }, [phase, tutorialStep]);

  // Practice question advance handler
  const advancePractice = useCallback(() => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    setPracticeIsSubmitting(true);

    practiceTimeoutRef.current = setTimeout(() => {
      setPracticeIndex((currentIdx) => {
        if (currentIdx === 0) {
          setPracticeSelectedIds([]);
          setPracticeRemainingSeconds(timeLimitSeconds);
          setPracticeIsSubmitting(false);
          isAdvancingRef.current = false;
          return 1;
        } else {
          // After Question 2 of 2 is complete, transition to practice-completed state
          setPracticeSelectedIds([]);
          setPracticeIsSubmitting(false);
          isAdvancingRef.current = false;
          setPhase("practice-completed");
          return 0;
        }
      });
    }, 450);
  }, [timeLimitSeconds]);

  // Practice countdown timer
  useEffect(() => {
    if (phase !== "practice" || practiceIsSubmitting) return;

    const interval = setInterval(() => {
      setPracticeRemainingSeconds((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          advancePractice();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, practiceIndex, practiceIsSubmitting, advancePractice]);

  // Practice bubble click handler
  const handlePracticeBubbleClick = (id: string) => {
    if (practiceIsSubmitting || isAdvancingRef.current) return;

    if (practiceSelectedIds.includes(id)) {
      setPracticeSelectedIds((prev) => prev.filter((sId) => sId !== id));
      return;
    }

    const newSelections = [...practiceSelectedIds, id];
    setPracticeSelectedIds(newSelections);

    if (newSelections.length === 3) {
      advancePractice();
    }
  };

  const activeQ = phase === "practice"
    ? (FIXED_PRACTICE_QUESTIONS[practiceIndex] || FIXED_PRACTICE_QUESTIONS[0])
    : currentQ;

  const activeSelectedIds = phase === "practice" ? practiceSelectedIds : selectedIds;
  const activeIsSubmitting = phase === "practice" ? practiceIsSubmitting : isSubmitting;
  const activeRemainingSeconds = phase === "intro"
    ? timeLimitSeconds
    : phase === "practice"
    ? practiceRemainingSeconds
    : remainingSeconds;

  // Constrained layout patterns designed specifically for the max-w-[540px] play area
  const patternA = [
    "top-[4%] left-[60%] -translate-x-1/2",
    "top-[30%] left-[25%]",
    "top-[58%] right-[28%]",
  ];

  const patternB = [
    "top-[5%] left-[28%]",
    "top-[32%] left-[65%] -translate-x-1/2",
    "top-[58%] left-[28%]",
  ];

  const patternC = [
    "top-[7%] right-[16%]",
    "top-[34%] left-[14%]",
    "top-[60%] left-[46%] -translate-x-1/2",
  ];

  const patternD = [
    "top-[7%] left-[14%]",
    "top-[34%] right-[14%]",
    "top-[60%] left-[54%] -translate-x-1/2",
  ];

  let positions = patternA;
  if (activeQ.layoutPattern === "B") positions = patternB;
  else if (activeQ.layoutPattern === "C") positions = patternC;
  else if (activeQ.layoutPattern === "D") positions = patternD;

  if (phase === "intro") {
    positions = [
      "top-[19%] sm:top-[21%] left-[50%] -translate-x-1/2",
      "top-[55%] sm:top-[55%] left-[25%] -translate-x-1/2",
      "top-[55%] sm:top-[55%] left-[75%] -translate-x-1/2",
      "top-[75%] left-[50%] -translate-x-1/2",
    ];
  }

  const totalQuestions = currentSession.totalItems || 28;
  const currentItemNum = currentSession.currentItemIndex + 1;

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-100/70">

      {/* 1. Accenture-Branded Dark Top Area */}
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
            Full Bubble Mock Test
          </span>
        </div>
      </header>

      {/* Main Challenge Stage Area - Constrained and Centered */}
      <main className="flex-1 w-full max-w-[800px] mx-auto px-4 py-6 flex flex-col justify-start items-center">

        {/* 2. Dark Horizontal Challenge Bar */}
        <div className="w-full bg-neutral-900 text-white px-5 py-3 rounded-t-lg flex items-center justify-between shadow-md select-none border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base text-neutral-100 tracking-wide">
              {phase === "practice"
                ? `Question ${practiceIndex + 1} of 2`
                : phase === "playing"
                ? `Question ${currentItemNum} of ${totalQuestions}`
                : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono tracking-wider">
              {phase === "practice"
                ? `${Math.round(((practiceIndex + 1) / 2) * 100)}% COMPLETED`
                : phase === "playing"
                ? `${Math.round((currentItemNum / totalQuestions) * 100)}% COMPLETED`
                : ""}
            </span>
          </div>
        </div>

        {/* 3. Constrained Light Play Area */}
        <div className="w-full bg-slate-100 border-x border-b border-slate-200 rounded-b-lg shadow-sm flex flex-col min-h-[480px] p-5 justify-between relative overflow-hidden">

          {/* Practice Completed Screen */}
          {phase === "practice-completed" ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[460px] sm:min-h-[500px] text-center px-4">
              <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-slate-200 max-w-md w-full flex flex-col items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                    Practice Questions Completed
                  </h2>
                  <p className="text-sm text-slate-500">
                    You have finished the practice questions and are now ready for the assessment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPhase("playing");
                    if (onStartSession) {
                      onStartSession();
                    }
                  }}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-3 px-6 rounded-lg transition-transform active:scale-95 text-sm tracking-wider uppercase shadow-sm"
                >
                  START ASSESSMENT
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Instruction Panel Overlay */}
              {phase === "intro" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full bg-white border-b border-slate-200 shadow-md z-[60] pb-6">
                  <div className="flex items-center justify-between p-4 min-h-[100px] sm:min-h-[120px]">
                    {/* Left Arrow */}
                    <button 
                      onClick={() => setTutorialStep((prev: number) => (prev > 1 ? prev - 1 : 1))}
                      disabled={tutorialStep === 1}
                      className={"w-12 h-12 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors " + (tutorialStep === 1 ? "invisible" : "visible")}
                      aria-label="Previous Instruction"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>

                    {/* Text Content */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-4 text-slate-800 text-[15px] sm:text-[16px] font-medium leading-relaxed">
                      {tutorialStep === 1 && (
                        <p>Some bubbles are displayed. Select the bubbles in order from the <strong className="font-bold text-black">LOWEST</strong> to the <strong className="font-bold text-black">HIGHEST</strong> value.</p>
                      )}
                      {tutorialStep === 2 && (
                        <p>Select a bubble by clicking on it. Your selected bubbles will be highlighted.</p>
                      )}
                      {tutorialStep === 3 && (
                        <p>You can deselect a bubble by clicking on it again. However, you will automatically advance to the next question after the third bubble is selected.</p>
                      )}
                      {tutorialStep === 4 && (
                        <p>Each set of bubbles has a time limit, indicated by the timer at the bottom of the screen.</p>
                      )}
                      {tutorialStep === 5 && (
                        <div className="flex flex-col items-center gap-4">
                          <p>
                            The practice exercise will have 2 questions in total.<br/><br/>
                            So you should take this opportunity to practice how to navigate.
                          </p>
                          <button 
                            type="button"
                            onClick={() => {
                              setPhase("practice");
                              setPracticeIndex(0);
                              setPracticeSelectedIds([]);
                              setPracticeRemainingSeconds(timeLimitSeconds);
                              setPracticeIsSubmitting(false);
                              isAdvancingRef.current = false;
                            }} 
                            className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm tracking-wide"
                          >
                            PRACTICE
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right Arrow */}
                    <button 
                      onClick={() => setTutorialStep((prev: number) => (prev < 5 ? prev + 1 : 5))}
                      disabled={tutorialStep === 5}
                      className={"w-12 h-12 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors " + (tutorialStep === 5 ? "invisible" : "visible")}
                      aria-label="Next Instruction"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Progress Dots */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div 
                        key={step} 
                        className={"rounded-full transition-colors " + (tutorialStep === step ? "w-1.5 h-1.5 bg-black" : "w-1.5 h-1.5 bg-transparent border border-slate-400")} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 dim overlay */}
              {phase === "intro" && tutorialStep === 4 && <div className="absolute inset-0 bg-black/40 z-[50] pointer-events-none rounded-b-lg" />}

              {/* Bubble Play Area Canvas with Upward Exit Animation */}
              <div className="relative w-full h-[460px] sm:h-[500px] my-1 select-none overflow-hidden">
                {activeQ.displayOrderIds.map((id, index) => {
                  const expr = activeQ.expressions.find((e) => e.id === id)!;
                  const isSelected = activeSelectedIds.includes(id) || (phase === "intro" && tutorialStep === 2 && index === 0) || (phase === "intro" && tutorialStep === 3 && index === 0 && demoSelected);
                  const isRevealed = index < revealedCount;

                  let animationClass = "translate-y-6 opacity-0 pointer-events-none";
                  if (activeIsSubmitting) {
                    animationClass = "-translate-y-24 opacity-0 transition-all duration-400 ease-in pointer-events-none";
                  } else if (isRevealed || phase === "intro") {
                    animationClass = "translate-y-0 opacity-100 transition-all duration-300 ease-out";
                  }

                  const bubbleStyleClass = isSelected
                    ? "w-32 h-36 sm:w-40 sm:h-40 rounded-full bg-neutral-900 border-2 border-neutral-900 text-white shadow-md transition-all duration-300 ease-out"
                    : "w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white border-2 border-slate-300 text-neutral-900 shadow-sm transition-all duration-300 ease-out";

                  return (
                    <div
                      key={id}
                      className={`absolute ${positions[index]} ${animationClass}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (phase === "practice" && isRevealed && revealedCount === 3 && !activeIsSubmitting) {
                            handlePracticeBubbleClick(id);
                          } else if (phase === "playing" && isRevealed && revealedCount === 3 && !activeIsSubmitting) {
                            onBubbleClick(id);
                          }
                        }}
                        disabled={activeIsSubmitting || revealedCount < 3 || phase === "intro"}
                        aria-label={`Bubble ${expr.display}`}
                        className={`relative flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none ${bubbleStyleClass}`}
                      >
                        <span>{expr.display}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* 4. Bottom Timer & Instruction Bar */}
              <div className="flex items-center justify-center gap-3 pt-4 pb-1 px-2 border-t border-slate-100">

                {/* Timer */}
                <div className={`relative flex items-center justify-center w-14 h-14 shrink-0 ${phase === "intro" && tutorialStep === 4 ? "z-[60] bg-white rounded-full ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" : ""}`}>
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 36 36"
                    aria-hidden="true"
                  >
                    <path
                      className="text-slate-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />

                    <path
                      className="text-neutral-900 transition-all duration-1000 ease-linear"
                      strokeDasharray={`${(
                        (activeRemainingSeconds / timeLimitSeconds) *
                        100
                      ).toFixed(2)}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>

                  <span className="text-lg font-bold text-neutral-900 font-mono">
                    {activeRemainingSeconds}
                  </span>
                </div>

                {/* Instruction */}
                <p className="text-lg sm:text-sm text-slate-700 leading-snug text-center">
                  <span className="block">
                    Select the bubbles in order from the
                  </span>
                  <span className="block">
                    <strong className="font-bold text-neutral-900">
                      LOWEST
                    </strong>{" "}
                    value to{" "}
                    <strong className="font-bold text-neutral-900">
                      HIGHEST
                    </strong>{" "}
                    value
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}


function FullMockTestUI({
  currentSession,
  controller,
  currentQ,
  selectedIds,
  isSubmitting,
  remainingSeconds,
  onBubbleClick,
  onStartSession,
  timer,
}: BubbleUIProps) {
  const timeLimitSeconds = controller?.config?.timeLimitSeconds || 15;

  const [revealedCount, setRevealedCount] = useState(0);
  const [tutorialStep, setTutorialStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | "playing">(1);
  const [hasSeenStep6, setHasSeenStep6] = useState(false);

  // Trigger Step 6 after first two questions are completed
  useEffect(() => {
    if (currentSession.currentItemIndex === 2 && !hasSeenStep6 && tutorialStep === "playing") {
      setTutorialStep(6);
      timer?.stop();
    }
  }, [currentSession.currentItemIndex, hasSeenStep6, tutorialStep, timer]);

  // Staged sequential reveal per question
  useEffect(() => {
    const timer0 = setTimeout(() => setRevealedCount(0), 0);
    const timer1 = setTimeout(() => setRevealedCount(1), 60);
    const timer2 = setTimeout(() => setRevealedCount(2), 180);
    const timer3 = setTimeout(() => setRevealedCount(3), 300);

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentSession.currentItemIndex]);

  // Constrained layout patterns designed specifically for the max-w-[540px] play area
  const patternA = [
    "top-[4%] left-[60%] -translate-x-1/2",
    "top-[30%] left-[25%]",
    "top-[58%] right-[28%]",
  ];

  const patternB = [
    "top-[5%] left-[28%]",
    "top-[32%] left-[65%] -translate-x-1/2",
    "top-[58%] left-[28%]",
  ];

  const patternC = [
    "top-[7%] right-[16%]",
    "top-[34%] left-[14%]",
    "top-[60%] left-[46%] -translate-x-1/2",
  ];

  const patternD = [
    "top-[7%] left-[14%]",
    "top-[34%] right-[14%]",
    "top-[60%] left-[54%] -translate-x-1/2",
  ];

  let positions = patternA;
  if (currentQ.layoutPattern === "B") positions = patternB;
  else if (currentQ.layoutPattern === "C") positions = patternC;
  else if (currentQ.layoutPattern === "D") positions = patternD;

  const totalQuestions = currentSession.totalItems || 28;
  const currentItemNum = currentSession.currentItemIndex + 1;

  const panelPosition = tutorialStep === 4 ? "top-[15%]" : "bottom-[5%]";

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-100/70 relative">
      {/* Tutorial Overlay */}
      {tutorialStep !== "playing" && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex flex-col items-center pointer-events-auto">
          {/* Instruction Card */}
          <div className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[540px] bg-white rounded-md shadow-xl z-[110] overflow-hidden">
            <div className="relative flex items-center justify-between p-4 sm:p-6 min-h-[140px] sm:min-h-[160px]">
              
              {/* Left Arrow */}
              {tutorialStep !== 6 && (
                <button 
                  onClick={() => setTutorialStep((prev) => (typeof prev === "number" && prev > 1 ? (prev - 1) as any : 1))}
                  disabled={tutorialStep === 1}
                  className={`w-10 h-10 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors ${tutorialStep === 1 ? "invisible" : "visible"}`}
                  aria-label="Previous Instruction"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
              )}

              {/* Text Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-4 text-slate-800 text-[15px] sm:text-base font-medium leading-relaxed">
                {tutorialStep === 1 && (
                  <p>Some bubbles are displayed. Select the bubbles in order from the <strong className="font-bold text-black">LOWEST</strong> to the <strong className="font-bold text-black">HIGHEST</strong> value.</p>
                )}
                {tutorialStep === 2 && (
                  <p>Select a bubble by clicking on it. Your selected bubbles will be highlighted.</p>
                )}
                {tutorialStep === 3 && (
                  <p>You can deselect a bubble by clicking on it again. However, you will automatically advance to the next question after the third bubble is selected.</p>
                )}
                {tutorialStep === 4 && (
                  <p>Each set of bubbles has a time limit, indicated by the timer at the bottom of the screen.</p>
                )}
                {tutorialStep === 5 && (
                  <div className="flex flex-col items-center gap-4">
                    <p>
                      The practice exercise will have 4 questions in total.<br/><br/>
                      The first two questions will be ones you can replay, so you should take this opportunity to practice how to navigate.
                    </p>
                    <button onClick={() => {
                      if (currentSession.status === "IDLE" && onStartSession) {
                        onStartSession();
                      }
                      if (currentSession.currentItemIndex >= 2) {
                        setTutorialStep(6);
                      } else {
                        setTutorialStep("playing");
                        if (currentSession.status !== "IDLE") {
                          timer?.start();
                        }
                      }
                    }} className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm">
                      PRACTICE
                    </button>
                  </div>
                )}
                {tutorialStep === 6 && (
                  <div className="flex flex-col items-center gap-5 w-full">
                    <p>
                      You completed the first two practice items.<br/><br/>
                      To repeat the instructions, select REPLAY.<br/>
                      To continue to the next two practice items, select START.
                    </p>
                    <div className="flex justify-center gap-3 w-full sm:w-[80%] mx-auto">
                      <button onClick={() => setTutorialStep(1)} className="flex-1 bg-white border border-slate-300 text-black py-2.5 px-4 rounded font-semibold transition-transform active:scale-95 hover:bg-slate-50 text-sm">
                        REPLAY
                      </button>
                      <button onClick={() => {
                        setTutorialStep("playing");
                        setHasSeenStep6(true);
                        timer?.start();
                      }} className="flex-1 bg-black text-white py-2.5 px-4 rounded font-semibold transition-transform active:scale-95 hover:bg-neutral-800 text-sm">
                        START
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Arrow */}
              {tutorialStep !== 6 && (
                <button 
                  onClick={() => setTutorialStep((prev) => (typeof prev === "number" && prev < 5 ? (prev + 1) as any : 5))}
                  disabled={tutorialStep === 5}
                  className={`w-10 h-10 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors ${tutorialStep === 5 ? "invisible" : "visible"}`}
                  aria-label="Next Instruction"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Progress Dots */}
            {tutorialStep >= 1 && tutorialStep <= 5 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div 
                    key={step} 
                    className={`rounded-full transition-colors ${tutorialStep === step ? 'w-1.5 h-1.5 bg-black' : 'w-1.5 h-1.5 bg-transparent border border-slate-400'}`} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. Accenture-Branded Dark Top Area */}
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
            Full Mock Test
          </span>
        </div>
      </header>

      {/* Main Challenge Stage Area - Constrained and Centered */}
      <main className="flex-1 w-full max-w-[800px] mx-auto px-4 py-6 flex flex-col justify-start items-center">

        {/* 2. Dark Horizontal Challenge Bar */}
        <div className="w-full bg-neutral-900 text-white px-5 py-3 rounded-t-lg flex items-center justify-between shadow-md select-none border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base text-neutral-100 tracking-wide">
              Question {currentItemNum} of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono tracking-wider">
              {Math.round((currentItemNum / totalQuestions) * 100)}% COMPLETED
            </span>
          </div>
        </div>

        {/* 3. Constrained Light Play Area */}
        <div className="w-full bg-slate-100 border-x border-b border-slate-200 rounded-b-lg shadow-sm flex flex-col min-h-[480px] p-5 justify-between relative overflow-hidden">

          {/* Bubble Play Area Canvas with Upward Exit Animation */}
          <div className={`relative w-full h-[460px] sm:h-[500px] my-1 select-none overflow-hidden ${
            (tutorialStep === 1 || tutorialStep === 2 || tutorialStep === 3) ? "z-[105] bg-slate-100 rounded-lg shadow-lg" : ""
          }`}>

            {currentQ.displayOrderIds.map((id, index) => {
              const expr = currentQ.expressions.find((e) => e.id === id)!;
              const isSelected = selectedIds.includes(id) 
                || (tutorialStep === 2 && index === 0)
                || (tutorialStep === 3 && (index === 0 || index === 1));
              
              const isRevealed = index < revealedCount;

              let animationClass = "translate-y-6 opacity-0 pointer-events-none";
              if (isSubmitting) {
                animationClass = "-translate-y-24 opacity-0 transition-all duration-400 ease-in pointer-events-none";
              } else if (isRevealed || tutorialStep !== "playing") {
                animationClass = "translate-y-0 opacity-100 transition-all duration-300 ease-out";
              }

              const bubbleStyleClass = isSelected
                ? "w-32 h-36 sm:w-40 sm:h-40 rounded-full bg-neutral-900 border-2 border-neutral-900 text-white shadow-md transition-all duration-300 ease-out"
                : "w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white border-2 border-slate-300 text-neutral-900 shadow-sm transition-all duration-300 ease-out";

              return (
                <div
                  key={id}
                  className={`absolute ${positions[index]} ${animationClass}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (tutorialStep !== "playing") return;
                      if (isRevealed && revealedCount === 3 && !isSubmitting) {
                        onBubbleClick(id);
                      }
                    }}
                    disabled={isSubmitting || (revealedCount < 3 && tutorialStep === "playing")}
                    aria-label={`Bubble ${expr.display}`}
                    className={`relative flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none ${bubbleStyleClass}`}
                  >
                    <span>{expr.display}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* 4. Bottom Timer & Instruction Bar */}
          <div className={`flex items-center justify-center gap-3 pt-4 pb-1 px-2 border-t border-slate-100 ${
            tutorialStep === 4 ? "z-[60] bg-white rounded-lg shadow-lg relative p-2" : ""
          }`}>

            {/* Timer */}
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 36 36"
                aria-hidden="true"
              >
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />

                <path
                  className="text-neutral-900 transition-all duration-1000 ease-linear"
                  strokeDasharray={`${(
                    (remainingSeconds / timeLimitSeconds) *
                    100
                  ).toFixed(2)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>

              <span className="text-lg font-bold text-neutral-900 font-mono">
                {remainingSeconds}
              </span>
            </div>

            {/* Instruction */}
            <p className="text-lg sm:text-sm text-slate-700 leading-snug text-center">
              <span className="block">
                Some bubbles are displayed. Select the bubbles in order from the
              </span>
              <span className="block">
                <strong className="font-bold text-neutral-900">
                  LOWEST
                </strong>{" "}
                value to{" "}
                <strong className="font-bold text-neutral-900">
                  HIGHEST
                </strong>{" "}
                value
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic UI
// Used by variants other than practice-1 / practice-2
// ─────────────────────────────────────────────────────────────────────────────

interface GenericGridUIProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentSession: any;

  currentQ: BubbleMathQuestion;

  selectedIds: string[];

  isSubmitting: boolean;

  remainingSeconds: number;

  onBubbleClick: (id: string) => void;
}

function GenericGridUI({
  currentSession,
  currentQ,
  selectedIds,
  isSubmitting,
  remainingSeconds,
  onBubbleClick,
}: GenericGridUIProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-2xl mx-auto">

      {/* Header */}

      <div className="flex w-full items-center justify-between">

        <span className="text-sm font-medium text-muted-foreground">
          Question{" "}
          {currentSession.currentItemIndex + 1}{" "}
          of{" "}
          {currentSession.totalItems}
        </span>

        <AssessmentTimer
          remainingSeconds={remainingSeconds}
        />
      </div>

      {/* Bubble grid */}

      <div className="flex flex-wrap gap-6 justify-center">

        {currentQ.displayOrderIds.map((id) => {
          const expr =
            currentQ.expressions.find(
              (e) => e.id === id
            )!;

          const isSelected =
            selectedIds.includes(id);

          const selectionIndex =
            selectedIds.indexOf(id);

          return (
            <MathBubble
              key={id}
              expression={expr.display}
              selected={isSelected}
              selectionOrder={
                isSelected
                  ? selectionIndex + 1
                  : undefined
              }
              onClick={() => onBubbleClick(id)}
              disabled={isSubmitting}
              aria-label={`Bubble ${expr.display}${
                isSelected
                  ? `, selected ${selectionIndex + 1}`
                  : ""
              }`}
            />
          );
        })}
      </div>

      {/* Instruction */}

      <p className="text-sm text-muted-foreground text-center">
        Select from{" "}
        <strong>LOWEST</strong>{" "}
        to{" "}
        <strong>HIGHEST</strong>
      </p>
    </div>
  );
}