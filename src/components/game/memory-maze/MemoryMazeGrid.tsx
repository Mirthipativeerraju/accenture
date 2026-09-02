"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CellCoordinate } from "@/lib/games/memory-maze/types";

interface MemoryMazeGridProps {
  gridSize: number;
  correctPath?: CellCoordinate[]; // Passed during memorization phase
  selectedIds: string[];
  disabled: boolean;
  onCellClick: (id: string) => void;
}

export function MemoryMazeGrid({
  gridSize,
  correctPath,
  selectedIds,
  disabled,
  onCellClick
}: MemoryMazeGridProps) {
  
  const cells = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const id = `r${r}c${c}`;
      
      const isCorrectPath = correctPath && correctPath.some(cell => cell.id === id);
      const selectedIndex = selectedIds.indexOf(id);
      const isSelected = selectedIndex !== -1;
      
      cells.push(
        <button
          key={id}
          className={cn(
            "relative flex aspect-square w-full items-center justify-center rounded-lg border-2 text-xl font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50",
            disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-muted",
            isCorrectPath ? "border-primary bg-primary/20 text-primary" : "border-border bg-card",
            isSelected && !isCorrectPath ? "border-primary bg-primary text-primary-foreground shadow-inner scale-95" : ""
          )}
          onClick={() => {
            if (!disabled) {
              onCellClick(id);
            }
          }}
          disabled={disabled}
          aria-label={`Row ${r + 1} Column ${c + 1}`}
          aria-pressed={isSelected}
        >
          {isSelected && (
            <span>{selectedIndex + 1}</span>
          )}
        </button>
      );
    }
  }

  return (
    <div 
      className="grid w-full max-w-[400px] gap-2 p-4 mx-auto"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
      }}
    >
      {cells}
    </div>
  );
}
