"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameSessionStore } from "@/lib/store/game-session";
import { PathFinderConfig } from "@/lib/games/path-finder/types";
import { registerPathFinder } from "@/lib/games/path-finder";

const VARIANTS: Record<string, Partial<PathFinderConfig>> = {
  "practice-1": {
    variantId: "practice-1",
    difficulty: "EASY",
    timeLimitSeconds: 240,
    itemCount: 5,
    blockGridSize: 3,
    blockSize: 3,
  },
  "standard-assessment": {
    variantId: "standard-assessment",
    difficulty: "MEDIUM",
    timeLimitSeconds: 240,
    itemCount: 10,
    blockGridSize: 3,
    blockSize: 3,
  },
  "full-challenge": {
    variantId: "full-challenge",
    difficulty: "HARD",
    timeLimitSeconds: 300,
    itemCount: 15,
    blockGridSize: 3,
    blockSize: 3,
  },
};

export default function PathFinderPracticeSetup() {
  const router = useRouter();
  const { initializeSession } = useGameSessionStore();
  const [selectedVariant, setSelectedVariant] = useState<string>("standard-assessment");

  useEffect(() => {
    registerPathFinder();
  }, []);

  const handleLaunch = () => {
    const variantConfig = VARIANTS[selectedVariant];

    const config: PathFinderConfig = {
      gameId: "path-finder",
      variantId: variantConfig.variantId!,
      difficulty: variantConfig.difficulty!,
      mode: "TIMED_PRACTICE",
      itemCount: variantConfig.itemCount!,
      timeLimitSeconds: variantConfig.timeLimitSeconds!,
      instructionTimeSeconds: 0,
      blockGridSize: variantConfig.blockGridSize || 3,
      blockSize: variantConfig.blockSize || 3,
      scoringConfig: {
        mode: "TIMED_PRACTICE",
        weights: { accuracy: 1, speed: 1, completion: 1 },
      },
      allowRestart: false,
      allowBacktrack: false,
    };

    const sessionId = `sess-${Date.now()}`;
    const seed = `seed-${Date.now()}`;

    initializeSession(sessionId, config, seed, () => {
      // Handled in PathFinderGame
    });

    router.push("/assessment/path-finder");
  };

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Path Finder Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Rotate grid blocks and align directional arrow routes to connect the start shuttle to the destination planet.
          </p>

          <div className="grid gap-3">
            {Object.entries(VARIANTS).map(([key, variant]) => (
              <Button
                key={key}
                variant={selectedVariant === key ? "default" : "outline"}
                className="justify-start h-auto py-4 px-6 flex-col items-start gap-1"
                onClick={() => setSelectedVariant(key)}
              >
                <div className="font-bold text-lg">{key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</div>
                <div className="text-sm font-normal opacity-80">
                  {variant.itemCount} puzzles • 9x9 grid (3x3 blocks) • {variant.timeLimitSeconds}s total
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full h-14 text-lg" onClick={handleLaunch}>
            Launch Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
