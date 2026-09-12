"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const PATH_FINDER_VARIANTS = [
  { id: "practice-1", label: "Practice Test 1" },
  { id: "practice-2", label: "Practice Test 2" },
  { id: "practice-3", label: "Practice Test 3" },
  { id: "full-mock-test", label: "Full Mock Test" },
];

export default function PathFinderPracticeSetup() {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const handleLaunch = () => {
    if (!selectedVariant) return;
    router.push(`/assessment/path-finder/${selectedVariant}`);
  };

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Path Finder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Select a practice configuration below.
          </p>
          
          <div className="grid gap-3">
            {PATH_FINDER_VARIANTS.map((variant) => (
              <Button 
                key={variant.id}
                variant={selectedVariant === variant.id ? "default" : "outline"}
                className="justify-start h-auto py-4 px-6 flex-col items-start gap-1"
                onClick={() => setSelectedVariant(variant.id)}
              >
                <div className="font-bold text-lg">{variant.label}</div>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            size="lg" 
            className="w-full h-14 text-lg" 
            onClick={handleLaunch} 
            disabled={!selectedVariant}
          >
            Launch Practice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
