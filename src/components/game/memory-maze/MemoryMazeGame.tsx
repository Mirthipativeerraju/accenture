"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useGameSessionStore } from "@/lib/store/game-session";
import { AssessmentTimer } from "../AssessmentTimer";
import { MemoryMazeState, MemoryMazeQuestion, MemoryMazeConfig } from "@/lib/games/memory-maze/types";
import { MemoryMazeInstructions } from "./MemoryMazeInstructions";
import { MemoryMazeResult } from "./MemoryMazeResult";
import { MemoryMazeGrid } from "./MemoryMazeGrid";
import { AssessmentTimerEngine, defaultTimeProvider } from "@/lib/games/core/timer";

export function MemoryMazeGame() {
  const { currentSession, controller, timer, startSession, recordAction, advanceQuestion } = useGameSessionStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const questionStartTime = useRef<number>(0);
  
  const [phase, setPhase] = useState<"MEMORIZING" | "RECALL">("MEMORIZING");
  const [memoRemainingMs, setMemoRemainingMs] = useState<number>(0);
  
  const memoTimerRef = useRef<AssessmentTimerEngine | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync remaining seconds from the global timer for RECALL phase
  const [recallRemainingSec, setRecallRemainingSec] = useState<number>(0);

  // Safely get state and config
  const state = currentSession?.gameState as MemoryMazeState | undefined;
  const config = currentSession ? (controller as unknown as { config: MemoryMazeConfig }).config : undefined;

  const startMemoPhase = useCallback(() => {
    if (!config) return;
    setPhase("MEMORIZING");
    setSelectedIds([]);
    
    // Create memo timer
    const durationSec = config.memorizationTimeMs / 1000;
    const t = new AssessmentTimerEngine(durationSec, () => {
      // Memo complete, transition to RECALL
      setPhase("RECALL");
      
      // Start the actual game timer for recall phase
      timer?.reset();
      timer?.start();
      questionStartTime.current = Date.now();
    }, defaultTimeProvider);
    
    memoTimerRef.current = t;
    t.start();
    
    // Local sync interval for memo timer
    if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    syncIntervalRef.current = setInterval(() => {
      setMemoRemainingMs(t.getRemainingTimeMs());
    }, 50); // fast sync for progress bar
    
  }, [config, timer]);

  // Handle Initial Start and Question transitions
  useEffect(() => {
    if (currentSession?.status === "PLAYING") {
      // When a new question starts, timer is stopped by default if we just transitioned
      // or we just advanced. We need to check if we should start memo phase.
      // Wait, we can track the current question index.
    }
  }, [currentSession?.status]);

  // Sync recall timer
  useEffect(() => {
    if (phase === "RECALL" && currentSession?.status === "PLAYING") {
      const interval = setInterval(() => {
        if (timer) {
          setRecallRemainingSec(timer.getRemainingSeconds());
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase, currentSession?.status, timer]);

  // Handle Timeout
  useEffect(() => {
    if (phase === "RECALL" && currentSession?.status === "PLAYING" && recallRemainingSec <= 0) {
      if (config && selectedIds.length < config.pathLength) {
        const responseTimeMs = Date.now() - questionStartTime.current;
        recordAction({ selectedPathIds: [...selectedIds], isTimeout: true }, responseTimeMs);
        
        // Reset for next question
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedIds([]);
        advanceQuestion();
        startMemoPhase();
      }
    }
  }, [recallRemainingSec, phase, currentSession?.status, selectedIds, recordAction, config, startMemoPhase, advanceQuestion]);

  // Cleanup memo interval
  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
      if (memoTimerRef.current) memoTimerRef.current.stop();
    };
  }, []);

  if (!currentSession || !controller || !config || !state) {
    return <div className="flex h-[400px] items-center justify-center">Loading...</div>;
  }

  if (currentSession.status === "IDLE") {
    return <MemoryMazeInstructions onStart={() => {
      startSession();
      // Instantly start memo phase instead of global timer
      timer?.stop(); // stop global timer initially
      startMemoPhase();
    }} />;
  }

  if (["COMPLETED", "TIMEOUT", "FAILED", "ABORTED"].includes(currentSession.status)) {
    return <MemoryMazeResult />;
  }

  const currentQ: MemoryMazeQuestion | undefined = state.questions[currentSession.currentItemIndex];
  if (!currentQ) return null;

  const handleCellClick = (id: string) => {
    if (phase !== "RECALL") return;
    if (selectedIds.includes(id)) return; // No deselection or duplicates in memory maze for now

    const newSelections = [...selectedIds, id];
    setSelectedIds(newSelections);

    // Is the selection incorrect?
    const currentIndex = newSelections.length - 1;
    const isCorrectSoFar = newSelections[currentIndex] === currentQ.correctPath[currentIndex].id;

    if (!isCorrectSoFar) {
      // Incorrect!
      const responseTimeMs = Date.now() - questionStartTime.current;
      recordAction({ selectedPathIds: newSelections, isTimeout: false }, responseTimeMs);
      advanceQuestion();
      startMemoPhase();
      return;
    }

    if (newSelections.length === currentQ.pathLength) {
      // Completed successfully!
      const responseTimeMs = Date.now() - questionStartTime.current;
      recordAction({ selectedPathIds: newSelections, isTimeout: false }, responseTimeMs);
      advanceQuestion();
      startMemoPhase();
    }
  };

  const memoProgress = config.memorizationTimeMs > 0 
    ? (memoRemainingMs / config.memorizationTimeMs) * 100 
    : 0;

  return (
    <div className="flex w-full flex-col items-center justify-center py-4">
      <div className="w-full max-w-4xl rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/20 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold">Memory Maze</h2>
            <p className="text-sm text-muted-foreground">
              Question {currentSession.currentItemIndex + 1} of {currentSession.totalItems}
            </p>
          </div>
          
          {phase === "RECALL" && (
            <AssessmentTimer 
              remainingSeconds={recallRemainingSec} 
              totalSeconds={config.timeLimitSeconds} 
            />
          )}
          {phase === "MEMORIZING" && (
            <div className="text-right">
              <span className="text-sm font-bold text-primary">MEMORIZE</span>
            </div>
          )}
        </div>

        {/* Progress Bar for Memo Phase */}
        {phase === "MEMORIZING" && (
          <div className="h-1.5 w-full bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-100 ease-linear" 
              style={{ width: `${memoProgress}%` }} 
            />
          </div>
        )}

        {/* Game Area */}
        <div className="flex min-h-[450px] flex-col items-center justify-center p-8 bg-dot-pattern">
          
          <div className="mb-6 h-8 text-center">
            {phase === "MEMORIZING" ? (
              <p className="text-lg font-semibold text-primary animate-pulse">Memorize the path...</p>
            ) : (
              <p className="text-lg font-semibold text-foreground">Recall the path</p>
            )}
          </div>
          
          <MemoryMazeGrid
            gridSize={currentQ.gridSize}
            correctPath={phase === "MEMORIZING" ? currentQ.correctPath : undefined}
            selectedIds={selectedIds}
            disabled={phase === "MEMORIZING"}
            onCellClick={handleCellClick}
          />
        </div>
      </div>
    </div>
  );
}
