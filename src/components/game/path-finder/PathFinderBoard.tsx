import React from "react";
import { ArrowDirection, PathFinderQuestion } from "@/lib/games/path-finder/types";
import { getRotatedCell, DIRECTION_ANGLES } from "@/lib/games/path-finder/validator";
import { PathFinderMarker, PathFinderMovingRocket } from "./PathFinderMarkers";

interface BoardProps {
  question: PathFinderQuestion;
  rotations: number[][];
  selectedBlock: { br: number; bc: number } | null;
  onSelectBlock: (br: number, bc: number) => void;
  highlightedPath?: { r: number; c: number }[];
  disabled?: boolean;
  direction?: "FORWARD" | "REVERSE";
  rocketState?: { x: number; y: number; angle: number } | null;
}

function ArrowIcon({ direction }: { direction: ArrowDirection }) {
  const angle = DIRECTION_ANGLES[direction] ?? 0;

  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-150"
      style={{ transform: `rotate(${angle}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </svg>
  );
}

export function PathFinderBoard({
  question,
  rotations,
  selectedBlock,
  onSelectBlock,
  highlightedPath = [],
  disabled = false,
  direction = "FORWARD",
  rocketState = null,
}: BoardProps) {
  const { blockGridSize, blockSize, totalGridSize, start, destination } = question;

  const highlightedSet = new Set(highlightedPath.map((p) => `${p.r},${p.c}`));

  return (
    <div className="relative flex items-center justify-center p-8 sm:p-10 select-none">
      {/* Outer Board Frame */}
      <div
        data-testid="path-finder-board"
        className="w-[310px] h-[310px] sm:w-[400px] sm:h-[400px] md:w-[440px] md:h-[440px] bg-white border-2 border-neutral-400 grid shadow-md relative overflow-visible"
      >
        {/* 1. Start Marker outside board */}
        {start.side === "LEFT" && (
          <div
            className="absolute -left-9 sm:-left-10 z-20 pointer-events-none"
            style={{
              top: `${((start.index + 0.5) / totalGridSize) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <PathFinderMarker endpoint={start} isStart={true} />
          </div>
        )}
        {start.side === "TOP" && (
          <div
            className="absolute -top-9 sm:-top-10 z-20 pointer-events-none"
            style={{
              left: `${((start.index + 0.5) / totalGridSize) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <PathFinderMarker endpoint={start} isStart={true} />
          </div>
        )}

        {/* 2. Destination Marker outside board */}
        {destination.side === "RIGHT" && (
          <div
            className="absolute -right-9 sm:-right-10 z-20 pointer-events-none"
            style={{
              top: `${((destination.index + 0.5) / totalGridSize) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <PathFinderMarker endpoint={destination} isStart={false} />
          </div>
        )}
        {destination.side === "BOTTOM" && (
          <div
            className="absolute -bottom-9 sm:-bottom-10 z-20 pointer-events-none"
            style={{
              left: `${((destination.index + 0.5) / totalGridSize) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <PathFinderMarker endpoint={destination} isStart={false} />
          </div>
        )}

        {/* 3. Moving Rocket Layer */}
        {rocketState && (
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: `${rocketState.x}%`,
              top: `${rocketState.y}%`,
              transform: "translate(-50%, -50%)",
              transition: "left 100ms linear, top 100ms linear",
            }}
          >
            <PathFinderMovingRocket angle={rocketState.angle} />
          </div>
        )}

        {/* Render block grid layout */}
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${blockGridSize}, 1fr)`,
            gridTemplateRows: `repeat(${blockGridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: blockGridSize }).map((_, br) =>
            Array.from({ length: blockGridSize }).map((_, bc) => {
              const isSelected = selectedBlock?.br === br && selectedBlock?.bc === bc;
              const blockRot = rotations?.[br]?.[bc] ?? 0;
              const block = question.blocks[br][bc];

              return (
                <div
                  key={`block-${br}-${bc}`}
                  data-testid={`block-${br}-${bc}`}
                  onClick={() => !disabled && onSelectBlock(br, bc)}
                  className={`relative grid cursor-pointer transition-all duration-150 ${
                    isSelected ? "ring-2 ring-yellow-400 z-10" : "border border-neutral-300"
                  }`}
                  style={{
                    gridTemplateColumns: `repeat(${blockSize}, 1fr)`,
                    gridTemplateRows: `repeat(${blockSize}, 1fr)`,
                  }}
                >
                  {Array.from({ length: blockSize }).map((_, lr) =>
                    Array.from({ length: blockSize }).map((_, lc) => {
                      const gr = br * blockSize + lr;
                      const gc = bc * blockSize + lc;
                      const isPathHighlighted = highlightedSet.has(`${gr},${gc}`);

                      // Compute canonical rotated cell using shared helper
                      const rotatedCell = getRotatedCell(block, lr, lc, blockRot);
                      const isActive = rotatedCell.active;
                      const dir = rotatedCell.direction;

                      return (
                        <div
                          key={`cell-${gr}-${gc}`}
                          data-testid={`cell-${gr}-${gc}`}
                          data-cell-row={gr}
                          data-cell-col={gc}
                          className={`flex items-center justify-center border border-slate-200 transition-colors duration-150 relative ${
                            isActive
                              ? isPathHighlighted
                                ? "bg-emerald-600 text-white shadow-inner"
                                : "bg-[#757575] text-white"
                              : "bg-white"
                          }`}
                        >
                          {isActive && dir && (
                            <div className="flex items-center justify-center transition-transform duration-150">
                              <ArrowIcon direction={dir} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
