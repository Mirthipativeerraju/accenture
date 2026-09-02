"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameSessionStore } from "@/lib/store/game-session";
import { PracticeConfig } from "@/lib/games/core/types";
import { registerBubbleMath } from "@/lib/games/bubble-math";

const VARIANTS: Record<string, Partial<PracticeConfig> & { label?: string }> = {
  "speed-techniques": {
    variantId: "speed-techniques",
    difficulty: "EASY",
    timeLimitSeconds: 20,
    itemCount: 10
  },
  "practice-1": {
    variantId: "practice-1",
    difficulty: "EASY",
    timeLimitSeconds: 15,
    itemCount: 10
  },
  "practice-2": {
    variantId: "practice-2",
    difficulty: "MEDIUM",
    timeLimitSeconds: 15,
    itemCount: 15
  },
  "practice-3": {
    variantId: "practice-3",
    difficulty: "HARD",
    timeLimitSeconds: 15,
    itemCount: 20
  },
  "full-challenge": {
    variantId: "full-challenge",
    difficulty: "HARD",
    timeLimitSeconds: 15,
    itemCount: 28,
    label: "Full Challenge"
  },
  "full-mock-test": {
    variantId: "full-mock-test",
    difficulty: "HARD",
    timeLimitSeconds: 15,
    itemCount: 28,
    label: "Full Mock Test"
  },
  "full-bubble-mock-test": {
    variantId: "full-bubble-mock-test",
    difficulty: "HARD",
    timeLimitSeconds: 15,
    itemCount: 28,
    label: "Full Bubble Mock Test"
  }
};

export default function BubbleMathPracticeSetup() {
  const router = useRouter();
  const { initializeSession } = useGameSessionStore();
  const [selectedVariant, setSelectedVariant] = useState<string>("full-challenge");

  useEffect(() => {
    registerBubbleMath();
  }, []);

  const handleLaunch = () => {
    const variantConfig = VARIANTS[selectedVariant];
    
    const config: PracticeConfig = {
      gameId: "bubble-math",
      variantId: variantConfig.variantId!,
      difficulty: variantConfig.difficulty!,
      mode: "TIMED_PRACTICE",
      itemCount: variantConfig.itemCount!,
      timeLimitSeconds: variantConfig.timeLimitSeconds!,
      instructionTimeSeconds: 0,
      scoringConfig: {
        mode: "TIMED_PRACTICE",
        weights: { accuracy: 1, speed: 1, completion: 1 }
      },
      allowRestart: false,
      allowBacktrack: false
    };

    const sessionId = `sess-${Date.now()}`;
    const seed = `seed-${Date.now()}`;

    initializeSession(sessionId, config, seed, () => {
      // No-op: Game component handles per-question timeout
    });

    router.push("/assessment/bubble-math");
  };

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Bubble Math Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">Select a practice configuration below. These are simulator configurations for practicing your numerical dexterity.</p>
          
          <div className="grid gap-3">
            {Object.entries(VARIANTS).map(([key, variant]) => (
              <Button 
                key={key}
                variant={selectedVariant === key ? "default" : "outline"}
                className="justify-start h-auto py-4 px-6 flex-col items-start gap-1"
                onClick={() => setSelectedVariant(key)}
              >
                <div className="font-bold text-lg">{variant.label || key.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div className="text-sm font-normal opacity-80">
                  {variant.itemCount} questions • {variant.timeLimitSeconds}s per question • {variant.difficulty}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full h-14 text-lg" onClick={handleLaunch}>Launch Practice</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
