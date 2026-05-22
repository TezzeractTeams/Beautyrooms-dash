"use client";

import type { Platform } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Platform; label: string }[] = [
  { value: "all", label: "All" },
  { value: "meta", label: "Meta" },
  { value: "google", label: "Google" },
];

interface PlatformToggleProps {
  value: Platform;
  onChange: (platform: Platform) => void;
  className?: string;
}

export function PlatformToggle({ value, onChange, className }: PlatformToggleProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="mr-1 font-sans text-[11px] tracking-[0.12em] uppercase text-[#888888]">
        Platform
      </span>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "inline-flex px-3 py-1 font-sans text-xs tracking-wide transition-colors",
            "border border-border",
            value === opt.value
              ? "bg-muted text-warm-brown"
              : "bg-background text-warm-brown/70 hover:bg-muted hover:text-warm-brown",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
