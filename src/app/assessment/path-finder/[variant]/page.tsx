"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PathFinderGame } from "@/components/game/path-finder/PathFinderGame";

export default function PathFinderVariantAssessmentPage() {
  const params = useParams();
  const rawVariant = typeof params?.variant === "string" ? params.variant : "";

  if (rawVariant === "practice-1" || rawVariant === "practice-2") {
    return <PathFinderGame variant={rawVariant} />;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground">
      {/* Empty placeholder for unrequested tests */}
    </div>
  );
}
