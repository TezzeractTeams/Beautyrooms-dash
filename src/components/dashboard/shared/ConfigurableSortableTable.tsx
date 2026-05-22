"use client";

import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { SortableTable, type SortableColumn } from "./SortableTable";

interface ConfigurableSortableTableProps<T> {
  rows: T[];
  columns: SortableColumn<T>[];
  getRowKey: (row: T) => string;
  tableId: string;
  pinnedColumnIds?: string[];
  emptyMessage?: string;
}

export function ConfigurableSortableTable<T>({
  rows,
  columns,
  getRowKey,
  tableId,
  pinnedColumnIds = ["name"],
  emptyMessage,
}: ConfigurableSortableTableProps<T>) {
  const { visibleColumns, hideColumn, canHide } = useColumnVisibility(
    columns,
    tableId,
    pinnedColumnIds,
  );

  return (
    <SortableTable
      rows={rows}
      columns={visibleColumns}
      getRowKey={getRowKey}
      emptyMessage={emptyMessage}
      onHideColumn={hideColumn}
      canHideColumn={canHide}
    />
  );
}
