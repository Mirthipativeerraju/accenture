"use client";

import React, { useEffect } from "react";

interface PathFinderTimerProps {
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds (240)
  onTimeout: () => void;
  isRunning: boolean;
}

export function PathFinderTimer({
  timeRemaining,
  totalTime,
  onTimeout,
  isRunning,
}: PathFinderTimerProps) {
  useEffect(() => {
    if (!isRunning) return;
    if (timeRemaining <= 0) {
      onTimeout();
    }
  }, [timeRemaining, isRunning, onTimeout]);

  const minutes = Math.floor(Math.max(0, timeRemaining) / 60);
  const seconds = Math.max(0, timeRemaining) % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const size = 56;
  const strokeWidth = 4;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, timeRemaining / totalTime));
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center w-14 h-14 select-none">
      <svg className="w-14 h-14 -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#e5e7eb] dark:stroke-slate-700"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#333333] dark:stroke-slate-200 transition-all duration-300 ease-linear"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="absolute text-xs font-semibold tracking-tight text-[#333333] dark:text-slate-200">
        {formattedTime}
      </div>
    </div>
  );
}
