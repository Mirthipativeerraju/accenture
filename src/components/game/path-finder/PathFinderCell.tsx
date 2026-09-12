"use client";

import React from "react";
import { RouteCell } from "@/lib/games/path-finder/types";
import { DIRECTION_ANGLE } from "@/lib/games/path-finder/transformations";

interface PathFinderCellProps {
  cell: RouteCell;
  isTileSelected?: boolean;
}

export function PathFinderCell({ cell, isTileSelected = false }: PathFinderCellProps) {
  const angle = cell.arrowDirection ? DIRECTION_ANGLE[cell.arrowDirection] : 0;

  return (
    <div
      className={`w-[42px] h-[42px] border border-[#e5e7eb] dark:border-slate-800 flex items-center justify-center select-none transition-all duration-75 ${
        cell.active
          ? isTileSelected
            ? "bg-[#757575] text-white ring-2 ring-yellow-400 z-10 shadow-sm"
            : "bg-[#757575] text-white"
          : "bg-white dark:bg-slate-900"
      }`}
    >
      {cell.active && cell.arrowDirection && (
        <svg
          viewBox="0 0 24 24"
          className="w-[22px] h-[22px] stroke-white fill-none"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <path
            d="M5 12h11M13 7l5 5-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}


