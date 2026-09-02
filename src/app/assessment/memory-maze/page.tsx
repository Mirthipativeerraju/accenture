"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MemoryMazeGame } from "@/components/game/memory-maze/MemoryMazeGame";
import { useGameSessionStore } from "@/lib/store/game-session";
import { registerMemoryMaze } from "@/lib/games/memory-maze";

export default function MemoryMazeAssessmentPage() {
  const router = useRouter();
  const currentSession = useGameSessionStore(state => state.currentSession);

  useEffect(() => {
    registerMemoryMaze();
    if (!currentSession) {
      router.replace("/practice/memory-maze");
    }
  }, [currentSession, router]);

  if (!currentSession) {
    return null;
  }

  return (
    <div className="w-full flex justify-center h-full items-center min-h-[calc(100vh-200px)]">
      <MemoryMazeGame />
    </div>
  );
}
