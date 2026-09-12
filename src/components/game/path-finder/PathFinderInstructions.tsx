"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, ArrowLeftRight } from "lucide-react";

interface PathFinderInstructionsProps {
  onNext: () => void;
}

export function PathFinderInstructions({ onNext }: PathFinderInstructionsProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 max-w-4xl mx-auto w-full">
      <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Path Finder Instructions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Your goal is to create a path from the icon on the left to the icon on the right by rotating the tiles and changing the arrow directions. You should try to generate a path in the least number of moves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border/80 rounded-xl p-5 bg-card/60 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-sm">
                <RotateCw className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">ROTATE TILE</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Rotates the selected 3×3 tile clockwise by 90 degrees.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Tap/click on a tile to select it.</li>
              <li>Tap/click the rotate button to rotate the tile clockwise.</li>
            </ul>
          </div>

          <div className="border border-border/80 rounded-xl p-5 bg-card/60 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-sm">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">CHANGE ROUTE DIRECTION</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Reverses the direction of the arrows inside the selected 3×3 tile.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Tap/click the direction button to change the direction of route.</li>
              <li>Does not move tile geometry or affect other tiles.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-8 pb-4 w-full flex justify-center">
        <Button
          size="lg"
          onClick={onNext}
          className="w-full sm:w-64 h-12 text-base font-semibold shadow-md"
        >
          NEXT
        </Button>
      </div>
    </div>
  );
}
