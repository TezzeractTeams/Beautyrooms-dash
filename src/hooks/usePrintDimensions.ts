"use client";

import { useEffect, useState } from "react";

/**
 * Returns fixed pixel dimensions when the page is being printed so that
 * Recharts' ResponsiveContainer gets measurable values instead of the -1
 * it gets when ResizeObserver fails to fire in print layout.
 */
export function usePrintDimensions(
  printWidth = 680,
  printHeight = 240,
): { width: number | "100%"; height: number | "100%" } {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("print");

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsPrinting(e.matches);
    };

    // Check state immediately (handles the case where component mounts during print)
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isPrinting) {
    return { width: printWidth, height: printHeight };
  }
  return { width: "100%", height: "100%" };
}
