"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PathFinderDefaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/practice/path-finder");
  }, [router]);

  return null;
}
