"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MathBubble } from "./MathBubble";

interface BubbleMathInstructionsProps {
  onStart: () => void;
}

export function BubbleMathInstructions({ onStart }: BubbleMathInstructionsProps) {
  return (
    <div className="w-full flex justify-center py-6 px-4">
      <div className="w-full max-w-4xl border border-border bg-card rounded-lg p-6 sm:p-8 shadow-sm flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Bubble Math</h1>
          <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the expressions and select the bubbles in ascending order (lowest to highest).
          </p>
        </div>
        
        {/* Instructions Box */}
        <div className="w-full bg-muted/30 border border-border rounded-md p-4 sm:p-5 mb-6 text-left">
          <h2 className="text-base sm:text-lg font-bold text-foreground mb-3">Instructions:</h2>
          <div className="space-y-2 text-black font-normal text-sm sm:text-[15px] leading-relaxed">
            <p>1) Some bubbles are displayed. Select the bubbles in order from LOWEST to HIGHEST value.</p>
            <p>2) You can select a bubble by clicking it once.</p>
            <p>3) The selected bubbles will be highlighted.</p>
            <p>4) Click a selected bubble again to deselect it. After selecting three bubbles, the game automatically moves forward.</p>
            <p>5) You have 15 seconds to answer each question.</p>
            <p>6) If you do not select all three bubbles within the time limit, the game will automatically move to the next question.</p>
          </div>
        </div>

        {/* Example Bubbles */}
        <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8 md:flex-row my-2">
          <MathBubble expression="8 + 4" selected={false} />
          <MathBubble expression="20 - 5" selected={false} />
          <MathBubble expression="7 × 3" selected={false} />
        </div>
        
        {/* Correct Order */}
        <div className="text-center my-4">
          <h3 className="mb-2 text-lg font-semibold text-foreground">Correct Order:</h3>
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground text-sm sm:text-base">
            <p>1. <span className="font-bold text-foreground">8 + 4</span> (12)</p>
            <p>2. <span className="font-bold text-foreground">20 - 5</span> (15)</p>
            <p>3. <span className="font-bold text-foreground">7 × 3</span> (21)</p>
          </div>
        </div>
        
        {/* Start Practice Button */}
        <div className="mt-4 w-full flex justify-center">
          <Button size="lg" className="w-full max-w-sm text-base sm:text-lg h-12 sm:h-14 font-semibold" onClick={onStart}>
            Start Practice
          </Button>
        </div>
      </div>
    </div>
  );
}
