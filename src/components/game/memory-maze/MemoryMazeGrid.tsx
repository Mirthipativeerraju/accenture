"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Position, Direction } from "@/lib/games/memory-maze/types";

interface MemoryMazeGridProps {
  playerPosition: Position;
  keyPosition?: Position;
  key1Position?: Position;
  key2Position?: Position;
  keys?: Position[];
  doorPosition: Position;
  keyCollected?: boolean;
  key1Collected?: boolean;
  key2Collected?: boolean;
  isDoorOpen?: boolean;
  doorPhase?: "entering" | "opened" | null;
  visitedCells?: Position[];
  collisionDirection: Direction | null;
  onMove: (direction: Direction) => void;
  disabled?: boolean;
  showArrows?: boolean;
  gridSize?: number;
}

export function MemoryMazeGrid({
  playerPosition,
  keyPosition,
  key1Position,
  key2Position,
  keys,
  doorPosition,
  keyCollected = false,
  key1Collected = false,
  key2Collected = false,
  isDoorOpen = false,
  doorPhase = null,
  visitedCells = [],
  collisionDirection,
  onMove,
  disabled = false,
  showArrows = false,
  gridSize = 3,
}: MemoryMazeGridProps) {
  const rows = [];

  const k1Pos = key1Position || keyPosition;
  const k2Pos = key2Position;
  const isK1Collected = key1Collected || keyCollected;
  const isK2Collected = key2Collected;
  const isAnyKeyCollected = isK1Collected || isK2Collected;

  for (let r = 0; r < gridSize; r++) {
    const cols = [];
    for (let c = 0; c < gridSize; c++) {
      const isPlayer = playerPosition.row === r && playerPosition.col === c;
      const isKey1 = !isK1Collected && k1Pos && k1Pos.row === r && k1Pos.col === c;
      const isKey2 = !isK2Collected && k2Pos && k2Pos.row === r && k2Pos.col === c;
      const isKey = (isKey1 || isKey2) && !isPlayer;
      const isDoor = doorPosition.row === r && doorPosition.col === c;
      const isVisited = visitedCells.some((p) => p.row === r && p.col === c);

      // Determine adjacency to player for whole-cell clicking
      let cellDirection: Direction | null = null;
      if (r === playerPosition.row - 1 && c === playerPosition.col) {
        cellDirection = "up";
      } else if (r === playerPosition.row + 1 && c === playerPosition.col) {
        cellDirection = "down";
      } else if (r === playerPosition.row && c === playerPosition.col - 1) {
        cellDirection = "left";
      } else if (r === playerPosition.row && c === playerPosition.col + 1) {
        cellDirection = "right";
      }
      const isAdjacent = cellDirection !== null;

      cols.push(
        <div
          key={`cell-${r}-${c}`}
          onClick={() => {
            if (!disabled && isAdjacent && cellDirection) {
              onMove(cellDirection);
            }
          }}
          className={cn(
            "relative flex aspect-square items-center justify-center select-none",
            "border-[1.5px] border-[#b8b8b8]",
            // Visited cells and player cell turn dark charcoal (#2c2c2c)
            (isPlayer || isVisited) && !isDoor ? "bg-[#2c2c2c]" : "bg-white",
            isPlayer && "z-10 rounded-[5px]",
            !disabled && isAdjacent && "cursor-pointer"
          )}
          data-row={r}
          data-col={c}
          aria-label={`Grid cell row ${r + 1}, column ${c + 1}`}
        >
          {/* Key rendering - Classic black key on white cell (before collection) */}
          {isKey && !isPlayer && (
            <div className="flex items-center justify-center p-1 sm:p-2 w-full h-full pointer-events-none">
              <svg
                viewBox="0 0 64 64"
                className={cn(
                  "fill-black",
                  gridSize === 4
                    ? "w-10 h-10 sm:w-12 sm:h-12"
                    : gridSize === 5
                    ? "w-8 h-8 sm:w-9 sm:h-9"
                    : gridSize === 6
                    ? "w-6 h-6 sm:w-7 sm:h-7"
                    : gridSize >= 7
                    ? "w-5 h-5 sm:w-6 sm:h-6"
                    : "w-14 h-14 sm:w-17 sm:h-17"
                )}
                aria-label="Key"
              >
                {/* Key Head with Hole & Shaft with Teeth */}
                <path
                  d="
    M 43 8
    C 34 8 27 15 27 24
    C 27 26.5 27.6 29 28.8 31.2

    L 13 47
    C 11 49 10 51 10 53
    L 10 57
    L 19 57
    L 19 53
    L 24 53
    L 24 49
    L 29 49
    L 29 46
    L 33 46
    L 38 42

    C 39.6 42.6 41.3 43 43 43
    C 52 43 59 36 59 25
    C 59 15.5 52 8 43 8
    Z

    M 43 19
    C 45.2 19 47 20.8 47 23
    C 47 25.2 45.2 27 43 27
    C 40.8 27 39 25.2 39 23
    C 39 20.8 40.8 19 43 19
    Z
  "
                  fill="black"
                />
              </svg>
            </div>
          )}

          {/* Door rendering - Black outlined arched door with knob or key-opening animation */}
          {isDoor && (
            <div className="relative flex items-end justify-center w-full h-full pb-0.5 sm:pb-1 pointer-events-none">
              <svg
                viewBox="0 0 64 74"
                className={cn(
                  "stroke-black fill-none",
                  gridSize === 4
                    ? "w-14 h-17 sm:w-16 sm:h-22 pb-0 sm:pb-0 translate-y-2"
                    : gridSize === 5
                    ? "w-11 h-13 sm:w-12 sm:h-15 pb-0.5 sm:pb-0 translate-y-2"
                    : gridSize === 6
                    ? "w-9 h-11 sm:w-10 sm:h-12 pb-0.5 sm:pb-0 translate-y-1.5"
                    : gridSize >= 7
                    ? "w-7 h-9 sm:w-8 sm:h-10 pb-0 sm:pb-0 translate-y-1"
                    : "w-20 h-24 sm:w-22 sm:h-26 pb-1 sm:pb-1.5 translate-y-2"
                )}
                aria-label="Door"
              >
                {/* Arched Top Door Frame */}
                <path
                  d="M 12,66 L 12,18
     Q 12,8 22,8
     L 42,8
     Q 52,8 52,18
     L 52,66"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Door Base Horizontal Line */}
                <line x1="9" y1="66" x2="55" y2="66" strokeWidth="3.5" strokeLinecap="round" />

                {isDoorOpen || doorPhase === "opened" ? (
                  <>
                    {/* Swung Open Door Inner Panel */}
                    <polygon
                      points="15,22 36,16 36,66 15,66"
                      fill="#e0e0e0"
                      stroke="black"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Key inside opened doorway */}
                    <g transform="translate(36, 36) scale(0.42) translate(-32, -32)">
                      <path
                        d="M 44,11 C 37.5,11 32.2,16.3 32.2,22.8 C 32.2,25.3 33,27.6 34.4,29.5 L 18,45.9 L 18,53 L 25.1,53 L 25.1,48.5 L 29.5,48.5 L 29.5,44 L 34,44 L 34,39.5 L 37.5,39.5 C 39.4,40.9 41.6,41.7 44,41.7 C 50.5,41.7 55.8,36.4 55.8,29.9 C 55.8,23.4 50.5,11 44,11 Z M 44,18 C 46.8,18 49,20.2 49,23 C 49,25.8 46.8,28 44,28 C 41.2,28 39,25.8 39,23 C 39,20.2 41.2,18 44,18 Z"
                        fill="black"
                        stroke="none"
                      />
                    </g>
                  </>
                ) : doorPhase === "entering" ? (
                  <>
                    {/* Key entering / positioned inside the doorway */}
                    <g transform="translate(32, 40) scale(0.38) translate(-32, -32)">
                      <path
                        d="M 44,11 C 37.5,11 32.2,16.3 32.2,22.8 C 32.2,25.3 33,27.6 34.4,29.5 L 18,45.9 L 18,53 L 25.1,53 L 25.1,48.5 L 29.5,48.5 L 29.5,44 L 34,44 L 34,39.5 L 37.5,39.5 C 39.4,40.9 41.6,41.7 44,41.7 C 50.5,41.7 55.8,36.4 55.8,29.9 C 55.8,23.4 50.5,11 44,11 Z M 44,18 C 46.8,18 49,20.2 49,23 C 49,25.8 46.8,28 44,28 C 41.2,28 39,25.8 39,23 C 39,20.2 41.2,18 44,18 Z"
                        fill="black"
                        stroke="none"
                      />
                    </g>
                  </>
                ) : (
                  /* Standard Closed Door Knob */
                  <circle cx="41" cy="40" r="3" fill="black" stroke="none" />
                )}
              </svg>
            </div>
          )}

          {/* Player rendering in current cell (unless in door opening sequence) */}
          {isPlayer && !isDoor && (
            <div className="relative flex items-center justify-center w-full h-full">
              {isAnyKeyCollected ? (
                /* Key-Collected Player Visual: Silhouette carrying the key */
                <svg
                  viewBox="0 0 40 40"
                  className={cn(
                    "fill-white pointer-events-none z-10",
                    gridSize === 4
                      ? "w-10 h-10 sm:w-12 sm:h-12"
                      : gridSize === 5
                      ? "w-8 h-8 sm:w-9 sm:h-9"
                      : gridSize === 6
                      ? "w-6 h-6 sm:w-7 sm:h-7"
                      : gridSize >= 7
                      ? "w-5 h-5 sm:w-6 sm:h-6"
                      : "w-14 h-14 sm:w-16 sm:h-16"
                  )}
                  aria-label="Player with Key"
                >
                  {/* Circular Head */}
                  <circle cx="15.5" cy="11.5" r="5.5" />
                  {/* Torso */}
                  <path d="M 5,34 C 5,24.5 10,20.5 15.5,20.5 C 21,20.5 26,24.5 26,34 Z" />
                  {/* Carried Key on the right side */}
                  <g transform="translate(29, 21) scale(0.26) translate(-32, -32)">
                    <path
                      d="M 44,11 C 37.5,11 32.2,16.3 32.2,22.8 C 32.2,25.3 33,27.6 34.4,29.5 L 18,45.9 L 18,53 L 25.1,53 L 25.1,48.5 L 29.5,48.5 L 29.5,44 L 34,44 L 34,39.5 L 37.5,39.5 C 39.4,40.9 41.6,41.7 44,41.7 C 50.5,41.7 55.8,36.4 55.8,29.9 C 55.8,23.4 50.5,11 44,11 Z M 44,18 C 46.8,18 49,20.2 49,23 C 49,25.8 46.8,28 44,28 C 41.2,28 39,25.8 39,23 C 39,20.2 41.2,18 44,18 Z"
                      fill="white"
                    />
                  </g>
                </svg>
              ) : (
                /* Normal Player Visual: White Person Silhouette */
                <svg
                  viewBox="0 0 40 40"
                  className={cn(
                    "fill-white pointer-events-none z-10",
                    gridSize === 4
                      ? "w-10 h-10 sm:w-12 sm:h-12"
                      : gridSize === 5
                      ? "w-8 h-8 sm:w-9 sm:h-9"
                      : gridSize === 6
                      ? "w-6 h-6 sm:w-7 sm:h-7"
                      : gridSize >= 7
                      ? "w-5 h-5 sm:w-6 sm:h-6"
                      : "w-14 h-14 sm:w-16 sm:h-16"
                  )}
                  aria-label="Player"
                >
                  {/* Circular Head */}
                  <circle cx="20" cy="11.5" r="6" />
                  {/* Torso */}
                  <path d="M 6,34 C 6,24 11,20 20,20 C 29,20 34,24 34,34 Z" />
                </svg>
              )}

              {/* Reference-style directional arrows */}
              {(!disabled || showArrows) && (
                <>
                  {/* UP */}
                  {r > 0 && (
                    <button
                      type="button"
                      aria-label="Move up"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) onMove("up");
                      }}
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 z-[5] focus:outline-none",
                        gridSize >= 6
                          ? "-top-[14px] w-[22px] h-[14px]"
                          : gridSize === 5
                          ? "-top-[18px] w-[30px] h-[18px]"
                          : "-top-[22px] w-[38px] h-[22px]",
                        disabled ? "cursor-default pointer-events-none" : "cursor-pointer"
                      )}
                    >
                      <svg
                        viewBox="0 0 38 22"
                        className="block w-full h-full"
                        aria-hidden="true"
                      >
                        <polygon
                          points="19,0 38,22 0,22"
                          fill="#c4c4c4"
                        />
                      </svg>
                    </button>
                  )}

                  {/* DOWN */}
                  {r < gridSize - 1 && (
                    <button
                      type="button"
                      aria-label="Move down"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) onMove("down");
                      }}
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 z-[5] focus:outline-none",
                        gridSize >= 6
                          ? "-bottom-[14px] w-[22px] h-[14px]"
                          : gridSize === 5
                          ? "-bottom-[18px] w-[30px] h-[18px]"
                          : "-bottom-[22px] w-[38px] h-[22px]",
                        disabled ? "cursor-default pointer-events-none" : "cursor-pointer"
                      )}
                    >
                      <svg
                        viewBox="0 0 38 22"
                        className="block w-full h-full"
                        aria-hidden="true"
                      >
                        <polygon
                          points="0,0 38,0 19,22"
                          fill="#c4c4c4"
                        />
                      </svg>
                    </button>
                  )}

                  {/* LEFT */}
                  {c > 0 && (
                    <button
                      type="button"
                      aria-label="Move left"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) onMove("left");
                      }}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 z-[5] focus:outline-none",
                        gridSize >= 6
                          ? "-left-[14px] w-[14px] h-[22px]"
                          : gridSize === 5
                          ? "-left-[18px] w-[18px] h-[30px]"
                          : "-left-[22px] w-[22px] h-[38px]",
                        disabled ? "cursor-default pointer-events-none" : "cursor-pointer"
                      )}
                    >
                      <svg
                        viewBox="0 0 22 38"
                        className="block w-full h-full"
                        aria-hidden="true"
                      >
                        <polygon
                          points="0,19 22,0 22,38"
                          fill="#c4c4c4"
                        />
                      </svg>
                    </button>
                  )}

                  {/* RIGHT */}
                  {c < gridSize - 1 && (
                    <button
                      type="button"
                      aria-label="Move right"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) onMove("right");
                      }}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 z-[5] focus:outline-none",
                        gridSize >= 6
                          ? "-right-[14px] w-[14px] h-[22px]"
                          : gridSize === 5
                          ? "-right-[18px] w-[18px] h-[30px]"
                          : "-right-[22px] w-[22px] h-[38px]",
                        disabled ? "cursor-default pointer-events-none" : "cursor-pointer"
                      )}
                    >
                      <svg
                        viewBox="0 0 22 38"
                        className="block w-full h-full"
                        aria-hidden="true"
                      >
                        <polygon
                          points="22,19 0,0 0,38"
                          fill="#c4c4c4"
                        />
                      </svg>
                    </button>
                  )}
                </>
              )}
              {/* Temporary bright red wall collision line on the exact blocked edge */}
             {/* Wall collision: red line + simple 6-point grey spark */}
{/* =========================================================
    WALL COLLISION EFFECT
    Red collision line + simple grey spark
    ========================================================= */}

{collisionDirection && (
  <>
    {/* RED COLLISION LINE */}
    <div
      className={cn(
        "absolute pointer-events-none z-40 bg-[#e60000]",

        /* TOP */
        collisionDirection === "up" &&
          "top-0 -translate-y-1/2 left-0 right-0 h-[8px]",

        /* BOTTOM */
        collisionDirection === "down" &&
          "bottom-0 translate-y-1/2 left-0 right-0 h-[8px]",

        /* LEFT */
        collisionDirection === "left" &&
          "left-0 -translate-x-1/2 top-0 bottom-0 w-[8px]",

        /* RIGHT */
        collisionDirection === "right" &&
          "right-0 translate-x-1/2 top-0 bottom-0 w-[8px]"
      )}
    />

    {/* SIMPLE GREY SPARK */}
    <span
      className={cn(
        "absolute pointer-events-none z-50",
        "text-[#e60000] text-[30px] leading-none font-bold",

        /* LEFT */
        collisionDirection === "left" &&
          "left-[-15px] top-1/2 -translate-y-1/2",

        /* RIGHT */
        collisionDirection === "right" &&
          "right-[-15px] top-1/2 -translate-y-1/2",

        /* TOP */
        collisionDirection === "up" &&
          "top-[-15px] left-1/2 -translate-x-1/2",

        /* BOTTOM */
        collisionDirection === "down" &&
          "bottom-[-15px] left-1/2 -translate-x-1/2"
      )}
      aria-hidden="true"
    >
      ✦
    </span>
  </>
)}
            </div>
          )}
        </div>
      );
    }
    rows.push(cols);
  }

  return (
    <div className="w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] bg-white border-[4px] border-[#b8b8b8] rounded-[5px] shadow-none select-none overflow-visible mx-auto">
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {rows.flat()}
      </div>
    </div>
  );
}



