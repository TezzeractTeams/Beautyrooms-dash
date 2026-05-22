interface DonutStatProps {
  value: number;
  percentage: number;
  label: string;
  size?: number;
}

const VIEWBOX = 100;
const RADIUS = 42;
const STROKE = 7;
const NORMALIZED_RADIUS = RADIUS - STROKE / 2;
const CIRCUMFERENCE = 2 * Math.PI * NORMALIZED_RADIUS;

export function DonutStat({
  value,
  percentage,
  label,
  size = 112,
}: DonutStatProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const filled = (clamped / 100) * CIRCUMFERENCE;
  const gap = CIRCUMFERENCE - filled;

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`${label}: ${value}, ${clamped}% of funnel`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          className="block"
        >
          {/* Track */}
          <circle
            cx={VIEWBOX / 2}
            cy={VIEWBOX / 2}
            r={NORMALIZED_RADIUS}
            fill="hsl(var(--background))"
            stroke="hsl(var(--border))"
            strokeWidth={STROKE}
          />
          {/* Progress — starts at 12 o'clock */}
          <circle
            cx={VIEWBOX / 2}
            cy={VIEWBOX / 2}
            r={NORMALIZED_RADIUS}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={STROKE}
            strokeLinecap="butt"
            strokeDasharray={`${filled} ${gap}`}
            transform={`rotate(-90 ${VIEWBOX / 2} ${VIEWBOX / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-sans text-2xl font-extralight leading-none tracking-[-0.02em] text-heading">
            {value}
          </span>
          <span className="mt-1 font-sans text-[10px] font-light text-warm-brown">
            {clamped}%
          </span>
        </div>
      </div>
      <span className="font-sans text-[11px] tracking-[0.12em] uppercase text-[#888888]">
        {label}
      </span>
    </div>
  );
}
