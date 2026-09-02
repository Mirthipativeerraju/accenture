import React from "react";
import { Endpoint } from "@/lib/games/path-finder/types";

interface MarkerProps {
  endpoint: Endpoint;
  isStart: boolean;
}

export function PathFinderMarker({ endpoint, isStart }: MarkerProps) {
  if (isStart) {
    // Space shuttle silhouette pointing into the board
    let rotation = "rotate-90"; // points right into board if on LEFT
    if (endpoint.side === "TOP") rotation = "rotate-180";
    else if (endpoint.side === "RIGHT") rotation = "-rotate-90";
    else if (endpoint.side === "BOTTOM") rotation = "rotate-0";

    return (
      <div className={`flex items-center justify-center ${rotation} select-none`} title="Start (Space Shuttle)">
        <svg
          viewBox="0 0 28 28"
          className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm text-neutral-900"
          fill="currentColor"
          aria-label="Start Shuttle"
        >
          {/* Space Shuttle Orbiter silhouette */}
          <path d="M14 2 C13 5, 11 8, 11 15 L7 19 L7 22 L11 20.5 L11 24 L12.5 25.5 L14 24.5 L15.5 25.5 L17 24 L17 20.5 L21 22 L21 19 L17 15 C17 8, 15 5, 14 2 Z" />
          {/* Cockpit window line */}
          <ellipse cx="14" cy="8.5" rx="1.8" ry="1" fill="#ffffff" />
          {/* Wing payload detail lines */}
          <path d="M13 14 L13 19 M15 14 L15 19" stroke="#ffffff" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  // Moon / Destination silhouette with authentic crater markings
  return (
    <div className="flex items-center justify-center select-none" title="Destination (Moon)">
      <svg
        viewBox="0 0 28 28"
        className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm text-neutral-900"
        fill="none"
        aria-label="Destination Moon"
      >
        {/* Dark moon sphere */}
        <circle cx="14" cy="14" r="11" fill="currentColor" />
        {/* Moon Craters */}
        <circle cx="10" cy="11" r="2.6" fill="#ffffff" opacity="0.9" />
        <circle cx="17.5" cy="9.5" r="1.6" fill="#ffffff" opacity="0.85" />
        <circle cx="16" cy="17" r="2.8" fill="#ffffff" opacity="0.9" />
        <circle cx="10.5" cy="18" r="1.4" fill="#ffffff" opacity="0.75" />
      </svg>
    </div>
  );
}

export function PathFinderMovingRocket({ angle }: { angle: number }) {
  // Base SVG has nose pointing UP (-90 deg in Cartesian).
  // To orient with vector angle (where 0 deg = RIGHT), rotate by (angle + 90).
  const rotationDeg = angle + 90;

  return (
    <div
      data-testid="path-finder-rocket"
      className="flex items-center justify-center select-none pointer-events-none drop-shadow-md z-30"
      style={{
        transform: `rotate(${rotationDeg}deg)`,
        transition: "transform 100ms linear",
      }}
    >
      <svg
        viewBox="0 0 28 28"
        className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-900 drop-shadow"
        fill="currentColor"
        aria-label="Moving Shuttle"
      >
        <path d="M14 2 C13 5, 11 8, 11 15 L7 19 L7 22 L11 20.5 L11 24 L12.5 25.5 L14 24.5 L15.5 25.5 L17 24 L17 20.5 L21 22 L21 19 L17 15 C17 8, 15 5, 14 2 Z" />
        <ellipse cx="14" cy="8.5" rx="1.8" ry="1" fill="#ffffff" />
        <path d="M13 14 L13 19 M15 14 L15 19" stroke="#ffffff" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
