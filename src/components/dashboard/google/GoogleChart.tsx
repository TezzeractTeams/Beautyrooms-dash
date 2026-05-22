"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GoogleChartPoint } from "@/types/dashboard";
import { cn } from "@/lib/utils";

type SeriesKey = "cost" | "impressions" | "clicks";

interface GoogleChartProps {
  data: GoogleChartPoint[];
  className?: string;
}

const SERIES: {
  key: SeriesKey;
  label: string;
  color: string;
  fill: string;
  yAxisId: "left" | "right";
}[] = [
  {
    key: "cost",
    label: "Cost",
    color: "hsl(var(--primary))",
    fill: "hsl(var(--primary) / 0.2)",
    yAxisId: "left",
  },
  {
    key: "impressions",
    label: "Impressions",
    color: "hsl(var(--warm-brown))",
    fill: "hsl(var(--warm-brown) / 0.18)",
    yAxisId: "right",
  },
  {
    key: "clicks",
    label: "Clicks",
    color: "hsl(var(--status-positive))",
    fill: "hsl(var(--status-positive) / 0.18)",
    yAxisId: "left",
  },
];

export function GoogleChart({ data, className }: GoogleChartProps) {
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    cost: true,
    impressions: true,
    clicks: true,
  });

  const activeSeries = useMemo(
    () => SERIES.filter((s) => visible[s.key]),
    [visible],
  );

  const formatDate = (date: string) => {
    const d = new Date(date + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const toggle = (key: SeriesKey) => {
    setVisible((v) => {
      const next = { ...v, [key]: !v[key] };
      if (!next.cost && !next.impressions && !next.clicks) return v;
      return next;
    });
  };

  return (
    <div
      className={cn(
        "dashboard-fade-up border border-[rgba(103,92,83,0.08)] bg-surface p-4 sm:p-5 md:p-6",
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => toggle(s.key)}
            className={cn(
              "inline-flex items-center gap-2 border px-3 py-1.5 font-sans text-sm tracking-wide transition-opacity",
              "border-border",
              visible[s.key]
                ? "bg-muted text-warm-brown opacity-100"
                : "bg-background text-warm-brown/50 opacity-60",
            )}
          >
            <span
              className="size-2 shrink-0"
              style={{ backgroundColor: visible[s.key] ? s.color : "#ccc" }}
              aria-hidden
            />
            {s.label}
          </button>
        ))}
      </div>

      <div className="h-[200px] w-full min-w-0 sm:h-[220px] md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            key={activeSeries.map((s) => s.key).join("-")}
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: "#888888", fontSize: 10 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#888888", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                visible.cost && !visible.impressions
                  ? `$${v}`
                  : v.toLocaleString()
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#888888", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              contentStyle={{
                background: "#FAFAF5",
                border: "1px solid rgba(103,92,83,0.12)",
                borderRadius: 0,
                fontFamily: "var(--font-barlow)",
                fontSize: 12,
              }}
              labelFormatter={(label) => formatDate(String(label))}
            />
            <Legend wrapperStyle={{ display: "none" }} />
            {activeSeries.map((s) => (
              <Area
                key={s.key}
                yAxisId={s.yAxisId}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                fill={s.fill}
                strokeWidth={2}
                dot={false}
                animationDuration={550}
                animationEasing="ease-out"
                hide={!visible[s.key]}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
