"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameSessionStore } from "@/lib/store/game-session";
import { BubbleMathGame } from "@/components/game/bubble-math/BubbleMathGame";
import { registerBubbleMath } from "@/lib/games/bubble-math";
import { PracticeConfig } from "@/lib/games/core/types";
import { BUBBLE_MATH_VARIANTS } from "@/app/(main)/practice/bubble-math/page";

const ROUTE_TO_VARIANT: Record<string, string> = {
  "practice1": "practice-1",
  "practice-1": "practice-1",
  "practice2": "practice-2",
  "practice-2": "practice-2",
  "practice3": "practice-3",
  "practice-3": "practice-3",
  "full-challenge": "full-challenge",
  "full-mock-test": "full-mock-test",
  "full-bubble-mock-test": "full-bubble-mock-test",
};

export default function BubbleMathVariantAssessmentPage() {
  const params = useParams();
  const rawVariant = typeof params?.variant === "string" ? params.variant : "";
  const variantId = ROUTE_TO_VARIANT[rawVariant] || "practice-1";
  
  const { currentSession, initializeSession } = useGameSessionStore();

  useEffect(() => {
    registerBubbleMath();
    // If session is missing or session variantId does not match the URL variant
    if (!currentSession || currentSession.variantId !== variantId) {
      const variantConfig = BUBBLE_MATH_VARIANTS[variantId] || BUBBLE_MATH_VARIANTS["practice-1"];
      const config: PracticeConfig = {
        gameId: "bubble-math",
        variantId: variantConfig.variantId!,
        difficulty: variantConfig.difficulty || "EASY",
        mode: "TIMED_PRACTICE",
        itemCount: variantConfig.itemCount || 10,
        timeLimitSeconds: variantConfig.timeLimitSeconds || 15,
        instructionTimeSeconds: 0,
        scoringConfig: {
          mode: "TIMED_PRACTICE",
          weights: { accuracy: 1, speed: 1, completion: 1 }
        },
        allowRestart: false,
        allowBacktrack: false
      };
      initializeSession(`sess-${Date.now()}`, config, `seed-${Date.now()}`, () => {
        // No-op: Game component handles per-question timeout
      });
    }
  }, [currentSession, variantId, initializeSession]);

  if (!currentSession || currentSession.variantId !== variantId) {
    return <div className="p-8 text-center text-muted-foreground">Loading session...</div>;
  }

  return <BubbleMathGame />;
}
