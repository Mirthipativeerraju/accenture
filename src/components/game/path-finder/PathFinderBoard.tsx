"use client";

import React from "react";
import {
  PuzzleDefinition,
  TileState,
} from "@/lib/games/path-finder/types";
import { PathFinderTile } from "./PathFinderTile";

interface PathFinderBoardProps {
  puzzle: PuzzleDefinition;
  tileStates: Record<string, TileState>;
  selectedTileId: string | null;
  onSelectTile: (tileId: string) => void;

  animatingRocket?: {
    x: number;
    y: number;
    angle: number;
  } | null;
}

export function PathFinderBoard({
  puzzle,
  tileStates,
  selectedTileId,
  onSelectTile,
  animatingRocket,
}: PathFinderBoardProps) {
  const startRowRatio =
    (puzzle.startPos.row + 0.5) /
    puzzle.gridRows;

  const destRowRatio =
    (puzzle.destinationPos.row + 0.5) /
    puzzle.gridRows;

  return (
    <div className="relative flex items-center justify-center py-2 px-10">

      {/* =========================================================
          DESTINATION
          ========================================================= */}

      <div
        className="
          absolute
          right-0
          -translate-y-1/2
          flex
          items-center
          pl-1
          pointer-events-none
          z-10
        "
        style={{
          top: `${destRowRatio * 100}%`,
        }}
      >
        <svg
          viewBox="0 0 40 40"
          className="
            w-7 h-7
            sm:w-8 sm:h-8
            text-slate-800
            dark:text-slate-200
            fill-current
          "
          aria-label="Destination position"
        >
          <circle
            cx="20"
            cy="20"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />

          <circle
            cx="20"
            cy="20"
            r="7"
          />

          <circle
            cx="16"
            cy="16"
            r="2.5"
            className="fill-white"
          />
        </svg>
      </div>

      {/* =========================================================
          BOARD
          ========================================================= */}

      <div
        className="
          relative
          w-[378px]
          h-[378px]
          grid
          grid-cols-3
          grid-rows-3
          border-[3px]
          border-[#9ca3af]
          bg-white
          dark:bg-slate-900
          shadow-sm
          select-none
        "
      >

        {/* =======================================================
            NORMAL STARTING ROCKET
            ======================================================= */}

        {!animatingRocket && (
          <div
            className="
              absolute
              -left-10
              -translate-y-1/2
              flex
              items-center
              pointer-events-none
              z-10
            "
            style={{
              top: `${startRowRatio * 100}%`,
            }}
          >
            <StartingRocket />
          </div>
        )}

        {/* =======================================================
            PUZZLE TILES
            ======================================================= */}

        {puzzle.tiles.map(
          (tile) => {
            const isSelected =
              selectedTileId ===
              tile.id;

            const state =
              tileStates[
                tile.id
              ] || {
                rotation: 0,
                directionReversed:
                  false,
              };

            return (
              <PathFinderTile
                key={tile.id}
                tile={tile}
                state={state}
                isSelected={
                  isSelected
                }
                onSelect={
                  onSelectTile
                }
              />
            );
          }
        )}

        {/* =======================================================
            ANIMATED STARTING ROCKET
            ======================================================= */}
        
        {animatingRocket && (
          <div
            className="
              absolute
              pointer-events-none
              z-30
              flex
              items-center
              justify-center
            "
            style={{
              left: `${animatingRocket.x}px`,
              top: `${animatingRocket.y}px`,
              width: "40px",
              height: "40px",

              transform: `
                translate(-50%, -50%)
                rotate(${animatingRocket.angle}deg)
              `,

              transformOrigin:
                "center center",
            }}
          >
            <StartingRocket />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STARTING ROCKET
// ============================================================================

function StartingRocket() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1100 1014"
      className="w-9 h-9 sm:w-10 sm:h-10"
      aria-label="Start position"
    >

      {/* Main rocket body */}

      <path
        d="
          M 0 311
          C 85 315, 190 327, 343 350
          C 405 359, 510 368, 620 382
          C 735 397, 825 412, 856 442
          C 874 459, 883 477, 883 493
          C 883 510, 874 528, 856 545
          C 825 575, 735 590, 620 605
          C 510 619, 405 629, 343 638
          C 300 645, 270 667, 238 700
          L 130 816
          C 112 835, 90 846, 66 846
          L 0 846
          Z
        "
        fill="#000000"
      />

      {/* Upper wing */}

      <path
        d="
          M 0 113
          L 68 113
          C 91 113, 111 123, 128 140
          L 348 347
          C 330 347, 313 344, 295 340
          L 0 310
          Z
        "
        fill="#000000"
      />

      {/* Lower wing */}

      <path
        d="
          M 0 846
          L 68 846
          C 91 846, 111 836, 128 819
          L 348 638
          C 330 638, 313 641, 295 645
          L 0 675
          Z
        "
        fill="#000000"
      />

      {/* Upper white cutout */}

      <path
        d="
          M 10 159
          L 32 159
          L 32 310
          L 10 307
          Z
        "
        fill="#ffffff"
      />

      <path
        d="
          M 48 159
          L 65 159
          C 78 159, 91 165, 101 175
          L 186 302
          C 194 314, 186 331, 171 331
          C 130 328, 91 322, 48 316
          Z
        "
        fill="#ffffff"
      />

      {/* Lower white cutout */}

      <path
        d="
          M 10 671
          L 32 674
          L 32 822
          L 10 822
          Z
        "
        fill="#ffffff"
      />

      <path
        d="
          M 48 669
          C 91 663, 130 657, 171 650
          C 186 648, 194 665, 186 677
          L 101 802
          C 91 812, 78 818, 65 818
          L 48 818
          Z
        "
        fill="#ffffff"
      />

      {/* Central stripe */}

      <path
        d="
          M 40 483
          L 552 483
          L 552 506
          L 40 506
          Z
        "
        fill="#ffffff"
      />

      {/* Cockpit */}

      <path
        d="
          M 617 439
          C 604 439, 594 447, 592 462
          L 592 516
          C 594 531, 604 545, 617 545
          L 720 533
          C 733 531, 742 522, 742 509
          L 742 475
          C 742 462, 733 453, 720 451
          Z
        "
        fill="#ffffff"
      />

      {/* Rear cutout */}

      <path
        d="
          M 0 402
          C 17 402, 28 412, 28 428
          L 28 571
          C 28 587, 17 597, 0 597
          Z
        "
        fill="#ffffff"
      />
    </svg>
  );
}