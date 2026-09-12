"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Position, Direction } from "@/lib/games/memory-maze/types";
import { MemoryMazeGrid } from "./MemoryMazeGrid";

interface MemoryMazeTutorialProps {
  onStart: () => void;
}

// Fixed deterministic tutorial maze configuration
const TUTORIAL_START: Position = { row: 2, col: 0 };
const TUTORIAL_KEY: Position = { row: 0, col: 1 };
const TUTORIAL_DOOR: Position = { row: 2, col: 2 };

export function MemoryMazeTutorial({ onStart }: MemoryMazeTutorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [isDemoCompleted, setIsDemoCompleted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [step4TimeRemaining, setStep4TimeRemaining] = useState(240); // 4:00 (240s)
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Running countdown timer for Slide 4 (Timer explanation)
  useEffect(() => {
    if (currentSlide === 3) {
      setStep4TimeRemaining(240);
      const timerInterval = setInterval(() => {
        setStep4TimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    } else {
      setStep4TimeRemaining(240);
    }
  }, [currentSlide]);

  // Scripted demonstration animation loops per slide with locked Next until complete
  useEffect(() => {
    if (animTimerRef.current) {
      clearInterval(animTimerRef.current);
    }
    setDemoStep(0);

    const alreadyCompleted = completedSteps.includes(currentSlide);
    setIsDemoCompleted(alreadyCompleted);

    let maxSteps = 7;
    let stepInterval = 950;

    if (currentSlide === 0) {
      maxSteps = 7; // Up, Right, Down, Left, and back over visited cells
      stepInterval = 950;
    } else if (currentSlide === 1) {
      maxSteps = 6; // Move through several cells -> hit invisible wall -> red line -> reset to original START
      stepInterval = 1050;
    } else if (currentSlide === 2) {
      maxSteps = 8; // Navigate around remembered wall -> collect key -> reach door -> door opens
      stepInterval = 950;
    } else if (currentSlide === 3) {
      maxSteps = 1; // Timer-only explanation: grid unchanged
      stepInterval = 1200;
    } else {
      maxSteps = 1; // Full mock ready state
      stepInterval = 1000;
    }

    if (currentSlide === 3 || currentSlide === 4) {
      // For static explanation slides, unlock Next after brief reading time
      const timer = setTimeout(() => {
        setIsDemoCompleted(true);
        setCompletedSteps((prev) => (prev.includes(currentSlide) ? prev : [...prev, currentSlide]));
      }, stepInterval);
      return () => clearTimeout(timer);
    }

    let currentStepCount = 0;
    animTimerRef.current = setInterval(() => {
      currentStepCount++;
      setDemoStep((prev) => {
        const next = (prev + 1) % maxSteps;
        // Mark demo as completed once the full sequence has executed at least once
        if (currentStepCount >= maxSteps - 1) {
          setIsDemoCompleted(true);
          setCompletedSteps((prev) => (prev.includes(currentSlide) ? prev : [...prev, currentSlide]));
        }
        return next;
      });
    }, stepInterval);

    return () => {
      if (animTimerRef.current) {
        clearInterval(animTimerRef.current);
      }
    };
  }, [currentSlide, completedSteps]);

  const isCurrentStepUnlocked = completedSteps.includes(currentSlide) || isDemoCompleted;

  const nextSlide = () => {
    if (isCurrentStepUnlocked && currentSlide < 4) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Full 3x3 Deterministic Demonstration Grid State
  const getDemoGridState = () => {
    let player: Position = TUTORIAL_START;
    let key: Position | null = TUTORIAL_KEY;
    const door: Position = TUTORIAL_DOOR;
    let visited: Position[] = [TUTORIAL_START];
    let keyCollected = false;
    let isDoorOpen = false;
    let doorPhase: "entering" | "opened" | null = null;
    let collisionDirection: Direction | null = null;
    let pointerPosition: Position | null = null;

    if (currentSlide === 0) {
      // Slide 1 (State 1: Basic Movement)
      // Clearly demonstrates: UP, RIGHT, DOWN, LEFT, and returning back over visited path
      const path: Position[] = [
        { row: 2, col: 0 }, // Step 0: START
        { row: 1, col: 0 }, // Step 1: UP
        { row: 1, col: 1 }, // Step 2: RIGHT
        { row: 2, col: 1 }, // Step 3: DOWN
        { row: 2, col: 0 }, // Step 4: LEFT (returning to visited START)
        { row: 1, col: 0 }, // Step 5: UP (re-entering visited cell)
        { row: 1, col: 1 }, // Step 6: RIGHT (re-entering visited cell)
      ];
      const targets: Position[] = [
        { row: 1, col: 0 }, // Step 0 target: UP to (1,0)
        { row: 1, col: 1 }, // Step 1 target: RIGHT to (1,1)
        { row: 2, col: 1 }, // Step 2 target: DOWN to (2,1)
        { row: 2, col: 0 }, // Step 3 target: LEFT to (2,0)
        { row: 1, col: 0 }, // Step 4 target: UP to (1,0)
        { row: 1, col: 1 }, // Step 5 target: RIGHT to (1,1)
        { row: 2, col: 1 }, // Step 6 target: DOWN to (2,1)
      ];
      const idx = demoStep % path.length;
      player = path[idx];
      pointerPosition = targets[idx];

      // Visited cells accumulated
      const uniqueVisited: Position[] = [];
      for (let i = 0; i <= idx; i++) {
        const p = path[i];
        if (!uniqueVisited.some((u) => u.row === p.row && u.col === p.col)) {
          uniqueVisited.push(p);
        }
      }
      visited = uniqueVisited;
      key = TUTORIAL_KEY;
      keyCollected = false;
    } else if (currentSlide === 1) {
      // Slide 2 (State 2: Invisible Wall Collision & Return to Original START)
      key = TUTORIAL_KEY;
      keyCollected = false;
      if (demoStep === 0) {
        // Step 0: START position (2,0), selecting (1,0) [UP]
        player = { row: 2, col: 0 };
        pointerPosition = { row: 1, col: 0 };
        visited = [{ row: 2, col: 0 }];
      } else if (demoStep === 1) {
        // Step 1: Move UP to (1,0), selecting (1,1) [RIGHT]
        player = { row: 1, col: 0 };
        pointerPosition = { row: 1, col: 1 };
        visited = [{ row: 2, col: 0 }, { row: 1, col: 0 }];
      } else if (demoStep === 2) {
        // Step 2: Move RIGHT to (1,1), selecting (2,1) [DOWN - attempting blocked move]
        player = { row: 1, col: 1 };
        pointerPosition = { row: 2, col: 1 };
        visited = [{ row: 2, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }];
      } else if (demoStep === 3) {
        // Step 3: Attempt blocked downward move across invisible wall between (1,1) and (2,1)
        player = { row: 1, col: 1 };
        pointerPosition = { row: 2, col: 1 };
        visited = [{ row: 2, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }];
        collisionDirection = "down"; // Temporary RED COLLISION LINE appears on bottom boundary
      } else if (demoStep === 4) {
        // Step 4: Reset immediately to ORIGINAL START (2,0), wall remains invisible, path reset
        player = { row: 2, col: 0 };
        pointerPosition = { row: 1, col: 0 };
        visited = [{ row: 2, col: 0 }];
        collisionDirection = null;
      } else {
        // Step 5: Pause at START to reinforce reset behavior
        player = { row: 2, col: 0 };
        pointerPosition = { row: 1, col: 0 };
        visited = [{ row: 2, col: 0 }];
        collisionDirection = null;
      }
    } else if (currentSlide === 2) {
      // Slide 3 (State 3: Remember Discovered Wall, Collect Key, Reach Door)
      const path: Position[] = [
        { row: 2, col: 0 }, // Step 0: START
        { row: 1, col: 0 }, // Step 1: UP
        { row: 0, col: 0 }, // Step 2: UP (choosing another route around the wall)
        { row: 0, col: 1 }, // Step 3: RIGHT -> reaches KEY
        { row: 0, col: 2 }, // Step 4: RIGHT -> continues with collected key
        { row: 1, col: 2 }, // Step 5: DOWN
        { row: 2, col: 2 }, // Step 6: DOWN -> reaches DOOR
        { row: 2, col: 2 }, // Step 7: DOOR OPENS
      ];
      const targets: (Position | null)[] = [
        { row: 1, col: 0 }, // Step 0: selecting (1,0) [UP]
        { row: 0, col: 0 }, // Step 1: selecting (0,0) [UP]
        { row: 0, col: 1 }, // Step 2: selecting (0,1) [RIGHT - Key]
        { row: 0, col: 2 }, // Step 3: selecting (0,2) [RIGHT]
        { row: 1, col: 2 }, // Step 4: selecting (1,2) [DOWN]
        { row: 2, col: 2 }, // Step 5: selecting (2,2) [DOWN - Door]
        null,               // Step 6: reached door
        null,               // Step 7: door opened
      ];
      const idx = demoStep % path.length;
      player = path[idx];
      pointerPosition = targets[idx];

      const uniqueVisited: Position[] = [];
      for (let i = 0; i <= idx; i++) {
        const p = path[i];
        if (!uniqueVisited.some((u) => u.row === p.row && u.col === p.col)) {
          uniqueVisited.push(p);
        }
      }
      visited = uniqueVisited;
      key = idx < 3 ? TUTORIAL_KEY : null;
      keyCollected = idx >= 3;
      doorPhase = idx === 6 ? "entering" : idx >= 7 ? "opened" : null;
      isDoorOpen = idx >= 7;
    } else if (currentSlide === 3) {
      // Slide 4 (State 4: Timer Explanation - Maze Unchanged)
      player = { row: 2, col: 0 };
      key = TUTORIAL_KEY;
      doorPhase = null;
      isDoorOpen = false;
      keyCollected = false;
      visited = [{ row: 2, col: 0 }];
      pointerPosition = null;
    } else {
      // Slide 5 (State 5: Ready for Full Mock Test)
      player = { row: 2, col: 0 };
      key = TUTORIAL_KEY;
      doorPhase = null;
      isDoorOpen = false;
      keyCollected = false;
      visited = [{ row: 2, col: 0 }];
      pointerPosition = null;
    }

    return { player, key, door, visited, keyCollected, isDoorOpen, doorPhase, collisionDirection, pointerPosition };
  };

  const { player, key, door, visited, keyCollected, isDoorOpen, doorPhase, collisionDirection, pointerPosition } =
    getDemoGridState();

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timerDashoffset =
    currentSlide === 3
      ? 2 * Math.PI * 21 * (1 - step4TimeRemaining / 240)
      : 0;

  const slideContents = [
    {
      p1: "In this exercise, you must move between boxes in a grid that contains a maze of invisible walls. You can navigate up, down, left or right, but NOT diagonally. You can also navigate back over the path you have taken. You can only move across one box at a time.",
      p2: null,
    },
    {
      p1: "Each time you hit a wall, you will be returned back to the beginning of the maze and must start over. The walls do not move, but you must remember where they are located.",
      p2: null,
    },
    {
      p1: "Your goal is to collect the key and reach the door in the least number of attempts. If there are two keys in a grid, you will need to collect both before navigating to the door.",
      p2: null,
    },
    {
      p1: "You do not need to rush. However, if you have been unable to solve the maze within the time limit, you will progress automatically to the next maze.",
      p2: "A timer is located at the bottom of the screen to indicate time remaining.",
    },
    {
      p1: "The practice exercise will have 2 mazes to solve.",
      p2: "The first maze will be one that you can replay, so you should take this opportunity to practice how to navigate.",
    },
  ];

  const currentContent = slideContents[currentSlide];

  return (
    <div className="w-full min-h-[520px] flex flex-col items-center justify-center py-6 px-4 bg-white text-black select-none">
      {/* Full Outer Tutorial Game Container - Exact same outer dimensions as production Memory Maze */}
      <div className="w-full max-w-[750px] min-h-[650px] flex flex-col border border-[#b8b8b8] rounded-[6px] overflow-hidden bg-[#f3f3f3] shadow-none relative">
        {/* Black Question Header - Title only */}
        <div className="w-full h-[48px] bg-black flex items-center px-5 shrink-0 z-10">
          <span className="text-white text-sm sm:text-base font-semibold tracking-tight">
            Memory Maze - Full Memory Mock Test
          </span>
        </div>

        {/* FIXED BASE GAMEPLAY AREA (Maze, Timer & Objective NEVER move between tutorial states) */}
        <div className="flex-1 flex flex-col items-center justify-center w-full px-4 py-6 relative bg-[#f3f3f3] overflow-hidden">
          {/* Fixed Maze + Timer Column */}
          <div className="flex flex-col items-center w-[300px] sm:w-[340px] mx-auto my-auto">
            {/* Full-Scale Memory Maze Grid - Exact production dimensions */}
            <div className="flex justify-center items-center w-full">
              <MemoryMazeGrid
                playerPosition={player}
                keyPosition={key || undefined}
                doorPosition={door}
                keyCollected={keyCollected}
                isDoorOpen={isDoorOpen}
                doorPhase={doorPhase}
                visitedCells={visited}
                collisionDirection={collisionDirection}
                onMove={() => {}}
                disabled={true}
                showArrows={true}
                gridSize={3}
                pointerPosition={pointerPosition}
              />
            </div>

            {/* Timer & Objective Row */}
            <div className="flex items-center justify-between w-full mt-3 px-1">
              {/* Circular Timer - Live running countdown in Step 4 with clean white rounded callout */}
              <div
                className={cn(
                  "relative flex items-center justify-center shrink-0 transition-all duration-200",
                  currentSlide === 3
                    ? "bg-white border border-[#b8b8b8] rounded-[8px] shadow-sm p-1.5 -m-1.5 z-20"
                    : "w-11 h-11 sm:w-12 sm:h-12"
                )}
              >
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r={21} fill="white" stroke="#e5e5e5" strokeWidth="2.5" />
                    <circle
                      cx="24"
                      cy="24"
                      r={21}
                      fill="none"
                      stroke="black"
                      strokeWidth="2.5"
                      strokeDasharray={2 * Math.PI * 21}
                      strokeDashoffset={timerDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-sans font-bold text-xs sm:text-sm text-black tracking-tight select-none">
                    {currentSlide === 3 ? formatTimer(step4TimeRemaining) : "4:00"}
                  </span>
                </div>
              </div>

              {/* Objective Text */}
              <div className="flex flex-col text-[11px] sm:text-xs font-sans font-semibold text-black leading-tight text-right tracking-tight">
                <span>Collect 1 KEY</span>
                <span>then get to the DOOR</span>
              </div>
            </div>
          </div>

          {/* ============================================================
              OVERLAY INSTRUCTION LAYERS (Placed over the fixed base maze)
              ============================================================ */}

          {/* STEPS 1, 2, 3: BOTTOM INSTRUCTION OVERLAY (Attached directly to left, right, and bottom borders with no gap) */}
          {currentSlide <= 2 && (
            <div className="absolute bottom-0 left-0 right-0 w-full bg-white border-t border-[#b8b8b8] px-3 sm:px-4 py-3.5 sm:py-4 z-30 shadow-sm">
              <div className="flex items-center justify-between w-full max-w-[580px] mx-auto">
                {/* Previous Chevron Button */}
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-all shrink-0 select-none",
                    currentSlide === 0
                      ? "opacity-20 cursor-not-allowed text-neutral-300"
                      : "text-neutral-700 hover:text-black hover:scale-110 active:scale-95 cursor-pointer"
                  )}
                  aria-label="Previous tutorial step"
                >
                  <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                </button>

                {/* Instruction Text Center */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-3 sm:px-5 min-h-[52px]">
                  <p className="text-xs sm:text-[13px] text-neutral-900 leading-snug sm:leading-relaxed font-normal">
                    {currentContent.p1}
                  </p>
                  {currentContent.p2 && (
                    <p className="text-xs sm:text-[13px] text-neutral-900 leading-snug sm:leading-relaxed font-normal mt-1">
                      {currentContent.p2}
                    </p>
                  )}
                </div>

                {/* Next Chevron Button - Locked during incomplete step, unlocked once complete without any tooltip */}
                <button
                  onClick={nextSlide}
                  disabled={!isCurrentStepUnlocked}
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-all shrink-0 select-none",
                    !isCurrentStepUnlocked
                      ? "opacity-30 cursor-not-allowed text-neutral-400"
                      : "text-black hover:scale-110 active:scale-95 cursor-pointer"
                  )}
                  aria-label="Next tutorial step"
                >
                  <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
                </button>
              </div>

              {/* 6 Pagination Indicators */}
              <div className="flex items-center justify-center gap-2 mt-2" role="tablist" aria-label="Tutorial Progress">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={`dot-${idx}`}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      currentSlide === idx
                        ? "bg-black scale-110"
                        : "border border-neutral-400 bg-transparent",
                      idx === 5 && "opacity-40"
                    )}
                    aria-label={`Tutorial step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: TOP INSTRUCTION OVERLAY (Sits at top over upper portion of fixed maze) */}
          {currentSlide === 3 && (
            <div className="absolute top-0 left-0 right-0 w-full bg-white border-b border-[#b8b8b8] px-3 sm:px-4 py-3 sm:py-3.5 z-30 shadow-sm">
              <div className="flex items-center justify-between w-full max-w-[580px] mx-auto">
                {/* Previous Chevron Button */}
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-700 hover:text-black hover:scale-110 active:scale-95 cursor-pointer transition-all shrink-0 select-none"
                  aria-label="Previous tutorial step"
                >
                  <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                </button>

                {/* Instruction Text Center */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-3 sm:px-5 min-h-[52px]">
                  <p className="text-xs sm:text-[13px] text-neutral-900 leading-snug sm:leading-relaxed font-normal">
                    {currentContent.p1}
                  </p>
                  {currentContent.p2 && (
                    <p className="text-xs sm:text-[13px] text-neutral-900 leading-snug sm:leading-relaxed font-normal mt-1">
                      {currentContent.p2}
                    </p>
                  )}
                </div>

                {/* Next Chevron Button - Locked during incomplete step, unlocked once complete without any tooltip */}
                <button
                  onClick={nextSlide}
                  disabled={!isCurrentStepUnlocked}
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-all shrink-0 select-none",
                    !isCurrentStepUnlocked
                      ? "opacity-30 cursor-not-allowed text-neutral-400"
                      : "text-black hover:scale-110 active:scale-95 cursor-pointer"
                  )}
                  aria-label="Next tutorial step"
                >
                  <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
                </button>
              </div>

              {/* 6 Pagination Indicators */}
              <div className="flex items-center justify-center gap-2 mt-2" role="tablist" aria-label="Tutorial Progress">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={`dot-${idx}`}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      currentSlide === idx
                        ? "bg-black scale-110"
                        : "border border-neutral-400 bg-transparent",
                      idx === 5 && "opacity-40"
                    )}
                    aria-label={`Tutorial step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* FINAL STEP: WIDE CENTER INSTRUCTION OVERLAY (Attached to left and right borders over middle of fixed maze) */}
          {currentSlide === 4 && (
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full bg-white border-y border-[#b8b8b8] px-4 sm:px-8 py-5 sm:py-6 z-30 flex flex-col items-center justify-center text-center shadow-sm">
              {/* 3 Instruction Paragraphs with comfortable spacing */}
              <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center space-y-2 sm:space-y-2.5">
                <p className="text-xs sm:text-[13px] text-neutral-900 leading-snug sm:leading-relaxed font-normal">
                  The practice exercise will have 2 mazes to solve.
                </p>
                <p className="text-xs sm:text-[13px] text-neutral-900 leading-snug sm:leading-relaxed font-normal">
                  The first maze will be one that you can replay, so you should take this opportunity to practice how to navigate.
                </p>
                <p className="text-xs sm:text-[13px] text-neutral-900 leading-snug sm:leading-relaxed font-normal">
                  Press the PRACTICE button to proceed to the first maze.
                </p>
              </div>

              {/* Centered PRACTICE CTA Button */}
              <div className="w-full flex justify-center mt-4 sm:mt-5">
                <button
                  onClick={onStart}
                  className="w-full max-w-[280px] h-10 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-[4px] shadow-sm transition-all cursor-pointer"
                  aria-label="Practice"
                >
                  PRACTICE
                </button>
              </div>

              {/* Centered Previous + Next Navigation Arrows Pair */}
              <div className="flex items-center justify-center gap-6 mt-3 sm:mt-4">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-700 hover:text-black hover:scale-110 active:scale-95 cursor-pointer transition-all shrink-0 select-none"
                  aria-label="Previous tutorial step"
                >
                  <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                </button>
                <button
                  disabled={true}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center opacity-30 cursor-not-allowed text-neutral-400 transition-all shrink-0 select-none"
                  aria-label="Next tutorial step"
                >
                  <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
                </button>
              </div>

              {/* 6 Pagination Indicators */}
              <div className="flex items-center justify-center gap-2 mt-2" role="tablist" aria-label="Tutorial Progress">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={`dot-${idx}`}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      currentSlide === idx
                        ? "bg-black scale-110"
                        : "border border-neutral-400 bg-transparent",
                      idx === 5 && "opacity-40"
                    )}
                    aria-label={`Tutorial step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
