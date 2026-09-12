"use client";

import React from "react";
import { RotateCw, ArrowLeftRight, Check } from "lucide-react";

interface PathFinderControlsProps {
  onRotate: () => void;
  onChangeDirection: () => void;
  onCheck: () => void;
  hasSelection: boolean;
  disabled?: boolean;
}

export function PathFinderControls({
  onRotate,
  onChangeDirection,
  onCheck,
  hasSelection,
  disabled = false,
}: PathFinderControlsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* 1. ROTATE BUTTON */}
      <button
        type="button"
        onClick={onRotate}
        disabled={!hasSelection || disabled}
        aria-label="Rotate block clockwise"
        className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
          hasSelection && !disabled
            ? "bg-[#333333] hover:bg-[#222222] active:scale-95 text-white cursor-pointer"
            : "bg-[#333333]/50 text-white/40 cursor-not-allowed"
        }`}
      >
        <RotateCw className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* 2. CHANGE ROUTE DIRECTION BUTTON */}
      <button
        type="button"
        onClick={onChangeDirection}
        disabled={!hasSelection || disabled}
        aria-label="Change route direction"
        className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
          hasSelection && !disabled
            ? "bg-[#333333] hover:bg-[#222222] active:scale-95 text-white cursor-pointer"
            : "bg-[#333333]/50 text-white/40 cursor-not-allowed"
        }`}
      >
        <ArrowLeftRight className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* 3. CHECK BUTTON */}
      <button
        type="button"
        onClick={onCheck}
        disabled={disabled}
        aria-label="Submit path"
        className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
          !disabled
            ? "bg-[#333333] hover:bg-[#222222] active:scale-95 text-white cursor-pointer"
            : "bg-[#333333]/50 text-white/40 cursor-not-allowed"
        }`}
      >
        <Check className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
