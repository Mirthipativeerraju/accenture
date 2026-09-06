"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, DoorOpen, Compass, Clock, Navigation } from "lucide-react";

interface MemoryMazeInstructionsProps {
  onStart: () => void;
}

export function MemoryMazeInstructions({ onStart }: MemoryMazeInstructionsProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-6 px-4">
      <Card className="w-full max-w-2xl border bg-card text-card-foreground shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="text-center bg-neutral-900 text-white py-6">
          <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight">
            Memory Maze Instructions
          </CardTitle>
          <p className="mt-1 text-sm text-neutral-300">
            Navigation & Key-Door Assessment
          </p>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Main prompt box */}
         

          {/* Key rules list */}
          <div className="grid gap-3.5 text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-300">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <p className="leading-snug pt-1">
                <strong>Collect KEY:</strong> Navigate your player through the maze, collect the required key(s).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                <DoorOpen className="w-5 h-5" />
              </div>
              <p className="leading-snug pt-1">
                <strong>Reach the DOOR:</strong> After collecting the key, navigate to the door to solve the maze. Reaching the door before getting the key will not open it.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <p className="leading-snug pt-1">
                <strong>Directional Controls:</strong> Use the on-screen arrow buttons (↑, ↓, ←, →) or keyboard arrow keys to move one cell at a time.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <p className="leading-snug pt-1">
                <strong>Countdown Timer:</strong> The timer is displayed at the bottom of the screen. If time expires, the game progresses automatically.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0 flex justify-center">
          <Button
            size="lg"
            className="w-full max-w-sm text-base font-bold h-13 tracking-wide uppercase bg-black hover:bg-neutral-800 text-white rounded-xl shadow-sm transition-transform active:scale-95"
            onClick={onStart}
          >
            PRACTICE
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

