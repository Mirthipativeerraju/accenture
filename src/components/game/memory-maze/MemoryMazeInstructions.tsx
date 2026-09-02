"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemoryMazeGrid } from "./MemoryMazeGrid";

interface MemoryMazeInstructionsProps {
  onStart: () => void;
}

export function MemoryMazeInstructions({ onStart }: MemoryMazeInstructionsProps) {
  // Simple example path
  const examplePath = [
    { r: 0, c: 0, id: "r0c0" },
    { r: 0, c: 1, id: "r0c1" },
    { r: 1, c: 1, id: "r1c1" },
    { r: 2, c: 1, id: "r2c1" }
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <Card className="w-full max-w-2xl border-none shadow-none bg-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold tracking-tight">Memory Maze</CardTitle>
          <p className="mt-4 text-lg text-muted-foreground">
            Memorize the highlighted path, then recall it by selecting the cells in the exact same order.
          </p>
        </CardHeader>
        
        <CardContent className="mt-8 flex flex-col items-center space-y-8">
          <div className="w-full max-w-[280px]">
            <MemoryMazeGrid 
              gridSize={3}
              correctPath={examplePath}
              selectedIds={[]}
              disabled={true}
              onCellClick={() => {}}
            />
          </div>
          <div className="text-center text-sm text-muted-foreground max-w-md">
            <p>1. Memorize Phase: The correct path is shown.</p>
            <p className="mt-2">2. Recall Phase: The path is hidden. Select the cells in order.</p>
          </div>
        </CardContent>
        
        <CardFooter className="mt-8 flex justify-center">
          <Button size="lg" className="w-full max-w-sm text-lg h-14" onClick={onStart}>
            Start Practice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
