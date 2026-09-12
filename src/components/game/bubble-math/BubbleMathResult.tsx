"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameResult } from "@/lib/games/core/types";
import { persistence } from "@/lib/games/core/persistence";
import { useRouter } from "next/navigation";

interface BubbleMathResultProps {
  result: GameResult;
  onRestart?: () => void;
}

export function BubbleMathResult({ result, onRestart }: BubbleMathResultProps) {
  const router = useRouter();
  const { correct, incorrect, totalActions, averageResponseTimeMs } = result.rawMetrics;
  
  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <Card className="w-full max-w-2xl border-border/50 shadow-lg">
        <CardHeader className="bg-muted/50 text-center pb-8 pt-10">
          <CardTitle className="text-3xl font-bold">Practice Complete</CardTitle>
          <div className="mt-6 flex flex-col items-center justify-center">
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Practice Score</span>
            <span className="text-6xl font-black text-primary">{correct * 10}</span>
          </div>
        </CardHeader>
        
        <CardContent className="grid gap-6 p-8 sm:grid-cols-2">
          <div className="flex flex-col rounded-lg bg-muted/30 p-4">
            <span className="text-sm text-muted-foreground">Accuracy</span>
            <span className="text-2xl font-semibold">{Math.round(result.accuracy * 100)}%</span>
          </div>
          
          <div className="flex flex-col rounded-lg bg-muted/30 p-4">
            <span className="text-sm text-muted-foreground">Correct</span>
            <span className="text-2xl font-semibold text-green-600">{correct} / {totalActions}</span>
          </div>
          
          <div className="flex flex-col rounded-lg bg-muted/30 p-4">
            <span className="text-sm text-muted-foreground">Incorrect</span>
            <span className="text-2xl font-semibold text-red-600">{incorrect}</span>
          </div>
          
          <div className="flex flex-col rounded-lg bg-muted/30 p-4">
            <span className="text-sm text-muted-foreground">Avg Response Time</span>
            <span className="text-2xl font-semibold">{(averageResponseTimeMs / 1000).toFixed(1)}s</span>
          </div>
        </CardContent>
        
        <div className="px-8 pb-4">
          <h3 className="mb-2 font-semibold">Practice Feedback</h3>
          {result.accuracy >= 0.8 ? (
            <p className="text-sm text-muted-foreground">Strong accuracy across the round. To improve further, focus on reducing your average response time.</p>
          ) : (
            <p className="text-sm text-muted-foreground">Focus on careful arithmetic. Don&apos;t let the timer rush your calculations on harder expressions.</p>
          )}
        </div>
        
        <CardFooter className="flex flex-col justify-center gap-4 bg-muted/20 p-8 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              if (result.variantId) {
                persistence.clearLatestResult(result.variantId);
              }
              router.push("/practice/bubble-math");
            }}
          >
            {result.variantId?.startsWith("practice-") ? "Choose Another Practice" : "Choose Another Practice"}
          </Button>
          {onRestart && (
            <Button size="lg" onClick={onRestart}>
              Practice Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
