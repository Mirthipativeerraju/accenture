"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameSessionStore } from "@/lib/store/game-session";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Trophy, Clock, Zap, Target } from "lucide-react";

export function MemoryMazeResult() {
  const { currentSession } = useGameSessionStore();
  
  if (!currentSession || !["COMPLETED", "TIMEOUT"].includes(currentSession.status)) {
    return null;
  }
  
  // N2 scoring logic extraction (simplified)
  let correct = 0;
  let timeouts = 0;
  let totalTime = 0;
  
  currentSession.actions.forEach(a => {
    if (a.payload && (a.payload as { isTimeout?: boolean }).isTimeout) timeouts++;
    else if (a.valid) correct++;
    
    totalTime += a.responseTimeMs;
  });
  
  const total = currentSession.totalItems;
  const incorrect = total - correct - timeouts;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const avgTime = total > 0 ? (totalTime / total / 1000).toFixed(1) : "0.0";
  
  // Basic practice score
  const score = Math.round((accuracy * 10) + (correct * 50));

  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Practice Complete</CardTitle>
          <p className="mt-2 text-muted-foreground">Memory Maze</p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-primary">{score}</span>
            <span className="mt-2 font-medium uppercase tracking-wider text-muted-foreground">Practice Score</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50">
              <Target className="h-5 w-5 mb-2 text-primary" />
              <span className="text-2xl font-bold">{accuracy}%</span>
              <span className="text-xs text-muted-foreground uppercase mt-1">Accuracy</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50">
              <Zap className="h-5 w-5 mb-2 text-green-500" />
              <span className="text-2xl font-bold">{correct}</span>
              <span className="text-xs text-muted-foreground uppercase mt-1">Correct</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50">
              <div className="flex h-5 w-5 mb-2 items-center justify-center rounded-full bg-destructive/20 text-destructive font-bold text-[10px]">X</div>
              <span className="text-2xl font-bold">{incorrect}</span>
              <span className="text-xs text-muted-foreground uppercase mt-1">Incorrect</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50">
              <Clock className="h-5 w-5 mb-2 text-orange-500" />
              <span className="text-2xl font-bold">{avgTime}s</span>
              <span className="text-xs text-muted-foreground uppercase mt-1">Avg Time</span>
            </div>
          </div>
          
          {timeouts > 0 && (
            <Badge variant="outline" className="text-orange-500 border-orange-500/30">
              {timeouts} {timeouts === 1 ? 'Timeout' : 'Timeouts'}
            </Badge>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link href="/practice" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              Back to Practice
            </Button>
          </Link>
          <Link href="/practice/memory-maze" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">
              Play Again
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
