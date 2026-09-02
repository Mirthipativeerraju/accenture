"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameSessionStore } from "@/lib/store/game-session";
import { BubbleMathGame } from "@/components/game/bubble-math/BubbleMathGame";
import { registerBubbleMath } from "@/lib/games/bubble-math";

export default function BubbleMathAssessmentPage() {
  const router = useRouter();
  const { currentSession, initializeSession } = useGameSessionStore();

  useEffect(() => {
    registerBubbleMath();
    if (!currentSession) {
      // If directly navigated to /assessment/bubble-math without setup,
      // initialize default Practice Test 1 session automatically so it is always playable
      const config = {
        gameId: "bubble-math",
        variantId: "practice-1",
        difficulty: "EASY" as const,
        mode: "TIMED_PRACTICE" as const,
        itemCount: 10,
        timeLimitSeconds: 15,
        instructionTimeSeconds: 0,
        scoringConfig: {
          mode: "TIMED_PRACTICE" as const,
          weights: { accuracy: 1, speed: 1, completion: 1 }
        },
        allowRestart: false,
        allowBacktrack: false
      };
      initializeSession(`sess-${Date.now()}`, config, `seed-${Date.now()}`);
    }
  }, [currentSession, initializeSession]);

  if (!currentSession) return <div className="p-8 text-center text-muted-foreground">Loading session...</div>;

  return <BubbleMathGame />;
}
