"use client";

/** Deterministic mini sparkline from metric id (tooltip preview stub) */
export function SparklineStub({ metricId }: { metricId: string }) {
  const seed = metricId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const points = Array.from({ length: 12 }, (_, i) => {
    const v = 50 + Math.sin((i + seed) * 0.7) * 20 + (i % 3) * 5;
    return v;
  });
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg
      width={w}
      height={h}
      className="mt-3 w-full opacity-100"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        points={coords.join(" ")}
      />
    </svg>
  );
}
