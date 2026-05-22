"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CustomDateRangePickerProps {
  start: string;
  end: string;
  onApply: (start: string, end: string) => void;
  className?: string;
}

export function CustomDateRangePicker({
  start,
  end,
  onApply,
  className,
}: CustomDateRangePickerProps) {
  const [draftStart, setDraftStart] = useState(start);
  const [draftEnd, setDraftEnd] = useState(end);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraftStart(start);
    setDraftEnd(end);
    setError(null);
  }, [start, end]);

  useEffect(() => {
    if (!draftStart || !draftEnd) return;

    if (draftStart > draftEnd) {
      setError("Start date must be on or before end date.");
      return;
    }

    setError(null);

    if (draftStart === start && draftEnd === end) return;

    onApply(draftStart, draftEnd);
  }, [draftStart, draftEnd, start, end, onApply]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end",
        className,
      )}
      role="group"
      aria-label="Custom date range"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[11rem]">
        <label
          htmlFor="custom-range-start"
          className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#888888]"
        >
          From
        </label>
        <input
          id="custom-range-start"
          type="date"
          value={draftStart}
          max={draftEnd || today}
          onChange={(e) => setDraftStart(e.target.value)}
          className={cn(
            "w-full min-w-0 border border-border bg-background px-2 py-2 font-sans text-sm text-warm-brown",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[11rem]">
        <label
          htmlFor="custom-range-end"
          className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#888888]"
        >
          To
        </label>
        <input
          id="custom-range-end"
          type="date"
          value={draftEnd}
          min={draftStart}
          max={today}
          onChange={(e) => setDraftEnd(e.target.value)}
          className={cn(
            "w-full min-w-0 border border-border bg-background px-2 py-2 font-sans text-sm text-warm-brown",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        />
      </div>
      {error ? (
        <p className="w-full font-sans text-xs text-status-negative">{error}</p>
      ) : null}
    </div>
  );
}
