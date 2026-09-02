import React from "react";
import { RotateCw, ArrowLeftRight, Check } from "lucide-react";

interface ControlsProps {
  onRotate: () => void;
  onToggleDirection: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  direction?: "FORWARD" | "REVERSE";
}

export function PathFinderControls({
  onRotate,
  onToggleDirection,
  onSubmit,
  disabled = false,
  direction = "FORWARD",
}: ControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 select-none">
      {/* 1. Rotate Control */}
      <button
        type="button"
        onClick={onRotate}
        disabled={disabled}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#555555] hover:bg-[#444444] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        title="Rotate Selected Block (Clockwise)"
        aria-label="Rotate Selected Block"
      >
        <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
      </button>

      {/* 2. Change / Reverse Route Direction */}
      <button
        type="button"
        onClick={onToggleDirection}
        disabled={disabled}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#555555] hover:bg-[#444444] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
          direction === "REVERSE" ? "ring-2 ring-yellow-400" : ""
        }`}
        title={`Change Route Direction (Currently ${direction})`}
        aria-label="Change Route Direction"
      >
        <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
      </button>

      {/* 3. Submit / Check */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#555555] hover:bg-[#444444] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        title="Submit / Validate Route"
        aria-label="Submit Route"
      >
        <Check className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
      </button>
    </div>
  );
}
