"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MathBubbleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expression: string;
  selected: boolean;
  selectionOrder?: number;
  /** When set during the feedback window, overrides the selected appearance */
  feedbackType?: "correct" | "incorrect";
}

export function MathBubble({
  expression,
  selected,
  selectionOrder,
  feedbackType,
  className,
  ...props
}: MathBubbleProps) {
  // Determine the bubble's visual state in priority order:
  // 1. Feedback (correct/incorrect) overrides selected styling
  // 2. Selected
  // 3. Default unselected
  const bubbleStyles = feedbackType
    ? feedbackType === "correct"
      ? "bg-white text-black border-[3px] border-green-500 scale-100 shadow-lg"
      : "bg-white text-black border-[3px] border-red-500 scale-100 shadow-lg"
    : selected
    ? "bg-black text-white border-2 border-black scale-95 shadow-inner"
    : "bg-white text-black border border-slate-300 shadow-sm hover:border-slate-400 hover:shadow-md";

  // Badge: during feedback, use black bg + white text to match reference
  const badgeStyles = feedbackType
    ? "bg-black text-white border border-black"
    : "bg-white text-black border border-black";

  return (
    <button
      className={cn(
        "relative flex aspect-square w-24 h-24 sm:w-28 sm:h-28 flex-col items-center justify-center rounded-full text-lg sm:text-xl font-bold transition-all duration-300 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        bubbleStyles,
        props.disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      aria-pressed={selected}
      {...props}
    >
      <span>{expression}</span>

      {/* Selection order badge — visible when selected OR during feedback */}
      {(selected || feedbackType) && selectionOrder !== undefined && (
        <div
          className={cn(
            "absolute -top-1 -right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs sm:text-sm font-bold shadow-sm",
            badgeStyles
          )}
          aria-hidden="true"
        >
          {selectionOrder}
        </div>
      )}
    </button>
  );
}
