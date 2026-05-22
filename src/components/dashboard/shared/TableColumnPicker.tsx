"use client";

import { Plus } from "lucide-react";
import type { SortableColumn } from "./SortableTable";
import { cn } from "@/lib/utils";

interface TableColumnPickerProps {
  hiddenColumns: SortableColumn<unknown>[];
  onShowColumn: (columnId: string) => void;
  className?: string;
}

export function TableColumnPicker({
  hiddenColumns,
  onShowColumn,
  className,
}: TableColumnPickerProps) {
  if (hiddenColumns.length === 0) return null;

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-1.5 md:w-auto md:border-l md:border-border md:pl-3",
        className,
      )}
      role="group"
      aria-label="Hidden columns"
    >
      <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-[#888888]">
        Hidden
      </span>
      {hiddenColumns.map((col) => (
        <button
          key={col.id}
          type="button"
          onClick={() => onShowColumn(col.id)}
          className={cn(
            "inline-flex items-center gap-1 border border-border bg-background px-2 py-0.5",
            "font-sans text-[11px] tracking-wide text-warm-brown transition-colors",
            "hover:bg-muted",
          )}
          title={`Show ${col.label} column`}
        >
          <Plus className="size-3" strokeWidth={1.5} aria-hidden />
          {col.label}
        </button>
      ))}
    </div>
  );
}
