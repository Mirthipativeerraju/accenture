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
    <div className="flex w-full flex-col items-center justify-center py-8">
      <Card className="w-full max-w-2xl border-none shadow-none bg-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold tracking-tight">Bubble Math</CardTitle>
          <p className="mt-4 text-lg text-muted-foreground">
            Calculate the expressions and select the bubbles in ascending order (lowest to highest).
          </p>
        </CardHeader>
        
        <CardContent className="mt-8 flex flex-col items-center space-y-12">
          <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
            <MathBubble expression="8 + 4" selected={false} />
            <MathBubble expression="20 - 5" selected={false} />
            <MathBubble expression="7 × 3" selected={false} />
          </div>
          
          <div className="text-center">
            <h3 className="mb-4 text-xl font-semibold">Correct Order:</h3>
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <p>1. <span className="font-bold text-foreground">8 + 4</span> (12)</p>
              <p>2. <span className="font-bold text-foreground">20 - 5</span> (15)</p>
              <p>3. <span className="font-bold text-foreground">7 × 3</span> (21)</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="mt-12 flex justify-center">
          <Button size="lg" className="w-full max-w-sm text-lg h-14" onClick={onStart}>
            Start Practice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
