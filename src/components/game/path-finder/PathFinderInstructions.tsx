"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RotateCw,
  ArrowLeftRight,
  Target,
  Move,
  Clock,
} from "lucide-react";

interface PathFinderInstructionsProps {
  onNext: () => void;
}

export function PathFinderInstructions({
  onNext,
}: PathFinderInstructionsProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-6 px-4">
      <Card className="w-full max-w-2xl border bg-card text-card-foreground shadow-md rounded-2xl overflow-hidden">

        {/* Header */}
        <CardHeader className="text-center bg-neutral-900 text-white py-6">
          <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight">
            Path Finder Instructions
          </CardTitle>

          <p className="mt-1 text-sm text-neutral-300">
            Route Creation & Tile Navigation Assessment
          </p>
        </CardHeader>

        {/* Instructions */}
        <CardContent className="p-6 sm:p-8 space-y-6">

          {/* Main Objective */}
          <div className="rounded-xl border bg-neutral-50 dark:bg-neutral-900/40 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
                <Target className="w-5 h-5" />
              </div>

              <p className="text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-300 leading-snug">
                <strong>Goal:</strong> Create a path from the icon on the
                left to the icon on the right by rotating the tiles and
                changing the arrow directions. Try to generate the path in
                the least number of moves.
              </p>
            </div>
          </div>

          {/* Rules */}
          <div className="grid gap-3.5 text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-300">

            {/* Select Tile */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                <Move className="w-5 h-5" />
              </div>

              <p className="leading-snug pt-1">
                <strong>Select a Tile:</strong> Tap or click on a tile to
                select it before using either control.
              </p>
            </div>

            {/* Rotate */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
                <RotateCw className="w-5 h-5" />
              </div>

              <p className="leading-snug pt-1">
                <strong>Rotate Tile:</strong> Tap or click the rotate button
                to rotate the selected 3×3 tile clockwise by 90 degrees.
              </p>
            </div>

            {/* Change Direction */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
                <ArrowLeftRight className="w-5 h-5" />
              </div>

              <p className="leading-snug pt-1">
                <strong>Change Route Direction:</strong> Tap or click the
                direction button to reverse the direction of the arrows
                inside the selected tile. The tile geometry does not move.
              </p>
            </div>

            {/* Timer */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                <Clock className="w-5 h-5" />
              </div>

              <p className="leading-snug pt-1">
                <strong>Countdown Timer:</strong> You have a limited amount
                of time to create the route. Your moves are counted when you
                rotate a tile or change its route direction.
              </p>
            </div>

          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-6 pt-0 flex justify-center">
          <Button
            size="lg"
            className="w-full max-w-sm text-base font-bold h-13 tracking-wide uppercase bg-black hover:bg-neutral-800 text-white rounded-xl shadow-sm transition-transform active:scale-95"
            onClick={onNext}
          >
            PRACTICE
          </Button>
        </CardFooter>

      </Card>
    </div>
  );
}