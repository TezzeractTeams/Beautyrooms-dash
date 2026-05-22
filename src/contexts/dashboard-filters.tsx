"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
} from "react";
import type { DateRange, DateRangePreset, Platform } from "@/types/dashboard";
import { defaultCustomDateRange } from "@/lib/mock-data/utils";

const LOADING_MS = 200;

export type DatePresetLabel =
  | "Today"
  | "Last 7 days"
  | "Last 30 days"
  | "Last 90 days"
  | "Custom";

const LABEL_TO_PRESET: Record<DatePresetLabel, DateRangePreset> = {
  Today: "today",
  "Last 7 days": "7d",
  "Last 30 days": "30d",
  "Last 90 days": "90d",
  Custom: "custom",
};

export const PRESET_TO_LABEL: Record<DateRangePreset, DatePresetLabel> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  custom: "Custom",
};

export type PlatformLabel = "All" | "Meta" | "Google" | "Boulevard";

const LABEL_TO_PLATFORM: Record<PlatformLabel, Platform> = {
  All: "all",
  Meta: "meta",
  Google: "google",
  Boulevard: "boulevard",
};

interface DashboardFiltersContextValue {
  platform: Platform;
  dateRange: DateRange;
  datePresetLabel: DatePresetLabel;
  platformLabel: PlatformLabel;
  customDateStart: string;
  customDateEnd: string;
  isLoading: boolean;
  contentKey: number;
  lastUpdated: Date;
  setDatePreset: (label: DatePresetLabel) => void;
  setCustomDateRange: (start: string, end: string) => void;
  setPlatformLabel: (label: PlatformLabel) => void;
  showMeta: boolean;
  showGoogle: boolean;
}

const DashboardFiltersContext =
  createContext<DashboardFiltersContextValue | null>(null);

export function DashboardFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [platformLabel, setPlatformLabelState] =
    useState<PlatformLabel>("All");
  const [datePresetLabel, setDatePresetLabelState] =
    useState<DatePresetLabel>("Last 30 days");
  const [customRange, setCustomRange] = useState(defaultCustomDateRange);
  const [isLoading, setIsLoading] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [, startTransition] = useTransition();

  const platform = LABEL_TO_PLATFORM[platformLabel];

  const dateRange: DateRange = useMemo(() => {
    const preset = LABEL_TO_PRESET[datePresetLabel];
    if (preset === "custom") {
      return {
        preset,
        start: customRange.start,
        end: customRange.end,
      };
    }
    return { preset };
  }, [datePresetLabel, customRange]);

  const bumpLoading = useCallback(() => {
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setContentKey((k) => k + 1);
      setLastUpdated(new Date());
    }, LOADING_MS);
  }, []);

  const setDatePreset = useCallback(
    (label: DatePresetLabel) => {
      setDatePresetLabelState(label);
      startTransition(() => bumpLoading());
    },
    [bumpLoading],
  );

  const setCustomDateRange = useCallback(
    (start: string, end: string) => {
      setCustomRange({ start, end });
      setDatePresetLabelState("Custom");
      startTransition(() => bumpLoading());
    },
    [bumpLoading],
  );

  const setPlatformLabel = useCallback(
    (label: PlatformLabel) => {
      if (label === "Boulevard") return;
      setPlatformLabelState(label);
      startTransition(() => bumpLoading());
    },
    [bumpLoading],
  );

  const showMeta = platform === "all" || platform === "meta";
  const showGoogle = platform === "all" || platform === "google";

  const value = useMemo(
    () => ({
      platform,
      dateRange,
      datePresetLabel,
      platformLabel,
      customDateStart: customRange.start,
      customDateEnd: customRange.end,
      isLoading,
      contentKey,
      lastUpdated,
      setDatePreset,
      setCustomDateRange,
      setPlatformLabel,
      showMeta,
      showGoogle,
    }),
    [
      platform,
      dateRange,
      datePresetLabel,
      platformLabel,
      customRange,
      isLoading,
      contentKey,
      lastUpdated,
      setDatePreset,
      setCustomDateRange,
      setPlatformLabel,
      showMeta,
      showGoogle,
    ],
  );

  return (
    <DashboardFiltersContext.Provider value={value}>
      {children}
    </DashboardFiltersContext.Provider>
  );
}

export function useDashboardFilters() {
  const ctx = useContext(DashboardFiltersContext);
  if (!ctx) {
    throw new Error(
      "useDashboardFilters must be used within DashboardFiltersProvider",
    );
  }
  return ctx;
}

export function formatLastUpdated(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
