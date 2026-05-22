"use client";

import type { MetaAdRow } from "@/types/dashboard";
import { SortableTable } from "../shared/SortableTable";
import { metaAdColumns } from "./meta-table-columns";

interface MetaAdsTableProps {
  rows: MetaAdRow[];
}

export function MetaAdsTable({ rows }: MetaAdsTableProps) {
  return (
    <SortableTable
      rows={rows}
      columns={metaAdColumns}
      getRowKey={(r) => r.id}
    />
  );
}
