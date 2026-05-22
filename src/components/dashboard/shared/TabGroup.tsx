"use client";

import { cn } from "@/lib/utils";

export interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface TabGroupProps<T extends string> {
  tabs: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
}

export function TabGroup<T extends string>({
  tabs,
  value,
  onChange,
  className,
  ariaLabel = "Tabs",
}: TabGroupProps<T>) {
  return (
    <div
      className={cn("flex border-b border-border", className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-5 py-3 font-sans text-base tracking-[0.05em] transition-colors",
            value === tab.value
              ? "border-b-2 border-warm-brown text-warm-brown"
              : "text-warm-brown/70 hover:bg-muted hover:text-warm-brown",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
