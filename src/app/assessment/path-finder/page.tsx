"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PathFinderGame } from "@/components/game/path-finder/PathFinderGame";
import { useGameSessionStore } from "@/lib/store/game-session";
import { registerPathFinder } from "@/lib/games/path-finder";

export default function PathFinderAssessmentPage() {
  const router = useRouter();
  const currentSession = useGameSessionStore((state) => state.currentSession);

  useEffect(() => {
    registerPathFinder();
    if (!currentSession) {
      router.replace("/practice/path-finder");
    }
  }, [currentSession, router]);

  if (!currentSession) {
    return null;
  }

  return (
    <div className="w-full flex justify-center h-full items-center min-h-[calc(100vh-200px)]">
      <PathFinderGame />
    </div>
  );
}
