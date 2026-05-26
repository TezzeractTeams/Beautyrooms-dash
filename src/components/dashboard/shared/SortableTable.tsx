"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDir = "asc" | "desc";

export interface SortableColumn<T> {
  id: string;
  label: string;
  sortable?: boolean;
  className?: string;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
}

interface SortableTableProps<T> {
  rows: T[];
  columns: SortableColumn<T>[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  onHideColumn?: (columnId: string) => void;
  canHideColumn?: (columnId: string) => boolean;
}

export function SortableTable<T>({
  rows,
  columns,
  getRowKey,
  emptyMessage = "No rows to display.",
  onHideColumn,
  canHideColumn,
}: SortableTableProps<T>) {
  const [sortId, setSortId] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    if (!sortId) return rows;
    const col = columns.find((c) => c.id === sortId);
    if (!col?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [rows, columns, sortId, sortDir]);

  const toggleSort = (colId: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortId === colId) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortId(colId);
      setSortDir("asc");
    }
  };

  return (
    <div className="overflow-x-auto [-webkit-overflow-scrolling:touch] print:overflow-visible">
      <table className="w-full min-w-[640px] border-collapse text-left sm:min-w-[720px]">
        <thead>
          <tr className="border-b border-border bg-surface">
            {columns.map((col) => {
              const hideable =
                onHideColumn && canHideColumn?.(col.id) === true;
              return (
                <th
                  key={col.id}
                  className={cn(
                    "group px-5 py-4 font-sans text-xs tracking-[0.12em] uppercase text-[#888888]",
                    col.sortable && "cursor-pointer select-none hover:text-warm-brown",
                    col.className,
                  )}
                  onClick={() => toggleSort(col.id, col.sortable)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable ? (
                      sortId === col.id ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="size-3" strokeWidth={1.5} />
                        ) : (
                          <ArrowDown className="size-3" strokeWidth={1.5} />
                        )
                      ) : (
                        <ArrowUpDown
                          className="size-3 opacity-40"
                          strokeWidth={1.5}
                        />
                      )
                    ) : null}
                    {hideable ? (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex size-5 items-center justify-center text-warm-brown/50",
                          "opacity-0 transition-opacity hover:bg-muted hover:text-warm-brown",
                          "group-hover:opacity-100",
                        )}
                        aria-label={`Hide ${col.label} column`}
                        title={`Hide ${col.label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onHideColumn(col.id);
                        }}
                      >
                        <X className="size-3" strokeWidth={1.5} />
                      </button>
                    ) : null}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody key={`${sortId ?? "none"}-${sortDir}`}>
          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-10 text-center font-sans text-base font-light text-[#2D2926]/65"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row, index) => (
              <tr
                key={getRowKey(row)}
                className="dashboard-fade-up border-b border-border transition-colors duration-150 hover:bg-surface/50"
                style={{
                  ["--enter-delay" as string]: `${Math.min(index, 14) * 30}ms`,
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(
                      "px-5 py-4 font-sans text-base font-light text-[#2D2926]",
                      col.className,
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
