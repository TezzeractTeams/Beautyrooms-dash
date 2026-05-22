"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { KpiMetric, Platform } from "@/types/dashboard";
import {
  DEFAULT_STAT_SLOT_IDS,
  STAT_SLOT_COUNT,
} from "@/lib/mock-data/overall-stats";

const STORAGE_KEY = "br-dash-stat-slots";

function loadSlots(platform: Platform, availableIds: string[]): string[] {
  if (typeof window === "undefined") {
    return resolveSlots(DEFAULT_STAT_SLOT_IDS as unknown as string[], availableIds);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Record<Platform, string[]>>;
      const saved = parsed[platform];
      if (saved?.length) {
        return resolveSlots(saved, availableIds);
      }
    }
  } catch {
    /* ignore */
  }

  return resolveSlots(DEFAULT_STAT_SLOT_IDS as unknown as string[], availableIds);
}

function resolveSlots(preferred: string[], availableIds: string[]): string[] {
  const available = new Set(availableIds);
  const used = new Set<string>();
  const slots: string[] = [];

  for (const id of preferred) {
    if (slots.length >= STAT_SLOT_COUNT) break;
    if (available.has(id) && !used.has(id)) {
      slots.push(id);
      used.add(id);
    }
  }

  for (const id of availableIds) {
    if (slots.length >= STAT_SLOT_COUNT) break;
    if (!used.has(id)) {
      slots.push(id);
      used.add(id);
    }
  }

  return slots;
}

function persistSlots(platform: Platform, slots: string[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Partial<Record<Platform, string[]>> = raw
      ? (JSON.parse(raw) as Partial<Record<Platform, string[]>>)
      : {};
    all[platform] = slots;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function useStatCardSlots(metrics: KpiMetric[], platform: Platform) {
  const availableIds = useMemo(() => metrics.map((m) => m.id), [metrics]);
  const metricsById = useMemo(
    () => new Map(metrics.map((m) => [m.id, m])),
    [metrics],
  );

  const [slots, setSlots] = useState<string[]>(() =>
    loadSlots(platform, availableIds),
  );

  useEffect(() => {
    setSlots(loadSlots(platform, availableIds));
  }, [platform, availableIds.join(",")]);

  const setSlotMetric = useCallback(
    (slotIndex: number, metricId: string) => {
      if (!availableIds.includes(metricId)) return;

      setSlots((prev) => {
        const next = [...prev];
        const prevId = next[slotIndex];
        const duplicateIndex = next.findIndex(
          (id, i) => i !== slotIndex && id === metricId,
        );

        if (duplicateIndex >= 0 && prevId) {
          next[duplicateIndex] = prevId;
        }

        next[slotIndex] = metricId;

        persistSlots(platform, next);
        return next;
      });
    },
    [availableIds, platform],
  );

  const slotMetrics = useMemo(
    () =>
      slots
        .map((id) => metricsById.get(id))
        .filter((m): m is KpiMetric => m != null),
    [slots, metricsById],
  );

  return {
    slotMetrics,
    slots,
    setSlotMetric,
    availableMetrics: metrics,
  };
}
