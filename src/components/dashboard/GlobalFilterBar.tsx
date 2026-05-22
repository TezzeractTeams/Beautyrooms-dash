"use client";

import {
  useDashboardFilters,
  type DatePresetLabel,
  type PlatformLabel,
} from "@/contexts/dashboard-filters";
import { cn } from "@/lib/utils";
import { CustomDateRangePicker } from "./CustomDateRangePicker";

const DATE_PRESETS: DatePresetLabel[] = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Custom",
];

const PLATFORM_PILLS: PlatformLabel[] = [
  "All",
  "Meta",
  "Google",
  "Boulevard",
];

export function GlobalFilterBar() {
  const {
    datePresetLabel,
    platformLabel,
    customDateStart,
    customDateEnd,
    setDatePreset,
    setCustomDateRange,
    setPlatformLabel,
  } = useDashboardFilters();

  const isCustom = datePresetLabel === "Custom";

  return (
    <div className="border-b border-[rgba(232,232,227,0.5)] bg-background px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-3">
        <div className="-mx-1 flex w-full items-center gap-1 overflow-x-auto px-1 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:w-auto md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setDatePreset(preset)}
              className={cn(
                "shrink-0 px-3 py-2 font-sans text-sm tracking-[0.05em] transition-colors",
                datePresetLabel === preset
                  ? "border-b-2 border-warm-brown text-warm-brown"
                  : "text-warm-brown/70 hover:bg-muted hover:text-warm-brown",
              )}
            >
              {preset}
            </button>
          ))}
        </div>

        {isCustom ? (
          <CustomDateRangePicker
            start={customDateStart}
            end={customDateEnd}
            onApply={setCustomDateRange}
            className="w-full md:w-auto"
          />
        ) : null}

        <div
          className={cn(
            "flex w-full flex-wrap items-center gap-2 border-t border-border pt-3",
            "md:ml-auto md:w-auto md:border-t-0 md:pt-0",
          )}
        >
          <span className="w-full font-sans text-xs tracking-[0.12em] uppercase text-[#888888] sm:w-auto">
            Platform
          </span>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_PILLS.map((pill) => {
              const isBoulevard = pill === "Boulevard";
              return (
                <button
                  key={pill}
                  type="button"
                  disabled={isBoulevard}
                  title={
                    isBoulevard
                      ? "Boulevard integration coming soon"
                      : undefined
                  }
                  onClick={() => setPlatformLabel(pill)}
                  className={cn(
                    "inline-flex shrink-0 px-3 py-1.5 font-sans text-sm tracking-wide transition-colors",
                    "border border-border",
                    platformLabel === pill
                      ? "bg-muted text-warm-brown"
                      : "bg-background text-warm-brown/70 hover:bg-muted",
                    isBoulevard && "cursor-not-allowed opacity-50",
                  )}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
