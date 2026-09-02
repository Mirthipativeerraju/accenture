"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BubbleMathDefaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/practice/bubble-math");
  }, [router]);

  return null;
}
