"use client";

import React from "react";
import { TileDefinition, TileState } from "@/lib/games/path-finder/types";
import { getEffectiveTileCells } from "@/lib/games/path-finder/transformations";
import { PathFinderCell } from "./PathFinderCell";

interface PathFinderTileProps {
  tile: TileDefinition;
  state: TileState;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function PathFinderTile({
  tile,
  state,
  isSelected,
  onSelect,
}: PathFinderTileProps) {
  const transformedCells = getEffectiveTileCells(tile, state);

  return (
    <div
      onClick={() => onSelect(tile.id)}
      role="button"
      tabIndex={0}
      aria-label={`Tile ${tile.id}${isSelected ? " selected" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(tile.id);
        }
      }}
      className={`relative w-full h-full aspect-square grid grid-cols-3 grid-rows-3 cursor-pointer select-none transition-all duration-75 border border-[#9ca3af] ${
        isSelected
          ? "ring-2 ring-yellow-400 border border-yellow-400 z-20"
          : "hover:bg-slate-50/50"
      }`}
    >
      {transformedCells.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <PathFinderCell
            key={`${tile.id}-${rIdx}-${cIdx}`}
            cell={cell}
            isTileSelected={isSelected}
          />
        ))
      )}
    </div>
  );
}
