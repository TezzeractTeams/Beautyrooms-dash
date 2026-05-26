"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MetaChartPoint } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { usePrintDimensions } from "@/hooks/usePrintDimensions";

type MetaPlacement = "facebook" | "instagram" | "combined";
type MetricMode = "cost" | "cpm" | "both";

interface MetaChartProps {
  data: MetaChartPoint[];
  className?: string;
}

const PLACEMENT_OPTIONS: { value: MetaPlacement; label: string }[] = [
  { value: "combined", label: "Combined" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
];

const METRIC_OPTIONS: { value: MetricMode; label: string }[] = [
  { value: "both", label: "Both" },
  { value: "cost", label: "Cost" },
  { value: "cpm", label: "CPM" },
];

function scaleData(data: MetaChartPoint[], placement: MetaPlacement): MetaChartPoint[] {
  const factor =
    placement === "facebook" ? 1.05 : placement === "instagram" ? 0.92 : 1;
  return data.map((d) => ({
    ...d,
    cost: Math.round(d.cost * factor * 10) / 10,
    cpm: Math.round(d.cpm * factor * 100) / 100,
  }));
}

export function MetaChart({ data, className }: MetaChartProps) {
  const [placement, setPlacement] = useState<MetaPlacement>("combined");
  const [metric, setMetric] = useState<MetricMode>("both");
  const { width: rcWidth, height: rcHeight } = usePrintDimensions();

  const chartData = useMemo(() => scaleData(data, placement), [data, placement]);

  const formatDate = (date: string) => {
    const d = new Date(date + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      className={cn(
        "dashboard-fade-up border border-[rgba(103,92,83,0.08)] bg-surface p-4 sm:p-5 md:p-6",
        className,
      )}
    >
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="font-sans text-xs tracking-[0.12em] uppercase text-[#888888]">
            Placement
          </span>
          {PLACEMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPlacement(opt.value)}
              className={cn(
                "px-3 py-1.5 font-sans text-sm tracking-wide border border-border transition-colors",
                placement === opt.value
                  ? "bg-muted text-warm-brown"
                  : "text-warm-brown/70 hover:bg-muted",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="font-sans text-xs tracking-[0.12em] uppercase text-[#888888]">
            Metric
          </span>
          {METRIC_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMetric(opt.value)}
              className={cn(
                "px-3 py-1.5 font-sans text-sm tracking-wide border border-border transition-colors",
                metric === opt.value
                  ? "bg-muted text-warm-brown"
                  : "text-warm-brown/70 hover:bg-muted",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[200px] w-full min-w-0 sm:h-[220px] md:h-[260px] print:h-[240px]">
        <ResponsiveContainer width={rcWidth} height={rcHeight}>
          <AreaChart
            key={`${placement}-${metric}`}
            data={chartData}
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
            {(metric === "cost" || metric === "both") && (
              <YAxis
                yAxisId="cost"
                tick={{ fill: "#888888", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
            )}
            {(metric === "cpm" || metric === "both") && (
              <YAxis
                yAxisId="cpm"
                orientation={metric === "both" ? "right" : "left"}
                tick={{ fill: "#888888", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
            )}
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
            {(metric === "cost" || metric === "both") && (
              <Area
                yAxisId="cost"
                type="monotone"
                dataKey="cost"
                name="Cost"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.15)"
                strokeWidth={2}
                animationDuration={550}
                animationEasing="ease-out"
              />
            )}
            {(metric === "cpm" || metric === "both") && (
              <Area
                yAxisId="cpm"
                type="monotone"
                dataKey="cpm"
                name="CPM"
                stroke="hsl(var(--warm-brown))"
                fill="hsl(var(--warm-brown) / 0.12)"
                strokeWidth={2}
                animationDuration={550}
                animationEasing="ease-out"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
