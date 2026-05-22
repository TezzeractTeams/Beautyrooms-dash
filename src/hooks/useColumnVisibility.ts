"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SortableColumn } from "@/components/dashboard/shared/SortableTable";

const STORAGE_PREFIX = "br-dash-cols:";

function loadVisibleIds(tableId: string, allIds: string[]): string[] {
  if (typeof window === "undefined") return allIds;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${tableId}`);
    if (!raw) return allIds;
    const parsed = JSON.parse(raw) as string[];
    const valid = parsed.filter((id) => allIds.includes(id));
    return valid.length > 0 ? valid : allIds;
  } catch {
    return allIds;
  }
}

export function useColumnVisibility<T>(
  allColumns: SortableColumn<T>[],
  tableId: string,
  pinnedColumnIds: string[] = ["name"],
) {
  const allIds = useMemo(() => allColumns.map((c) => c.id), [allColumns]);

  const [visibleIds, setVisibleIds] = useState<string[]>(() =>
    loadVisibleIds(tableId, allIds),
  );

  useEffect(() => {
    setVisibleIds(loadVisibleIds(tableId, allIds));
  }, [tableId, allIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      `${STORAGE_PREFIX}${tableId}`,
      JSON.stringify(visibleIds),
    );
  }, [tableId, visibleIds]);

  const hideColumn = useCallback(
    (id: string) => {
      if (pinnedColumnIds.includes(id)) return;
      setVisibleIds((prev) => {
        if (prev.length <= 1) return prev;
        return prev.filter((colId) => colId !== id);
      });
    },
    [pinnedColumnIds],
  );

  const showColumn = useCallback((id: string) => {
    setVisibleIds((prev) => {
      if (prev.includes(id)) return prev;
      return allIds.filter((colId) => prev.includes(colId) || colId === id);
    });
  }, [allIds]);

  const visibleColumns = useMemo(
    () => allColumns.filter((c) => visibleIds.includes(c.id)),
    [allColumns, visibleIds],
  );

  const hiddenColumns = useMemo(
    () => allColumns.filter((c) => !visibleIds.includes(c.id)),
    [allColumns, visibleIds],
  );

  const canHide = useCallback(
    (id: string) =>
      !pinnedColumnIds.includes(id) && visibleIds.length > 1 && visibleIds.includes(id),
    [pinnedColumnIds, visibleIds],
  );

  return {
    visibleColumns,
    hiddenColumns,
    hideColumn,
    showColumn,
    canHide,
  };
}
