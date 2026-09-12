"use client";

import React from "react";
import { PuzzleDefinition, TileState } from "@/lib/games/path-finder/types";
import { PathFinderTile } from "./PathFinderTile";

interface PathFinderBoardProps {
  puzzle: PuzzleDefinition;
  tileStates: Record<string, TileState>;
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;
  animatingRocket?: { x: number; y: number; angle: number } | null;
}

export function PathFinderBoard({
  puzzle,
  tileStates,
  selectedTileId,
  onSelectTile,
  animatingRocket,
}: PathFinderBoardProps) {
  // Start and Destination row calculations for vertical positioning
  const startRowRatio = (puzzle.startPos.row + 0.5) / puzzle.gridRows;
  const destRowRatio = (puzzle.destinationPos.row + 0.5) / puzzle.gridRows;

  return (
    <div className="relative flex items-center justify-center py-2 px-10">
      {/* START ICON on the LEFT */}
      <div
        className="absolute left-0 -translate-y-1/2 flex items-center pr-1 pointer-events-none z-10"
        style={{ top: `${startRowRatio * 100}%` }}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-7 h-7 sm:w-8 sm:h-8 text-slate-800 dark:text-slate-200 fill-current"
          aria-label="Start position"
        >
          <path d="M4 14 L18 14 L28 20 L18 26 L4 26 L8 20 Z" />
          <circle cx="14" cy="20" r="3" className="fill-white" />
          <line x1="2" y1="20" x2="6" y2="20" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      {/* DESTINATION ICON on the RIGHT */}
      <div
        className="absolute right-0 -translate-y-1/2 flex items-center pl-1 pointer-events-none z-10"
        style={{ top: `${destRowRatio * 100}%` }}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-7 h-7 sm:w-8 sm:h-8 text-slate-800 dark:text-slate-200 fill-current"
          aria-label="Destination position"
        >
          <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="20" cy="20" r="7" />
          <circle cx="16" cy="16" r="2.5" className="fill-white" />
        </svg>
      </div>

      {/* 9x9 PUZZLE BOARD CONTAINER (3x3 grid of 3x3 tiles, total 378px x 378px) */}
      <div className="relative w-[378px] h-[378px] grid grid-cols-3 grid-rows-3 border-[3px] border-[#9ca3af] bg-white dark:bg-slate-900 shadow-sm select-none">
        {puzzle.tiles.map((tile) => {
          const isSelected = selectedTileId === tile.id;
          const state = tileStates[tile.id] || { rotation: 0, directionReversed: false };

          return (
            <PathFinderTile
              key={tile.id}
              tile={tile}
              state={state}
              isSelected={isSelected}
              onSelect={onSelectTile}
            />
          );
        })}

        {/* ROCKET ANIMATION OVERLAY */}
        {animatingRocket && (
          <div
            className="absolute pointer-events-none z-30 transition-all duration-100 ease-linear flex items-center justify-center w-8 h-8"
            style={{
              left: `${animatingRocket.x}px`,
              top: `${animatingRocket.y}px`,
              transform: `translate(-50%, -50%) rotate(${animatingRocket.angle}deg)`,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-amber-500 fill-current drop-shadow-md"
            >
              <path d="M12 2.5s3 3.5 3 7.5c0 2-.5 4-1.5 5.5l1.5 3.5-3-1.5-3 1.5 1.5-3.5C9.5 14 9 12 9 10c0-4 3-7.5 3-7.5z" />
              <circle cx="12" cy="8" r="1.5" className="fill-white" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
