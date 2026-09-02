"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameSessionStore } from "@/lib/store/game-session";
import { MemoryMazeConfig } from "@/lib/games/memory-maze/types";
import { registerMemoryMaze } from "@/lib/games/memory-maze";

const VARIANTS: Record<string, Partial<MemoryMazeConfig>> = {
  "learn": {
    variantId: "learn",
    difficulty: "EASY",
    memoryMazeDifficulty: "EASY",
    timeLimitSeconds: 15,
    itemCount: 5,
    gridSize: 3,
    pathLength: 4,
    memorizationTimeMs: 4000,
    responseTimeMs: 15000,
  },
  "guided-practice": {
    variantId: "guided-practice",
    difficulty: "MEDIUM",
    memoryMazeDifficulty: "MEDIUM",
    timeLimitSeconds: 10,
    itemCount: 10,
    gridSize: 4,
    pathLength: 6,
    memorizationTimeMs: 3000,
    responseTimeMs: 10000,
  },
  "timed-practice": {
    variantId: "timed-practice",
    difficulty: "HARD",
    memoryMazeDifficulty: "HARD",
    timeLimitSeconds: 8,
    itemCount: 15,
    gridSize: 4,
    pathLength: 8,
    memorizationTimeMs: 2500,
    responseTimeMs: 8000,
  },
  "challenge": {
    variantId: "challenge",
    difficulty: "HARD",
    memoryMazeDifficulty: "VERY_HARD",
    timeLimitSeconds: 10,
    itemCount: 20,
    gridSize: 5,
    pathLength: 10,
    memorizationTimeMs: 2000,
    responseTimeMs: 10000,
  }
};

export default function MemoryMazePracticeSetup() {
  const router = useRouter();
  const { initializeSession } = useGameSessionStore();
  const [selectedVariant, setSelectedVariant] = useState<string>("guided-practice");

  useEffect(() => {
    registerMemoryMaze();
  }, []);

  const handleLaunch = () => {
    const variantConfig = VARIANTS[selectedVariant];
    
    const config: MemoryMazeConfig = {
      gameId: "memory-maze",
      variantId: variantConfig.variantId!,
      difficulty: variantConfig.difficulty!,
      memoryMazeDifficulty: variantConfig.memoryMazeDifficulty!,
      mode: "TIMED_PRACTICE",
      itemCount: variantConfig.itemCount!,
      timeLimitSeconds: variantConfig.timeLimitSeconds!,
      instructionTimeSeconds: 0,
      gridSize: variantConfig.gridSize!,
      pathLength: variantConfig.pathLength!,
      memorizationTimeMs: variantConfig.memorizationTimeMs!,
      responseTimeMs: variantConfig.responseTimeMs!,
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
      // MemoryMazeGame handles timeout locally in recall phase
    });

    router.push("/assessment/memory-maze");
  };

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Memory Maze Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">Select a practice configuration below. These are simulator configurations for practicing your spatial and sequence memory.</p>
          
          <div className="grid gap-3">
            {Object.entries(VARIANTS).map(([key, variant]) => (
              <Button 
                key={key}
                variant={selectedVariant === key ? "default" : "outline"}
                className="justify-start h-auto py-4 px-6 flex-col items-start gap-1"
                onClick={() => setSelectedVariant(key)}
              >
                <div className="font-bold text-lg">{key.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div className="text-sm font-normal opacity-80">
                  {variant.itemCount} grids • {variant.gridSize}x{variant.gridSize} • path of {variant.pathLength}
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
