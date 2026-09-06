"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameSessionStore } from "@/lib/store/game-session";
import { MemoryMazeConfig } from "@/lib/games/memory-maze/types";
import { registerMemoryMaze } from "@/lib/games/memory-maze";

export const MEMORY_MAZE_VARIANTS: Record<string, Partial<MemoryMazeConfig> & { label?: string }> = {
  "practice-1": {
    variantId: "practice-1",
    difficulty: "EASY",
    memoryMazeDifficulty: "EASY",
    timeLimitSeconds: 240,
    itemCount: 5,
    gridSize: 3,
    label: "Practice Test 1"
  },
  "practice-2": {
    variantId: "practice-2",
    difficulty: "MEDIUM",
    memoryMazeDifficulty: "MEDIUM",
    timeLimitSeconds: 240,
    itemCount: 5,
    gridSize: 4,
    label: "Practice Test 2"
  },
  "practice-3": {
    variantId: "practice-3",
    difficulty: "HARD",
    memoryMazeDifficulty: "HARD",
    timeLimitSeconds: 240,
    itemCount: 5,
    gridSize: 4,
    label: "Practice Test 3"
  },
  "full-memory-mock-test": {
    variantId: "full-memory-mock-test",
    difficulty: "HARD",
    memoryMazeDifficulty: "VERY_HARD",
    timeLimitSeconds: 240,
    itemCount: 5,
    gridSize: 3,
    label: "Full Memory Mock Test"
  }
};

const VARIANTS = MEMORY_MAZE_VARIANTS;

export default function MemoryMazePracticeSetup() {
  const router = useRouter();
  const { initializeSession } = useGameSessionStore();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  useEffect(() => {
    registerMemoryMaze();
  }, []);

  const handleLaunch = () => {
    if (!selectedVariant) return;
    const variantConfig = VARIANTS[selectedVariant];
    if (!variantConfig) return;
    
    const config: MemoryMazeConfig = {
      gameId: "memory-maze",
      variantId: variantConfig.variantId!,
      difficulty: variantConfig.difficulty || "EASY",
      memoryMazeDifficulty: variantConfig.memoryMazeDifficulty || "EASY",
      mode: "TIMED_PRACTICE",
      itemCount: variantConfig.itemCount || 3,
      timeLimitSeconds: 240,
      instructionTimeSeconds: 0,
      gridSize: variantConfig.gridSize || 3,
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
      // Game handles timeout locally
    });

    router.push("/assessment/memory-maze");
  };

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Memory Maze</CardTitle>
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
                <div className="font-bold text-lg">{variant.label || key.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div className="text-sm font-normal opacity-80">
                  {variant.itemCount} mazes • {variant.gridSize}x{variant.gridSize} grid • 4:00 timer
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full h-14 text-lg" onClick={handleLaunch} disabled={!selectedVariant}>Launch Practice</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
