"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PathFinderGame } from "@/components/game/path-finder/PathFinderGame";

export default function PathFinderVariantAssessmentPage() {
  const params = useParams();
  const rawVariant = typeof params?.variant === "string" ? params.variant : "practice-1";

  return <PathFinderGame variant={rawVariant || "practice-1"} />;
}
