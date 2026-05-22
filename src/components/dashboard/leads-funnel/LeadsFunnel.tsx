"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { LeadStage, LeadsFunnelData } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { SourceBadge } from "../shared/SourceBadge";

interface LeadsFunnelProps {
  data: LeadsFunnelData;
}

interface FunnelBarProps {
  stage: LeadStage;
  widthPercent: number;
  animate: boolean;
}

function FunnelBar({ stage, widthPercent, animate }: FunnelBarProps) {
  return (
    <div className="group relative flex min-w-0 flex-1 flex-col items-center px-1">
      <p className="mb-2 font-sans text-xs tracking-[0.12em] uppercase text-[#888888]">
        {stage.label}
      </p>

      <div className="relative flex h-20 w-full items-center justify-center md:h-24">
        <div
          className={cn(
            "h-full bg-gradient-to-r from-primary to-warm-brown transition-all duration-300 ease-out",
            "mx-auto min-w-[4rem]",
          )}
          style={{ width: animate ? `${widthPercent}%` : "0%" }}
        />
      </div>

      <p className="mt-3 font-sans text-2xl font-extralight tracking-[-0.02em] text-[#2D2926] md:text-3xl">
        {stage.count.toLocaleString()}
      </p>
      <p className="font-sans text-sm font-light text-[#2D2926]/65">
        {stage.percentOfTop}% of MQL
      </p>

      {/* Tooltip */}
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-0 z-10 w-48 -translate-x-1/2 -translate-y-full",
          "border border-[rgba(103,92,83,0.12)] bg-background px-3 py-2 shadow-sm",
          "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
        )}
        role="tooltip"
      >
        <p className="font-sans text-xs font-light text-[#2D2926]">
          <span className="font-normal text-heading">{stage.label}</span>
          <br />
          Count: {stage.count.toLocaleString()}
          <br />
          {stage.percentOfTop}% of total funnel
          {stage.dropOffFromPrevious !== null && (
            <>
              <br />
              {stage.dropOffFromPrevious}% drop-off from previous stage
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export function LeadsFunnel({ data }: LeadsFunnelProps) {
  const [animate, setAnimate] = useState(false);
  const maxCount = Math.max(...data.stages.map((s) => s.count), 1);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, [data]);

  return (
    <div className="border border-[rgba(103,92,83,0.08)] bg-surface p-5 sm:p-7 md:p-9">
      <div className="mb-8 flex items-center justify-between">
        <p className="font-sans text-base font-light text-[#2D2926]/65">
          Lead conversion pipeline
        </p>
        <SourceBadge source="hubspot" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-2 lg:gap-3">
        {data.stages.map((stage, index) => (
          <div key={stage.id} className="flex w-full flex-col gap-4 md:contents">
            <FunnelBar
              stage={stage}
              widthPercent={(stage.count / maxCount) * 100}
              animate={animate}
            />
            {index < data.stages.length - 1 ? (
              <div className="flex shrink-0 flex-col items-center justify-center gap-1 self-center py-1 md:pb-10 md:py-0">
                <ChevronRight
                  className="size-5 rotate-90 text-warm-brown/50 md:size-6 md:rotate-0"
                  strokeWidth={1.5}
                  aria-hidden
                />
                {data.stages[index + 1]?.dropOffFromPrevious !== null && (
                  <span className="font-sans text-[10px] text-[#888888]">
                    −{data.stages[index + 1].dropOffFromPrevious}%
                  </span>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Stage-to-stage conversion summary */}
      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
        {data.stages.map((stage) => (
          <div key={stage.id} className="text-center">
            <p className="font-sans text-xs tracking-[0.1em] uppercase text-[#888888]">
              {stage.label} rate
            </p>
            <p className="font-sans text-base font-light text-warm-brown">
              {stage.percentOfTop}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
