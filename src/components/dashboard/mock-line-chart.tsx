import type { ChartPoint } from "@/types/dashboard";

interface MockLineChartProps {
  points: ChartPoint[];
  height?: number;
}

export function MockLineChart({ points, height = 140 }: MockLineChartProps) {
  if (points.length === 0) return null;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 100;
  const padding = 4;

  const coords = points.map((point, i) => {
    const x = padding + (i / (points.length - 1 || 1)) * (width - padding * 2);
    const y =
      height - padding - ((point.value - min) / range) * (height - padding * 2);
    return { x, y, label: point.label };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${coords[coords.length - 1]?.x ?? 0} ${height} L ${coords[0]?.x ?? 0} ${height} Z`;

  return (
    <div className="flex flex-1 flex-col">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full flex-1"
        preserveAspectRatio="none"
        role="img"
        aria-label="Trend chart"
      >
        <path d={areaPath} fill="hsl(var(--primary) / 0.08)" />
        <path
          d={linePath}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {coords.map((c) => (
          <circle
            key={c.label}
            cx={c.x}
            cy={c.y}
            r="1.5"
            fill="hsl(var(--warm-brown))"
          />
        ))}
      </svg>
      <div className="mt-2 flex justify-between">
        {points.map((p) => (
          <span
            key={p.label}
            className="font-sans text-[10px] tracking-wide text-[#888888]"
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
